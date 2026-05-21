import Link from "next/link";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const markPx = size === "sm" ? 24 : size === "lg" ? 36 : 28;
  const textCls =
    size === "sm"
      ? "text-[14px]"
      : size === "lg"
        ? "text-[18px]"
        : "text-[15px]";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="FreelanceConnect – Startseite"
    >
      <LogoMark size={markPx} />
      <span
        className={`${textCls} font-semibold tracking-tight text-ink-900`}
      >
        Freelance<span className="text-brand-600">Connect</span>
      </span>
    </Link>
  );
}

export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient
          id="fc-mark-bg"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0C87EB" />
          <stop offset="1" stopColor="#0556A3" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#fc-mark-bg)" />
      <rect width="64" height="30" rx="14" fill="#FFFFFF" fillOpacity="0.07" />
      <circle cx="18" cy="32" r="7" fill="#FFFFFF" />
      <rect x="24" y="30" width="14" height="4" rx="2" fill="#FFFFFF" />
      <circle cx="46" cy="32" r="7" fill="none" stroke="#FFFFFF" strokeWidth="3" />
    </svg>
  );
}
