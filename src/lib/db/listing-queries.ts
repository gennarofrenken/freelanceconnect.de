import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_PROJECTS } from "@/constants/mock-data";
import type {
  ContractType,
  Country,
  Project,
  ProjectDuration,
  WorkMode,
} from "@/types";

interface ProjectRowWithOwner {
  id: string;
  title: string;
  description: string;
  industry: string;
  contract_type: ContractType;
  work_mode: WorkMode;
  country: Country;
  region: string | null;
  location: string;
  postal_code: string | null;
  start_date: string;
  duration_months: number | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_unit: "hour" | "day" | "project";
  rate_undisclosed: boolean;
  skills: string[];
  is_top: boolean;
  is_urgent: boolean;
  published_at: string;
  profiles?: { full_name?: string; company_name?: string } | null;
}

const DURATION_FROM_MONTHS = (m: number | null): ProjectDuration => {
  if (m === null) return "medium";
  if (m <= 3) return "short";
  if (m <= 6) return "medium";
  return "long";
};

function rowToProject(row: ProjectRowWithOwner): Project {
  return {
    id: row.id,
    title: row.title,
    company: row.profiles?.company_name ?? row.profiles?.full_name ?? "—",
    companyVerified: false,
    location: row.location,
    postalCode: row.postal_code ?? undefined,
    region: row.region ?? undefined,
    country: row.country,
    workMode: row.work_mode,
    budgetMin: row.budget_min ?? undefined,
    budgetMax: row.budget_max ?? undefined,
    budgetUnit: row.budget_unit,
    rateUndisclosed: row.rate_undisclosed,
    duration: DURATION_FROM_MONTHS(row.duration_months),
    durationMonths: row.duration_months ?? undefined,
    contractType: row.contract_type,
    startDate: row.start_date,
    publishedAt: row.published_at,
    industry: row.industry,
    description: row.description,
    skills: row.skills ?? [],
    applicants: 0,
    isTopProject: row.is_top,
    isUrgent: row.is_urgent,
  };
}

/**
 * Liefert alle für die aktuelle Session sichtbaren Projekte aus der DB.
 * - Eingeloggte Nutzer sehen via RLS alle projects-Rows.
 * - Gäste/anon erhalten leeres Array (RLS blockt — gewollt: DSGVO).
 *
 * Die Mock-Daten werden anschließend als Demo-Volumen hinzugefügt, damit
 * die Live-Site nicht leer aussieht, solange noch wenige echte Inserts
 * vorhanden sind.
 */
export async function listAllProjectsHybrid(): Promise<{
  fromDb: Project[];
  fromMock: Project[];
  combined: Project[];
}> {
  const fromMock = [...MOCK_PROJECTS];

  if (!isSupabaseConfigured) {
    return { fromDb: [], fromMock, combined: fromMock };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { fromDb: [], fromMock, combined: fromMock };

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id, title, description, industry, contract_type, work_mode,
      country, region, location, postal_code, start_date, duration_months,
      budget_min, budget_max, budget_unit, rate_undisclosed, skills,
      is_top, is_urgent, published_at,
      profiles:profiles!projects_owner_id_fkey(full_name, company_name)
    `,
    )
    .order("published_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return { fromDb: [], fromMock, combined: fromMock };
  }

  const fromDb = (data as unknown as ProjectRowWithOwner[]).map(rowToProject);
  // DB-Einträge zuerst (neuer + echter), Mock dahinter als Demo-Volumen
  const seen = new Set(fromDb.map((p) => p.id));
  const combined = [...fromDb, ...fromMock.filter((p) => !seen.has(p.id))];

  return { fromDb, fromMock, combined };
}

/** Nur DB-Projekte (für Detail-Pages, ohne Mock-Fallback). */
export async function getProjectFromDbById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id, title, description, industry, contract_type, work_mode,
      country, region, location, postal_code, start_date, duration_months,
      budget_min, budget_max, budget_unit, rate_undisclosed, skills,
      is_top, is_urgent, published_at,
      profiles:profiles!projects_owner_id_fkey(full_name, company_name)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToProject(data as unknown as ProjectRowWithOwner);
}
