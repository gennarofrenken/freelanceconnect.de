"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ClipboardPaste,
  FileText,
  Info,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import {
  extractProfile,
  isExtractableFile,
  readFileAsText,
  savePrefill,
  type ExtractedProfile,
} from "@/lib/cv-parser";

type Source = "file" | "text";
type Stage = "idle" | "analyzing" | "done";

const DEMO_FALLBACK: ExtractedProfile = {
  fullName: "Sophie Berger",
  title: "Senior Full-Stack Developer (React / Node.js)",
  yearsExperience: 11,
  location: "Berlin",
  email: "sophie.berger@example.de",
  phone: "+49 30 1234567",
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

export function CvUploader() {
  const router = useRouter();
  const [source, setSource] = useState<Source>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const isDemoOnly = useMemo(() => {
    if (source === "text") return false;
    if (!file) return false;
    return !isExtractableFile(file);
  }, [source, file]);

  async function runFileExtraction(f: File) {
    setFile(f);
    setStage("analyzing");
    setNotice(null);

    try {
      if (isExtractableFile(f)) {
        const content = await readFileAsText(f);
        await new Promise((r) => setTimeout(r, 700));
        const extracted = extractProfile(content);
        const enriched = mergeWithDefaults(extracted);
        setProfile(enriched);
        setStage("done");
      } else {
        await new Promise((r) => setTimeout(r, 1400));
        setProfile(DEMO_FALLBACK);
        setNotice(
          "PDF/DOCX-Erkennung läuft erst nach Server-Anbindung — wir zeigen Demo-Daten. Für echte Erkennung den CV-Text einfügen.",
        );
        setStage("done");
      }
    } catch {
      setProfile(DEMO_FALLBACK);
      setNotice(
        "Die Datei konnte nicht gelesen werden. Wir zeigen Demo-Daten — bitte den CV-Text einfügen für echte Erkennung.",
      );
      setStage("done");
    }
  }

  function runTextExtraction(content: string) {
    setStage("analyzing");
    setNotice(null);
    setTimeout(() => {
      const extracted = extractProfile(content);
      if (
        !extracted.fullName &&
        !extracted.email &&
        extracted.skills.length === 0 &&
        extracted.languages.length === 0
      ) {
        setProfile(extracted);
        setNotice(
          "Wir konnten in diesem Text keine Profil-Daten erkennen. Fügen Sie einen typischen Lebenslauf-Text ein (Name, Titel, Skills, Sprachen).",
        );
      } else {
        setProfile(extracted);
      }
      setStage("done");
    }, 700);
  }

  function reset() {
    setFile(null);
    setText("");
    setProfile(null);
    setStage("idle");
    setNotice(null);
  }

  function applyProfile() {
    if (!profile) return;
    savePrefill(profile);
    router.push("/register?role=freelancer&from=cv");
  }

  return (
    <div className="space-y-6">
      <SourceTabs source={source} onChange={(s) => { setSource(s); reset(); }} />

      {source === "file" ? (
        <FileDropzone
          file={file}
          dragOver={dragOver}
          stage={stage}
          onDragOver={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
          onDrop={(f) => {
            setDragOver(false);
            void runFileExtraction(f);
          }}
          onPick={(f) => void runFileExtraction(f)}
          onReset={reset}
        />
      ) : (
        <TextPaste
          value={text}
          stage={stage}
          onChange={setText}
          onSubmit={runTextExtraction}
          onReset={reset}
        />
      )}

      {notice && (
        <div className="flex items-start gap-3 rounded-xl border border-warning-100 bg-warning-50 p-4 text-sm leading-relaxed text-warning-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{notice}</p>
        </div>
      )}

      {profile && stage === "done" && (
        <ProfilePreview
          profile={profile}
          fileName={file?.name}
          demoOnly={isDemoOnly}
          onReset={reset}
          onApply={applyProfile}
        />
      )}
    </div>
  );
}

function mergeWithDefaults(p: ExtractedProfile): ExtractedProfile {
  return p;
}

function SourceTabs({
  source,
  onChange,
}: {
  source: Source;
  onChange: (s: Source) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Eingabequelle"
      className="grid grid-cols-2 gap-1 rounded-xl border border-ink-200 bg-white p-1"
    >
      <button
        role="tab"
        aria-selected={source === "file"}
        onClick={() => onChange("file")}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${
          source === "file"
            ? "bg-brand-600 text-white shadow-soft"
            : "text-ink-600 hover:bg-ink-100"
        }`}
      >
        <Upload className="h-4 w-4" aria-hidden />
        Datei hochladen
      </button>
      <button
        role="tab"
        aria-selected={source === "text"}
        onClick={() => onChange("text")}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${
          source === "text"
            ? "bg-brand-600 text-white shadow-soft"
            : "text-ink-600 hover:bg-ink-100"
        }`}
      >
        <ClipboardPaste className="h-4 w-4" aria-hidden />
        Text einfügen
      </button>
    </div>
  );
}

function FileDropzone({
  file,
  stage,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onPick,
  onReset,
}: {
  file: File | null;
  stage: Stage;
  dragOver: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (f: File) => void;
  onPick: (f: File) => void;
  onReset: () => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped && stage === "idle") onDrop(dropped);
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
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink-900">
            Lebenslauf hochladen
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            TXT oder Markdown wird direkt analysiert. PDF/DOCX folgen mit der
            Server-Anbindung — solange werden Demo-Daten gezeigt.
          </p>
          <label className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
            <Upload className="h-4 w-4" aria-hidden />
            Datei auswählen
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md,text/plain,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
              }}
            />
          </label>
          <p className="mt-3 text-[11px] text-ink-500">
            Verarbeitung lokal im Browser — keine Übertragung an einen Server.
          </p>
        </>
      )}

      {stage === "analyzing" && (
        <div className="mx-auto max-w-sm">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink-900">
            Lebenslauf wird analysiert …
          </h2>
          <p className="mt-1 truncate text-sm text-ink-600">{file?.name}</p>
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full animate-pulse rounded-full bg-brand-500"
              style={{ width: "70%" }}
            />
          </div>
        </div>
      )}

      {stage === "done" && file && (
        <div className="mx-auto max-w-sm">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success-500/15 text-success-600 ring-1 ring-success-500/30">
            <CheckCircle2 className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink-900">
            Analyse abgeschlossen
          </h2>
          <p className="mt-1 truncate text-sm text-ink-600">{file.name}</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-brand-700"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Andere Datei wählen
          </button>
        </div>
      )}
    </div>
  );
}

