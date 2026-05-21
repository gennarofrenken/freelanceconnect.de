import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { isAdminEmail } from "@/lib/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Badge } from "@/components/ui/Badge";
import { LicenseRowActions } from "./LicenseRowActions";

export const metadata: Metadata = {
  title: "Recruiter-Lizenzen verwalten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface LicenseRow {
  id: string;
  recruiter_id: string;
  status: "pending" | "active" | "revoked";
  legal_name: string;
  ust_id: string | null;
  hrb_number: string | null;
  granted_at: string | null;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
    company_name?: string;
    company_verified?: boolean;
  } | null;
}

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export default async function AdminLicensesPage() {
  if (!isSupabaseConfigured) {
    return (
      <EmptyShell title="Backend nicht verbunden">
        Bitte zuerst Supabase im Vercel-Marketplace verbinden.
      </EmptyShell>
    );
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <EmptyShell title="Auth-Client nicht verfügbar" />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin/lizenzen");
  if (!isAdminEmail(user.email)) {
    return (
      <EmptyShell title="Kein Admin-Zugriff">
        Ihr Konto ({user.email}) ist nicht als Admin eingetragen. Setzen Sie
        die ENV-Variable <code className="font-mono">ADMIN_EMAILS</code> in
        Vercel und redeployen Sie.
      </EmptyShell>
    );
  }

  if (!SERVICE_ROLE_KEY) {
    return (
      <EmptyShell title="Service-Role-Key fehlt">
        <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> muss in
        Vercel als Env-Variable verfügbar sein.
      </EmptyShell>
    );
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin
    .from("recruiter_licenses")
    .select(
      `id, recruiter_id, status, legal_name, ust_id, hrb_number, granted_at, created_at,
       profiles:profiles!recruiter_licenses_recruiter_id_fkey(full_name, email, company_name, company_verified)`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <EmptyShell title="Fehler beim Laden">
        {error.message}
      </EmptyShell>
    );
  }

  const licenses = (data ?? []) as unknown as LicenseRow[];
  const pendingCount = licenses.filter((l) => l.status === "pending").length;

  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Admin · Lizenz-Verwaltung
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight text-ink-900">
              Recruiter-Lizenzen
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {licenses.length} Lizenz{licenses.length === 1 ? "" : "en"}
              {pendingCount > 0 && (
                <>
                  {" · "}
                  <span className="font-medium text-warning-700">
                    {pendingCount} zur Prüfung
                  </span>
                </>
              )}
            </p>
          </div>
        </header>

        {licenses.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-ink-900">
              Noch keine Lizenz-Anträge
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Recruiter beantragen Lizenzen über <code>/recruiter/lizenz</code>.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft">
            <ul className="divide-y divide-ink-100">
              {licenses.map((l) => (
                <li key={l.id} className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                        <StatusBadge status={l.status} />
                        <span aria-hidden>·</span>
                        <span>Beantragt {new Date(l.created_at).toLocaleDateString("de-DE")}</span>
                        {l.granted_at && (
                          <>
                            <span aria-hidden>·</span>
                            <span>Freigeschaltet {new Date(l.granted_at).toLocaleDateString("de-DE")}</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-1 text-base font-semibold tracking-tight text-ink-900">
                        {l.legal_name}
                      </h2>
                      <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-ink-600">
                        <DlRow icon={Building2} label="Profil-Firma">
                          {l.profiles?.company_name ?? "—"}
                        </DlRow>
                        <DlRow icon={ShieldCheck} label="Ansprechpartner">
                          {l.profiles?.full_name ?? "—"}
                        </DlRow>
                        <DlRow icon={ShieldCheck} label="E-Mail">
                          {l.profiles?.email ?? "—"}
                        </DlRow>
                        <DlRow icon={Clock} label="HRB / USt-IdNr">
                          {[l.hrb_number, l.ust_id].filter(Boolean).join(" · ") || "—"}
                        </DlRow>
                      </dl>
                    </div>
                    <LicenseRowActions licenseId={l.id} status={l.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "active" | "revoked" }) {
  if (status === "active") {
    return (
      <Badge tone="success">
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        Aktiv
      </Badge>
    );
  }
  if (status === "revoked") {
    return (
      <Badge tone="warning">
        <XCircle className="h-3 w-3" aria-hidden />
        Widerrufen
      </Badge>
    );
  }
  return (
    <Badge tone="warning">
      <Clock className="h-3 w-3" aria-hidden />
      Prüfung
    </Badge>
  );
}

function DlRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Building2;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 text-ink-400" aria-hidden />
      <dt className="text-ink-500">{label}:</dt>
      <dd className="truncate font-medium text-ink-800">{children}</dd>
    </div>
  );
}

function EmptyShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">
          {title}
        </h1>
        {children && (
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-600">
            {children}
          </p>
        )}
      </div>
    </div>
  );
}
