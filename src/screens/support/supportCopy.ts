import type { PillTone } from "@/components/dashboard/ui";
import type { SupportAudience, SupportCategory, TicketStatus } from "@/types/marketplace";

export const CATEGORIES: { value: SupportCategory; label: string; hint: string }[] = [
  { value: "order", label: "My order", hint: "Something missing, late or wrong" },
  { value: "refund", label: "Refund", hint: "Money you should get back" },
  { value: "quality", label: "Quality of care or product", hint: "Not what you expected" },
  { value: "conduct", label: "Behaviour", hint: "Rude or unprofessional treatment" },
  { value: "safety", label: "Safety concern", hint: "Wrong medicine, harm or danger. Always treated as urgent." },
  { value: "other", label: "Something else", hint: "Anything not listed" },
];

export const categoryLabel = (value: string) => CATEGORIES.find((c) => c.value === value)?.label ?? value;

/** Status wording depends on who is reading. */
export function ticketStatus(status: TicketStatus, audience: SupportAudience): { label: string; tone: PillTone } {
  const patient = audience === "patient";
  const staff = audience === "admin";
  switch (status) {
    case "awaiting_provider":
      return { label: patient ? "Waiting for the provider" : staff ? "Waiting for provider" : "Your reply needed", tone: "warm" };
    case "awaiting_patient":
      return { label: patient ? "Your reply needed" : "Waiting for patient", tone: "blue" };
    case "resolved":
      return { label: "Resolved", tone: "brand" };
    case "closed":
      return { label: "Closed", tone: "neutral" };
    default:
      return { label: status, tone: "neutral" };
  }
}

export const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "awaiting_provider", label: "Waiting for provider" },
  { value: "awaiting_patient", label: "Waiting for patient" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const AUTHOR_LABEL = { patient: "Patient", provider: "Provider", doclabpharm: "DocLabPharm support" } as const;
