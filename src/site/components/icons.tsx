import {
  Ambulance,
  FlaskConical,
  Pill,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSlug } from "@/site/config";

export const SERVICE_ICON: Record<ServiceSlug, LucideIcon> = {
  pharmacy: Pill,
  doctors: Stethoscope,
  "lab-tests": FlaskConical,
  ambulance: Ambulance,
};

/** Soft background and icon colour per service, used on tiles. */
export const SERVICE_TONE: Record<ServiceSlug, { tile: string; badge: string; icon: string }> = {
  pharmacy: { tile: "bg-white", badge: "bg-brand-100", icon: "text-brand-700" },
  doctors: { tile: "bg-white", badge: "bg-[#e3f0fb]", icon: "text-[#1d4f7a]" },
  "lab-tests": { tile: "bg-white", badge: "bg-[#efe9fb]", icon: "text-[#4b2a8a]" },
  ambulance: { tile: "bg-warm-50", badge: "bg-warm-400", icon: "text-warm-900" },
};
