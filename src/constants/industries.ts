/**
 * Branchen-Modell — angelehnt an die Projektsuche-Filter von
 * freelancermap.de und freelance.de. Bewährte Hauptbranchen mit den
 * jeweils dort üblichen Unterbranchen.
 *
 * Wenn du eine Branche umbenennst: prüfe auch `src/constants/mock-data.ts`
 * (alle Strings in `industry:` müssen weiterhin in einer der `items`-Listen
 * vorkommen, sonst greifen die Suchfilter ins Leere).
 */
export const INDUSTRY_GROUPS = [
  {
    label: "IT & Software",
    slug: "it-software",
    blurb: "Softwareentwicklung, SAP, Cloud, Data, Security",
    projectCount: 8420,
    items: [
      "IT & Softwareentwicklung",
      "Softwareentwicklung",
      "SAP & ERP",
      "Cloud & DevOps",
      "Data Science & KI",
      "Cyber Security",
      "Mobile (iOS / Android)",
      "Web & E-Commerce",
      "Embedded Systems",
      "Test & QA",
      "Hardware",
      "IT-Beratung",
      "Datenbanken & BI",
      "Netzwerk & Infrastruktur",
    ],
  },
  {
    label: "Telekommunikation",
    slug: "telekommunikation",
    blurb: "Mobilfunk, Netzbetrieb, OSS/BSS, 5G",
    projectCount: 540,
    items: [
      "Telekommunikation",
      "Mobilfunk & Netzbetrieb",
      "OSS / BSS",
      "Netzplanung",
    ],
  },
  {
    label: "Banken & Finanzdienstleistungen",
    slug: "finanzdienstleistungen",
    blurb: "Banken, FinTech, Asset Management, Risk",
    projectCount: 2340,
    items: [
      "Banken & Kapitalmarkt",
      "Asset Management",
      "Zahlungsverkehr & FinTech",
      "Risk & Compliance",
      "Kreditwesen",
      "Wertpapiere & Handel",
    ],
  },
  {
    label: "Versicherungen",
    slug: "versicherungen",
    blurb: "Leben, Sach, Rück, InsurTech",
    projectCount: 1120,
    items: [
      "Lebens- & Krankenversicherung",
      "Sach- & Schadenversicherung",
      "Rückversicherung",
      "InsurTech",
      "Aktuariat",
    ],
  },
  {
    label: "Automotive",
    slug: "automotive",
    blurb: "OEM, Tier-1, E-Mobility, ADAS, Autonomous Driving",
    projectCount: 1780,
    items: [
      "Automotive",
      "OEM & Tier-1",
      "E-Mobility",
      "Autonomous Driving / ADAS",
      "Fahrzeug-Elektronik",
    ],
  },
  {
    label: "Industrie & Maschinenbau",
    slug: "industrie-engineering",
    blurb: "Maschinenbau, Anlagenbau, Elektrotechnik, Automatisierung",
    projectCount: 1980,
    items: [
      "Maschinen- & Anlagenbau",
      "Elektrotechnik",
      "Automatisierung",
      "Luft- & Raumfahrt",
      "Chemie & Verfahrenstechnik",
      "Stahl & Metallverarbeitung",
    ],
  },
  {
    label: "Energie & Versorgung",
    slug: "energie-versorgung",
    blurb: "Strom, Gas, Wasser, Erneuerbare, Netze",
    projectCount: 870,
    items: [
      "Energieversorgung",
      "Stadtwerke",
      "Erneuerbare Energien",
      "Wasserwirtschaft",
      "Smart Grid",
    ],
  },
  {
    label: "Bauwesen & Architektur",
    slug: "bauwesen",
    blurb: "Hoch- und Tiefbau, Architektur, BIM",
    projectCount: 410,
    items: [
      "Hochbau",
      "Tiefbau",
      "Architektur",
      "BIM & Planung",
      "Bauwesen & Architektur",
    ],
  },
  {
    label: "Pharma, Medizin & Healthcare",
    slug: "life-sciences",
    blurb: "Pharma, Medizintechnik, Biotech, Healthcare-IT",
    projectCount: 840,
    items: [
      "Pharma",
      "Medizintechnik",
      "Biotech",
      "Klinikbetrieb & Healthcare-IT",
      "eHealth",
    ],
  },
  {
    label: "Logistik & Transport",
    slug: "logistik",
    blurb: "Supply Chain, Transport, Spedition, Lager",
    projectCount: 620,
    items: [
      "Logistik & Supply Chain",
      "Transport & Verkehr",
      "Spedition",
      "Warehousing",
    ],
  },
  {
    label: "Handel & E-Commerce",
    slug: "handel",
    blurb: "Retail, E-Commerce, Konsumgüter",
    projectCount: 730,
    items: [
      "Handel & Retail",
      "E-Commerce",
      "Konsumgüter",
      "Marktplätze",
    ],
  },
  {
    label: "Medien & Marketing",
    slug: "medien-marketing",
    blurb: "Verlag, Werbung, Spiele, Entertainment",
    projectCount: 480,
    items: [
      "Medien & Verlag",
      "Marketing & Werbung",
      "Spiele & Entertainment",
      "Online-Medien",
    ],
  },
  {
    label: "Beratung & Services",
    slug: "beratung-services",
    blurb: "Management, HR, Recht, Steuern, Personalwesen",
    projectCount: 1290,
    items: [
      "Beratung & Management",
      "Personalwesen / HR",
      "Recht & Steuern",
      "Unternehmensberatung",
    ],
  },
  {
    label: "Bildung & Forschung",
    slug: "bildung-forschung",
    blurb: "Hochschule, EdTech, Forschungseinrichtungen",
    projectCount: 220,
    items: [
      "Bildung & Forschung",
      "Hochschule",
      "EdTech",
      "Forschungsinstitute",
    ],
  },
  {
    label: "Öffentlicher Sektor",
    slug: "oeffentlicher-sektor",
    blurb: "Verwaltung (Bund/Länder/Kommunen), Verteidigung",
    projectCount: 510,
    items: [
      "Bundes-, Landes- & Kommunalverwaltung",
      "Verteidigung & Sicherheit",
      "Non-Profit & Verbände",
    ],
  },
  {
    label: "Reise & Touristik",
    slug: "reise-touristik",
    blurb: "Touristik, Hotellerie, Verkehrsträger",
    projectCount: 180,
    items: [
      "Reise & Touristik",
      "Hotellerie & Gastronomie",
      "Luftfahrt-Operator",
    ],
  },
  {
    label: "Sonstige",
    slug: "sonstige",
    blurb: "Branchen, die nicht eindeutig in eine Kategorie fallen",
    projectCount: 150,
    items: ["Sonstige"],
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
