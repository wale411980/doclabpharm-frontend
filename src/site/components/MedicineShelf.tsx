"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Search } from "lucide-react";
import type { MedicineShelf as Shelf, ShelfMedicine } from "@/site/api";
import { API_URL, basketCount, naira, onBasketChange, readMedicines, setMedicineQty } from "@/site/basket";
import { cn } from "@/lib/utils";

/**
 * Browse the medicine we deliver and add it to the basket, without signing
 * in. Choosing an area shows what we can deliver there and what it costs.
 */
export function MedicineShelf({ initial }: { initial: Shelf }) {
  const [shelf, setShelf] = useState(initial);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [inBasket, setInBasket] = useState<Record<number, number>>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    try {
      setArea(localStorage.getItem("dlp_area") || "");
    } catch {
      // No remembered area.
    }
    const sync = () => {
      setInBasket(Object.fromEntries(readMedicines().map((item) => [item.id, item.qty])));
      setCount(basketCount());
    };
    sync();
    return onBasketChange(sync);
  }, []);

  // Stock and prices change during the day; an area adds distance and delivery cost.
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/medicines${area ? `?area=${encodeURIComponent(area)}` : ""}`, { headers: { Accept: "application/json" }, signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => body && setShelf(body))
      .catch(() => undefined);
    try {
      if (area) localStorage.setItem("dlp_area", area);
    } catch {
      // Not remembered.
    }
    return () => controller.abort();
  }, [area]);

  const all = useMemo(() => shelf.categories.flatMap((group) => group.medicines), [shelf]);
  const term = query.trim().toLowerCase();
  const shown = all.filter(
    (medicine) =>
      (!category || medicine.category === category) &&
      (!term || medicine.name.toLowerCase().includes(term) || (medicine.details || "").toLowerCase().includes(term) || medicine.category.toLowerCase().includes(term))
  );

  const change = (medicine: ShelfMedicine, qty: number) =>
    setMedicineQty(
      {
        id: medicine.id,
        name: medicine.name,
        pack: medicine.pack,
        price: medicine.price,
        max: medicine.in_stock,
        prescription_only: medicine.prescription_only,
      },
      qty
    );

  const chip = (active: boolean) =>
    cn(
      "min-h-11 flex-none rounded-full px-4 text-[15px] font-bold ring-1 ring-inset transition-colors",
      active ? "bg-night text-white ring-night" : "bg-white text-ink-700 ring-brand-200 hover:bg-brand-50"
    );

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_260px]">
        <label className="relative block min-w-0">
          <span className="sr-only">Search medicines</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a medicine, like paracetamol"
            className="h-14 w-full rounded-2xl bg-white pl-12 pr-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <label className="block min-w-0">
          <span className="sr-only">Your area in Abuja</span>
          <select
            value={area}
            onChange={(event) => setArea(event.target.value)}
            className="h-14 w-full appearance-none rounded-2xl bg-white px-4 text-base font-bold text-ink-900 ring-1 ring-inset ring-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Your area (for delivery)</option>
            {shelf.areas.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Category">
        <button type="button" aria-pressed={!category} onClick={() => setCategory("")} className={chip(!category)}>
          All
        </button>
        {shelf.categories.map((group) => (
          <button key={group.name} type="button" aria-pressed={category === group.name} onClick={() => setCategory(group.name)} className={chip(category === group.name)}>
            {group.name}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-brand-100">
          <p className="text-xl font-extrabold text-ink-900">{all.length === 0 ? "No medicine is listed yet" : "Nothing matches that search"}</p>
          <p className="mt-2 text-ink-700">{all.length === 0 ? "Please check back soon." : "Try a shorter name, or clear the search."}</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((medicine) => {
            const qty = inBasket[medicine.id] ?? 0;
            return (
              <li key={medicine.id} className="flex min-w-0 flex-col gap-3 rounded-3xl bg-white p-5 ring-1 ring-brand-100">
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold leading-snug text-ink-900">{medicine.name}</h3>
                  {medicine.pack && <p className="text-[15px] font-semibold text-ink-500">{medicine.pack}</p>}
                  {medicine.details && <p className="mt-1 line-clamp-2 text-[15px] text-ink-700">{medicine.details}</p>}
                </div>
                {medicine.prescription_only && (
                  <p className="w-fit rounded-full bg-[#fff1ed] px-3 py-1 text-sm font-bold text-[#7a1d0a]">Needs a prescription. The pharmacist will ask for it.</p>
                )}
<p className="text-sm text-ink-500">{medicine.delivery_fee !== null ? `Delivered to you. Delivery ${naira(medicine.delivery_fee)}` : "Delivered to you"}</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{naira(medicine.price)}</span>
                  {qty === 0 ? (
                    <button type="button" onClick={() => change(medicine, 1)} className="min-h-11 rounded-full bg-lime px-6 text-[15px] font-extrabold text-night hover:bg-[#d6fa85] active:scale-[0.97]">
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 rounded-full bg-night p-1 text-white">
                      <button type="button" onClick={() => change(medicine, qty - 1)} aria-label={`One less ${medicine.name}`} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15">
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="min-w-6 text-center text-base font-extrabold" aria-live="polite">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => change(medicine, qty + 1)}
                        disabled={qty >= Math.min(medicine.in_stock, 20)}
                        aria-label={`One more ${medicine.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-100 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <p className="text-base font-bold text-ink-900">
              {count} {count === 1 ? "item" : "items"} in your basket
            </p>
            <Link href="/checkout" className="inline-flex min-h-12 items-center rounded-2xl bg-lime px-7 text-base font-extrabold text-night hover:bg-[#d6fa85]">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
