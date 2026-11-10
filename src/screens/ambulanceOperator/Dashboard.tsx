import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Ambulance, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Card, ErrorState, LoadingState, PageHeader, Pill, buttonStyles } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import { useAmbulanceOperatorProfile } from "@/queries/use-ambulance-operator";
import { useProviderVerification } from "@/queries/use-verification";
import { VERIFICATION_STATUS } from "@/screens/verification/statusCopy";
import type { ProviderVerification } from "@/types/verification";

/** The steps to going live, ticked off from the verification status. */
function nextSteps(verification: ProviderVerification, profileComplete: boolean) {
  const status = verification.verificationStatus;
  const uploaded = verification.outstandingDocuments.length === 0;
  const submitted = ["submitted", "approved"].includes(status);
  const steps: { label: string; done: boolean; href?: string }[] = [
    { label: "Add your business details (CAC number, address) on your profile", done: profileComplete, href: "/ambulance_operator/profile" },
    { label: "Upload your CAC certificate and health authority registration", done: uploaded, href: "/ambulance_operator/verification" },
    { label: "Submit your documents for review", done: submitted, href: "/ambulance_operator/verification" },
    { label: "Our team checks your documents and approves your account", done: status === "approved" },
  ];
  return steps;
}

export default function AmbulanceOperatorDashboard() {
  const verification = useProviderVerification("ambulance_operator");
  const profile = useAmbulanceOperatorProfile();

  useEffect(() => {
    document.title = "Dashboard | DocLabPharm";
  }, []);

  const name = profile.data?.businessName || profile.data?.firstName;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={name ? `Welcome, ${name}` : "Welcome"}
        intro="Your ambulance service on DocLabPharm. Here is where your account stands."
      />

      {verification.isLoading && <LoadingState label="Loading your account" />}
      {verification.isError && (
        <ErrorState
          message={apiErrorMessage(verification.error, "We could not load your account status.")}
          onRetry={() => verification.refetch()}
        />
      )}
      {verification.data && <StatusCard verification={verification.data} profileComplete={Boolean(profile.data?.cacNumber && profile.data?.address)} />}

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warm-100 text-warm-700">
          <Ambulance className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-ink-900">Fleet and dispatch are coming later</h2>
          <p className="leading-relaxed text-ink-700">
            Adding your vehicles, setting prices and receiving emergency requests are not available yet. They
            arrive in a later phase of DocLabPharm. For now, get verified so you are ready on day one.
          </p>
        </div>
      </Card>
    </div>
  );
}

function StatusCard({ verification, profileComplete }: { verification: ProviderVerification; profileComplete: boolean }) {
  const copy = VERIFICATION_STATUS[verification.verificationStatus];
  const steps = nextSteps(verification, profileComplete);

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-ink-900">Verification</h2>
          <Pill tone={copy.tone}>{copy.label}</Pill>
        </div>
        <p className="leading-relaxed text-ink-700">{copy.explanation}</p>
        {["rejected", "suspended"].includes(verification.verificationStatus) && verification.verificationNote && (
          <p className="rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200">
            <span className="font-bold">Reason from our team: </span>
            {verification.verificationNote}
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-bold text-ink-900">What happens next</h3>
        <ol className="flex flex-col gap-2">
          {steps.map((step) => (
            <li key={step.label} className="flex items-start gap-3 rounded-2xl bg-sand p-3">
              {step.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-label="Done" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-ink-300" aria-label="To do" />
              )}
              {step.href && !step.done ? (
                <Link to={step.href} className="font-bold text-brand-700 underline-offset-4 hover:underline">
                  {step.label}
                </Link>
              ) : (
                <span className={step.done ? "text-ink-500" : "text-ink-700"}>{step.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {verification.verificationStatus !== "approved" && (
        <div>
          <Link to="/ambulance_operator/verification" className={buttonStyles("primary")}>
            Go to verification
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </Card>
  );
}
