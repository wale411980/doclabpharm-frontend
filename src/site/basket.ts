import type { CatalogueTest } from "@/site/api";

/** Tests a visitor has chosen, kept in this browser so nobody signs in to book. */
export type BasketTest = {
  id: number;
  name: string;
  price: number;
  lab_id: number;
  lab_name: string;
  lab_area: string | null;
  home_collection: boolean;
  home_fee: number | null;
};

const KEY = "dlp_basket";
const EVENT = "dlp-basket";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function readBasket(): BasketTest[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list.filter((item) => item && typeof item.id === "number") : [];
  } catch {
    return [];
  }
}

export function writeBasket(tests: BasketTest[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(tests));
  } catch {
    // Storage is blocked: the basket lasts for this page only.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function addToBasket(test: CatalogueTest): BasketTest[] {
  if (!test.lab) return readBasket();
  const item: BasketTest = {
    id: test.id,
    name: test.name,
    price: test.price,
    lab_id: test.lab.id,
    lab_name: test.lab.name,
    lab_area: test.lab.area ?? null,
    home_collection: Boolean(test.lab.home_collection),
    home_fee: test.lab.home_collection_fee ?? null,
  };
  const next = [...readBasket().filter((entry) => entry.id !== test.id), item];
  writeBasket(next);
  return next;
}

export function onBasketChange(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export const naira = (amount: number) => `₦${Math.round(amount).toLocaleString("en-NG")}`;
