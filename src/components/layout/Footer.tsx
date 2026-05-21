import Link from "next/link";
import { Logo } from "./Logo";

const PLATFORM = [
  { label: "Projekte finden", href: "/search?type=projects" },
  { label: "Freelancer finden", href: "/search?type=freelancers" },
  { label: "Projekt einstellen", href: "/projekte/erstellen" },
  { label: "Preise", href: "/preise" },
];

const COMPANY = [
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Karriere", href: "/karriere" },
  { label: "Kontakt", href: "/kontakt" },
];

const LEGAL = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200 bg-ink-50/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,_1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              Die direkte Plattform für IT-Freelancer und Unternehmen
              in der DACH-Region. Ohne Vermittlungsgebühr.
            </p>
          </div>
          <FooterColumn title="Plattform" items={PLATFORM} />
          <FooterColumn title="Unternehmen" items={COMPANY} />
          <FooterColumn title="Rechtliches" items={LEGAL} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FreelanceConnect GmbH</p>
          <p>DSGVO-konform · Hosting in der EU</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-ink-700 transition-colors hover:text-brand-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
