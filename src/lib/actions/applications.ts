"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ApplyInput {
  projectId: string;
  coverLetter: string;
  proposedRate?: number;
}

export type ApplyResult =
  | { ok: true; id: string }
  | { ok: false; error: string; needsPremium?: boolean; needsLogin?: boolean };

export async function applyToProjectAction(input: ApplyInput): Promise<ApplyResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Backend nicht verbunden. Bitte zuerst Supabase im Vercel-Marketplace aktivieren.",
    };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase-Client nicht verfügbar." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: "Bitte loggen Sie sich als Freelancer ein.",
      needsLogin: true,
    };
  }

  if (input.coverLetter.length < 40) {
    return {
      ok: false,
      error: "Ihr Anschreiben sollte mindestens 40 Zeichen lang sein.",
    };
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      project_id: input.projectId,
      freelancer_id: user.id,
      cover_letter: input.coverLetter,
      proposed_rate: input.proposedRate ?? null,
    })
    .select("id")
    .single();

  if (error) {
    // 42501 = RLS-Violation: kein Freelancer-Konto oder kein Premium-Abo
    if (error.code === "42501") {
      return {
        ok: false,
        error:
          "Bewerbungen sind nur mit aktivem Connect-Pro-Abo möglich. Sie behalten 100 % Ihres Honorars — wir nehmen keine Vermittlungsgebühr.",
        needsPremium: true,
      };
    }
    // 23505 = unique violation (project_id, freelancer_id)
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Sie haben sich bereits auf dieses Projekt beworben.",
      };
    }
    return { ok: false, error: `Datenbank-Fehler: ${error.message}` };
  }

  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath("/dashboard");

  return { ok: true, id: data.id as string };
}
