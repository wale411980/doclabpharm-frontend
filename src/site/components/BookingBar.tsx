"use client";

import { useState, type FormEvent } from "react";
import { FlaskConical, Pill, Search, Siren, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The first thing on the homepage: pick what you need and go straight to
 * booking it. Each tab leads into the patient app (sign-in comes first for
 * new visitors, then they land on the right screen).
 */
const TABS = [
  {
    key: "lab",
    label: "Lab test",
    icon: FlaskConical,
    placeholder: "Which test? Try malaria, typhoid, full body check",
    button: "Book test",
    quick: ["Malaria", "Typhoid", "Full body", "Pregnancy", "STI", "Genotype"],
    target: (q: string) => `/tests${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  },
  {
    key: "doctor",
    label: "Doctor",
    icon: Stethoscope,
    placeholder: "What is wrong? Fever, cough, rash, anything",
    button: "See a doctor now",
    quick: ["Fever", "Cough or cold", "Skin problem", "Stomach pain", "Women's health", "Child is sick"],
    target: () => "/user/see-doctor-now",
  },
  {
    key: "medicine",
    label: "Medicine",
    icon: Pill,
    placeholder: "Which medicine? Try paracetamol, amoxicillin",
    button: "Find it near me",
    quick: ["Paracetamol", "Malaria drugs", "Vitamin C", "Antacid", "Cough syrup", "ORS"],
    target: (q: string) => `/user/medicines/near-me${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  },
  {
    key: "ambulance",
    label: "Ambulance",
    icon: Siren,
    placeholder: "",
    button: "Request an ambulance",
    quick: [],
    target: () => "/user/ambulance",
  },
] as const;

export function BookingBar() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const tab = TABS[active];
  const urgent = tab.key === "ambulance";

  const go = (q: string) => {
    window.location.assign(tab.target(q.trim()));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    go(query);
  };

  return (
    <div className="w-full min-w-0 rounded-[28px] bg-white p-2.5 text-ink-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/40 sm:p-3">
      <div role="tablist" aria-label="What do you need?" className="grid grid-cols-4 gap-1 rounded-[20px] bg-brand-50 p-1">
        {TABS.map((item, index) => {
          const Icon = item.icon;
          const selected = index === active;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setActive(index);
                setQuery("");
              }}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[13px] font-bold transition-colors sm:flex-row sm:gap-2 sm:text-[15px]",
                selected
                  ? item.key === "ambulance"
                    ? "bg-[#ff5a3c] text-white shadow"
                    : "bg-[#06281f] text-white shadow"
                  : "text-ink-700 hover:bg-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={submit} className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        {urgent ? (
          <p className="flex-1 rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold leading-snug text-[#7a1d0a]">
            The nearest free ambulance comes to you. Life in danger right now? Call{" "}
            <a href="tel:112" className="underline">
              112
            </a>
            .
          </p>
        ) : (
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{tab.placeholder}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tab.placeholder}
              className="h-14 w-full min-w-0 rounded-2xl bg-white pl-12 pr-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        )}
        <button
          type="submit"
          className={cn(
            "h-14 flex-none rounded-2xl px-6 text-base font-extrabold transition-transform active:scale-[0.98]",
            urgent
              ? "bg-[#ff5a3c] text-white hover:bg-[#e94a2d]"
              : "bg-[#c8f56a] text-[#06281f] shadow-[0_0_0_0_rgba(200,245,106,0.7)] hover:bg-[#d6fa85]"
          )}
        >
          {tab.button}
        </button>
      </form>

      {tab.quick.length > 0 && (
        <ul className="mt-2.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab.quick.map((item) => (
            <li key={item} className="flex-none">
              <button
                type="button"
                onClick={() => go(item)}
                className="min-h-10 rounded-full bg-brand-50 px-4 text-sm font-semibold text-ink-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100 hover:text-brand-800"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
