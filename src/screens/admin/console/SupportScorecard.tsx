import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Trophy } from "lucide-react";
import { Card, ErrorState, LoadingState, PageHeader, Pill, inputStyles } from "@/components/dashboard/ui";
import { EmptyState } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { providerRoleLabel } from "@/lib/providerTypes";
import { useSupportScorecard } from "@/queries/use-admin-console";

function minutes(value: number | null): string {
  if (value === null) return "—";
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  return `${hours} h ${value % 60} min`;
}

/** How providers handle support: worst first (most missed deadlines, then most open). */
export default function SupportScorecard({ basePath }: { basePath: string }) {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError, error, refetch } = useSupportScorecard(days);

  useEffect(() => {
    document.title = "Support scorecard | DocLabPharm";
  }, []);

  const rows = data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <Link to={`${basePath}/support`} className="inline-flex min-h-11 items-center gap-2 self-start font-bold text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Support tickets
      </Link>
      <PageHeader
        title="Provider support scorecard"
        intro="Providers who miss deadlines are listed first. 3 missed deadlines in 30 days brings a warning; 5 takes the provider off DocLabPharm for review."
        actions={
          <div className="flex flex-col gap-1.5">
            <label htmlFor="scorecard-days" className="text-sm font-bold text-ink-700">
              Period
            </label>
            <select id="scorecard-days" className={inputStyles} value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        }
      />
      {isLoading && <LoadingState label="Loading the scorecard" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load the scorecard.")} onRetry={() => refetch()} />}
      {data && rows.length === 0 && (
        <EmptyState icon={Trophy} title="No tickets in this period">
          Providers with support tickets will be listed here.
        </EmptyState>
      )}
      {rows.length > 0 && (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={`${row.providerType}-${row.providerId}`}>
              <Link
                to={`${basePath}/providers/${row.providerType}/${row.providerId}`}
                className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-brand-100 hover:ring-brand-300 sm:p-5"
              >
                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[2fr_repeat(4,1fr)] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink-900">{row.name ?? `Provider #${row.providerId}`}</p>
                    <p className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
                      {providerRoleLabel(row.providerType)}
                      {row.status === "banned" && <Pill tone="red">Banned</Pill>}
                    </p>
                  </div>
                  <Stat label="Tickets" value={row.tickets} />
                  <Stat label="Open" value={row.open} />
                  <Stat label="Missed deadlines" value={row.breached} danger={row.breached >= 3} />
                  <Stat label="First reply" value={minutes(row.avgFirstResponseMinutes)} />
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-500" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Card className="p-4 text-sm text-ink-500">“First reply” is the average time from a new ticket to the provider's first answer.</Card>
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: React.ReactNode; danger?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 sm:flex-col sm:items-start sm:gap-0">
      <span className="text-sm text-ink-500">{label}</span>
      <span className={danger ? "font-extrabold text-red-700" : "font-bold text-ink-900"}>{value}</span>
    </div>
  );
}
