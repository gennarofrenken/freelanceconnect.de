import type { Metadata } from "next";
import { BadgeCheck, Building2, Globe2, Handshake, Scale, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "FreelanceConnect ist die Plattform für IT-Freelancer und Unternehmen in der DACH-Region — seriös, direkt, ohne Vermittlungsgebühr.",
};

const VALUES = [
  {
    icon: Handshake,
    title: "Direkt &amp; transparent",
    body: "Kein Vermittler zwischen Auftraggeber und Freelancer — keine versteckten Margen, keine Erfolgshonorare.",
  },
  {
    icon: Scale,
    title: "Rechtssicher",
    body: "Wir sind kein Personaldienstleister gem. AÜG, sondern Plattform. Sie behalten die volle Vertragshoheit.",
  },
  {
    icon: Globe2,
    title: "DSGVO &amp; EU-Hosting",
    body: "Daten verbleiben in der EU. Wir verfolgen Datensparsamkeit und Privacy by Design konsequent.",
  },
];

const NUMBERS = [
  { value: "12.500+", label: "geprüfte Freelancer-Profile" },
  { value: "1.800+", label: "aktive Projekte monatlich" },
  { value: "0 €", label: "Vermittlungsgebühr" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-hero-glow">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Über uns
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Die seriöse Brücke zwischen IT-Freelancern und Unternehmen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
            FreelanceConnect ist als Antwort auf einen unübersichtlichen Markt
            entstanden. Wir bauen die Plattform, die wir uns als IT-Freelancer
            und Auftraggeber selbst gewünscht hätten: klar, fair, rechtssicher.
          </p>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {NUMBERS.map((n) => (
            <div key={n.label} className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-ink-900">
                {n.value}
              </p>
              <p className="mt-1 text-sm text-ink-500">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Was uns leitet
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Drei Prinzipien, die jede Produktentscheidung bei
            FreelanceConnect prägen.
          </p>
        </header>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <article
              key={v.title}
              className="rounded-2xl border border-ink-200 bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <v.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3
                className="mt-4 text-base font-semibold tracking-tight text-ink-900"
                dangerouslySetInnerHTML={{ __html: v.title }}
              />
              <p
                className="mt-2 text-sm leading-relaxed text-ink-600"
                dangerouslySetInnerHTML={{ __html: v.body }}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink-50/40">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
              Unsere Geschichte
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">
              FreelanceConnect wurde 2025 in Berlin gegründet — von Praktiker:innen
              aus Tech-Consulting, Plattformökonomie und Datenschutzrecht. Wir
              kennen den Markt aus beiden Seiten und wissen, woran es scheitert:
              an Intransparenz, an Vermittlerketten und an Plattformen, die
              Geschwindigkeit über Sorgfalt stellen.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Unser Anspruch: Wir bauen Software, die jeden Schritt der
              Zusammenarbeit so klar wie möglich macht — von der Projektdefinition
              über die Auswahl bis zum Vertragsabschluss.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              {
                icon: Users,
                title: "Wer wir sind",
                body: "Ein interdisziplinäres Team aus Engineering, Recht und Product.",
              },
              {
                icon: Building2,
                title: "Unsere Kund:innen",
                body: "Mittelstand, Konzerne und öffentliche Auftraggeber aus DACH.",
              },
              {
                icon: BadgeCheck,
                title: "Unser Versprechen",
                body: "Wir verifizieren jedes neue Unternehmen anhand des Handelsregistereintrags.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-ink-200 bg-white p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-ink-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
          Sie möchten mit uns zusammenarbeiten?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
          Egal ob als Auftraggeber, Freelancer oder Partner — wir freuen uns
          über Ihre Nachricht.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/kontakt" variant="primary" size="md">
            Kontakt aufnehmen
          </Button>
          <Button href="/karriere" variant="outline" size="md">
            Offene Stellen
          </Button>
        </div>
      </section>
    </div>
  );
}
