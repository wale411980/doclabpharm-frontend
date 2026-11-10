import { useEffect, useState } from "react";
import { Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { StatTile } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { defaultPeriod, formatNaira, humanize, snakeKeys } from "@/lib/marketplace";
import { useCommissionReport } from "@/queries/use-admin-console";
import { SERVICE_LABEL } from "@/screens/shared/EarningsPage";

/** Walex Biz's commission by service and by payment method. */
export default function CommissionReport() {
  const [period, setPeriod] = useState(defaultPeriod);
  const { data, isLoading, isError, error, refetch, isFetching } = useCommissionReport(period);

  useEffect(() => {
    document.title = "Commission | DocLabPharm";
  }, []);

  const byService = snakeKeys(data?.byService);
  const byMethod = snakeKeys(data?.byPaymentMethod);
  const rate = data && data.gross > 0 ? ((data.commission / data.gross) * 100).toFixed(1) : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader title="Commission" intro="What Walex Biz earned from DocLabPharm orders, by service and by how patients paid. Cancelled and refunded items are left out." />
      <Card className="grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="From" id="commission-from">
          <input id="commission-from" type="date" className={inputStyles} value={period.from} max={period.to} onChange={(e) => e.target.value && setPeriod((p) => ({ ...p, from: e.target.value }))} />
        </Field>
        <Field label="To" id="commission-to">
          <input id="commission-to" type="date" className={inputStyles} value={period.to} min={period.from} onChange={(e) => e.target.value && setPeriod((p) => ({ ...p, to: e.target.value }))} />
        </Field>
        {isFetching && !isLoading && <p className="pb-3 text-sm text-ink-500">Updating…</p>}
      </Card>
      {isLoading && <LoadingState label="Loading the report" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load the report.")} onRetry={() => refetch()} />}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Commission" value={formatNaira(data.commission)} tone="brand" hint={rate ? `${rate}% of what patients paid` : undefined} />
            <StatTile label="Patients paid" value={formatNaira(data.gross)} />
            <StatTile label="Owed back by providers" value={formatNaira(data.owedByProviders)} tone={data.owedByProviders ? "warm" : "neutral"} hint="Taken from their next earnings" />
            <StatTile label="Card vs wallet" value={`${formatNaira(byMethod.card ?? 0)} / ${formatNaira(byMethod.wallet ?? 0)}`} hint="Commission by payment method" />
          </div>
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[28rem] text-left">
              <caption className="sr-only">Commission by service</caption>
              <thead className="bg-brand-50 text-sm text-ink-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Service</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Items</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Patients paid</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {Object.keys({ ...SERVICE_LABEL, ...byService }).map((type) => (
                  <tr key={type}>
                    <th scope="row" className="px-4 py-3 font-bold text-ink-900">{SERVICE_LABEL[type] ?? humanize(type)}</th>
                    <td className="px-4 py-3 text-right tabular-nums">{byService[type]?.items ?? 0}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatNaira(byService[type]?.gross ?? 0)}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">{formatNaira(byService[type]?.commission ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-sand">
                <tr>
                  <th scope="row" className="px-4 py-3 font-extrabold">Total</th>
                  <td />
                  <td className="px-4 py-3 text-right font-bold tabular-nums">{formatNaira(data.gross)}</td>
                  <td className="px-4 py-3 text-right font-extrabold tabular-nums">{formatNaira(data.commission)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>
          {Object.keys(byMethod).length > 0 && (
            <Card className="flex flex-col gap-2">
              <h2 className="font-extrabold text-ink-900">By payment method</h2>
              <ul className="flex flex-col gap-1">
                {Object.entries(byMethod).map(([method, amount]) => (
                  <li key={method} className="flex justify-between gap-3">
                    <span className="text-ink-700">{method === "card" ? "Card (Paystack)" : method === "wallet" ? "Wallet" : humanize(method)}</span>
                    <span className="font-bold tabular-nums">{formatNaira(amount)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <p className="text-sm text-ink-500">To give one provider a different rate, open their account from the support scorecard or their verification file.</p>
        </>
      )}
    </div>
  );
}
