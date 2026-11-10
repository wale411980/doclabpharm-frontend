"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import type { CatalogueTest } from "@/site/api";
import { naira } from "./TestCard";

const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const label = (time: string) => {
  const hour = Number(time.slice(0, 2));
  return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "pm" : "am"}`;
};

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/**
 * Pick a day and time, then go to checkout. The test is put in the cart in
 * this browser, so nobody has to sign in until it is time to pay.
 */
export function BookTest({ test }: { test: CatalogueTest }) {
  const days = useMemo(() => {
    const list: { value: string; label: string }[] = [];
    for (let offset = 1; list.length < 7; offset++) {
      const day = new Date();
      day.setDate(day.getDate() + offset);
      if (day.getDay() === 0) continue; // labs are closed on Sundays
      list.push({
        value: isoDate(day),
        label: offset === 1 ? "Tomorrow" : day.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" }),
      });
    }
    return list;
  }, []);

  const [date, setDate] = useState(days[0].value);
  const [time, setTime] = useState("09:00");
  const [busy, setBusy] = useState(false);

  const book = () => {
    if (!test.lab) return;
    setBusy(true);

    const item = {
      service_type: "lab" as const,
      service_id: test.id,
      lab_technician_id: test.lab.id,
      date,
      time,
      price: test.price,
      name: test.name,
    };

    try {
      const cart = JSON.parse(localStorage.getItem("patient_cart") || "[]");
      const others = Array.isArray(cart) ? cart.filter((entry) => !(entry?.service_type === "lab" && entry?.service_id === test.id)) : [];
      localStorage.setItem("patient_cart", JSON.stringify([...others, item]));
    } catch {
      // Storage is blocked: checkout will show an empty cart and explain.
    }

    window.location.assign("/user/checkout");
  };

  const choice = (active: boolean) =>
    `min-h-11 flex-none rounded-2xl px-4 text-[15px] font-bold ring-1 ring-inset transition-colors ${
      active ? "bg-night text-white ring-night" : "bg-white text-ink-700 ring-brand-200 hover:bg-brand-50"
    }`;

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-[28px] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(6,40,31,0.45)] ring-1 ring-brand-100 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight text-ink-900">{naira(test.price)}</span>
        {test.lab?.home_collection && test.lab.home_collection_fee !== null && (
          <span className="text-right text-sm font-semibold text-ink-500">
            Home collection
            <br />+ {naira(test.lab.home_collection_fee)}
          </span>
        )}
      </div>

      <fieldset className="min-w-0">
        <legend className="mb-2 flex items-center gap-2 text-[15px] font-bold text-ink-900">
          <CalendarDays className="h-5 w-5 text-brand-600" aria-hidden="true" />
          Choose a day
        </legend>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((day) => (
            <button key={day.value} type="button" aria-pressed={date === day.value} onClick={() => setDate(day.value)} className={choice(date === day.value)}>
              {day.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className="mb-2 text-[15px] font-bold text-ink-900">Choose a time</legend>
        <div className="grid grid-cols-3 gap-2">
          {TIMES.map((slot) => (
            <button key={slot} type="button" aria-pressed={time === slot} onClick={() => setTime(slot)} className={choice(time === slot)}>
              {label(slot)}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={book}
        disabled={busy || !test.lab}
        className="min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night transition-transform hover:bg-[#d6fa85] active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? "Taking you to checkout" : "Book this test"}
      </button>
      <p className="text-center text-sm text-ink-500">
        You choose home collection or a lab visit at checkout. You only sign in when it is time to pay.
      </p>
    </div>
  );
}
