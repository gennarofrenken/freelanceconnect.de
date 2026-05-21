"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FALLBACK_ANSWER,
  FALLBACK_LINKS,
  SUGGESTED_QUESTIONS,
  WELCOME_MESSAGE,
  loadRules,
  matchRule,
  type AssistantLink,
  type AssistantRule,
} from "@/lib/assistant";

type Message =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      links?: AssistantLink[];
      followups?: string[];
    };

function nextId() {
  return Math.random().toString(36).slice(2, 11);
}

export function AiAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<AssistantRule[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRules(loadRules());
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key && e.key.includes("assistant:rules")) setRules(loadRules());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [messages, open]);

  if (pathname?.startsWith("/admin")) return null;

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const match = matchRule(trimmed, rules);
      const reply: Message = match
        ? {
            id: nextId(),
            role: "assistant",
            text: match.rule.answer,
            links: match.rule.links,
            followups: match.rule.followups,
          }
        : {
            id: nextId(),
            role: "assistant",
            text: FALLBACK_ANSWER,
            links: FALLBACK_LINKS,
          };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 380);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(input);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const hasUserMessage = messages.some((m) => m.role === "user");

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
        <div className="flex h-[34rem] max-h-[calc(100vh-3rem)] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-deep">
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
                  Antwortet sofort · Schlagwort-basiert
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
            {messages.map((m) =>
              m.role === "user" ? (
                <UserBubble key={m.id} text={m.text} />
              ) : (
                <AssistantBubble
                  key={m.id}
                  text={m.text}
                  links={m.links}
                  followups={m.followups}
                  onPickFollowup={send}
                />
              ),
            )}
            {typing && <TypingDots />}
            <div ref={endRef} />
          </div>

          {!hasUserMessage && (
            <div className="border-t border-ink-100 bg-white px-3 py-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Vorschläge
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((s) => (
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
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-ink-100 bg-white p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Nachricht schreiben…"
              className="h-10 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
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

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-brand-600 px-3 py-2 text-sm leading-relaxed text-white">
        {text}
      </div>
    </div>
  );
}

function AssistantBubble({
  text,
  links,
  followups,
  onPickFollowup,
}: {
  text: string;
  links?: AssistantLink[];
  followups?: string[];
  onPickFollowup: (q: string) => void;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-2">
        <div
          className={cn(
            "rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm leading-relaxed text-ink-800 ring-1 ring-ink-200",
          )}
        >
          {text}
        </div>
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                {l.label}
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            ))}
          </div>
        )}
        {followups && followups.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {followups.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onPickFollowup(q)}
                className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-600 hover:border-brand-300 hover:text-brand-700"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-white px-3 py-2 text-xs text-ink-500 ring-1 ring-ink-200">
        <span className="inline-flex gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
            style={{ animationDelay: "0.3s" }}
          />
        </span>
      </div>
    </div>
  );
}
