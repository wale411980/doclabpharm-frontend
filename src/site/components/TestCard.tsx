import Link from "next/link";
import { Clock, Home } from "lucide-react";
import type { CatalogueTest } from "@/site/api";

export const naira = (amount: number) => `₦${Math.round(amount).toLocaleString("en-NG")}`;

const slug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const testHref = (test: Pick<CatalogueTest, "id" | "name">) => `/tests/${test.id}-${slug(test.name)}`;

/** One test or package: what it is, what is inside, the price and a way to book. */
export function TestCard({ test }: { test: CatalogueTest }) {
  const count = test.includes.length;

  return (
    <Link
      href={testHref(test)}
      className="group flex h-full flex-col gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100 transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(6,40,31,0.35)] hover:ring-brand-300 sm:p-6"
    >
      <span className="flex flex-col gap-1.5">
        <span className="text-xl font-extrabold leading-snug text-ink-900">{test.name}</span>
        {test.summary && <span className="line-clamp-2 text-[15px] leading-relaxed text-ink-500">{test.summary}</span>}
      </span>

      <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-ink-700">
        {count > 1 && <span>{count} tests inside</span>}
        {test.turnaround && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-600" aria-hidden="true" />
            {test.turnaround}
          </span>
        )}
        {test.lab?.home_collection && (
          <span className="flex items-center gap-1.5">
            <Home className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Home collection
          </span>
        )}
      </span>

      <span className="mt-auto flex items-end justify-between gap-3 pt-1">
        <span className="font-display text-3xl font-extrabold tracking-tight text-ink-900">{naira(test.price)}</span>
        <span className="rounded-full bg-lime px-5 py-2.5 text-[15px] font-extrabold text-night transition-transform group-hover:scale-105">
          Book
        </span>
      </span>
    </Link>
  );
}
