import type { PillTone } from "@/components/dashboard/ui";
import type { DocumentStatus, VerificationStatus } from "@/types/verification";

type StatusCopy = {
  label: string;
  tone: PillTone;
  /** What the status means for the provider, in plain words. */
  explanation: string;
};

export const VERIFICATION_STATUS: Record<VerificationStatus, StatusCopy> = {
  draft: {
    label: "Not yet submitted",
    tone: "neutral",
    explanation:
      "Upload your licence documents, then submit them for review. Patients cannot see you or order from you until our team has checked your licence.",
  },
  submitted: {
    label: "Submitted",
    tone: "blue",
    explanation:
      "Thank you. Your documents are with our verification team, and we will email you when they have decided. You cannot change documents while you wait, unless we ask you to replace one.",
  },
  under_review: {
    label: "Under review",
    tone: "blue",
    explanation:
      "Our team is reviewing your account, and you are hidden from patients until this is done. Make sure every required document is uploaded and current, then submit them for review.",
  },
  approved: {
    label: "Approved",
    tone: "brand",
    explanation:
      "You are verified. Patients can find you and place orders. When you renew your licence, upload the new document on the Verification page: you stay live while we check it.",
  },
  rejected: {
    label: "Not approved",
    tone: "red",
    explanation:
      "Our team could not approve your application. Read their reason, replace the documents it mentions, and submit again.",
  },
  suspended: {
    label: "Suspended",
    tone: "red",
    explanation:
      "Your account has been taken off DocLabPharm, so patients cannot see you or order from you. Read the reason from our team and contact support to resolve it.",
  },
  expired: {
    label: "Licence expired",
    tone: "warm",
    explanation:
      "The licence date we have on file has passed, so you are hidden from patients. Upload your renewed licence and submit it for review.",
  },
};

export const DOCUMENT_STATUS: Record<DocumentStatus, { label: string; tone: PillTone }> = {
  pending: { label: "Waiting for review", tone: "blue" },
  accepted: { label: "Accepted", tone: "brand" },
  rejected: { label: "Needs replacing", tone: "red" },
};

/** Statuses in which the provider can delete documents and submit (API: PROVIDER_EDITABLE). */
export const PROVIDER_EDITABLE: VerificationStatus[] = ["draft", "under_review", "rejected", "expired"];

/** Document types that carry a registration or licence number worth recording. */
export const NUMBERED_DOCUMENTS = new Set([
  "mdcn_certificate",
  "annual_practising_licence",
  "government_id",
  "specialist_certificate",
  "cac_certificate",
  "pcn_premises_licence",
  "superintendent_pharmacist_licence",
  "mlscn_registration",
  "scientist_in_charge_licence",
  "health_authority_registration",
]);
