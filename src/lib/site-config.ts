const DEFAULT_SITE_URL = "https://freelanceconnect.de";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return DEFAULT_SITE_URL;
}

export const SITE_NAME = "FreelanceConnect";

export const SITE_DEFAULTS = {
  title: "FreelanceConnect – IT-Freelancer & Projekte in Deutschland",
  description:
    "Die seriöse B2B-Plattform für IT-Freelancer und Unternehmen in der DACH-Region. DSGVO-konform, ohne Vermittlungsgebühr.",
  locale: "de_DE",
  themeColor: "#0c87eb",
} as const;
