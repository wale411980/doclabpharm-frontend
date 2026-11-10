import { CalendarClock, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { Card, Pill, formatDate } from "@/components/dashboard/ui";
import type { ProviderVerification } from "@/types/verification";
import { VERIFICATION_STATUS } from "./statusCopy";

const iconFor = (status: ProviderVerification["verificationStatus"]) => {
  if (status === "approved") return ShieldCheck;
  if (status === "rejected" || status === "suspended" || status === "expired") return ShieldAlert;
  return ShieldQuestion;
};

/** The provider's verification status with what it means and what to do. */
export function StatusSummary({ verification }: { verification: ProviderVerification }) {
  const status = verification.verificationStatus;
  const copy = VERIFICATION_STATUS[status];
  const Icon = iconFor(status);
  const isReason = status === "rejected" || status === "suspended";

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-ink-900">Verification status</h2>
            <Pill tone={copy.tone}>{copy.label}</Pill>
          </div>
          <p className="leading-relaxed text-ink-700">{copy.explanation}</p>
        </div>
      </div>

      {verification.verificationNote && (
        <div
          className={
            isReason
              ? "rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200"
              : "rounded-2xl bg-brand-50 p-4 text-ink-900 ring-1 ring-brand-200"
          }
        >
          <p className="font-bold">
            {status === "suspended" ? "Reason for suspension" : isReason ? "Reason from our team" : "Note from our team"}
          </p>
          <p className="mt-1 whitespace-pre-line">{verification.verificationNote}</p>
        </div>
      )}

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-sand p-4">
          <dt className="flex items-center gap-1.5 text-sm text-ink-500">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Licence valid until
          </dt>
          <dd className="mt-1 font-bold text-ink-900">{formatDate(verification.licenceExpiresAt)}</dd>
        </div>
        <div className="rounded-2xl bg-sand p-4">
          <dt className="text-sm text-ink-500">Submitted</dt>
          <dd className="mt-1 font-bold text-ink-900">{formatDate(verification.submittedAt)}</dd>
        </div>
        <div className="rounded-2xl bg-sand p-4">
          <dt className="text-sm text-ink-500">Approved</dt>
          <dd className="mt-1 font-bold text-ink-900">{formatDate(verification.verifiedAt)}</dd>
        </div>
      </dl>
    </Card>
  );
}
