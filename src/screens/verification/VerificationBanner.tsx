import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { buttonStyles } from "@/components/dashboard/ui";
import type { ProviderRole } from "@/lib/providerTypes";
import { useProviderVerification } from "@/queries/use-verification";
import { VERIFICATION_STATUS } from "./statusCopy";

const CALL_TO_ACTION: Record<string, string> = {
  draft: "Upload documents",
  under_review: "Check your documents",
  rejected: "See what to fix",
  expired: "Upload your renewal",
  suspended: "See the reason",
  submitted: "View your application",
};

/**
 * Shown on a provider's dashboard home until their licence is approved,
 * because until then patients cannot see them.
 */
export function VerificationBanner({ role }: { role: ProviderRole }) {
  const { data } = useProviderVerification(role);
  if (!data || data.verificationStatus === "approved") return null;

  const status = data.verificationStatus;
  const urgent = status !== "submitted";

  return (
    <div
      role="region"
      aria-label="Verification"
      className={
        urgent
          ? "mb-6 flex flex-col gap-4 rounded-3xl bg-warm-50 p-5 ring-1 ring-warm-300 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          : "mb-6 flex flex-col gap-4 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-200 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      }
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className={urgent ? "mt-0.5 h-6 w-6 shrink-0 text-warm-700" : "mt-0.5 h-6 w-6 shrink-0 text-brand-700"} aria-hidden="true" />
        <div>
          <p className="font-bold text-ink-900">
            {status === "submitted"
              ? "Your documents are being reviewed"
              : "Patients cannot see you yet"}
            {" · "}
            {VERIFICATION_STATUS[status].label}
          </p>
          <p className="mt-1 text-ink-700">{VERIFICATION_STATUS[status].explanation}</p>
        </div>
      </div>
      <Link to={`/${role}/verification`} className={buttonStyles("primary", "shrink-0")}>
        {CALL_TO_ACTION[status]}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/**
 * The banner on the dashboard home only. Rendered by the provider layouts
 * (above the page) so it shows even while the home page's own data is
 * loading or empty, as it is for a provider who has just registered.
 */
export function HomeVerificationBanner({ role }: { role: ProviderRole }) {
  const { pathname } = useLocation();
  if (pathname !== `/${role}/dashboard`) return null;
  return <VerificationBanner role={role} />;
}
