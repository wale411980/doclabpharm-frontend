import { toast } from "react-toastify";
import { Eye, FileText, XCircle } from "lucide-react";
import { Button, Card, Pill, formatDate } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import { adminDocumentPath, openAuthenticatedFile } from "@/queries/use-verification";
import type { AdminProviderDocument, VerificationDetail } from "@/types/verification";
import { formatFileSize } from "@/screens/verification/DocumentCard";
import { DOCUMENT_STATUS } from "@/screens/verification/statusCopy";
import { toCamelCase } from "@/utils/caseConverter";

/**
 * The required and optional documents with their current upload, followed by
 * earlier uploads kept as history (accepted documents are never overwritten).
 */
export function DocumentsPanel({
  detail,
  onRejectDocument,
}: {
  detail: VerificationDetail;
  onRejectDocument: (document: AdminProviderDocument) => void;
}) {
  // Documents arrive newest first, so the first of each type is the current
  // one. The requirement keys were camelCased by the API client, so the map
  // is keyed the same way.
  const current = new Map<string, AdminProviderDocument>();
  detail.documents.forEach((doc) => {
    const key = toCamelCase(doc.type);
    if (!current.has(key)) current.set(key, doc);
  });
  const currentIds = new Set(Array.from(current.values()).map((doc) => doc.id));
  const history = detail.documents.filter((doc) => !currentIds.has(doc.id));

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-ink-900">Documents</h2>
      <ul className="flex flex-col gap-3">
        {Object.entries(detail.requiredDocuments).map(([type, requirement]) => {
          const doc = current.get(type);
          return (
            <li key={type} className="flex flex-col gap-3 rounded-2xl bg-sand p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <p className="font-bold text-ink-900">{requirement.label}</p>
                <div className="flex flex-wrap gap-2">
                  {!requirement.required && <Pill>Optional</Pill>}
                  {doc ? (
                    <Pill tone={DOCUMENT_STATUS[doc.status].tone}>{doc.status === "pending" ? "To check" : DOCUMENT_STATUS[doc.status].label}</Pill>
                  ) : (
                    <Pill tone={requirement.required ? "red" : "neutral"}>Not uploaded</Pill>
                  )}
                </div>
              </div>
              {doc && <DocumentLine document={doc} onReject={doc.status !== "rejected" ? () => onRejectDocument(doc) : undefined} />}
            </li>
          );
        })}
      </ul>

      {history.length > 0 && (
        <details className="rounded-2xl ring-1 ring-brand-100">
          <summary className="flex min-h-11 cursor-pointer items-center px-4 font-bold text-brand-700">
            Earlier uploads ({history.length})
          </summary>
          <ul className="flex flex-col gap-3 p-4 pt-0">
            {history.map((doc) => (
              <li key={doc.id} className="rounded-2xl bg-sand p-4">
                <p className="mb-2 text-sm font-bold text-ink-700">{doc.label}</p>
                <DocumentLine document={doc} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </Card>
  );
}

function DocumentLine({ document, onReject }: { document: AdminProviderDocument; onReject?: () => void }) {
  const view = async () => {
    try {
      await openAuthenticatedFile(adminDocumentPath(document.id), document.originalName);
    } catch (error) {
      toast.error(apiErrorMessage(error, "The document could not be opened."));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
        <div className="min-w-0 text-sm">
          <p className="break-words font-bold text-ink-900">{document.originalName}</p>
          <p className="text-ink-500">
            {formatFileSize(document.size)} · uploaded {formatDate(document.uploadedAt, true)}
          </p>
          {(document.documentNumber || document.expiresAt) && (
            <p className="text-ink-700">
              {document.documentNumber && <>No. {document.documentNumber}</>}
              {document.documentNumber && document.expiresAt && " · "}
              {document.expiresAt && <>expires {formatDate(document.expiresAt)}</>}
            </p>
          )}
          {document.reviewedBy && (
            <p className="text-ink-500">
              {DOCUMENT_STATUS[document.status].label} by {document.reviewedBy.firstName} {document.reviewedBy.lastName},{" "}
              {formatDate(document.reviewedAt)}
            </p>
          )}
          {document.reviewNote && <p className="mt-1 text-red-800">Reason: {document.reviewNote}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={view}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          View
        </Button>
        {onReject && (
          <Button variant="ghost" className="text-red-700 hover:bg-red-50" onClick={onReject}>
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Reject document
          </Button>
        )}
      </div>
    </div>
  );
}
