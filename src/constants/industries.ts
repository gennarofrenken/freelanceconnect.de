export const INDUSTRY_GROUPS = [
  {
    label: "IT & Software",
    slug: "it-software",
    blurb: "Softwareentwicklung, SAP, Cloud, Data, Security",
    projectCount: 8420,
    items: [
      "IT & Softwareentwicklung",
      "SAP & ERP",
      "Cloud & DevOps",
      "Data Science & KI",
      "Cyber Security",
      "Mobile (iOS / Android)",
      "Web & E-Commerce",
      "Embedded Systems",
      "Test & QA",
    ],
  },
  {
    label: "Finanzdienstleistungen",
    slug: "finanzdienstleistungen",
    blurb: "Banken, FinTech, Asset Management, Risk",
    projectCount: 1340,
    items: [
      "Banken & Kapitalmarkt",
      "Asset Management",
      "Zahlungsverkehr & FinTech",
      "Risk & Compliance",
    ],
  },
  {
    label: "Versicherungen",
    slug: "versicherungen",
    blurb: "Leben, Sach, Rück, InsurTech",
    projectCount: 720,
    items: [
      "Lebens- & Krankenversicherung",
      "Sach- & Schadenversicherung",
      "Rückversicherung",
      "InsurTech",
    ],
  },
  {
    label: "Industrie & Engineering",
    slug: "industrie-engineering",
    blurb: "Automotive, Maschinenbau, Elektrotechnik, Energie",
    projectCount: 1180,
    items: [
      "Automotive",
      "Maschinen- & Anlagenbau",
      "Elektrotechnik",
      "Luft- & Raumfahrt",
      "Energieversorgung",
      "Bauwesen & Architektur",
    ],
  },
  {
    label: "Life Sciences",
    slug: "life-sciences",
    blurb: "Pharma, Medizintechnik, Biotech, Healthcare-IT",
    projectCount: 540,
    items: [
      "Pharma",
      "Medizintechnik",
      "Biotech",
      "Klinikbetrieb & Healthcare-IT",
    ],
  },
  {
    label: "Telekommunikation & Medien",
    slug: "telekom-medien",
    blurb: "Telekom, Verlag, Marketing, Entertainment",
    projectCount: 480,
    items: [
      "Telekommunikation",
      "Medien & Verlag",
      "Marketing & Werbung",
      "Spiele & Entertainment",
    ],
  },
  {
    label: "Logistik & Handel",
    slug: "logistik-handel",
    blurb: "Supply Chain, Transport, Retail, Konsumgüter",
    projectCount: 620,
    items: [
      "Logistik & Supply Chain",
      "Transport & Verkehr",
      "Handel & Retail",
      "Konsumgüter",
    ],
  },
  {
    label: "Beratung & Services",
    slug: "beratung-services",
    blurb: "Management, HR, Recht, Bildung",
    projectCount: 390,
    items: [
      "Beratung & Management",
      "Personalwesen / HR",
      "Recht & Steuern",
      "Bildung & Forschung",
    ],
  },
  {
    label: "Öffentlicher Sektor",
    slug: "oeffentlicher-sektor",
    blurb: "Verwaltung, Verteidigung, Non-Profit",
    projectCount: 310,
    items: [
      "Bundes-, Landes- & Kommunalverwaltung",
      "Verteidigung & Sicherheit",
      "Non-Profit & Verbände",
    ],
  },
] as const;

export type IndustryGroup = (typeof INDUSTRY_GROUPS)[number];
export type IndustryGroupSlug = IndustryGroup["slug"];

export function findIndustryGroupBySlug(
  slug: string | null | undefined,
): IndustryGroup | undefined {
  if (!slug) return undefined;
  return INDUSTRY_GROUPS.find((g) => g.slug === slug);
}

export function findIndustryGroupByItem(
  industry: string,
): IndustryGroup | undefined {
  return INDUSTRY_GROUPS.find((g) =>
    (g.items as readonly string[]).includes(industry),
  );
}

/**
 * Skaliert die deklarierte projectCount-Baseline um den Mock-Anteil der Gruppe.
 * Mock hat nur 16 Projekte — würde sonst 0 oder 1 anzeigen. Baseline + Mock-Boost
 * sorgt für glaubwürdige UI ohne Backend.
 */
export function projectCountForGroup(
  group: IndustryGroup,
  mockMatches: number,
  mockTotal: number,
): number {
  if (mockTotal === 0) return group.projectCount;
  const liveShare = mockMatches / mockTotal;
  const blended = Math.round(group.projectCount * (0.85 + liveShare * 0.6));
  return blended;
}

export const INDUSTRIES = INDUSTRY_GROUPS.flatMap((g) => g.items) as readonly string[];

export type Industry = (typeof INDUSTRIES)[number];

export const CONTRACT_TYPES = [
  { value: "freelance", label: "Freelance / Selbstständig" },
  { value: "werkvertrag", label: "Werkvertrag" },
  { value: "dienstvertrag", label: "Dienstvertrag" },
  { value: "anue", label: "Arbeitnehmerüberlassung (AÜG)" },
  { value: "festanstellung", label: "Festanstellung" },
] as const;
