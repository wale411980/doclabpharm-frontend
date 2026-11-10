"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogueCategory } from "@/site/api";
import { TestCard } from "./TestCard";

const AUDIENCES = [
  { key: "all", label: "Everyone" },
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "children", label: "Children" },
] as const;

/** Search and filter the whole catalogue in the browser: no waiting, no sign-in. */
export function TestsBrowser({ categories, initialQuery = "" }: { categories: CatalogueCategory[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]["key"]>("all");

  const groups = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return categories
      .filter((group) => category === "All" || group.name === category)
      .map((group) => ({
        name: group.name,
        tests: group.tests.filter((test) => {
          if (audience !== "all" && test.audience !== "everyone" && test.audience !== audience) return false;
          if (audience !== "all" && audience !== "children" && test.audience === "children") return false;
          const text = `${test.name} ${test.summary ?? ""} ${test.includes.join(" ")} ${group.name}`.toLowerCase();
          return words.every((word) => text.includes(word));
        }),
      }))
      .filter((group) => group.tests.length > 0);
  }, [categories, category, audience, query]);

  const total = groups.reduce((sum, group) => sum + group.tests.length, 0);
  const pill = (active: boolean) =>
    cn(
      "min-h-11 flex-none rounded-full px-5 text-[15px] font-bold transition-colors",
      active ? "bg-night text-white" : "bg-white text-ink-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-4 ring-1 ring-brand-100 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search tests</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a test or a symptom: malaria, genotype, full body"
            className="h-14 w-full min-w-0 rounded-2xl bg-sand pl-12 pr-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Who is the test for?">
          {AUDIENCES.map((item) => (
            <button key={item.key} type="button" aria-pressed={audience === item.key} onClick={() => setAudience(item.key)} className={pill(audience === item.key)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden" role="group" aria-label="Category">
        {["All", ...categories.map((group) => group.name)].map((name) => (
          <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)} className={pill(category === name)}>
            {name}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-brand-100">
          <p className="text-xl font-extrabold text-ink-900">No test matches that yet</p>
          <p className="mt-2 text-ink-500">
            Try another word, or{" "}
            <a href="/user/see-doctor-now" className="font-bold text-brand-700 underline underline-offset-4">
              ask a doctor which test you need
            </a>
            .
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.name} className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{group.name}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.tests.map((test) => (
                <li key={test.id}>
                  <TestCard test={test} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
