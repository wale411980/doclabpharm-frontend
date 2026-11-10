import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertTriangle, ArrowLeft, Ban, CheckCircle2, XCircle } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, Pill, formatDate } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import { isProviderRole, providerRoleLabel, type ProviderRole } from "@/lib/providerTypes";
import { useVerificationDecision, useVerificationDetail } from "@/queries/use-verification";
import type { AdminProviderDocument, VerificationDetail as Detail } from "@/types/verification";
import NotFoundPage from "@/screens/PageNotFound";
import { toCamelCase } from "@/utils/caseConverter";
import { ADMIN_STATUS } from "./adminCopy";
import { AuditTrail } from "./AuditTrail";
import { ApproveDialog, ReasonDialog } from "./DecisionDialogs";
import { DocumentsPanel } from "./DocumentsPanel";

const REJECTABLE = ["draft", "submitted", "under_review", "expired"];

/** One provider's verification file and the admin decisions. `basePath` is "/admin" or "/super-admin". */
export default function VerificationDetail({ basePath }: { basePath: string }) {
  const params = useParams();
  const id = Number(params.id);
  if (!isProviderRole(params.type) || !Number.isInteger(id)) return <NotFoundPage />;
  return <DetailScreen basePath={basePath} type={params.type} id={id} />;
}

