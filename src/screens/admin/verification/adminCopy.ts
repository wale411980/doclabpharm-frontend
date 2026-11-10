import type { PillTone } from "@/components/dashboard/ui";
import type { VerificationStatus } from "@/types/verification";

/** Verification statuses as admins see them. */
export const ADMIN_STATUS: Record<VerificationStatus, { label: string; tone: PillTone }> = {
  draft: { label: "Draft", tone: "neutral" },
  submitted: { label: "Submitted", tone: "blue" },
  under_review: { label: "Under review", tone: "warm" },
  approved: { label: "Approved", tone: "brand" },
  rejected: { label: "Rejected", tone: "red" },
  suspended: { label: "Suspended", tone: "red" },
  expired: { label: "Licence expired", tone: "warm" },
};

/** Audit trail actions (verification_events.action). */
export const EVENT_ACTION: Record<string, string> = {
  submitted: "Submitted for review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  document_rejected: "Document rejected",
  expired: "Licence expired",
  sent_for_review: "Sent back for review",
};
