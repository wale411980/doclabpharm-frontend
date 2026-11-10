"use client";

import { useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type PickerTest = {
  id: number | string;
  name: string;
  /** Price in naira from the lab; null while labs have not listed it. */
  price: number | null;
  lab?: string | null;
  note?: string | null;
};

export type PickerGroup = { name: string; tests: PickerTest[] };

const naira = (amount: number) => `₦${Math.round(amount).toLocaleString("en-NG")}`;

/** Tests by category, each one tap away from booking. */
export function TestPicker({ groups }: { groups: PickerGroup[] }) {
  const [active, setActive] = useState(0);
  const group = groups[active] ?? groups[0];
  if (!group) return null;

  return (
    <div className="flex flex-col gap-6">
      {groups.length > 1 && (
        <div
          role="tablist"
          aria-label="Test categories"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={cn(
                "min-h-11 flex-none rounded-full px-5 text-[15px] font-bold transition-colors",
                index === active
                  ? "bg-[#06281f] text-white"
                  : "bg-white text-ink-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.tests.map((test) => (
          <li key={test.id}>
            <Link
              href={`/user/laboratories2?q=${encodeURIComponent(test.name)}`}
              className="group flex h-full items-center justify-between gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100 transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(6,40,31,0.35)] hover:ring-brand-300"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-lg font-extrabold leading-snug text-ink-900">{test.name}</span>
                <span className="flex items-center gap-1.5 text-sm text-ink-500">
                  {test.lab ? (
                    test.lab
                  ) : (
                    <>
                      <Home className="h-4 w-4 flex-none" aria-hidden="true" />
                      {test.note ?? "At home or at the lab"}
                    </>
                  )}
                </span>
                {test.price !== null && (
                  <span className="mt-1 font-display text-2xl font-bold text-brand-700">{naira(test.price)}</span>
                )}
              </span>
              <span className="flex-none rounded-full bg-[#c8f56a] px-5 py-2.5 text-[15px] font-extrabold text-[#06281f] transition-transform group-hover:scale-105">
                Book
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
