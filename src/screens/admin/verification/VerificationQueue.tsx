import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, ErrorState, LoadingState, PageHeader, Pill, formatDate, inputStyles } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import { PROVIDER_ROLES, isProviderRole, providerRoleLabel } from "@/lib/providerTypes";
import { cn } from "@/lib/utils";
import { useVerificationQueue } from "@/queries/use-verification";
import type { QueueFilter } from "@/types/verification";
import { Pagination } from "@/components/dashboard/Pagination";
import { ADMIN_STATUS } from "./adminCopy";

const FILTERS: { value: QueueFilter; label: string; hint: string }[] = [
  { value: "pending", label: "Pending", hint: "Submitted or under review: waiting for a decision." },
  { value: "renewal", label: "Renewals", hint: "Approved providers who uploaded renewed licences." },
  { value: "all", label: "All", hint: "Every provider, newest submission first." },
];

/** The admin verification queue. `basePath` is "/admin" or "/super-admin". */
export default function VerificationQueue({ basePath }: { basePath: string }) {
  const [params, setParams] = useSearchParams();
  const status = (FILTERS.find((f) => f.value === params.get("status"))?.value ?? "pending") as QueueFilter;
  const typeParam = params.get("type");
  const type = isProviderRole(typeParam) ? typeParam : undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const { data, isLoading, isError, error, refetch, isFetching } = useVerificationQueue({ status, type, page });

  useEffect(() => {
    document.title = "Provider verification | DocLabPharm";
  }, []);

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Provider verification"
        intro="Check each provider's licence documents before they are shown to patients."
      />

      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-ink-700" id="queue-filter-label">
            Show
          </span>
          <div role="group" aria-labelledby="queue-filter-label" className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                title={filter.hint}
                aria-pressed={status === filter.value}
                onClick={() => update({ status: filter.value, page: undefined })}
                className={cn(
                  "min-h-11 rounded-full px-5 font-bold transition-colors",
                  status === filter.value ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-800 hover:bg-brand-100"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-ink-500">{FILTERS.find((f) => f.value === status)?.hint}</p>
        </div>
        <div className="flex flex-col gap-1.5 sm:w-56">
          <label htmlFor="queue-type" className="text-sm font-bold text-ink-700">
            Provider type
          </label>
          <select
            id="queue-type"
            className={inputStyles}
            value={type ?? ""}
            onChange={(event) => update({ type: event.target.value || undefined, page: undefined })}
          >
            <option value="">All types</option>
            {PROVIDER_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {isLoading && <LoadingState label="Loading the queue" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load the queue.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <Card className="text-center text-ink-700">Nothing to review here.</Card>
      )}
      {data && data.data.length > 0 && (
        <div className={cn("flex flex-col gap-4 transition-opacity", isFetching && "opacity-60")} aria-busy={isFetching}>
          <ul className="flex flex-col gap-3">
            {data.data.map((item) => {
              const copy = ADMIN_STATUS[item.verificationStatus];
              return (
                <li key={`${item.providerType}-${item.id}`}>
                  <Link
                    to={`${basePath}/verifications/${item.providerType}/${item.id}`}
                    className="flex items-center gap-4 rounded-3xl bg-white p-4 ring-1 ring-brand-100 transition-colors hover:ring-brand-300 focus-visible:outline-2 focus-visible:outline-brand-700 sm:p-5"
                  >
                    <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink-900">{item.name}</p>
                        <p className="truncate text-sm text-ink-500">
                          {providerRoleLabel(item.providerType)}
                          {item.city && ` · ${item.city}`}
                          {item.businessName && ` · ${item.firstName} ${item.lastName}`}
                        </p>
                      </div>
                      <div>
                        <Pill tone={copy.tone}>{copy.label}</Pill>
                      </div>
                      <div className="text-sm">
                        <span className="text-ink-500">Submitted </span>
                        <span className="font-bold text-ink-900">{formatDate(item.submittedAt)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-ink-900">{item.pendingDocuments}</span>
                        <span className="text-ink-500"> {item.pendingDocuments === 1 ? "document" : "documents"} to check</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-ink-500" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={(next) => update({ page: String(next) })} />
        </div>
      )}
    </div>
  );
}
