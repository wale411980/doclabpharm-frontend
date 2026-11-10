import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity } from "lucide-react";
import { Card, ErrorState, LoadingState, PageHeader, Pill, formatDate, inputStyles, type PillTone } from "@/components/dashboard/ui";
import { Pagination } from "@/components/dashboard/Pagination";
import { Countdown, EmptyState, FilterChips, Toggle } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira, humanize } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useLiveOperations, type LiveList } from "@/queries/use-admin-console";
import type { AdminAmbulanceRow, AdminConsultRow, AdminDeliveryRow } from "@/types/marketplace";

const TABS: { value: LiveList; label: string }[] = [
  { value: "deliveries", label: "Pharmacy orders" },
  { value: "consults", label: "See a doctor now" },
  { value: "ambulance", label: "Ambulance trips" },
];

const STATUSES: Record<LiveList, string[]> = {
  deliveries: ["awaiting_pharmacy", "accepted", "out_for_delivery", "ready_for_pickup", "delivered", "declined", "expired", "cancelled"],
  consults: ["waiting", "in_progress", "completed", "declined", "expired", "cancelled"],
  ambulance: ["searching", "assigned", "arrived", "transporting", "completed", "no_vehicle", "cancelled"],
};

const TONE: Record<string, PillTone> = {
  awaiting_pharmacy: "warm",
  waiting: "warm",
  searching: "warm",
  accepted: "blue",
  out_for_delivery: "blue",
  in_progress: "blue",
  assigned: "blue",
  arrived: "blue",
  transporting: "blue",
  ready_for_pickup: "brand",
  delivered: "brand",
  completed: "brand",
  declined: "red",
  expired: "red",
  no_vehicle: "red",
  cancelled: "neutral",
};

/** Live lists of pharmacy orders, instant consultations and ambulance trips across the marketplace. */
export default function LiveOperations() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.value === params.get("tab"))?.value ?? "deliveries") as LiveList;
  const status = params.get("status") ?? "";
  const unpaid = params.get("unpaid") === "1";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const { data, isLoading, isError, error, refetch, isFetching } = useLiveOperations(tab, { status, unpaid, page });

  useEffect(() => {
    document.title = "Live operations | DocLabPharm";
  }, []);

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader title="Live operations" intro="Newest first. These lists refresh every 30 seconds." />
      <Card className="flex flex-col gap-4 p-4">
        <FilterChips label="List" value={tab} options={TABS} onChange={(value) => update({ tab: value, status: undefined, unpaid: undefined })} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5 sm:w-64">
            <label htmlFor="live-status" className="text-sm font-bold text-ink-700">
              Status
            </label>
            <select id="live-status" className={inputStyles} value={status} onChange={(e) => update({ status: e.target.value || undefined })}>
              <option value="">Any status</option>
              {STATUSES[tab].map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </select>
          </div>
          {tab === "ambulance" && (
            <div className="sm:max-w-xs">
              <Toggle id="unpaid-only" checked={unpaid} onChange={(next) => update({ unpaid: next ? "1" : undefined })} label="Unpaid fares only" description="Completed trips the patient has not paid." />
            </div>
          )}
        </div>
      </Card>

      {isLoading && <LoadingState label="Loading" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load this list.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState icon={Activity} title="Nothing here">
          No {TABS.find((t) => t.value === tab)?.label.toLowerCase()} match.
        </EmptyState>
      )}
      {data && data.data.length > 0 && (
        <div className={cn("flex flex-col gap-4", isFetching && "opacity-70")}>
          <ul className="flex flex-col gap-2">
            {tab === "deliveries" && (data.data as AdminDeliveryRow[]).map((row) => <DeliveryRow key={row.id} row={row} />)}
            {tab === "consults" && (data.data as AdminConsultRow[]).map((row) => <ConsultRow key={row.id} row={row} />)}
            {tab === "ambulance" && (data.data as AdminAmbulanceRow[]).map((row) => <AmbulanceRow key={row.id} row={row} />)}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={(next) => update({ page: String(next) })} />
        </div>
      )}
    </div>
  );
}

function Row({ title, detail, status, extra }: { title: React.ReactNode; detail: React.ReactNode; status: string; extra?: React.ReactNode }) {
  return (
    <li className="grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-brand-100 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <p className="break-words font-bold text-ink-900">{title}</p>
        <p className="break-words text-sm text-ink-500">{detail}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Pill tone={TONE[status] ?? "neutral"}>{humanize(status)}</Pill>
        {extra}
      </div>
    </li>
  );
}

function DeliveryRow({ row }: { row: AdminDeliveryRow }) {
  return (
    <Row
      title={`#${row.id} · ${row.pharmacy ?? "Pharmacy"} → ${row.patient ?? "Patient"}`}
      detail={`Order #${row.orderId} · ${row.method === "pickup" ? "Pickup" : `Delivery${row.distanceKm ? ` ${row.distanceKm} km` : ""}${row.city ? `, ${row.city}` : ""}`} · ${formatDate(row.createdAt, true)}${Number(row.fee) > 0 ? ` · Fee ${formatNaira(row.fee)}` : ""}`}
      status={row.status}
      extra={row.status === "awaiting_pharmacy" ? <Countdown until={row.acceptBy} expiredLabel="Overdue" /> : undefined}
    />
  );
}

function ConsultRow({ row }: { row: AdminConsultRow }) {
  return (
    <Row
      title={`#${row.id} · ${row.patient ?? "Patient"} → ${row.doctor ?? "Doctor"}`}
      detail={`Order #${row.orderId} · Requested ${formatDate(row.createdAt, true)}${row.acceptedAt ? ` · Accepted ${formatDate(row.acceptedAt, true)}` : ""}`}
      status={row.status}
      extra={row.status === "waiting" ? <Countdown until={row.acceptBy} expiredLabel="Overdue" /> : undefined}
    />
  );
}

function AmbulanceRow({ row }: { row: AdminAmbulanceRow }) {
  return (
    <Row
      title={`#${row.id} · ${row.patient ?? "Patient"}${row.operator ? ` · ${row.operator}` : ""}`}
      detail={`${row.emergency ? "Emergency · " : ""}${row.pickupAddress}${row.destinationName ? ` → ${row.destinationName}` : ""} · ${formatDate(row.createdAt, true)}`}
      status={row.status}
      extra={
        <>
          {row.status === "completed" && row.paymentStatus && (
            <Pill tone={row.paymentStatus === "unpaid" ? "red" : "brand"}>{row.paymentStatus === "unpaid" ? "Unpaid" : humanize(row.paymentStatus)}</Pill>
          )}
          {(row.finalFare ?? row.estimatedFare) != null && <span className="font-extrabold tabular-nums">{formatNaira(row.finalFare ?? row.estimatedFare)}</span>}
        </>
      }
    />
  );
}
