import { useId, useRef, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, Eye, FileText, Trash2, Upload } from "lucide-react";
import { Button, Field, Pill, formatDate, inputStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { apiErrorMessage } from "@/lib/apiError";
import type { ProviderRole } from "@/lib/providerTypes";
import {
  openAuthenticatedFile,
  providerDocumentPath,
  useDeleteVerificationDocument,
  useUploadVerificationDocument,
} from "@/queries/use-verification";
import type { DocumentRequirement } from "@/types/verification";
import { DOCUMENT_STATUS, NUMBERED_DOCUMENTS } from "./statusCopy";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** One required or optional document: what is on file, and the upload form. */
export function DocumentCard({
  role,
  requirement,
  canDelete,
  allowedFileTypes,
  maxFileSizeKb,
}: {
  role: ProviderRole;
  requirement: DocumentRequirement;
  canDelete: boolean;
  allowedFileTypes: string[];
  maxFileSizeKb: number;
}) {
  const { document, canChange } = requirement;
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [documentNumber, setDocumentNumber] = useState(document?.documentNumber ?? "");
  const [fileError, setFileError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const upload = useUploadVerificationDocument(role);
  const remove = useDeleteVerificationDocument(role);

  const accept = allowedFileTypes.map((ext) => `.${ext}`).join(",");
  const typesText = allowedFileTypes.map((ext) => ext.toUpperCase()).join(", ");
  const maxMb = Math.round(maxFileSizeKb / 1024);
  const asksForNumber = NUMBERED_DOCUMENTS.has(requirement.type);

  const chooseFile = (chosen: File | null) => {
    setFileError("");
    setFile(null);
    if (!chosen) return;
    const extension = chosen.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedFileTypes.includes(extension)) {
      setFileError(`This file type is not accepted. Please choose a ${typesText} file.`);
    } else if (chosen.size > maxFileSizeKb * 1024) {
      setFileError(`This file is ${formatFileSize(chosen.size)}. The limit is ${maxMb} MB: please choose a smaller file or a lower-resolution scan.`);
    } else {
      setFile(chosen);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    try {
      await upload.mutateAsync({ type: requirement.type, file, documentNumber: documentNumber.trim() || undefined });
      toast.success(`${requirement.label}: uploaded.`);
      setFile(null);
      setReplacing(false);
      if (fileInput.current) fileInput.current.value = "";
    } catch (error) {
      setFileError(apiErrorMessage(error, "The upload failed. Please try again."));
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    try {
      await remove.mutateAsync(document.id);
      toast.success("Document removed.");
      setConfirmDelete(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
      setConfirmDelete(false);
    }
  };

  const handleView = async () => {
    if (!document) return;
    try {
      await openAuthenticatedFile(providerDocumentPath(role, document.id), document.originalName);
    } catch (error) {
      toast.error(apiErrorMessage(error, "The document could not be opened."));
    }
  };

  const status = document ? DOCUMENT_STATUS[document.status] : null;
  // The upload form is open when something is needed; a document on file
  // that is fine is replaced on request.
  const showForm = canChange && (!document || document.status === "rejected" || replacing);

  const cancelReplace = () => {
    setReplacing(false);
    setFile(null);
    setFileError("");
  };

  return (
    <li className="flex flex-col gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-lg font-bold text-ink-900">{requirement.label}</h3>
        <div className="flex flex-wrap gap-2">
          <Pill tone={requirement.required ? "warm" : "neutral"}>{requirement.required ? "Required" : "Optional"}</Pill>
          {status ? <Pill tone={status.tone}>{status.label}</Pill> : <Pill tone="neutral">Not uploaded</Pill>}
        </div>
      </div>

      {document && (
        <div className="flex flex-col gap-3 rounded-2xl bg-sand p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <div className="min-w-0">
              <p className="break-words font-bold text-ink-900">{document.originalName}</p>
              <p className="text-sm text-ink-500">
                {formatFileSize(document.size)} · uploaded {formatDate(document.uploadedAt)}
                {document.documentNumber && <> · No. {document.documentNumber}</>}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleView}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              View
            </Button>
            {canChange && !showForm && (
              <Button variant="secondary" onClick={() => setReplacing(true)}>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Replace
              </Button>
            )}
            {canDelete && document.status !== "accepted" && (
              <Button variant="ghost" className="text-red-700 hover:bg-red-50" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            )}
          </div>
        </div>
      )}

      {document?.status === "rejected" && document.reviewNote && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          <span className="font-bold">Why it was not accepted: </span>
          {document.reviewNote}
        </p>
      )}

      {document?.status === "accepted" && (
        <p className="flex items-start gap-2 text-sm text-brand-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Checked by our team. It stays on your record; uploading a new one sends it for review.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleUpload} className="flex flex-col gap-3 border-t border-brand-100 pt-4">
          <Field
            id={`${id}-file`}
            label={document ? "Upload a replacement" : "Choose the file"}
            hint={`${typesText}, up to ${maxMb} MB. A clear scan or photo of the whole page.`}
          >
            <input
              ref={fileInput}
              id={`${id}-file`}
              type="file"
              accept={accept}
              onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
              aria-invalid={fileError ? true : undefined}
              aria-describedby={fileError ? `${id}-error` : undefined}
              className="block w-full text-sm text-ink-700 file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-bold file:text-brand-800 hover:file:bg-brand-200"
            />
          </Field>
          {asksForNumber && (
            <Field id={`${id}-number`} label="Registration or licence number (optional)">
              <input
                id={`${id}-number`}
                className={inputStyles}
                value={documentNumber}
                maxLength={100}
                onChange={(event) => setDocumentNumber(event.target.value)}
                autoComplete="off"
              />
            </Field>
          )}
          {fileError && (
            <p id={`${id}-error`} role="alert" className="text-sm font-bold text-red-700">
              {fileError}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!file} loading={upload.isPending}>
              <Upload className="h-4 w-4" aria-hidden="true" />
              {document ? "Upload replacement" : "Upload"}
            </Button>
            {replacing && (
              <Button variant="ghost" onClick={cancelReplace} disabled={upload.isPending}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Remove this document?"
        description={
          requirement.required
            ? `${document?.originalName ?? "The file"} will be deleted. This document is required, so you will need to upload it again before you submit.`
            : `${document?.originalName ?? "The file"} will be deleted.`
        }
        confirmLabel="Remove document"
        variant="danger"
        loading={remove.isPending}
        onConfirm={handleDelete}
      />
    </li>
  );
}
