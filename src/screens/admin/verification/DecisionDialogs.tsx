import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Field, inputStyles } from "@/components/dashboard/ui";

/** Tomorrow as YYYY-MM-DD in local time: the earliest licence date the API accepts. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ApproveDialog({
  open,
  onOpenChange,
  providerName,
  suggestedDate,
  renewal,
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  suggestedDate: string | null;
  renewal: boolean;
  loading: boolean;
  onConfirm: (licenceExpiresAt: string, note: string) => void;
}) {
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setDate(suggestedDate ?? "");
      setNote("");
    }
  }, [open, suggestedDate]);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={renewal ? "Approve licence renewal" : "Approve provider"}
      description={
        <>
          {providerName} will be shown to patients and can take orders until the licence date. Pending documents are
          marked accepted, and the provider is emailed.
        </>
      }
      confirmLabel="Approve"
      loading={loading}
      onConfirm={() => onConfirm(date, note.trim())}
    >
      <Field id="approve-date" label="Licence valid until" hint="Read it off the current licence. Must be a future date.">
        <input
          id="approve-date"
          type="date"
          className={inputStyles}
          value={date}
          min={tomorrow()}
          required
          onChange={(event) => setDate(event.target.value)}
        />
      </Field>
      <Field id="approve-note" label="Note for the provider (optional)">
        <textarea
          id="approve-note"
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

/** Reject, suspend or reject a document: each needs a reason the provider will read. */
export function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      variant="danger"
      loading={loading}
      onConfirm={() => onConfirm(reason.trim())}
    >
      <Field id="decision-reason" label="Reason" hint="The provider sees this, so say exactly what to fix.">
        <textarea
          id="decision-reason"
          className={inputStyles}
          rows={4}
          maxLength={2000}
          required
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </Field>
    </ConfirmDialog>
  );
}
