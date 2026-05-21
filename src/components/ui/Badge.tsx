import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "brand"
  | "soft"
  | "success"
  | "warning"
  | "accent"
  | "outline";

const TONE_STYLES: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
  soft: "bg-brand-100/70 text-brand-800",
  success: "bg-success-500/10 text-success-600",
  warning: "bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-100",
  accent: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200",
  outline: "border border-ink-200 text-ink-700",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        TONE_STYLES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
