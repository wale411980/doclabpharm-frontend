import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Pagination } from "@/components/dashboard/Pagination";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, Pill, formatDate, inputStyles } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import { providerRoleLabel } from "@/lib/providerTypes";
import { cn } from "@/lib/utils";
import { useProviderReports, useResolveProviderReport } from "@/queries/use-verification";
import type { ProviderReport, ReportStatus } from "@/types/verification";
import { ADMIN_STATUS } from "./adminCopy";

const FILTERS: { value: ReportStatus | "all"; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];

const REPORT_STATUS: Record<ReportStatus, { label: string; tone: "warm" | "brand" | "neutral" }> = {
  open: { label: "Open", tone: "warm" },
  resolved: { label: "Resolved", tone: "brand" },
  dismissed: { label: "Dismissed", tone: "neutral" },
};

/** Patient reports about providers. `basePath` is "/admin" or "/super-admin". */
export default function ProviderReports({ basePath }: { basePath: string }) {
  const [params, setParams] = useSearchParams();
  const status = FILTERS.find((f) => f.value === params.get("status"))?.value ?? "open";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useProviderReports(status, page);
  const [closing, setClosing] = useState<{ report: ProviderReport; outcome: "resolved" | "dismissed" } | null>(null);

  useEffect(() => {
    document.title = "Provider reports | DocLabPharm";
  }, []);

  const setFilter = (value: string, nextPage?: number) => {
    const next = new URLSearchParams();
    next.set("status", value);
    if (nextPage && nextPage > 1) next.set("page", String(nextPage));
    setParams(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Provider reports"
        intro="Concerns patients raised about providers. Three open reports from different patients send an approved provider back for review automatically."
      />

      <div role="group" aria-label="Report status" className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={status === filter.value}
            onClick={() => setFilter(filter.value)}
            className={cn(
              "min-h-11 rounded-full px-5 font-bold transition-colors",
              status === filter.value ? "bg-brand-600 text-white" : "bg-white text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState label="Loading reports" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load the reports.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && <Card className="text-center text-ink-700">No reports here.</Card>}
      {data && data.data.length > 0 && (
        <>
          <ul className="flex flex-col gap-4">
            {data.data.map((report) => (
              <ReportCard key={report.id} report={report} basePath={basePath} onClose={(outcome) => setClosing({ report, outcome })} />
            ))}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={(next) => setFilter(status, next)} />
        </>
      )}

      <CloseReportDialog closing={closing} onDone={() => setClosing(null)} />
    </div>
  );
}

function ReportCard({
  report,
  basePath,
  onClose,
}: {
  report: ProviderReport;
  basePath: string;
  onClose: (outcome: "resolved" | "dismissed") => void;
}) {
  const statusCopy = REPORT_STATUS[report.status];
  return (
    <li>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {report.provider ? (
              <Link
                to={`${basePath}/verifications/${report.provider.type}/${report.provider.id}`}
                className="font-bold text-brand-700 underline-offset-4 hover:underline"
              >
                {report.provider.name}
              </Link>
            ) : (
              <span className="font-bold text-ink-900">Provider no longer exists</span>
            )}
            <p className="text-sm text-ink-500">
              {report.provider && `${providerRoleLabel(report.provider.type)} · ${ADMIN_STATUS[report.provider.verificationStatus].label} · `}
              reported {formatDate(report.createdAt, true)}
            </p>
          </div>
          <Pill tone={statusCopy.tone}>{statusCopy.label}</Pill>
        </div>

        <blockquote className="whitespace-pre-line rounded-2xl bg-sand p-4 text-ink-900">{report.reason}</blockquote>

        {report.reporter && (
          <p className="text-sm text-ink-700">
            From {report.reporter.firstName} {report.reporter.lastName} · {report.reporter.email}
            {report.reporter.phone && ` · ${report.reporter.phone}`}
          </p>
        )}

        {report.status !== "open" && (
          <p className="text-sm text-ink-700">
            {statusCopy.label} {formatDate(report.resolvedAt)}
            {report.resolutionNote && <>: {report.resolutionNote}</>}
          </p>
        )}

        {report.status === "open" && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onClose("resolved")}>Mark resolved</Button>
            <Button variant="secondary" onClick={() => onClose("dismissed")}>
              Dismiss
            </Button>
          </div>
        )}
      </Card>
    </li>
  );
}

function CloseReportDialog({
  closing,
  onDone,
}: {
  closing: { report: ProviderReport; outcome: "resolved" | "dismissed" } | null;
  onDone: () => void;
}) {
  const [note, setNote] = useState("");
  const resolve = useResolveProviderReport();

  useEffect(() => setNote(""), [closing]);

  const confirm = async () => {
    if (!closing) return;
    try {
      const result = await resolve.mutateAsync({ id: closing.report.id, status: closing.outcome, note: note.trim() });
      toast.success(result.message);
      onDone();
    } catch (error) {
      toast.error(apiErrorMessage(error, "The report could not be closed."));
    }
  };

  const dismissing = closing?.outcome === "dismissed";

  return (
    <ConfirmDialog
      open={closing !== null}
      onOpenChange={(open) => !open && onDone()}
      title={dismissing ? "Dismiss report" : "Mark report resolved"}
      description={
        dismissing
          ? "Dismiss a report that is unfounded. It will no longer count towards sending the provider for review."
          : "Resolve a report once the concern has been dealt with. This does not change the provider's verification: approve them again from the queue if they were sent for review."
      }
      confirmLabel={dismissing ? "Dismiss report" : "Mark resolved"}
      loading={resolve.isPending}
      onConfirm={confirm}
    >
      <Field id="report-note" label="Note (optional)">
        <textarea
          id="report-note"
          className={inputStyles}
          rows={3}
          maxLength={2000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </Field>
    </ConfirmDialog>
  );
}
