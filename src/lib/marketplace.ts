import { toSnakeCase } from "@/utils/caseConverter";

/** Naira with no kobo, the way prices are shown in Nigeria: ₦12,500. */
export function formatNaira(value: number | string | null | undefined): string {
  const amount = Number(value);
  if (value === null || value === undefined || Number.isNaN(amount)) return "—";
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

/**
 * The API client camel-cases every object key, including keys that are data
 * (status names, service types). This turns them back into the API's names.
 */
export function snakeKeys<T>(record: Record<string, T> | null | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  Object.entries(record ?? {}).forEach(([key, value]) => {
    out[toSnakeCase(key)] = value;
  });
  return out;
}

/** "out_for_delivery" → "Out for delivery" (for values without their own wording). */
export function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  const text = value.replace(/[_-]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Whole minutes and seconds left until `iso`, or null when it has passed. */
export function timeLeft(iso: string | null | undefined, now: number): { minutes: number; seconds: number; total: number } | null {
  if (!iso) return null;
  const end = new Date(iso).getTime();
  if (Number.isNaN(end)) return null;
  const total = Math.max(0, Math.floor((end - now) / 1000));
  return { minutes: Math.floor(total / 60), seconds: total % 60, total };
}

/** "in 3 hours", "2 days ago": for deadlines in support. */
export function relativeTime(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "—";
  const diff = new Date(iso).getTime() - now;
  if (Number.isNaN(diff)) return "—";
  const abs = Math.abs(diff);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  const format = new Intl.RelativeTimeFormat("en-NG", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (abs >= size || unit === "minute") return format.format(Math.round(diff / size), unit);
  }
  return format.format(0, "minute");
}

/** Today and 29 days before it, as the API's default period (YYYY-MM-DD). */
export function defaultPeriod(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 29);
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { from: iso(from), to: iso(to) };
}

export type Coordinates = { latitude: number; longitude: number };

/** The browser's position, with a plain-language error the patient can act on. */
export function currentPosition(timeout = 15_000): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Your browser cannot share your location. Please type your address instead."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) =>
        reject(
          new Error(
            error.code === error.PERMISSION_DENIED
              ? "Location is turned off for this site. Allow location in your browser, or type your address instead."
              : "We could not find your location. Please try again or type your address instead."
          )
        ),
      { enableHighAccuracy: true, timeout, maximumAge: 30_000 }
    );
  });
}

/** Approximate centres of the Abuja districts we serve, for when location is off. */
export const ABUJA_AREAS: { name: string; latitude: number; longitude: number }[] = [
  { name: "Central Business District", latitude: 9.0579, longitude: 7.4951 },
  { name: "Garki", latitude: 9.0333, longitude: 7.4833 },
  { name: "Wuse", latitude: 9.0667, longitude: 7.4667 },
  { name: "Wuse 2", latitude: 9.0765, longitude: 7.4793 },
  { name: "Maitama", latitude: 9.0882, longitude: 7.4934 },
  { name: "Asokoro", latitude: 9.0437, longitude: 7.5284 },
  { name: "Utako", latitude: 9.0697, longitude: 7.4434 },
  { name: "Jabi", latitude: 9.0731, longitude: 7.4228 },
  { name: "Gwarinpa", latitude: 9.1099, longitude: 7.4042 },
  { name: "Kubwa", latitude: 9.1544, longitude: 7.3222 },
  { name: "Lugbe", latitude: 8.9806, longitude: 7.3753 },
  { name: "Lokogoma", latitude: 8.9895, longitude: 7.4528 },
  { name: "Life Camp", latitude: 9.0814, longitude: 7.4034 },
  { name: "Karu", latitude: 9.0094, longitude: 7.5636 },
  { name: "Nyanya", latitude: 9.0136, longitude: 7.5797 },
  { name: "Apo", latitude: 8.9947, longitude: 7.4986 },
  { name: "Gwagwalada", latitude: 8.9415, longitude: 7.0839 },
];
