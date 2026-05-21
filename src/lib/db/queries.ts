import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  ContractType,
  Country,
  Project,
  ProjectDuration,
  WorkMode,
} from "@/types";

interface ProjectRow {
  id: string;
  owner_id: string;
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

function rowToProject(row: ProjectRow): Project {
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
 * Eigene Projekte des eingeloggten Recruiters. Leeres Array, wenn nicht
 * eingeloggt oder Supabase nicht konfiguriert.
 */
export async function getMyProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id, owner_id, title, description, industry, contract_type, work_mode,
      country, region, location, postal_code, start_date, duration_months,
      budget_min, budget_max, budget_unit, rate_undisclosed, skills,
      is_top, is_urgent, published_at,
      profiles:profiles!projects_owner_id_fkey(full_name, company_name)
    `,
    )
    .eq("owner_id", user.id)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ProjectRow[]).map(rowToProject);
}

/**
 * Zähler für das Dashboard (eigene Projekte, eigene Bewerbungen).
 */
export interface DashboardStats {
  myProjectsCount: number;
  myApplicationsCount: number;
  isAuthenticated: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured) {
    return { myProjectsCount: 0, myApplicationsCount: 0, isAuthenticated: false };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { myProjectsCount: 0, myApplicationsCount: 0, isAuthenticated: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { myProjectsCount: 0, myApplicationsCount: 0, isAuthenticated: false };
  }

  const [projectsRes, applicationsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", user.id),
  ]);

  return {
    myProjectsCount: projectsRes.count ?? 0,
    myApplicationsCount: applicationsRes.count ?? 0,
    isAuthenticated: true,
  };
}
