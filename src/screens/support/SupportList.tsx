import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, ChevronRight, Clock, LifeBuoy, Plus } from "lucide-react";
import { Card, ErrorState, LoadingState, PageHeader, Pill, buttonStyles, formatDate, inputStyles } from "@/components/dashboard/ui";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState, FilterChips, Toggle, useNow } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { relativeTime } from "@/lib/marketplace";
import { PROVIDER_ROLES, isProviderRole, providerRoleLabel } from "@/lib/providerTypes";
import { cn } from "@/lib/utils";
import { useSupportTickets } from "@/queries/use-support";
import type { SupportAudience, SupportTicket } from "@/types/marketplace";
import { STATUS_FILTERS, categoryLabel, ticketStatus } from "./supportCopy";

const INTRO: Record<string, string> = {
  patient: "Questions or problems with an order? Open a ticket with the provider. DocLabPharm sees every ticket and steps in if the provider does not reply in time.",
  provider:
    "Patients' questions about your service. Reply before the deadline: missed deadlines are recorded, and repeated misses take your account off DocLabPharm for review.",
  admin: "Every ticket on DocLabPharm. Tickets waiting on the provider come first, ordered by deadline.",
};

/** Support tickets for a patient, a provider or DocLabPharm staff. */
export default function SupportList({ audience, basePath }: { audience: SupportAudience; basePath: string }) {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "";
  const breached = params.get("breached") === "1";
  const providerTypeParam = params.get("providerType");
  const providerType = isProviderRole(providerTypeParam) ? providerTypeParam : undefined;
  const providerId = Number(params.get("providerId")) || undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const isAdmin = audience === "admin";
  const isPatient = audience === "patient";

  const { data, isLoading, isError, error, refetch, isFetching } = useSupportTickets(audience, {
    status,
    breached,
    providerType: isAdmin ? providerType : undefined,
    providerId: isAdmin ? providerId : undefined,
    page,
  });

  useEffect(() => {
    document.title = "Support | DocLabPharm";
  }, []);

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title={isAdmin ? "Support tickets" : isPatient ? "Help and support" : "Support inbox"}
        intro={INTRO[isAdmin ? "admin" : isPatient ? "patient" : "provider"]}
        actions={
          <>
            {isPatient && (
              <Link to={`${basePath}/new`} className={buttonStyles("primary")}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New ticket
              </Link>
            )}
            {isAdmin && (
              <Link to={`${basePath}/scorecard`} className={buttonStyles("secondary")}>
                Provider scorecard
              </Link>
            )}
          </>
        }
      />

      <Card className="flex flex-col gap-4 p-4">
        <FilterChips label="Filter by status" value={status} options={STATUS_FILTERS} onChange={(value) => update({ status: value || undefined })} />
        {!isPatient && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="sm:max-w-sm">
              <Toggle
                id="breached-only"
                checked={breached}
                onChange={(next) => update({ breached: next ? "1" : undefined })}
                label="Only missed deadlines"
                description="Tickets where the provider replied late or not at all."
              />
            </div>
            {isAdmin && (
              <div className="flex flex-col gap-1.5 sm:w-56">
                <label htmlFor="support-provider-type" className="text-sm font-bold text-ink-700">
                  Provider type
                </label>
                <select
                  id="support-provider-type"
                  className={inputStyles}
                  value={providerType ?? ""}
                  onChange={(e) => update({ providerType: e.target.value || undefined, providerId: undefined })}
                >
                  <option value="">All types</option>
                  {PROVIDER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        {isAdmin && providerId && (
          <p className="text-sm text-ink-700">
            Showing one provider's tickets.{" "}
            <button type="button" className="font-bold text-brand-700 underline" onClick={() => update({ providerId: undefined, providerType: undefined })}>
              Show all
            </button>
          </p>
        )}
      </Card>

      {isLoading && <LoadingState label="Loading tickets" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load tickets.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState
          icon={LifeBuoy}
          title={status || breached ? "No tickets match" : "No tickets yet"}
          action={
            isPatient ? (
              <Link to={`${basePath}/new`} className={buttonStyles("primary")}>
                Open a ticket
              </Link>
            ) : undefined
          }
        >
          {isPatient ? "If something goes wrong with an order, we are here to help." : "Nothing here right now."}
        </EmptyState>
      )}
      {data && data.data.length > 0 && (
        <div className={cn("flex flex-col gap-4 transition-opacity", isFetching && "opacity-60")} aria-busy={isFetching}>
          <ul className="flex flex-col gap-3">
            {data.data.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} audience={audience} to={`${basePath}/${ticket.id}`} />
            ))}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={(next) => update({ page: String(next) })} />
        </div>
      )}
    </div>
  );
}

function TicketRow({ ticket, audience, to }: { ticket: SupportTicket; audience: SupportAudience; to: string }) {
  const status = ticketStatus(ticket.status, audience);
  const who = audience === "patient" ? ticket.provider?.name : audience === "admin" ? `${ticket.patient ?? "Patient"} → ${ticket.provider?.name ?? "Provider"}` : ticket.patient;
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-brand-100 transition-colors hover:ring-brand-300 focus-visible:outline-2 focus-visible:outline-brand-700 sm:p-5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={status.tone}>{status.label}</Pill>
            {ticket.urgent && <Pill tone="red">Urgent</Pill>}
            {ticket.slaBreached && (
              <Pill tone="red">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Missed deadline
              </Pill>
            )}
          </div>
          <p className="break-words font-bold text-ink-900">{ticket.subject}</p>
          <p className="text-sm text-ink-500">
            {ticket.reference} · {categoryLabel(ticket.category)}
            {who ? ` · ${who}` : ""}
            {audience === "admin" && ticket.provider ? ` (${providerRoleLabel(ticket.provider.type)})` : ""} · Opened {formatDate(ticket.createdAt)}
          </p>
          {ticket.status === "awaiting_provider" && <DeadlineNote due={ticket.responseDueAt} audience={audience} />}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-500" aria-hidden="true" />
      </Link>
    </li>
  );
}

/** "Reply due in 3 hours" / "Overdue by 2 hours", always next to open tickets. */
export function DeadlineNote({ due, audience, large }: { due: string | null; audience: SupportAudience; large?: boolean }) {
  const now = useNow(30_000);
  if (!due) return null;
  const overdue = new Date(due).getTime() < now;
  const whoReplies = audience === "patient" ? "The provider should reply" : audience === "admin" ? "Provider reply due" : "Reply";
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 font-bold",
        large ? "rounded-2xl px-4 py-3 text-base" : "text-sm",
        overdue ? (large ? "bg-red-50 text-red-800 ring-1 ring-red-200" : "text-red-700") : large ? "bg-warm-50 text-warm-900 ring-1 ring-warm-100" : "text-warm-700"
      )}
    >
      <Clock className={cn("h-4 w-4 shrink-0", large ? "mt-1" : "mt-0.5")} aria-hidden="true" />
      <span>
        {overdue
          ? `Deadline missed ${relativeTime(due, now)} (${formatDate(due, true)})`
          : `${whoReplies} by ${formatDate(due, true)} (${relativeTime(due, now)})`}
      </span>
    </p>
  );
}
