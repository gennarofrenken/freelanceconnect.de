import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "block w-full rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50 disabled:text-ink-500";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: FieldShellProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-ink-800"
      >
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-warning-700" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...rest }: TextInputProps) {
  return (
    <input
      className={cn(
        FIELD_BASE,
        "h-11",
        invalid && "border-warning-500 focus:border-warning-500 focus:ring-warning-100",
        className,
      )}
      {...rest}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, rows = 4, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        FIELD_BASE,
        "py-2.5 leading-relaxed",
        invalid && "border-warning-500 focus:border-warning-500 focus:ring-warning-100",
        className,
      )}
      {...rest}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({ className, invalid, children, ...rest }: SelectProps) {
  return (
    <select
      className={cn(
        FIELD_BASE,
        "h-11 pr-9 appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22%2364748b%22><path%20fill-rule=%22evenodd%22%20d=%22M5.23%207.21a.75.75%200%200%201%201.06.02L10%2011.06l3.71-3.83a.75.75%200%201%201%201.08%201.04l-4.25%204.39a.75.75%200%200%201-1.08%200L5.21%208.27a.75.75%200%200%201%20.02-1.06z%22%20clip-rule=%22evenodd%22/></svg>')] bg-[length:1.1rem] bg-[right_0.6rem_center] bg-no-repeat",
        invalid && "border-warning-500 focus:border-warning-500 focus:ring-warning-100",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  hint,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5 text-sm text-ink-700">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
        {...rest}
      />
      <span>
        <span>{label}</span>
        {hint && <span className="block text-xs text-ink-500">{hint}</span>}
      </span>
    </label>
  );
}
