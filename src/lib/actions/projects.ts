"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ContractType, Country, ProjectDuration, WorkMode } from "@/types";

export interface CreateProjectInput {
  title: string;
  description: string;
  industry: string;
  contract_type: ContractType;
  work_mode: WorkMode;
  country: Country;
  region?: string;
  location: string;
  postal_code?: string;
  start_date: string;
  duration_months?: number;
  duration: ProjectDuration;
  budget_min?: number;
  budget_max?: number;
  budget_unit: "hour" | "day" | "project";
  rate_undisclosed?: boolean;
  skills: string[];
}

export type CreateProjectResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createProjectAction(
  input: CreateProjectInput,
): Promise<CreateProjectResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error:
        "Backend nicht verbunden. Bitte Supabase im Vercel-Marketplace verbinden und ENV-Vars setzen.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase-Client nicht verfügbar." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      ok: false,
      error: "Sie sind nicht eingeloggt. Bitte melden Sie sich an.",
    };
  }

  // Validierung (Server-seitig, RLS macht den Rest)
  if (!input.title || input.title.length < 5) {
    return { ok: false, error: "Projekttitel ist zu kurz (min. 5 Zeichen)." };
  }
  if (!input.description || input.description.length < 20) {
    return {
      ok: false,
      error: "Projektbeschreibung ist zu kurz (min. 20 Zeichen).",
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      title: input.title,
      description: input.description,
      industry: input.industry,
      contract_type: input.contract_type,
      work_mode: input.work_mode,
      country: input.country,
      region: input.region ?? null,
      location: input.location,
      postal_code: input.postal_code ?? null,
      start_date: input.start_date,
      duration_months: input.duration_months ?? null,
      budget_min: input.budget_min ?? null,
      budget_max: input.budget_max ?? null,
      budget_unit: input.budget_unit,
      rate_undisclosed: input.rate_undisclosed ?? false,
      skills: input.skills,
    })
    .select("id")
    .single();

  if (error) {
    // RLS-Violations sind erwartbar: nicht-Recruiter oder nicht-eingeloggt.
    return {
      ok: false,
      error:
        error.code === "42501"
          ? "Sie benötigen ein Recruiter-Konto, um Projekte einzustellen."
          : `Datenbank-Fehler: ${error.message}`,
    };
  }

  // Dashboard + Suche refreshen
  revalidatePath("/dashboard");
  revalidatePath("/search");

  return { ok: true, id: data.id as string };
}
