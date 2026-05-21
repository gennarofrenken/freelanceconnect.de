# Testing-Policy

> **Ab sofort wird ausschließlich live gegen die Produktions-Deployment auf
> [https://freelanceconnect.de](https://freelanceconnect.de) getestet —
> keine lokalen Test-Loops mehr.**

## Workflow

1. Änderung lokal vornehmen.
2. `git commit` + `git push origin main`.
3. Vercel deployed automatisch (~30–60 Sekunden).
4. **Verifikation ausschließlich auf der Live-URL.**

Lokales `npm run dev` darf weiter zum Schreiben/Debuggen genutzt werden,
zählt aber **nicht** als „getestet". Erst die Live-URL zählt.

## Standard-Live-Checks

Diese Befehle laufen gegen das Production-Deployment und decken die
wichtigsten Funktionsbereiche ab.

### 1. Verfügbarkeit & Security-Header

```bash
curl -sI https://freelanceconnect.de/ -L | head -25
```

Erwartet: `HTTP/2 200`, plus alle Security-Header:
- `strict-transport-security`
- `content-security-policy-report-only`
- `x-frame-options: SAMEORIGIN`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(), …`
- **NICHT** vorhanden: `x-powered-by` (durch `poweredByHeader: false`).

### 2. SEO-Artefakte

```bash
curl -s https://freelanceconnect.de/robots.txt
curl -s https://freelanceconnect.de/sitemap.xml | head -40
curl -sI https://freelanceconnect.de/manifest.webmanifest
curl -sI https://freelanceconnect.de/opengraph-image
curl -sI https://freelanceconnect.de/twitter-image
```

Erwartet:
- `robots.txt` listet `/admin`, `/dashboard`, `/profil`, `/freelancers/`,
  `/recruiter/`, `/api/` unter `Disallow:` und referenziert die Sitemap.
- `sitemap.xml` enthält alle öffentlichen Routen + `/projects/:id`,
  **keine** `/freelancers/:id` (DSGVO — keine PII-Indexierung).
- OG/Twitter-Bilder liefern `content-type: image/png`.
- `manifest.webmanifest` liefert `application/manifest+json`.

### 3. DSGVO-Routen

```bash
# Öffentlich indexierbar:
curl -sI https://freelanceconnect.de/preise        | grep -E "HTTP|x-robots"
curl -sI https://freelanceconnect.de/agb           | grep -E "HTTP|x-robots"
curl -sI https://freelanceconnect.de/datenschutz   | grep -E "HTTP|x-robots"
curl -sI https://freelanceconnect.de/impressum     | grep -E "HTTP|x-robots"

# Private Routen — sollten `x-robots-tag: noindex` ausliefern:
curl -sI https://freelanceconnect.de/dashboard     | grep -E "HTTP|x-robots"
curl -sI https://freelanceconnect.de/profil        | grep -E "HTTP|x-robots"
curl -sI "https://freelanceconnect.de/freelancers/f-2001" | grep -E "HTTP|x-robots"
```

### 4. JSON-LD-Validierung

Für ein einzelnes Projekt das eingebettete JobPosting-LD prüfen:

```bash
curl -s "https://freelanceconnect.de/projects/p-1001" \
  | grep -o '<script type="application/ld+json"[^>]*>[^<]*</script>' \
  | head -3
```

Erwartet: mindestens ein `JobPosting`-Block mit `hiringOrganization`,
`baseSalary`, `jobLocation`.

Empfohlen: einmalig durch
[Google Rich Results Test](https://search.google.com/test/rich-results?url=https%3A%2F%2Ffreelanceconnect.de%2Fprojects%2Fp-1001)
schicken.

### 5. Performance & Vitals

- Lighthouse via PageSpeed Insights:
  https://pagespeed.web.dev/analysis?url=https%3A%2F%2Ffreelanceconnect.de
- Speed Insights Dashboard in Vercel (lädt nur nach Cookie-Zustimmung,
  daher zum Testen Cookies setzen).

### 6. Visuell — Browser-Smoketest

Im Browser auf der Live-URL durchklicken:

1. `/` → Hero, Stats, Top-Projekte sind sichtbar.
2. `/search?type=projects` → Filter funktioniert, Karten klickbar.
3. `/projects/<id>` → JobPosting LD im View-Source vorhanden.
4. `/cookies` → Toggles persistieren in LocalStorage.
5. Cookie-Banner → „Akzeptieren" → Vercel-Analytics-Request erscheint im
   Network-Tab (gegen `va.vercel-scripts.com`).
6. Im DevTools Mobile-Viewport: Manifest wird erkannt
   (Application-Tab → Manifest).
7. KI-Assistent unten rechts öffnen → testen, dass Antworten kommen.
8. Admin: `/admin/assistent` → Regel anlegen, speichern, im Widget testen.

## Smoketest-Skript

Einzeiler, um die wichtigsten Routen auf 200 zu prüfen:

```bash
for path in / /preise /agb /datenschutz /impressum /search /login /register \
            /projekte/erstellen /ueber-uns /karriere /kontakt /cookies \
            /preise /admin /admin/assistent /profil/cv-upload \
            /robots.txt /sitemap.xml /manifest.webmanifest \
            /opengraph-image /icon.svg; do
  code=$(curl -sLo /dev/null -w "%{http_code}" "https://freelanceconnect.de$path")
  printf "%-30s %s\n" "$path" "$code"
done
```

Erwartet: alle `200`.

## Was NICHT live getestet wird

- **Auth-Flows mit echten Accounts** auf der Produktiv-Domain, wenn dabei
  echte E-Mails versendet würden — dafür eine Test-Mailbox (z. B.
  `+test@`-Alias) verwenden.
- **Zerstörerische Operationen** auf der DB. Vor jedem Live-Test prüfen:
  bewege ich Daten, die ein realer User produziert hat?

## Wenn ein Test fehlschlägt

1. Bug lokal reproduzieren (über `npm run dev`).
2. Fix lokal, commit, push.
3. Auf erfolgreichen Vercel-Deploy warten (Dashboard oder `vercel logs`).
4. Live nochmal verifizieren.
