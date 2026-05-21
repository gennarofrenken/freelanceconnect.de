"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ParsedProfile {
  fullName: string;
  title: string;
  yearsExperience: number;
  location: string;
  skills: string[];
  languages: string[];
  bio: string;
}

const MOCK_PROFILE: ParsedProfile = {
  fullName: "Sophia Becker",
  title: "Senior Full-Stack Developer (React / Node.js)",
  yearsExperience: 11,
  location: "Berlin",
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "GraphQL",
    "Docker",
    "AWS",
  ],
  languages: ["Deutsch", "Englisch", "Französisch"],
  bio: "Senior Full-Stack Engineerin mit elf Jahren Erfahrung im Aufbau skalierbarer Web-Plattformen. Schwerpunkt auf produktnaher Frontend-Architektur, Design Systems und API-Design. Häufig als Vermittler zwischen Produkt und Engineering eingesetzt.",
};

type Stage = "idle" | "uploading" | "parsing" | "done";

export function CvUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function pick(f: File | null) {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      alert("Die Datei ist zu groß (max. 8 MB).");
      return;
    }
    setFile(f);
    setStage("uploading");
    window.setTimeout(() => setStage("parsing"), 600);
    window.setTimeout(() => {
      setProfile(MOCK_PROFILE);
      setStage("done");
    }, 2400);
  }

  function reset() {
    setFile(null);
    setProfile(null);
    setStage("idle");
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (stage === "idle") pick(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`rounded-2xl border-2 border-dashed bg-white p-8 text-center transition-colors ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-ink-200 hover:border-brand-300"
        }`}
      >
        {stage === "idle" && (
          <>
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Upload className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-ink-900">
              Lebenslauf hochladen
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              PDF oder DOCX, max. 8 MB. Die KI extrahiert Skills, Erfahrung
              und Sprachen automatisch.
            </p>
            <label className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              <Upload className="h-4 w-4" aria-hidden />
              Datei auswählen
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="mt-3 text-[11px] text-ink-500">
              Hinweis: Ihre Datei wird ausschließlich zur Profilbefüllung
              verarbeitet — keine Weitergabe an Dritte.
            </p>
          </>
        )}

        {(stage === "uploading" || stage === "parsing") && (
          <div className="mx-auto max-w-sm">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-ink-900">
              {stage === "uploading"
                ? "Datei wird hochgeladen…"
                : "KI extrahiert Profildaten…"}
            </h2>
            <p className="mt-1 truncate text-sm text-ink-600">
              {file?.name}
            </p>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-700"
                style={{ width: stage === "uploading" ? "30%" : "85%" }}
              />
            </div>
          </div>
        )}

        {stage === "done" && profile && (
          <div className="mx-auto max-w-sm">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success-500/15 text-success-600 ring-1 ring-success-500/30">
              <CheckCircle2 className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-ink-900">
              Profil extrahiert
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              {file?.name} — bitte überprüfen Sie die Vorschläge.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-brand-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Andere Datei wählen
            </button>
          </div>
        )}
      </div>

      {profile && (
        <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
          <header className="flex items-start gap-3 border-b border-ink-100 pb-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold tracking-tight text-ink-900">
                Vorschau Ihres Profils
              </h3>
              <p className="text-xs text-ink-500">
                Vorgeschlagen von der KI — Sie können alle Felder anpassen,
                bevor Sie das Profil veröffentlichen.
              </p>
            </div>
          </header>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ReadField label="Vollständiger Name" value={profile.fullName} />
            <ReadField label="Standort" value={profile.location} />
            <ReadField label="Rolle / Titel" value={profile.title} />
            <ReadField
              label="Berufserfahrung"
              value={`${profile.yearsExperience} Jahre`}
            />
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Erkannte Skills
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <Badge key={s} tone="brand">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Sprachen
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.languages.map((l) => (
                <Badge key={l} tone="neutral">
                  {l}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Kurz-Bio
            </p>
            <p className="mt-2 rounded-lg border border-ink-200 bg-ink-50/50 p-3 text-sm leading-relaxed text-ink-700">
              {profile.bio}
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse items-stretch justify-end gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-ink-200 bg-white px-5 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
            >
              Zurücksetzen
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Profil veröffentlichen
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}
