/**
 * Admin-Erkennung via ENV-Allowlist.
 * Setze in Vercel: ADMIN_EMAILS=mail1@firma.de,mail2@firma.de
 * (Komma-separiert, ohne Leerzeichen)
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
