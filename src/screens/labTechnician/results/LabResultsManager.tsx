import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, FlaskConical, Home, MapPin, Phone, Send, Upload } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, Pill, buttonStyles, formatDate, inputStyles, type PillTone } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { EmptyState, FilterChips, InlineError, textareaStyles } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { openAuthenticatedFile } from "@/queries/use-verification";
import {
  useAddLabResult,
  useLabBookings,
  useLabProgress,
  useLabReports,
  useReleaseLabResult,
  useUploadLabResultFile,
} from "@/queries/use-labs";
import type { LabBooking, LabReport } from "@/types/marketplace";

const PROGRESS: Record<string, { label: string; tone: PillTone }> = {
  sample_collected: { label: "Sample collected", tone: "blue" },
  processing: { label: "Processing", tone: "blue" },
  result_ready: { label: "Result released", tone: "brand" },
};

const RESULT_STATUS: Record<string, { label: string; tone: PillTone }> = {
  normal: { label: "Normal", tone: "brand" },
  abnormal: { label: "Abnormal", tone: "warm" },
  critical: { label: "Critical", tone: "red" },
};

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";
const MAX_BYTES = 10 * 1024 * 1024;

function checkFile(file: File | null | undefined): string {
  if (!file) return "";
  if (file.size > MAX_BYTES) return "The file is larger than 10 MB. Please upload a smaller PDF or photo.";
  if (!/\.(pdf|jpe?g|png|webp)$/i.test(file.name)) return "Please upload a PDF, JPG, PNG or WebP file.";
  return "";
}

