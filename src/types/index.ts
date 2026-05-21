export type WorkMode = "remote" | "hybrid" | "onsite";
export type Availability = "immediately" | "1month" | "3months" | "flexible";
export type ProjectDuration = "short" | "medium" | "long";

export type ContractType =
  | "freelance"
  | "werkvertrag"
  | "dienstvertrag"
  | "anue"
  | "festanstellung";

export type Country = "DE" | "AT" | "CH";

export interface Project {
  id: string;
  title: string;
  company: string;
  companyVerified: boolean;
  location: string;
  postalCode?: string;
  region?: string;
  country: Country;
  workMode: WorkMode;
  budgetMin?: number;
  budgetMax?: number;
  budgetUnit: "hour" | "day" | "project";
  rateUndisclosed?: boolean;
  duration: ProjectDuration;
  durationMonths?: number;
  contractType: ContractType;
  startDate: string;
  publishedAt: string;
  industry: string;
  description: string;
  skills: string[];
  applicants: number;
  isUrgent?: boolean;
  isTopProject?: boolean;
}

export interface Freelancer {
  id: string;
  fullName: string;
  title: string;
  initials: string;
  location: string;
  region?: string;
  country: Country;
  workMode: WorkMode;
  availability: Availability;
  hourlyRateMin: number;
  hourlyRateMax: number;
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  industry: string;
  bio: string;
  skills: string[];
  languages: string[];
  isVerified: boolean;
  isTopRated?: boolean;
  responseTimeHours: number;
}

export type SearchResult =
  | ({ kind: "project" } & Project)
  | ({ kind: "freelancer" } & Freelancer);

export interface SearchFilters {
  query: string;
  type: "all" | "projects" | "freelancers";
  workMode: WorkMode[];
  contractTypes: ContractType[];
  industries: string[];
  skills: string[];
  budgetMin?: number;
  budgetMax?: number;
  excludeNoRate: boolean;
  availability?: Availability;
  country?: Country;
  region?: string;
  location?: string;
  postalCode?: string;
  radius?: number;
  startMonth?: number;
  startYear?: number;
  durationMonthsMin?: number;
  durationMonthsMax?: number;
}
