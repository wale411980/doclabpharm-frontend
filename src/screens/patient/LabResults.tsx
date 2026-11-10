import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertTriangle, Download, FileText, FlaskConical } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, PageHeader, Pill, buttonStyles, formatDate, type PillTone } from "@/components/dashboard/ui";
import { EmptyState } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { downloadLabResult, usePatientLabResults } from "@/queries/use-labs";
import type { PatientLabResult } from "@/types/marketplace";

const RESULT_STATUS: Record<string, { label: string; tone: PillTone }> = {
  normal: { label: "Normal", tone: "brand" },
  abnormal: { label: "Needs a look", tone: "warm" },
  critical: { label: "Urgent", tone: "red" },
};

/** The patient's released lab results, with private file downloads. */
export default function LabResults() {
  const { data, isLoading, isError, error, refetch } = usePatientLabResults();

  useEffect(() => {
    document.title = "Lab results | DocLabPharm";
  }, []);

  const results = data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Lab results"
        intro="Your results appear here as soon as the lab releases them. Files are private: only you and your lab can open them."
        actions={
          <Link to="/patient/booking/select-test" className={buttonStyles("secondary")}>
            Book a test
          </Link>
        }
      />
      {isLoading && <LoadingState label="Loading your results" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your results.")} onRetry={() => refetch()} />}
      {data && results.length === 0 && (
        <EmptyState icon={FlaskConical} title="No results yet">
          When a lab releases a result for you, we will tell you and it will show here.
        </EmptyState>
      )}
      {results.length > 0 && (
        <ul className="flex flex-col gap-4">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: PatientLabResult }) {
  const [downloading, setDownloading] = useState(false);
  const status = result.status ? RESULT_STATUS[result.status] : undefined;

  const download = async () => {
    setDownloading(true);
    try {
      await downloadLabResult(`/user/lab-results/${result.id}/file`, `${result.test ?? "lab-result"}`.replace(/\s+/g, "-").toLowerCase());
    } catch (e) {
      toast.error(e instanceof Error && !("response" in e) ? e.message : apiErrorMessage(e, "We could not download this file."));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink-900">{result.test ?? "Lab test"}</h2>
            <p className="text-sm text-ink-500">
              {result.laboratory ?? "Laboratory"} · Released {formatDate(result.releasedAt, true)}
            </p>
          </div>
          {status && <Pill tone={status.tone}>{status.label}</Pill>}
        </div>
        {result.status === "critical" && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl bg-red-50 p-4 text-red-800 ring-1 ring-red-200 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 font-bold">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              This result needs attention. Please speak to a doctor today.
            </p>
            <Link to="/user/see-doctor-now" className={buttonStyles("danger", "shrink-0")}>
              See a doctor now
            </Link>
          </div>
        )}
        {result.summary && (
          <div className="rounded-2xl bg-sand p-4">
            <p className="mb-1 text-sm font-bold text-ink-700">What the lab wrote</p>
            <p className="whitespace-pre-line text-ink-900">{result.summary}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {result.hasFile ? (
            <Button onClick={download} loading={downloading}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download result
            </Button>
          ) : (
            <p className="flex items-center gap-2 text-sm text-ink-500">
              <FileText className="h-4 w-4" aria-hidden="true" />
              No file attached to this result.
            </p>
          )}
        </div>
      </Card>
    </li>
  );
}