function TextPaste({
  value,
  stage,
  onChange,
  onSubmit,
  onReset,
}: {
  value: string;
  stage: Stage;
  onChange: (v: string) => void;
  onSubmit: (text: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <ClipboardPaste className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-ink-900">
            CV-Text einfügen
          </h2>
          <p className="text-xs text-ink-500">
            Funktioniert für jeden Lebenslauf — kopieren Sie den Inhalt aus
            PDF, DOCX oder LinkedIn hierher.
          </p>
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="mt-4"
        placeholder={
          "Max Mustermann\nSenior Software Engineer\nBerlin · max@example.de · +49 30 …\n\n10 Jahre Erfahrung in …\n\nSkills: React, TypeScript, AWS, …\nSprachen: Deutsch, Englisch …"
        }
      />

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {value && (
          <Button variant="ghost" size="md" onClick={onReset}>
            Zurücksetzen
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={() => onSubmit(value)}
          disabled={value.trim().length < 20 || stage === "analyzing"}
        >
          {stage === "analyzing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Analysiere …
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden />
              Daten extrahieren
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ProfilePreview({
  profile,
  fileName,
  demoOnly,
  onReset,
  onApply,
}: {
  profile: ExtractedProfile;
  fileName?: string;
  demoOnly: boolean;
  onReset: () => void;
  onApply: () => void;
}) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
      <header className="flex items-start gap-3 border-b border-ink-100 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-ink-900">
            Vorschau Ihres Profils
          </h3>
          <p className="text-xs text-ink-500">
            {demoOnly
              ? "Demo-Daten — echte Erkennung folgt mit Server-Anbindung."
              : `Aus „${fileName ?? "Ihrem Text"}“ extrahiert. Bitte prüfen Sie alle Felder.`}
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <ReadField label="Name" value={profile.fullName} />
        <ReadField label="Standort" value={profile.location} />
        <ReadField label="Rolle / Titel" value={profile.title} />
        <ReadField
          label="Berufserfahrung"
          value={
            profile.yearsExperience !== undefined
              ? `${profile.yearsExperience} Jahre`
              : undefined
          }
        />
        <ReadField label="E-Mail" value={profile.email} />
        <ReadField label="Telefon" value={profile.phone} />
      </div>

      {profile.skills.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Erkannte Skills ({profile.skills.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.skills.map((s) => (
              <Badge key={s} tone="brand">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {profile.languages.length > 0 && (
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
      )}

      {profile.bio && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Kurz-Bio
          </p>
          <p className="mt-2 rounded-lg border border-ink-200 bg-ink-50/50 p-3 text-sm leading-relaxed text-ink-700">
            {profile.bio}
          </p>
        </div>
      )}

      <footer className="mt-6 flex flex-col-reverse items-stretch justify-end gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center">
        <Button variant="outline" size="md" onClick={onReset}>
          Erneut analysieren
        </Button>
        <Button variant="primary" size="md" onClick={onApply}>
          <FileText className="h-4 w-4" aria-hidden />
          Mit diesen Daten registrieren
        </Button>
      </footer>

      <p className="mt-3 text-center text-xs text-ink-500">
        Nach der Anmeldung können Sie alle Angaben in Ihrem{" "}
        <Link
          href="/profil"
          className="font-medium text-brand-700 underline-offset-2 hover:underline"
        >
          Profil
        </Link>{" "}
        anpassen.
      </p>
    </section>
  );
}

function ReadField({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {label}
        </p>
        <p className="mt-1 text-sm italic text-ink-400">nicht erkannt</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}
