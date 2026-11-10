import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

type Tone = "white" | "tint" | "sand" | "deep";

const toneClass: Record<Tone, string> = {
  white: "bg-white",
  tint: "bg-brand-50",
  sand: "bg-sand",
  deep: "bg-brand-900 text-white",
};

export function Section({
  tone = "white",
  className,
  children,
  ...props
}: ComponentProps<"section"> & { tone?: Tone }) {
  return (
    <section className={cn("py-16 sm:py-24", toneClass[tone], className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "warm" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold",
        tone === "brand" ? "bg-brand-100 text-brand-700" : "bg-warm-100 text-warm-700"
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  intro,
  align = "left",
  as: As = "h2",
}: {
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-4", align === "center" && "mx-auto items-center text-center")}>
      <As className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{title}</As>
      {intro && <p className="text-lg leading-relaxed text-ink-500">{intro}</p>}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "warm" | "light";

const buttonClass: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-700",
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 focus-visible:outline-brand-700",
  warm: "bg-warm-400 text-warm-900 hover:bg-warm-300 focus-visible:outline-warm-700",
  light: "bg-white text-brand-800 hover:bg-brand-50 focus-visible:outline-white",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: "md" | "lg" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-bold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-[15px]",
        buttonClass[variant],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to keep </script> out.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
