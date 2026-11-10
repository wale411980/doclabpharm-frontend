import { useEffect, useState } from "react";
import { Banknote } from "lucide-react";
import { Card, ErrorState, Field, LoadingState, PageHeader, Pill, formatDate, inputStyles } from "@/components/dashboard/ui";
import { EmptyState, StatTile } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { defaultPeriod, formatNaira } from "@/lib/marketplace";
import type { ProviderRole } from "@/lib/providerTypes";
import { useProviderEarnings } from "@/queries/use-admin-console";

export const SERVICE_LABEL: Record<string, string> = {
  med: "Medicines",
  delivery: "Delivery fees",
  consult: "Consultations",
  lab: "Lab tests",
  home_collection: "Home sample collection",
  ambulance: "Ambulance trips",
};

/** A provider's earnings: what patients paid, DocLabPharm's commission and their share. */
export default function EarningsPage({ role }: { role: ProviderRole }) {
  const [period, setPeriod] = useState(defaultPeriod);
  const { data, isLoading, isError, error, refetch, isFetching } = useProviderEarnings(role, period);

  useEffect(() => {
    document.title = "Earnings | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Earnings"
        intro="What patients paid you, the DocLabPharm commission, and your share. With a bank account saved, your share is paid straight to your bank when the patient pays by card."
      />
      <Card className="grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="From" id="earnings-from">
          <input id="earnings-from" type="date" className={inputStyles} value={period.from} max={period.to} onChange={(e) => e.target.value && setPeriod((p) => ({ ...p, from: e.target.value }))} />
        </Field>
        <Field label="To" id="earnings-to">
          <input id="earnings-to" type="date" className={inputStyles} value={period.to} min={period.from} onChange={(e) => e.target.value && setPeriod((p) => ({ ...p, to: e.target.value }))} />
        </Field>
        {isFetching && !isLoading && <p className="pb-3 text-sm text-ink-500">Updating…</p>}
      </Card>

      {isLoading && <LoadingState label="Loading your earnings" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your earnings.")} onRetry={() => refetch()} />}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Your earnings" value={formatNaira(data.earned)} tone="brand" hint={`${data.items} paid ${data.items === 1 ? "item" : "items"}`} />
            <StatTile label="Patients paid" value={formatNaira(data.gross)} />
            <StatTile
              label="DocLabPharm commission"
              value={formatNaira(data.commission)}
              hint={data.commissionPercent != null ? `Your rate: ${data.commissionPercent}%` : "Standard rate"}
            />
            <StatTile
              label="You owe back"
              value={formatNaira(data.owedBack)}
              tone={data.owedBack > 0 ? "warm" : "neutral"}
              hint={data.owedBack > 0 ? "Taken from your next earnings" : "Nothing owed"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Paid to your bank" value={formatNaira(data.paidToBank)} hint="Card payments, split by Paystack" />
            <StatTile label="Paid to your wallet" value={formatNaira(data.paidToWallet)} hint="Wallet payments" />
          </div>

          <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
            <h2 id="recent-heading" className="text-lg font-extrabold text-ink-900">
              Latest payments
            </h2>
            {data.recent.length === 0 ? (
              <EmptyState icon={Banknote} title="No payments in this period">
                Paid orders will show here.
              </EmptyState>
            ) : (
              <ul className="flex flex-col gap-2">
                {data.recent.map((line) => (
                  <li key={line.id} className="grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-brand-100 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="font-bold text-ink-900">
                        {SERVICE_LABEL[line.serviceType] ?? line.serviceType} · {line.orderTrx}
                      </p>
                      <p className="text-sm text-ink-500">
                        {formatDate(line.createdAt, true)} · Paid {formatNaira(line.price)} · Commission {formatNaira(line.adminCommission)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <Pill tone={line.payoutMethod === "split" ? "blue" : "neutral"}>{line.payoutMethod === "split" ? "To bank" : "To wallet"}</Pill>
                      <span className="text-lg font-extrabold text-ink-900 tabular-nums">{formatNaira(line.providerAmount)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
