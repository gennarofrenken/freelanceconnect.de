"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageSquareText, Send, Sparkles, X } from "lucide-react";
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
  | { id: string; from: "user"; text: string }
  | {
      id: string;
      from: "bot";
      text: string;
      links?: AssistantLink[];
      followups?: string[];
    };

function nextId() {
  return Math.random().toString(36).slice(2, 11);
}

export function AssistantWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<AssistantRule[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", from: "bot", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setRules(loadRules());
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const hideOnRoute = useMemo(
    () => Boolean(pathname?.startsWith("/admin")),
    [pathname],
  );

  if (hideOnRoute) return null;

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId(), from: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const match = matchRule(trimmed, rules);
      const bot: Message = match
        ? {
            id: nextId(),
            from: "bot",
            text: match.rule.answer,
            links: match.rule.links,
            followups: match.rule.followups,
          }
        : {
            id: nextId(),
            from: "bot",
            text: FALLBACK_ANSWER,
            links: FALLBACK_LINKS,
          };
      setMessages((m) => [...m, bot]);
      setThinking(false);
    }, 380);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const hasUserMessage = messages.some((m) => m.from === "user");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Assistent schließen" : "Assistent öffnen"}
        aria-expanded={open}
        className={`fixed z-40 right-5 bottom-5 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-deep transition-all duration-200 ${
          open
            ? "bg-ink-900 text-white"
            : "bg-brand-600 text-white hover:bg-brand-700"
        }`}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <MessageSquareText className="h-6 w-6" aria-hidden />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="KI-Assistent"
          className="fixed z-40 right-4 bottom-24 flex max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-deep sm:right-5 sm:bottom-24"
        >
          <header className="flex items-center justify-between gap-3 border-b border-ink-100 bg-brand-gradient px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-inset ring-white/20">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  FreelanceConnect Assistent
                </p>
                <p className="text-[11px] text-brand-100">
                  Antwortet sofort · Schlagwort-basiert
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dialog schließen"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-ink-50/40 px-4 py-4"
          >
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id}>
                  {m.from === "bot" ? (
                    <BotBubble message={m} />
                  ) : (
                    <UserBubble text={m.text} />
                  )}
                </li>
              ))}
              {thinking && (
                <li>
                  <BotTyping />
                </li>
              )}
            </ul>

            {!hasUserMessage && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Häufige Fragen
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-ink-100 bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Frage stellen …"
                className="block w-full resize-none rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="submit"
                aria-label="Nachricht senden"
                disabled={!input.trim() || thinking}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:bg-ink-200 disabled:text-ink-400"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-ink-400">
              Keine KI-API · Antworten basieren auf hinterlegten Schlagwort-Regeln.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

function BotBubble({
  message,
}: {
  message: Extract<Message, { from: "bot" }>;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-tl-sm border border-ink-100 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-800 shadow-soft">
          {message.text}
        </div>
        {message.links && message.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                {link.label}
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            ))}
          </div>
        )}
        {message.followups && message.followups.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.followups.map((q) => (
              <FollowupChip key={q} text={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FollowupChip({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const widget = document.querySelector<HTMLTextAreaElement>(
          'textarea[placeholder="Frage stellen …"]',
        );
        if (widget) {
          widget.value = text;
          widget.dispatchEvent(new Event("input", { bubbles: true }));
          widget.focus();
        }
      }}
      className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 hover:border-brand-300 hover:text-brand-700"
    >
      {text}
    </button>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-soft">
        {text}
      </div>
    </div>
  );
}

function BotTyping() {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm border border-ink-100 bg-white px-3 py-2.5 shadow-soft">
        <Dot delay={0} />
        <Dot delay={120} />
        <Dot delay={240} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
