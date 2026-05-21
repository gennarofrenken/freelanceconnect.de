import { CITIES, TOP_SKILLS } from "@/constants/skills";

export interface ExtractedProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  title?: string;
  location?: string;
  yearsExperience?: number;
  skills: string[];
  languages: string[];
  bio?: string;
}

const LANGUAGE_TERMS = [
  "Deutsch",
  "Englisch",
  "Französisch",
  "Spanisch",
  "Italienisch",
  "Polnisch",
  "Russisch",
  "Türkisch",
  "Chinesisch",
  "Japanisch",
  "Arabisch",
  "Niederländisch",
  "Portugiesisch",
  "Schwedisch",
  "Dänisch",
  "Norwegisch",
];

const TITLE_HINTS = [
  "Senior",
  "Junior",
  "Lead",
  "Principal",
  "Staff",
  "Engineer",
  "Entwickler",
  "Developer",
  "Consultant",
  "Berater",
  "Architect",
  "Architekt",
  "Manager",
  "Designer",
  "Analyst",
  "Specialist",
  "Spezialist",
  "Scientist",
];

const NAME_LINE = /^([A-ZÄÖÜ][a-zäöüß-]+\.?\s+){1,3}[A-ZÄÖÜ][a-zäöüß-]+$/;

export function extractProfile(rawText: string): ExtractedProfile {
  const text = rawText.replace(/\r/g, "");
  const lower = text.toLowerCase();
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const result: ExtractedProfile = { skills: [], languages: [] };

  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) result.email = emailMatch[0];

  const phoneMatch = text.match(/(?:\+49|0049|\+|0)[\s\d\-/()]{8,}/);
  if (phoneMatch) {
    result.phone = phoneMatch[0]
      .replace(/[^\d+\s/-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  for (const line of lines.slice(0, 6)) {
    if (line.length > 60) continue;
    if (NAME_LINE.test(line)) {
      result.fullName = line;
      break;
    }
  }

  for (const line of lines.slice(0, 14)) {
    if (line === result.fullName) continue;
    if (line.length > 90) continue;
    const hasHint = TITLE_HINTS.some((h) => line.includes(h));
    if (hasHint) {
      result.title = line.replace(/[•·|].*$/, "").trim();
      break;
    }
  }

  for (const city of CITIES) {
    const idx = text.indexOf(city);
    if (idx !== -1) {
      result.location = city;
      break;
    }
  }

  const yearsMatch = text.match(/(\d{1,2})\s*\+?\s*Jahre/i);
  if (yearsMatch) {
    const n = parseInt(yearsMatch[1], 10);
    if (n > 0 && n < 60) result.yearsExperience = n;
  }

  const seenSkills = new Set<string>();
  for (const skill of TOP_SKILLS) {
    const needle = skill.toLowerCase();
    if (lower.includes(needle) && !seenSkills.has(skill)) {
      seenSkills.add(skill);
      result.skills.push(skill);
    }
  }

  const seenLangs = new Set<string>();
  for (const lang of LANGUAGE_TERMS) {
    if (text.includes(lang) && !seenLangs.has(lang)) {
      seenLangs.add(lang);
      result.languages.push(lang);
    }
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  for (const p of paragraphs) {
    if (p.length < 80 || p.length > 600) continue;
    if (p.includes("@")) continue;
    if (/^\d/.test(p)) continue;
    if (p === result.fullName) continue;
    result.bio = p;
    break;
  }

  return result;
}

const PREFILL_KEY = "freelanceconnect:cv-prefill:v1";

export function savePrefill(profile: ExtractedProfile): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PREFILL_KEY, JSON.stringify(profile));
}

export function readPrefill(): ExtractedProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExtractedProfile;
  } catch {
    return null;
  }
}

export function clearPrefill(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PREFILL_KEY);
}

export function isExtractableFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    file.type.startsWith("text/")
  );
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
