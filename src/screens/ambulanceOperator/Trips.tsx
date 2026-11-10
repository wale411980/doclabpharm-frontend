import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Ambulance } from "lucide-react";
import { ErrorState, LoadingState, PageHeader, Pill } from "@/components/dashboard/ui";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState, FilterChips } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useOperatorTrips } from "@/queries/use-ambulance";
import { AMBULANCE_STATUS } from "@/screens/patient/AmbulanceRequest";

const FILTERS = [
  { value: "", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "assigned", label: "On the way" },
  { value: "transporting", label: "Transporting" },
  { value: "cancelled", label: "Cancelled" },
];

/** Every trip the operator's crews have taken. */
export default function Trips() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const { data, isLoading, isError, error, refetch, isFetching } = useOperatorTrips(status, page);

  useEffect(() => {
    document.title = "Trips | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader title="Trips" intro="Your trip history, with fares and whether the patient has paid." />
      <FilterChips label="Filter trips" value={status} options={FILTERS} onChange={(value) => setParams(value ? { status: value } : {})} />
      {isLoading && <LoadingState label="Loading trips" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your trips.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState icon={Ambulance} title="No trips here">
          Trips you accept appear here.
        </EmptyState>
      )}
      {data && data.data.length > 0 && (
        <div className={cn("flex flex-col gap-4", isFetching && "opacity-70")}>
          <ul className="flex flex-col gap-3">
            {data.data.map((trip) => (
              <li key={trip.id} className="grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-brand-100 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
                <div className="min-w-0">
                  <p className="font-bold text-ink-900">
                    Trip #{trip.id} · {trip.patientName ?? "Patient"}
                  </p>
                  <p className="break-words text-sm text-ink-500">
                    {trip.pickupAddress}
                    {trip.destinationName ? ` → ${trip.destinationName}` : ""}
                    {trip.vehicle ? ` · ${trip.vehicle.plateNumber}` : ""}
                    {trip.tripKm ? ` · ${trip.tripKm} km` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Pill tone={AMBULANCE_STATUS[trip.status]?.tone ?? "neutral"}>{AMBULANCE_STATUS[trip.status]?.label ?? trip.status}</Pill>
                  {trip.status === "completed" && (
                    <Pill tone={trip.paymentStatus === "unpaid" ? "red" : "brand"}>{trip.paymentStatus === "unpaid" ? "Not paid yet" : "Paid"}</Pill>
                  )}
                  {(trip.finalFare ?? trip.estimatedFare) != null && (
                    <span className="font-extrabold tabular-nums text-ink-900">{formatNaira(trip.finalFare ?? trip.estimatedFare)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={(next) => setParams({ ...(status ? { status } : {}), page: String(next) })} />
        </div>
      )}
    </div>
  );
}