/** Lab work: tell patients how their test is going, then upload and release results. */
export default function LabResultsManager() {
  const [tab, setTab] = useState<"tests" | "results">("tests");
  const bookings = useLabBookings();
  const reports = useLabReports();

  useEffect(() => {
    document.title = "Tests and results | DocLabPharm";
  }, []);

  const reportFor = (bookingId: number) => reports.data?.find((r) => Number(r.bookingId) === Number(bookingId));
  const openBookings = (bookings.data ?? []).filter((b) => b.status !== "cancelled" && !(reportFor(b.id)?.releasedAt));
  const drafts = (reports.data ?? []).filter((r) => !r.releasedAt).length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Tests and results"
        intro="Keep patients informed as you work, then upload the result. Files are stored privately: only the patient and your lab can open them."
        actions={
          <Link to="/lab_technician/home-collection" className={buttonStyles("secondary")}>
            <Home className="h-4 w-4" aria-hidden="true" />
            Home collection settings
          </Link>
        }
      />
      <FilterChips
        label="Show"
        value={tab}
        onChange={setTab}
        options={[
          { value: "tests", label: `Tests to do (${openBookings.length})` },
          { value: "results", label: `Results${drafts ? ` (${drafts} draft${drafts === 1 ? "" : "s"})` : ""}` },
        ]}
      />

      {tab === "tests" && (
        <>
          {bookings.isLoading && <LoadingState label="Loading bookings" />}
          {bookings.isError && <ErrorState message={apiErrorMessage(bookings.error, "We could not load your bookings.")} onRetry={() => bookings.refetch()} />}
          {bookings.data && openBookings.length === 0 && (
            <EmptyState icon={FlaskConical} title="No tests waiting">
              New bookings show here once a patient has paid.
            </EmptyState>
          )}
          <ul className="flex flex-col gap-4">
            {openBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} report={reportFor(booking.id)} />
            ))}
          </ul>
        </>
      )}

      {tab === "results" && (
        <>
          {reports.isLoading && <LoadingState label="Loading results" />}
          {reports.isError && <ErrorState message={apiErrorMessage(reports.error, "We could not load your results.")} onRetry={() => reports.refetch()} />}
          {reports.data && reports.data.length === 0 && (
            <EmptyState icon={FlaskConical} title="No results yet">
              Results you upload show here.
            </EmptyState>
          )}
          <ul className="flex flex-col gap-3">
            {(reports.data ?? []).map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function BookingCard({ booking, report }: { booking: LabBooking; report?: LabReport }) {
  const progress = useLabProgress();
  const [adding, setAdding] = useState(false);
  const patient = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "Patient";
  const step = booking.progress ? PROGRESS[booking.progress] : undefined;

  const mark = async (value: "sample_collected" | "processing") => {
    try {
      const result = await progress.mutateAsync({ bookingId: booking.id, progress: value });
      toast.success(result.message);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not update this test."));
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink-900">{booking.diagnosis?.name ?? "Lab test"}</h2>
            <p className="text-sm text-ink-500">
              {patient} · {formatDate(booking.date)}
              {booking.time ? ` at ${booking.time}` : ""} · Booking #{booking.id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.collectionMethod === "home" && (
              <Pill tone="warm">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                Home collection
              </Pill>
            )}
            <Pill tone={step?.tone ?? "neutral"}>{step?.label ?? "Booked"}</Pill>
            {report && !report.releasedAt && <Pill tone="warm">Draft result saved</Pill>}
          </div>
        </div>

        {booking.collectionMethod === "home" && (
          <div className="grid gap-2 rounded-2xl bg-warm-50 p-4 text-warm-900 sm:grid-cols-2">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {booking.addressLine}
                {booking.landmark ? ` (near ${booking.landmark})` : ""}
                {booking.distanceKm ? ` · ${booking.distanceKm} km away` : ""}
              </span>
            </p>
            {booking.contactPhone && (
              <a href={`tel:${booking.contactPhone}`} className="inline-flex items-center gap-2 font-bold underline">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {booking.contactPhone}
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button variant="secondary" onClick={() => mark("sample_collected")} disabled={progress.isPending || booking.progress === "sample_collected" || booking.progress === "processing"}>
            Sample collected
          </Button>
          <Button variant="secondary" onClick={() => mark("processing")} disabled={progress.isPending || booking.progress === "processing"}>
            Processing
          </Button>
          {!report && !adding && (
            <Button onClick={() => setAdding(true)}>
              <Upload className="h-4 w-4" aria-hidden="true" />
              Add result
            </Button>
          )}
        </div>
        {report && !report.releasedAt && <DraftActions report={report} />}
        {adding && <ResultForm booking={booking} onDone={() => setAdding(false)} />}
      </Card>
    </li>
  );
}

function ResultForm({ booking, onDone }: { booking: LabBooking; onDone: () => void }) {
  const add = useAddLabResult();
  const [status, setStatus] = useState<"normal" | "abnormal" | "critical">("normal");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<null | "draft" | "release">(null);

  const save = async (draft: boolean) => {
    setError("");
    const fileProblem = checkFile(file);
    if (fileProblem) return setError(fileProblem);
    if (!draft && !file && !summary.trim()) return setError("Add the result file or a summary before releasing it to the patient.");
    setSubmitting(draft ? "draft" : "release");
    try {
      const result = await add.mutateAsync({ bookingId: booking.id, status, summary, file, draft });
      toast.success(draft ? "Saved as a draft. The patient cannot see it yet." : "Result released. The patient has been told.");
      onDone();
      return result;
    } catch (e) {
      setError(apiErrorMessage(e, "We could not save the result."));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-sand p-4 ring-1 ring-brand-100">
      <h3 className="font-extrabold text-ink-900">Result for {booking.diagnosis?.name ?? "this test"}</h3>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold text-ink-700">Overall result</legend>
        <div className="flex flex-wrap gap-2">
          {(["normal", "abnormal", "critical"] as const).map((value) => (
            <label
              key={value}
              className={cn(
                "flex min-h-11 cursor-pointer items-center rounded-full px-4 font-bold ring-1 focus-within:outline-2 focus-within:outline-brand-700",
                status === value
                  ? value === "critical"
                    ? "bg-red-700 text-white ring-red-700"
                    : value === "abnormal"
                      ? "bg-warm-400 text-warm-900 ring-warm-400"
                      : "bg-brand-600 text-white ring-brand-600"
                  : "bg-white text-ink-700 ring-brand-200"
              )}
            >
              <input type="radio" name={`status-${booking.id}`} className="sr-only" checked={status === value} onChange={() => setStatus(value)} />
              {RESULT_STATUS[value].label}
            </label>
          ))}
        </div>
        {status === "critical" && (
          <p className="text-sm font-bold text-red-800">The patient will be told to speak to a doctor today. Please also call them.</p>
        )}
      </fieldset>
      <Field label="Summary for the patient" id={`summary-${booking.id}`} hint="Plain words the patient will read with the file.">
        <textarea id={`summary-${booking.id}`} className={textareaStyles} value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={5000} />
      </Field>
      <Field label="Result file" id={`file-${booking.id}`} hint="PDF, JPG, PNG or WebP, up to 10 MB.">
        <input
          id={`file-${booking.id}`}
          type="file"
          accept={ACCEPT}
          className={cn(inputStyles, "py-2 file:mr-3 file:rounded-full file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-bold file:text-brand-800")}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </Field>
      <InlineError>{error}</InlineError>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button onClick={() => save(false)} loading={submitting === "release"} disabled={!!submitting}>
          <Send className="h-4 w-4" aria-hidden="true" />
          Release to patient
        </Button>
        <Button variant="secondary" onClick={() => save(true)} loading={submitting === "draft"} disabled={!!submitting}>
          Save as draft
        </Button>
        <Button variant="ghost" onClick={onDone} disabled={!!submitting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function DraftActions({ report }: { report: LabReport }) {
  const release = useReleaseLabResult();
  const upload = useUploadLabResultFile();
  const [confirming, setConfirming] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const doRelease = async () => {
    try {
      const result = await release.mutateAsync(report.id);
      toast.success(result.message);
      setConfirming(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not release this result."));
      setConfirming(false);
    }
  };

  const onFile = async (file: File | undefined) => {
    const problem = checkFile(file);
    if (problem) return toast.error(problem);
    if (!file) return;
    try {
      const result = await upload.mutateAsync({ reportId: report.id, file });
      toast.success(result.message);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not upload the file."));
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button onClick={() => setConfirming(true)}>
        <Send className="h-4 w-4" aria-hidden="true" />
        Release to patient
      </Button>
      <Button variant="secondary" onClick={() => fileInput.current?.click()} loading={upload.isPending}>
        <Upload className="h-4 w-4" aria-hidden="true" />
        {report.hasFile ? "Replace file" : "Upload file"}
      </Button>
      {report.hasFile && <ViewFileButton report={report} />}
      <input ref={fileInput} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFile(e.target.files?.[0])} />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Release this result?"
        description={
          report.status === "critical"
            ? "The patient is told now that the result needs attention and is asked to speak to a doctor today."
            : "The patient is told their result is ready and can download it."
        }
        confirmLabel="Release"
        loading={release.isPending}
        onConfirm={doRelease}
      />
    </div>
  );
}

function ViewFileButton({ report }: { report: LabReport }) {
  const [opening, setOpening] = useState(false);
  return (
    <Button
      variant="ghost"
      loading={opening}
      onClick={async () => {
        setOpening(true);
        try {
          await openAuthenticatedFile(`/lab-technician/reports/${report.id}/file`, report.fileName ?? "lab-result");
        } catch (e) {
          toast.error(apiErrorMessage(e, "We could not open the file."));
        } finally {
          setOpening(false);
        }
      }}
    >
      <Eye className="h-4 w-4" aria-hidden="true" />
      View file
    </Button>
  );
}

function ReportRow({ report }: { report: LabReport }) {
  const status = report.status ? RESULT_STATUS[report.status] : undefined;
  return (
    <li>
      <Card className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-extrabold text-ink-900">{report.diagnosis?.name ?? "Lab test"}</p>
            <p className="text-sm text-ink-500">
              {report.user ? `${report.user.firstName} ${report.user.lastName}` : "Patient"} ·{" "}
              {report.releasedAt ? `Released ${formatDate(report.releasedAt, true)}` : `Saved ${formatDate(report.createdAt, true)}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {status && <Pill tone={status.tone}>{status.label}</Pill>}
            <Pill tone={report.releasedAt ? "brand" : "warm"}>{report.releasedAt ? "Visible to patient" : "Draft"}</Pill>
          </div>
        </div>
        {report.summary && <p className="line-clamp-3 text-ink-700">{report.summary}</p>}
        {!report.releasedAt ? <DraftActions report={report} /> : report.hasFile && <div><ViewFileButton report={report} /></div>}
      </Card>
    </li>
  );
}
