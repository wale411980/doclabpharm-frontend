import type { ComponentProps, ReactNode } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the new dashboard screens, in the style of the public
 * website (src/site/components/ui.tsx): warm, rounded, brand colours.
 */

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(16,36,30,0.06)] ring-1 ring-brand-100 sm:p-6", className)}
      {...props}
    />
  );
}

export function PageHeader({ title, intro, actions }: { title: ReactNode; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
        {intro && <p className="text-base leading-relaxed text-ink-500">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonClass: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-700",
  secondary: "bg-white text-ink-900 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 focus-visible:outline-brand-700",
  danger: "bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-800",
  ghost: "text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-700",
};

export const buttonStyles = (variant: ButtonVariant = "primary", className?: string) =>
  cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    buttonClass[variant],
    className
  );

export function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button type={type} className={buttonStyles(variant, className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export const inputStyles =
  "min-h-11 w-full rounded-2xl border border-brand-200 bg-white px-4 py-2.5 text-base text-ink-900 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:bg-sand disabled:text-ink-500";

export function Field({
  label,
  hint,
  id,
  children,
}: {
  label: string;
  hint?: ReactNode;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-sm text-ink-500">{hint}</p>}
    </div>
  );
}

export type PillTone = "brand" | "warm" | "red" | "neutral" | "blue";

const pillClass: Record<PillTone, string> = {
  brand: "bg-brand-100 text-brand-800",
  warm: "bg-warm-100 text-warm-900",
  red: "bg-red-100 text-red-800",
  neutral: "bg-slate-100 text-ink-700",
  blue: "bg-sky-100 text-sky-900",
};

export function Pill({ tone = "neutral", children }: { tone?: PillTone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold", pillClass[tone])}>
      {children}
    </span>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-ink-500">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-3xl bg-red-50 p-5 text-red-800 ring-1 ring-red-200">
      <p className="flex items-center gap-2 font-bold">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/** Dates from the API ("2027-10-31" or an ISO timestamp) in Nigerian English. */
export function formatDate(value: string | null | undefined, withTime = false): string {
  if (!value) return "—";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
