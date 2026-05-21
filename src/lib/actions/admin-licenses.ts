"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { isAdminEmail } from "@/lib/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export type LicenseStatus = "pending" | "active" | "revoked";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Setzt Recruiter-Lizenz auf 'active' (oder einen anderen Status). Markiert
 * gleichzeitig das Profil als `company_verified=true` und `has_recruiter_license=true`,
 * damit die RLS-Policies greifen.
 *
 * Verwendet den Service-Role-Key — umgeht RLS. Daher zwingender
 * Admin-Auth-Check vor jedem Aufruf.
 */
export async function setLicenseStatusAction(
  licenseId: string,
  status: LicenseStatus,
): Promise<AdminActionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Backend nicht verbunden." };
  }
  if (!SERVICE_ROLE_KEY) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  // Auth prüfen — nur eingeloggte Admins dürfen
  const userClient = await getSupabaseServerClient();
  if (!userClient) return { ok: false, error: "Auth-Client nicht verfügbar." };
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return { ok: false, error: "Nicht eingeloggt." };
  if (!isAdminEmail(user.email)) return { ok: false, error: "Keine Admin-Berechtigung." };

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const license = await admin
    .from("recruiter_licenses")
    .select("recruiter_id")
    .eq("id", licenseId)
    .maybeSingle();

  if (license.error || !license.data) {
    return { ok: false, error: "Lizenz nicht gefunden." };
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { status };
  if (status === "active") {
    updates.granted_at = now;
    updates.avv_signed_at = now;
  }

  const licUpdate = await admin
    .from("recruiter_licenses")
    .update(updates)
    .eq("id", licenseId);
  if (licUpdate.error) {
    return { ok: false, error: licUpdate.error.message };
  }

  const profileUpdate = await admin
    .from("profiles")
    .update({
      has_recruiter_license: status === "active",
      company_verified: status === "active" ? true : undefined,
    })
    .eq("id", license.data.recruiter_id);

  if (profileUpdate.error) {
    return { ok: false, error: profileUpdate.error.message };
  }

  revalidatePath("/admin/lizenzen");
  return { ok: true };
}
