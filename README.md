# FreelanceConnect.de

DSGVO-konforme B2B-Projektbörse für IT-Freelancer in der DACH-Region — direkte
Vermittlung ohne Mittelmann, ohne Vermittlungsgebühr.

**Live:** https://freelanceconnect.de

## Tech-Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 4** (CSS-only Theme via `@theme`)
- **Plus Jakarta Sans** (Fiverr-nah, modern-humanistisch)
- **lucide-react** Icons
- **@vercel/analytics** + **@vercel/speed-insights**

## Features

- Multi-Field-Suche (Skill + Stadt/PLZ) mit Quick-Categories
- Liste/Karten-Toggle für Suchergebnisse
- Filter: Vertragstyp, Branche (gruppiert wie freelancermap.de), Land →
  Region → Stadt → PLZ → Umkreis, Stundensatz min/max + „ohne Rate
  ausschließen", Projektstart (Monat/Jahr), Dauer
- DSGVO-Gating: Auftraggeber maskiert für Gäste, Freelancer-Namen
  pseudonymisiert ohne Recruiter-Lizenz
- KI-Assistent als Chat-Widget
- CV-Upload mit Mock-Profil-Extraktion
- Recruiter-Lizenz + Connect-Pro-Abo (Stub)
- Vollständige rechtliche Seiten (Impressum § 5 TMG, DSGVO, AGB)

## Lokal starten

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # Production-Build
npm run start        # Production-Server lokal
```

## Environment-Variablen

| Variable | Default | Zweck |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://freelanceconnect.de` | Kanonische Basis-URL für Metadata, OG-Tags, Sitemap, robots.txt und JSON-LD. Auf Vercel Previews automatisch via `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` befüllt. |
| `NEXT_PUBLIC_DEMO_MODE` | unset | `"1"` zeigt den Demo-Rollen-Switcher (Gast/Freelancer/Recruiter) und Demo-Hinweise auch in Production. In Production-Builds standardmäßig aus. |
| `NEXT_PUBLIC_SUPABASE_URL` | unset | URL des Supabase-Projekts. Wenn unset → Mock-Auth bleibt aktiv. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | unset | Anon-Key des Supabase-Projekts. |

## Supabase-Setup (echtes Backend)

1. **Supabase-Projekt anlegen** auf https://supabase.com/dashboard
   - Region: **Frankfurt (eu-central-1)** für DSGVO
   - Notiere Project URL + anon public key (`Settings → API`)

2. **Schema einspielen**: SQL Editor öffnen, Inhalt von
   `supabase/migrations/0001_initial.sql` ausführen.
   - Erstellt `profiles`, `projects`, `applications`, `recruiter_licenses`,
     `profile_access_log` mit kompletter Row-Level-Security
   - Trigger `on_auth_user_created` provisioniert automatisch eine
     `profiles`-Zeile bei jeder neuen Registrierung

3. **Auth-Settings** (`Authentication → URL Configuration`):
   - Site URL: `https://freelanceconnect.de`
   - Redirect URLs: `https://freelanceconnect.de/**`, `http://localhost:3000/**`

4. **Env-Vars in Vercel setzen**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   ```
   Auch für `preview` und `development` setzen, damit Previews funktionieren.

5. **Redeploy** auslösen — Login/Register laufen ab sofort gegen Supabase.
   Ohne ENV-Vars läuft die App weiter im Demo-Modus mit dem Mock-Switcher.

### Was die RLS-Policies absichern

| Aktion | Voraussetzung (server-seitig erzwungen) |
| --- | --- |
| Projekte sehen | eingeloggter Nutzer (Gäste sehen Mock) |
| Projekt einstellen | Recruiter-Rolle |
| Auf Projekt bewerben | Freelancer-Rolle **+** aktives Connect-Pro-Abo |
| Freelancer-Profil im Klartext | Recruiter mit `status='active'` Lizenz **+** `company_verified=true` |
| Profil-Download/Kontakt | wie oben + wird in `profile_access_log` protokolliert |
| Audit-Log einsehen | Freelancer für sich selbst, Recruiter für eigene Zugriffe |

### Auf Vercel setzen

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# Wert: https://freelanceconnect.de
```

## Analytics &amp; Privacy

Vercel Analytics und Speed Insights werden **erst nach expliziter
Cookie-Einwilligung** geladen (`Statistik &amp; Reichweite` im Cookie-Banner
bzw. unter `/cookies`). Ohne Zustimmung fließen keine Telemetriedaten.
Implementierung in `src/components/analytics/ConsentAnalytics.tsx`.

## Deployment

Vercel-Connect auf `gennarofrenken/freelanceconnect.de` — jeder Push auf
`main` deployt automatisch.

```bash
git push origin main
```

## Sicherheit

- Security-Headers (HSTS, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy) via `next.config.ts`
- CSP im **Report-Only**-Modus (Aktivierung als Enforce in einem
  Folge-Step nach Beobachtung)
- Auth-Mock + Permission-Helpers in `src/lib/auth.tsx` — vor Go-Live:
  durch echte Auth (z. B. Supabase, NextAuth) ersetzen

## Roadmap (Produktion)

1. Echtes Backend (Supabase / Postgres + Drizzle)
2. NextAuth / Supabase Auth mit Session-Cookies + Server-Side-Gating
3. Stripe-Abo für Connect-Pro (Freelancer Premium)
4. Recruiter-Lizenz-Workflow mit Video-Ident (z. B. IDnow) + AVV-Signatur
5. CV-Parsing serverseitig (z. B. via OpenAI Files API + JSON-Schema)
6. E-Mail-Versand (Resend / Postmark) für Bewerbungen, Anfragen,
   Account-Mails
7. Echtzeit-Benachrichtigungen (Vercel Queues)
8. Sentry für Error-Tracking
9. CSP von Report-Only auf Enforce umstellen

## Ordnerstruktur

```
src/
  app/                # Routen (App Router)
  components/
    ai/               # KI-Assistent, CV-Uploader
    cards/            # Project/Freelancer-Karten + Listen-Items
    details/          # Detailseiten-Bausteine (z. B. ContactDialog)
    dev/              # DemoRoleSwitcher (nur via DEMO_MODE)
    home/             # Sektionen der Landing Page
    layout/           # Navbar, Footer, Logo
    legal/            # CookieConsent, ContactGate, Identity-Masking
    search/           # SearchFiltersPanel
    seo/              # JSON-LD-Komponenten
    ui/               # Button, Badge, Input
  constants/          # Industries, Skills, Mock-Daten
  lib/                # auth, utils, cv-parser, mock-queries, assistant
  types/              # zentrale TS-Interfaces
```