function DetailScreen({ basePath, type, id }: { basePath: string; type: ProviderRole; id: number }) {
  const { data, isLoading, isError, error, refetch } = useVerificationDetail(type, id);

  useEffect(() => {
    document.title = "Provider verification | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-2 sm:py-4">
      <div>
        <Link
          to={`${basePath}/verifications`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full font-bold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to the queue
        </Link>
      </div>
      {isLoading && <LoadingState label="Loading the provider" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load this provider.")} onRetry={() => refetch()} />}
      {data && <DetailBody basePath={basePath} type={type} id={id} detail={data} />}
    </div>
  );
}

type OpenDialog = "approve" | "reject" | "suspend" | { document: AdminProviderDocument } | null;

function DetailBody({ basePath, type, id, detail }: { basePath: string; type: ProviderRole; id: number; detail: Detail }) {
  const { provider } = detail;
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const decide = useVerificationDecision(type, id);
  const name = provider.businessName || `${provider.firstName} ${provider.lastName}`;
  const status = provider.verificationStatus;
  const copy = ADMIN_STATUS[status];
  const hasPending = detail.documents.some((doc) => doc.status === "pending");
  const ready = detail.outstandingDocuments.length === 0;

  // Suggest the licence date from the earliest future expiry the provider entered.
  const today = new Date().toISOString().slice(0, 10);
  const suggestedDate =
    detail.documents
      .filter((doc) => doc.status !== "rejected" && doc.expiresAt && doc.expiresAt > today)
      .map((doc) => doc.expiresAt as string)
      .sort()[0] ?? null;

  const run = async (decision: Parameters<typeof decide.mutateAsync>[0]) => {
    try {
      const result = await decide.mutateAsync(decision);
      toast.success(result.message);
      setDialog(null);
    } catch (error) {
      toast.error(apiErrorMessage(error, "The decision could not be saved."));
    }
  };

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-700">{providerRoleLabel(type)}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{name}</h1>
          <Pill tone={copy.tone}>{copy.label}</Pill>
        </div>
        {provider.verificationNote && (
          <p className="max-w-3xl rounded-2xl bg-sand p-4 text-ink-700">
            <span className="font-bold">Note shown to the provider: </span>
            {provider.verificationNote}
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <DocumentsPanel detail={detail} onRejectDocument={(document) => setDialog({ document })} />
          <AuditTrail events={detail.events} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-ink-900">Decision</h2>
            {!ready && (
              <p className="rounded-2xl bg-warm-50 p-3 text-sm text-warm-900 ring-1 ring-warm-300">
                Missing or rejected required documents: {detail.outstandingDocuments.map((key) => labelFor(detail, key)).join("; ")}.
                The provider must upload them before approval.
              </p>
            )}
            {status === "approved" && hasPending && (
              <p className="text-sm text-ink-700">
                This provider uploaded renewal documents. Approve with the new licence date to accept them.
              </p>
            )}
            <Button onClick={() => setDialog("approve")} disabled={!ready}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {status === "approved" ? "Approve renewal" : status === "suspended" ? "Reinstate (approve)" : "Approve"}
            </Button>
            {REJECTABLE.includes(status) && (
              <Button variant="secondary" onClick={() => setDialog("reject")}>
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Reject application
              </Button>
            )}
            {status !== "suspended" && (
              <Button variant="ghost" className="text-red-700 hover:bg-red-50" onClick={() => setDialog("suspend")}>
                <Ban className="h-4 w-4" aria-hidden="true" />
                Suspend
              </Button>
            )}
          </Card>

          <ProviderFacts detail={detail} basePath={basePath} />
        </div>
      </div>

      <ApproveDialog
        open={dialog === "approve"}
        onOpenChange={(open) => !open && setDialog(null)}
        providerName={name}
        suggestedDate={suggestedDate}
        renewal={status === "approved"}
        loading={decide.isPending}
        onConfirm={(licenceExpiresAt, note) => run({ action: "approve", licenceExpiresAt, note })}
      />
      <ReasonDialog
        open={dialog === "reject"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Reject application"
        description={`${name} will be told the application was not approved and why. They can fix it and submit again.`}
        confirmLabel="Reject application"
        loading={decide.isPending}
        onConfirm={(reason) => run({ action: "reject", reason })}
      />
      <ReasonDialog
        open={dialog === "suspend"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Suspend provider"
        description={`${name} will be hidden from patients and unable to take orders straight away, and emailed the reason. Only an admin can reinstate them.`}
        confirmLabel="Suspend provider"
        loading={decide.isPending}
        onConfirm={(reason) => run({ action: "suspend", reason })}
      />
      <ReasonDialog
        open={typeof dialog === "object" && dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Reject document"
        description={
          typeof dialog === "object" && dialog
            ? `${dialog.document.label}: the provider will see this reason on their verification page and must upload a replacement.`
            : ""
        }
        confirmLabel="Reject document"
        loading={decide.isPending}
        onConfirm={(reason) =>
          typeof dialog === "object" && dialog && run({ action: "reject-document", documentId: dialog.document.id, reason })
        }
      />
    </>
  );
}

function labelFor(detail: Detail, type: string): string {
  return detail.requiredDocuments[toCamelCase(type)]?.label ?? type.replace(/_/g, " ");
}

function ProviderFacts({ detail, basePath }: { detail: Detail; basePath: string }) {
  const { provider } = detail;
  const facts: [string, string | null | undefined][] = [
    ["Contact", `${provider.firstName} ${provider.lastName}`],
    ["Email", provider.email],
    ["Phone", provider.phone],
    ["Address", [provider.address, provider.city, provider.state].filter(Boolean).join(", ")],
    ["CAC number", provider.cacNumber],
    ["MDCN number", provider.mdcnNumber],
    ["PCN premises number", provider.pcnPremisesNumber],
    ["MLSCN number", provider.mlscnNumber],
    ["Registered", formatDate(provider.createdAt)],
    ["Submitted", formatDate(provider.submittedAt)],
    ["Approved", provider.verifiedAt ? `${formatDate(provider.verifiedAt)}${provider.verifiedBy ? ` by ${provider.verifiedBy.firstName} ${provider.verifiedBy.lastName}` : ""}` : null],
    ["Licence valid until", provider.licenceExpiresAt ? formatDate(provider.licenceExpiresAt.slice(0, 10)) : null],
  ];

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-ink-900">Provider details</h2>
      <dl className="flex flex-col gap-3">
        {facts
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-ink-500">{label}</dt>
              <dd className="break-words font-bold text-ink-900">{value}</dd>
            </div>
          ))}
      </dl>
      {detail.openReports > 0 && (
        <Link
          to={`${basePath}/provider-reports`}
          className="flex items-start gap-2 rounded-2xl bg-warm-50 p-3 text-sm font-bold text-warm-900 ring-1 ring-warm-300 hover:underline"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {detail.openReports} open patient {detail.openReports === 1 ? "report" : "reports"} about this provider
        </Link>
      )}
    </Card>
  );
}
