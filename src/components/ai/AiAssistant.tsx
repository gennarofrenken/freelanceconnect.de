"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const INITIAL_GREETING: Message = {
  role: "assistant",
  text: "Hallo! Ich bin der FreelanceConnect-Assistent. Ich helfe Ihnen, das passende Projekt zu finden, Ihre Suche zu verfeinern oder Ihr Profil zu optimieren. Was kann ich für Sie tun?",
};

const SUGGESTIONS = [
  "Zeig mir Remote-Projekte mit React",
  "Wie befülle ich mein Profil per CV-Upload?",
  "Was kostet das Premium-Abo?",
  "Welche Filter sind für SAP-Projekte sinnvoll?",
];

const MOCK_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /react/i,
    reply:
      "Aktuell sind 38 Remote-Projekte mit React aktiv. Öffnen Sie die Suche, ich kann Sie direkt mit dem passenden Filter dorthin schicken: /search?type=projects&q=React",
  },
  {
    match: /cv|lebenslauf|profil/i,
    reply:
      "Unter „Profil → CV hochladen“ können Sie Ihren Lebenslauf als PDF/DOCX hochladen. Ich extrahiere Skills, Berufserfahrung und Sprachen automatisch und befülle Ihr Profil — Sie überprüfen und veröffentlichen es. Das spart ca. 20 Minuten Tippen.",
  },
  {
    match: /premium|preis|abo|kost/i,
    reply:
      "Das Premium-Abo für Freelancer kostet 19 €/Monat. Damit können Sie sich auf Projekte bewerben und Auftraggeber direkt kontaktieren. Recruiter zahlen je nach Lizenz-Modell — Details auf /preise.",
  },
  {
    match: /sap|s\/4hana/i,
    reply:
      "Für SAP-Projekte empfehle ich die Filter „Branche: SAP & ERP“ und „Vertragstyp: Werkvertrag oder Freelance“. Aktuell sind 21 SAP-Projekte aktiv, davon 12 hybrid mit Standort Baden-Württemberg.",
  },
  {
    match: /dsgvo|datenschutz/i,
    reply:
      "Auf FreelanceConnect sind alle Freelancer-Profile vor ungeprüften Recruitern geschützt. Auftraggeber-Namen sind nur für eingeloggte Mitglieder sichtbar. Kontaktaufnahme erfordert Lizenz/Premium. Hosting & Verarbeitung in der EU.",
  },
];

function generateReply(input: string): string {
  for (const r of MOCK_REPLIES) {
    if (r.match.test(input)) return r.reply;
  }
  return "Danke für Ihre Frage. Im Live-Betrieb verbinde ich mich mit unserer projekt-spezifischen Wissensbasis. In dieser Vorschau sind nur einige Demo-Antworten hinterlegt — versuchen Sie Stichworte wie „React“, „CV“, „Premium“ oder „SAP“.";
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    const reply = generateReply(trimmed);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 600);
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated transition-all hover:bg-brand-700 hover:shadow-deep"
          aria-label="KI-Assistent öffnen"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          KI-Assistent
        </button>
      ) : (
        <div className="flex h-[34rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-deep">
          <header className="flex items-center justify-between gap-2 border-b border-ink-100 bg-gradient-to-r from-brand-50 to-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
                <Bot className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight text-ink-900">
                  KI-Assistent
                </p>
                <p className="text-[11px] text-ink-500">
                  Beta · antwortet meist sofort
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-ink-50/40 p-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-brand-600 text-white"
                      : "bg-white text-ink-800 ring-1 ring-ink-200",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-3 py-2 text-xs text-ink-500 ring-1 ring-ink-200">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"></span>
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
                      style={{ animationDelay: "0.15s" }}
                    ></span>
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="border-t border-ink-100 bg-white px-3 py-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Vorschläge
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] text-ink-700 hover:border-brand-300 hover:text-brand-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink-100 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nachricht schreiben…"
              className="h-10 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
              aria-label="Senden"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
