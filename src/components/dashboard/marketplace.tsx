import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeLeft } from "@/lib/marketplace";

/**
 * More building blocks for the marketplace screens (orders, consultations,
 * ambulances, support, admin console), in the same style as ./ui.tsx.
 */

/** The current time, refreshed every `intervalMs` (for countdowns). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

/** "4:59 left" until a deadline; turns red under a minute. */
export function Countdown({
  until,
  expiredLabel = "Time is up",
  className,
}: {
  until: string | null | undefined;
  expiredLabel?: string;
  className?: string;
}) {
  const now = useNow();
  const left = timeLeft(until, now);
  if (!left) return null;
  const urgent = left.total < 60;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold tabular-nums",
        left.total === 0 ? "bg-slate-100 text-ink-700" : urgent ? "bg-red-100 text-red-800" : "bg-warm-100 text-warm-900",
        className
      )}
      role="timer"
      aria-live="off"
    >
      <Clock className="h-4 w-4" aria-hidden="true" />
      {left.total === 0 ? expiredLabel : `${left.minutes}:${String(left.seconds).padStart(2, "0")} left`}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-brand-100">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-extrabold text-ink-900">{title}</h2>
      {children && <div className="max-w-md text-ink-500">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  to,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  to?: string;
  tone?: "neutral" | "brand" | "warm" | "red";
}) {
  const toneClass = {
    neutral: "bg-white ring-brand-100",
    brand: "bg-brand-50 ring-brand-200",
    warm: "bg-warm-50 ring-warm-100",
    red: "bg-red-50 ring-red-200",
  }[tone];
  const body = (
    <>
      <span className="text-sm font-bold text-ink-500">{label}</span>
      <span className="text-2xl font-extrabold tracking-tight text-ink-900 tabular-nums">{value}</span>
      {hint && <span className="text-sm text-ink-500">{hint}</span>}
    </>
  );
  const className = cn("flex min-w-0 flex-col gap-1 rounded-3xl p-4 ring-1 sm:p-5", toneClass);
  return to ? (
    <Link to={to} className={cn(className, "transition-shadow hover:ring-brand-400 focus-visible:outline-2 focus-visible:outline-brand-700")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

/** A row of pill buttons that filter a list. */
export function FilterChips<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm font-bold transition-colors",
            value === option.value ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-800 hover:bg-brand-100"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** A status timeline: steps before `current` are done, `current` is highlighted. */
export function Timeline({
  steps,
  current,
  stopped,
  finished,
}: {
  steps: { key: string; label: string; hint?: ReactNode }[];
  current: string;
  /** Every step is done (the last step has happened). */
  finished?: boolean;
  /** Shown instead of the remaining steps when the process ended early (declined, cancelled). */
  stopped?: ReactNode;
}) {
  const index = steps.findIndex((step) => step.key === current);
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const done = !stopped && (finished || (index >= 0 && i < index));
        const active = !stopped && !finished && i === index;
        const last = i === steps.length - 1;
        if (stopped && i > Math.max(index, 0)) return null;
        return (
          <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && !stopped && (
              <span className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", done ? "bg-brand-500" : "bg-brand-100")} aria-hidden="true" />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                done && "bg-brand-600 text-white",
                active && "bg-warm-400 text-warm-900 ring-4 ring-warm-100",
                !done && !active && "bg-brand-50 text-ink-500 ring-1 ring-brand-100"
              )}
              aria-hidden="true"
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className="flex min-w-0 flex-col pt-1">
              <span className={cn("font-bold", active ? "text-ink-900" : done ? "text-ink-700" : "text-ink-500")}>
                {step.label}
                {active && <span className="sr-only"> (current step)</span>}
              </span>
              {step.hint && (active || done) && <span className="text-sm text-ink-500">{step.hint}</span>}
            </div>
          </li>
        );
      })}
      {stopped && <li className="mt-1 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-800">{stopped}</li>}
    </ol>
  );
}

/** An on/off switch with a visible label. */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <label htmlFor={id} className="font-bold text-ink-900">
          {label}
        </label>
        {description && <p className="text-sm text-ink-500">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-50",
          checked ? "bg-brand-600" : "bg-slate-300"
        )}
      >
        <span className={cn("inline-block h-6 w-6 rounded-full bg-white shadow transition-transform", checked ? "translate-x-7" : "translate-x-1")} />
      </button>
    </div>
  );
}

/** Always-visible link to Nigeria's emergency number. */
export function EmergencyCallLink({ className }: { className?: string }) {
  return (
    <a
      href="tel:112"
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-3 text-base font-extrabold text-white shadow-sm hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800",
        className
      )}
    >
      <Phone className="h-5 w-5" aria-hidden="true" />
      Emergency? Call 112
    </a>
  );
}

export function InlineError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-800 ring-1 ring-red-200">
      {children}
    </p>
  );
}

/** A labelled value in a list of details. */
export function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="break-words font-bold text-ink-900">{children}</dd>
    </div>
  );
}

export const textareaStyles =
  "min-h-28 w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200";
