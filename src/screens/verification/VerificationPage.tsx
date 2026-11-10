import { useEffect } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Send } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, PageHeader } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import type { ProviderRole } from "@/lib/providerTypes";
import { useProviderVerification, useSubmitVerification } from "@/queries/use-verification";
import type { ProviderVerification } from "@/types/verification";
import { DocumentCard } from "./DocumentCard";
import { StatusSummary } from "./StatusSummary";
import { PROVIDER_EDITABLE } from "./statusCopy";

/**
 * A provider's licence verification: status, documents and submission.
 * Shared by the doctor, pharmacy, lab and ambulance operator dashboards.
 */
export default function VerificationPage({ role }: { role: ProviderRole }) {
  const { data, isLoading, isError, error, refetch } = useProviderVerification(role);

  useEffect(() => {
    document.title = "Verification | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Verification"
        intro="Every provider on DocLabPharm is checked against a current Nigerian licence before patients can find them. Upload your documents here and we will review them."
      />
      {isLoading && <LoadingState label="Loading your verification" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your verification.")} onRetry={() => refetch()} />}
      {data && (
        <>
          <StatusSummary verification={data} />
          <RejectedDocumentsNotice verification={data} />
          <section aria-labelledby="documents-heading" className="flex flex-col gap-4">
            <h2 id="documents-heading" className="text-xl font-extrabold text-ink-900">
              Your documents
            </h2>
            <ul className="flex flex-col gap-4">
              {data.documents.map((requirement) => (
                <DocumentCard
                  key={requirement.type}
                  role={role}
                  requirement={requirement}
                  canDelete={PROVIDER_EDITABLE.includes(data.verificationStatus)}
                  allowedFileTypes={data.allowedFileTypes}
                  maxFileSizeKb={data.maxFileSizeKb}
                />
              ))}
            </ul>
          </section>
          <SubmitPanel role={role} verification={data} />
        </>
      )}
    </div>
  );
}

function SubmitPanel({ role, verification }: { role: ProviderRole; verification: ProviderVerification }) {
  const submit = useSubmitVerification(role);
  const status = verification.verificationStatus;

  // Approved providers' renewal uploads are reviewed without a new submission;
  // submitted and suspended providers cannot submit.
  if (!PROVIDER_EDITABLE.includes(status)) return null;

  const outstanding = verification.documents.filter((doc) =>
    verification.outstandingDocuments.includes(doc.type)
  );
  const ready = outstanding.length === 0;

  const handleSubmit = async () => {
    try {
      const result = await submit.mutateAsync();
      toast.success(result.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(apiErrorMessage(error, "We could not submit your documents."));
    }
  };

  return (
    <Card className="flex flex-col gap-4 bg-brand-50">
      <h2 className="text-lg font-bold text-ink-900">Submit for review</h2>
      {ready ? (
        <p className="text-ink-700">
          All required documents are uploaded. Submit them and our verification team will review your licence.
        </p>
      ) : (
        <div className="text-ink-700">
          <p>Upload these before you submit:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {outstanding.map((doc) => (
              <li key={doc.type}>
                {doc.label}
                {doc.document?.status === "rejected" && " (replace the file that was not accepted)"}
              </li>
            ))}
          </ul>
        </div>
      )}
      {submit.isError && (
        <p role="alert" className="font-bold text-red-700">
          {apiErrorMessage(submit.error, "We could not submit your documents.")}
        </p>
      )}
      <div>
        <Button onClick={handleSubmit} disabled={!ready} loading={submit.isPending}>
          <Send className="h-4 w-4" aria-hidden="true" />
          Submit for review
        </Button>
      </div>
    </Card>
  );
}

function RejectedDocumentsNotice({ verification }: { verification: ProviderVerification }) {
  const rejected = verification.documents.filter((doc) => doc.document?.status === "rejected");
  if (rejected.length === 0) return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-3xl bg-red-50 p-5 text-red-800 ring-1 ring-red-200">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>
        <span className="font-bold">
          {rejected.length === 1 ? "One document needs replacing: " : `${rejected.length} documents need replacing: `}
        </span>
        {rejected.map((doc) => doc.label).join("; ")}. The reason is shown with each one below.
      </p>
    </div>
  );
}
