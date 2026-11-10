import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { StatTile } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { defaultPeriod, formatNaira, humanize, snakeKeys } from "@/lib/marketplace";
import { PROVIDER_ROLES } from "@/lib/providerTypes";
import { cn } from "@/lib/utils";
import { useAdminOverview } from "@/queries/use-admin-console";
import { SERVICE_LABEL } from "@/screens/shared/EarningsPage";
import { ADMIN_STATUS } from "@/screens/admin/verification/adminCopy";
import type { VerificationStatus } from "@/types/verification";

const PLURAL: Record<string, string> = {
  doctor: "Doctors",
  pharmacy: "Pharmacies",
  lab_technician: "Labs",
  ambulance_operator: "Ambulance operators",
};

function formatSeconds(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min ${seconds % 60} s`;
}

/** The Walex Biz console home: money, activity, supply right now and the queues that need a person. */
export default function AdminOverview({ basePath }: { basePath: string }) {
  const [period, setPeriod] = useState(defaultPeriod);
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminOverview(period);

  useEffect(() => {
    document.title = "Overview | DocLabPharm";
  }, []);

  const byService = snakeKeys(data?.money.byService);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Marketplace overview"
        intro="Money, activity and what needs a person today. Figures cover the dates you choose; “right now” and queues are live."
      />
      <Card className="grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="From" id="overview-from">
          <input id="overview-from" type="date" className={inputStyles} value={period.from} max={period.to} onChange={(e) => e.target.value && setPeriod((p) => ({ ...p, from: e.target.value }))} />
        </Field>
        <Field label="To" id="overview-to">
          <input id="overview-to" type="date" className={inputStyles} value={period.to} min={period.from} onChange={(e) => e.target.value && setPeriod((p) => ({ ...p, to: e.target.value }))} />
        </Field>
        {isFetching && !isLoading && <p className="pb-3 text-sm text-ink-500">Updating…</p>}
      </Card>

      {isLoading && <LoadingState label="Loading the overview" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load the overview.")} onRetry={() => refetch()} />}

      {data && (
        <>
          <Section title="Needs a person">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <StatTile label="Verifications waiting" value={data.queues.verificationsWaiting} to={`${basePath}/verifications`} tone={data.queues.verificationsWaiting ? "warm" : "neutral"} />
              <StatTile label="Open support tickets" value={data.queues.supportOpen} to={`${basePath}/support`} />
              <StatTile
                label="Overdue tickets"
                value={data.queues.supportOverdue}
                to={`${basePath}/support?status=awaiting_provider`}
                tone={data.queues.supportOverdue ? "red" : "neutral"}
                hint="Provider missed the deadline"
              />
              <StatTile label="Open provider reports" value={data.queues.providerReportsOpen} to={`${basePath}/provider-reports`} tone={data.queues.providerReportsOpen ? "warm" : "neutral"} />
              <StatTile
                label="Pharmacy orders waiting"
                value={data.queues.pharmacyOrdersWaiting}
                to={`${basePath}/operations?tab=deliveries&status=awaiting_pharmacy`}
                tone={data.queues.pharmacyOrdersWaiting ? "warm" : "neutral"}
              />
              <StatTile
                label="Unpaid ambulance trips"
                value={data.queues.unpaidAmbulanceTrips}
                to={`${basePath}/operations?tab=ambulance&unpaid=1`}
                tone={data.queues.unpaidAmbulanceTrips ? "red" : "neutral"}
                hint={formatNaira(data.money.unpaidAmbulanceFares)}
              />
            </div>
          </Section>

          <Section title="Right now">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatTile label="Doctors online" value={data.now.doctorsOnline} tone="brand" to={`${basePath}/operations?tab=consults`} />
              <StatTile label="Pharmacies taking orders" value={data.now.pharmaciesTakingOrders} tone="brand" to={`${basePath}/operations?tab=deliveries`} />
              <StatTile label="Ambulances available" value={data.now.ambulancesAvailable} tone="brand" to={`${basePath}/operations?tab=ambulance`} />
              <StatTile
                label="Ambulance requests searching"
                value={data.now.ambulanceRequestsSearching}
                tone={data.now.ambulanceRequestsSearching ? "red" : "neutral"}
                to={`${basePath}/operations?tab=ambulance&status=searching`}
              />
            </div>
          </Section>

          <Section title="Money">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatTile label="Patients paid" value={formatNaira(data.money.gross)} hint={`${data.money.orders} orders`} />
              <StatTile label="Walex Biz commission" value={formatNaira(data.money.commission)} tone="brand" />
              <StatTile label="Owed back by providers" value={formatNaira(data.money.owedByProviders)} tone={data.money.owedByProviders ? "warm" : "neutral"} />
              <StatTile label="Unpaid ambulance fares" value={formatNaira(data.money.unpaidAmbulanceFares)} tone={data.money.unpaidAmbulanceFares ? "red" : "neutral"} />
            </div>
            <Card className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm sm:text-base">
                <caption className="sr-only">Gross and commission by service</caption>
                <thead className="bg-brand-50 text-sm text-ink-700">
                  <tr>
                    <th scope="col" className="px-3 py-3 sm:px-4 font-bold">Service</th>
                    <th scope="col" className="hidden px-3 py-3 text-right font-bold sm:table-cell sm:px-4">Items</th>
                    <th scope="col" className="px-3 py-3 sm:px-4 text-right font-bold">Patients paid</th>
                    <th scope="col" className="px-3 py-3 sm:px-4 text-right font-bold">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {Object.keys(SERVICE_LABEL).map((type) => (
                    <tr key={type}>
                      <th scope="row" className="px-3 py-3 sm:px-4 font-bold text-ink-900">{SERVICE_LABEL[type]}</th>
                      <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell sm:px-4">{byService[type]?.items ?? 0}</td>
                      <td className="px-3 py-3 sm:px-4 text-right tabular-nums">{formatNaira(byService[type]?.gross ?? 0)}</td>
                      <td className="px-3 py-3 sm:px-4 text-right font-bold tabular-nums">{formatNaira(byService[type]?.commission ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          <Section title="Activity">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatTile label="New patients" value={data.activity.newPatients} />
              <StatTile label="Support tickets opened" value={data.activity.supportTickets} />
              <StatTile label="Median time to assign an ambulance" value={formatSeconds(data.activity.ambulanceMedianAssignSeconds)} />
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <Breakdown title="Pharmacy orders" counts={data.activity.deliveries} to={`${basePath}/operations?tab=deliveries`} />
              <Breakdown title="See-a-doctor-now requests" counts={data.activity.instantConsults} to={`${basePath}/operations?tab=consults`} />
              <Breakdown title="Ambulance requests" counts={data.activity.ambulanceRequests} to={`${basePath}/operations?tab=ambulance`} />
            </div>
          </Section>

          <Section title="Providers by verification status">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PROVIDER_ROLES.map((role) => {
                const counts = snakeKeys(snakeKeys(data.providers)[role.value]);
                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                return (
                  <Card key={role.value} className="flex flex-col gap-3 p-4">
                    <Link to={`${basePath}/verifications?type=${role.value}&status=all`} className="flex items-center justify-between font-extrabold text-ink-900 hover:text-brand-700">
                      {PLURAL[role.value]} <span className="tabular-nums">{total}</span>
                    </Link>
                    <ul className="flex flex-col gap-1 text-sm">
                      {Object.entries(counts).map(([status, count]) => (
                        <li key={status} className="flex justify-between gap-2">
                          <span className="text-ink-700">{ADMIN_STATUS[status as VerificationStatus]?.label ?? humanize(status)}</span>
                          <span className="font-bold tabular-nums">{count}</span>
                        </li>
                      ))}
                      {total === 0 && <li className="text-ink-500">None yet</li>}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-extrabold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function Breakdown({ title, counts, to }: { title: string; counts: Record<string, number>; to: string }) {
  const rows = Object.entries(snakeKeys(counts));
  const total = rows.reduce((sum, [, n]) => sum + n, 0);
  return (
    <Card className="flex flex-col gap-3 p-4">
      <Link to={to} className="flex items-center justify-between gap-2 font-extrabold text-ink-900 hover:text-brand-700">
        <span>
          {title} <span className="tabular-nums text-ink-500">({total})</span>
        </span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-500">None in this period</p>
      ) : (
        <ul className="flex flex-col gap-1.5 text-sm">
          {rows.map(([status, count]) => (
            <li key={status} className="flex items-center gap-2">
              <span className="w-32 shrink-0 truncate text-ink-700 sm:w-36">{humanize(status)}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-brand-50" aria-hidden="true">
                <span className={cn("block h-full rounded-full bg-brand-500")} style={{ width: `${total ? Math.max(4, (count / total) * 100) : 0}%` }} />
              </span>
              <span className="w-8 text-right font-bold tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
