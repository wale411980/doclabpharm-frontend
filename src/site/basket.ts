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

/** Medicines chosen from the public shelf. */
export type BasketMedicine = {
  id: number;
  name: string;
  pack: string | null;
  price: number;
  qty: number;
  max: number;
  pharmacy_id: number;
  pharmacy_name: string;
  delivers: boolean;
  prescription_only: boolean;
};

const MED_KEY = "dlp_medicines";

export function readMedicines(): BasketMedicine[] {
  try {
    const list = JSON.parse(localStorage.getItem(MED_KEY) || "[]");
    return Array.isArray(list) ? list.filter((item) => item && typeof item.id === "number" && item.qty > 0) : [];
  } catch {
    return [];
  }
}

export function writeMedicines(medicines: BasketMedicine[]): void {
  try {
    localStorage.setItem(MED_KEY, JSON.stringify(medicines.filter((item) => item.qty > 0)));
  } catch {
    // Storage is blocked: the basket lasts for this page only.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Set how many of a medicine are in the basket (0 removes it). */
export function setMedicineQty(medicine: Omit<BasketMedicine, "qty">, qty: number): BasketMedicine[] {
  const amount = Math.max(0, Math.min(qty, medicine.max, 20));
  const rest = readMedicines().filter((entry) => entry.id !== medicine.id);
  const next = amount > 0 ? [...rest, { ...medicine, qty: amount }] : rest;
  writeMedicines(next);
  return next;
}

export const basketCount = () => readBasket().length + readMedicines().reduce((sum, item) => sum + item.qty, 0);

export function onBasketChange(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export const naira = (amount: number) => `₦${Math.round(amount).toLocaleString("en-NG")}`;
