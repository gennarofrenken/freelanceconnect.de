import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type Size = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-brand-700",
  outline:
    "border border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:text-brand-700",
  accent:
    "bg-accent-400 text-ink-900 shadow-soft hover:bg-accent-500 active:bg-accent-600",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-6 text-[15px] rounded-xl",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLinkProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = buttonClasses(variant, size, className);

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...rest
  } = props as ButtonAsButtonProps;
  void _variant;
  void _size;
  void _className;
  void _children;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
