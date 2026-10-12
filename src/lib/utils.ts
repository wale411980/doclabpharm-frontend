import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Text content of a value that may contain HTML markup (older profile fields
 * were saved from a rich-text editor), for use in plain inputs/textareas.
 */
export function htmlToPlainText(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (!/[<&]/.test(text)) return text;

  const withBreaks = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n");
  const doc = new DOMParser().parseFromString(withBreaks, "text/html");
  return (doc.body.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim();
}
