"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { CatalogueTest } from "@/site/api";
import { addToBasket, naira } from "@/site/basket";

/** The booking box on a test's page: straight to checkout, or keep choosing. */
export function BookTest({ test }: { test: CatalogueTest }) {
  const [busy, setBusy] = useState(false);

  const go = (to: string) => {
    if (!test.lab) return;
    setBusy(true);
    addToBasket(test);
    window.location.assign(to);
  };

  const promises = [
    "No account needed to book",
    "Our nurse comes to your home for the sample",
    "Results on your phone, explained simply",
  ];

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-[28px] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(6,40,31,0.45)] ring-1 ring-brand-100 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight text-ink-900">{naira(test.price)}</span>
        {test.lab && test.lab.home_collection_fee !== null && (
          <span className="text-right text-sm font-semibold text-ink-500">
            Nurse visit
            <br />+ {naira(test.lab.home_collection_fee)}
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-2.5">
        {promises.map((line) => (
          <li key={line} className="flex items-start gap-3 text-[16px] font-semibold text-ink-900">
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-lime">
              <Check className="h-4 w-4 text-night" aria-hidden="true" />
            </span>
            {line}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => go("/checkout")}
        disabled={busy || !test.lab}
        className="min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night transition-transform hover:bg-[#d6fa85] active:scale-[0.98] disabled:opacity-60"
      >
        Book now
      </button>
      <button
        type="button"
        onClick={() => go("/tests")}
        disabled={busy || !test.lab}
        className="min-h-12 rounded-2xl px-6 text-base font-bold text-brand-800 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 disabled:opacity-60"
      >
        Add this and choose another test
      </button>
    </div>
  );
}
