import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatRate(
  min: number | undefined,
  max: number | undefined,
  unit: "hour" | "day" | "project",
) {
  const unitLabel =
    unit === "hour" ? "€/Std." : unit === "day" ? "€/Tag" : "€ pauschal";
  if (min === undefined && max === undefined) return "Auf Anfrage";
  if (min === undefined || max === undefined) {
    return `${min ?? max} ${unitLabel}`;
  }
  if (min === max) return `${min} ${unitLabel}`;
  return `${min}–${max} ${unitLabel}`;
}

export const CONTRACT_TYPE_LABEL: Record<
  "freelance" | "werkvertrag" | "dienstvertrag" | "anue" | "festanstellung",
  string
> = {
  freelance: "Freelance",
  werkvertrag: "Werkvertrag",
  dienstvertrag: "Dienstvertrag",
  anue: "AÜG",
  festanstellung: "Festanstellung",
};

export function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function relativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "heute";
  if (days === 1) return "vor 1 Tag";
  if (days < 7) return `vor ${days} Tagen`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "vor 1 Woche";
  return `vor ${weeks} Wochen`;
}

export const WORK_MODE_LABEL: Record<"remote" | "hybrid" | "onsite", string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Vor-Ort",
};

export const AVAILABILITY_LABEL = {
  immediately: "Sofort verfügbar",
  "1month": "Verfügbar in 1 Monat",
  "3months": "Verfügbar in 3 Monaten",
  flexible: "Flexibel",
} as const;

export const DURATION_LABEL = {
  short: "Kurzfristig (< 3 Monate)",
  medium: "Mittelfristig (3–6 Monate)",
  long: "Langfristig (6+ Monate)",
} as const;
