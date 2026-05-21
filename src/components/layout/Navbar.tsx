"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PRIMARY_NAV: { label: string; href: string; subnav?: { label: string; href: string }[] }[] = [
  {
    label: "Projekte",
    href: "/search?type=projects",
    subnav: [
      { label: "Alle IT-Projekte", href: "/search?type=projects" },
      { label: "Remote-Projekte", href: "/search?type=projects&workMode=remote" },
      { label: "Top-Projekte", href: "/search?type=projects&sort=top" },
      { label: "Projekt einstellen", href: "/projekte/erstellen" },
    ],
  },
  {
    label: "Freelancer",
    href: "/search?type=freelancers",
    subnav: [
      { label: "Alle Freelancer", href: "/search?type=freelancers" },
      { label: "Top-Rated Experten", href: "/search?type=freelancers&top=1" },
      { label: "Sofort verfügbar", href: "/search?type=freelancers&avail=immediately" },
    ],
  },
  {
    label: "Magazin",
    href: "/magazin",
  },
  {
    label: "Preise",
    href: "/preise",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setOpenSub(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40">
      {/* Top-Bar (freelance.de-Stil): Vertrauenszahlen + Hotline */}
      <div className="hidden border-b border-brand-800/30 bg-brand-900 text-brand-50 md:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-6 px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 text-brand-100/90">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-300" aria-hidden />
              DSGVO-konform · EU-Hosting
            </span>
            <span aria-hidden className="text-brand-700">·</span>
            <span>Über 12.480 aktive Projekte · 38.700+ Freelancer</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:+4930000000000"
              className="inline-flex items-center gap-1.5 text-brand-100/90 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              +49 30 0000 0000
            </a>
            <Link
              href="/hilfe"
              className="text-brand-100/90 transition-colors hover:text-white"
            >
              Hilfe
            </Link>
          </div>
        </div>
      </div>

      {/* Main-Header */}
      <div className="border-b border-ink-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <Logo />
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Hauptnavigation"
              onMouseLeave={() => setOpenSub(null)}
            >
              {PRIMARY_NAV.map((item) => {
                const isActive =
                  pathname === item.href.split("?")[0] ||
                  (item.href.startsWith("/search") &&
                    pathname?.startsWith("/search") &&
                    item.href.includes(pathname?.split("?")[0] ?? ""));
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.subnav && setOpenSub(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-medium tracking-tight transition-colors",
                        isActive
                          ? "text-brand-700"
                          : "text-ink-700 hover:text-brand-700",
                      )}
                    >
                      {item.label}
                      {item.subnav && (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 text-ink-400 transition-transform",
                            openSub === item.label && "rotate-180",
                          )}
                          aria-hidden
                        />
                      )}
                    </Link>
                    {item.subnav && openSub === item.label && (
                      <div className="absolute left-0 top-full pt-2">
                        <div className="min-w-56 rounded-xl border border-ink-200 bg-white p-1 shadow-elevated">
                          {item.subnav.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button href="/login" variant="ghost" size="sm">
              Login
            </Button>
            <Button href="/register" variant="primary" size="sm">
              Kostenlos starten
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile-Menu */}
      {open && (
        <div className="md:hidden border-b border-ink-200 bg-white shadow-elevated">
          <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6" aria-label="Mobile Navigation">
            <ul className="space-y-1">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-200 pt-3">
              <Button href="/login" variant="outline" size="md" className="w-full">
                Login
              </Button>
              <Button href="/register" variant="primary" size="md" className="w-full">
                Kostenlos starten
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
