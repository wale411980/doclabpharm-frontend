import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Bike, CheckCircle2, FileWarning, MapPin, Package, Phone, Settings2, Store, XCircle } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, Pill, buttonStyles, formatDate, inputStyles, type PillTone } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Pagination } from "@/components/dashboard/Pagination";
import { Countdown, EmptyState, FilterChips } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { usePharmacyDeliveries, usePharmacyDeliveryAction, type PharmacyDeliveryAction } from "@/queries/use-deliveries";
import type { DeliveryStatus, PharmacyDelivery } from "@/types/marketplace";

const STATUS: Record<DeliveryStatus, { label: string; tone: PillTone }> = {
  awaiting_pharmacy: { label: "New: accept or decline", tone: "warm" },
  accepted: { label: "Accepted: prepare it", tone: "blue" },
  out_for_delivery: { label: "Out for delivery", tone: "blue" },
  ready_for_pickup: { label: "Waiting for pickup", tone: "brand" },
  delivered: { label: "Handed over", tone: "brand" },
  declined: { label: "Declined", tone: "neutral" },
  expired: { label: "Missed: not accepted in time", tone: "red" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "awaiting_pharmacy", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "ready_for_pickup", label: "Ready for pickup" },
  { value: "delivered", label: "Handed over" },
];

/** The pharmacy's order queue: accept, send out (or get ready for pickup), hand over, or decline. */
export default function PharmacyDeliveries() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const { data, isLoading, isError, error, refetch, isFetching } = usePharmacyDeliveries(status, page);

  useEffect(() => {
    document.title = "Order queue | DocLabPharm";
  }, []);

  const set = (next: Record<string, string>) => setParams(new URLSearchParams(next));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Order queue"
        intro="New orders must be accepted before the timer runs out, or the patient is refunded and it counts as a missed order."
        actions={
          <Link to="/pharmacy/delivery-settings" className={buttonStyles("secondary")}>
            <Settings2 className="h-4 w-4" aria-hidden="true" />
            Delivery settings
          </Link>
        }
      />
      <Card className="p-4">
        <FilterChips label="Filter orders" value={status} options={FILTERS} onChange={(value) => set(value ? { status: value } : {})} />
      </Card>
      {isLoading && <LoadingState label="Loading orders" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your orders.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState icon={Package} title={status ? "No orders here" : "No orders yet"}>
          New orders appear here by themselves, and we also tell you by email and in the app.
        </EmptyState>
      )}
      {data && data.data.length > 0 && (
        <div className={cn("flex flex-col gap-4 transition-opacity", isFetching && "opacity-70")}>
          <ul className="flex flex-col gap-4">
            {data.data.map((delivery) => (
              <OrderCard key={delivery.id} delivery={delivery} />
            ))}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={(next) => set({ ...(status ? { status } : {}), page: String(next) })} />
        </div>
      )}
    </div>
  );
}

type Dialog = null | "dispatch" | "complete" | "decline";

function OrderCard({ delivery }: { delivery: PharmacyDelivery }) {
  const act = usePharmacyDeliveryAction();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [riderName, setRiderName] = useState(delivery.riderName ?? "");
  const [riderPhone, setRiderPhone] = useState(delivery.riderPhone ?? "");
  const [code, setCode] = useState("");
  const [prescriptionChecked, setPrescriptionChecked] = useState(false);
  const [reason, setReason] = useState("");
  const [dialogError, setDialogError] = useState("");

  const status = STATUS[delivery.status] ?? { label: delivery.status, tone: "neutral" as PillTone };
  const isPickup = delivery.method === "pickup";
  const medicines = delivery.items.filter((item) => item.type === "med");
  const medTotal = medicines.reduce((sum, item) => sum + Number(item.price), 0);

  const openDialog = (next: Dialog) => {
    setDialogError("");
    setDialog(next);
  };

  const run = async (input: PharmacyDeliveryAction) => {
    setDialogError("");
    try {
      const result = await act.mutateAsync(input);
      toast.success(result.message);
      setDialog(null);
    } catch (e) {
      const message = apiErrorMessage(e, "That did not work. Please try again.");
      if (dialog) setDialogError(message);
      else toast.error(message);
    }
  };

  return (
    <li>
      <Card className={cn("flex flex-col gap-4", delivery.status === "awaiting_pharmacy" && "ring-2 ring-warm-300")}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink-900">
              Order #{delivery.orderId}
              <span className="ml-2 inline-flex items-center gap-1 align-middle text-sm font-bold text-ink-500">
                {isPickup ? <Store className="h-4 w-4" aria-hidden="true" /> : <Bike className="h-4 w-4" aria-hidden="true" />}
                {isPickup ? "Pickup" : `Delivery${delivery.distanceKm ? ` · ${delivery.distanceKm} km` : ""}`}
              </span>
            </h2>
            <p className="text-sm text-ink-500">
              {delivery.area ? `${delivery.area} · ` : ""}Medicines {formatNaira(medTotal)}
              {Number(delivery.fee) > 0 ? ` · Delivery fee ${formatNaira(delivery.fee)}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={status.tone}>{status.label}</Pill>
            {delivery.status === "awaiting_pharmacy" && <Countdown until={delivery.acceptBy} expiredLabel="Time is up" />}
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-brand-100 rounded-2xl bg-sand px-4">
          {medicines.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-3 py-2.5">
              <span className="min-w-0 text-ink-900">
                <span className="font-bold">{item.quantity} ×</span> {item.name}
                {item.volume ? <span className="text-ink-500"> ({item.volume})</span> : null}
              </span>
              <span className="shrink-0 tabular-nums text-ink-700">{formatNaira(item.price)}</span>
            </li>
          ))}
        </ul>

        {delivery.requiresPrescription && (
          <p className="flex items-start gap-2 rounded-2xl bg-warm-50 p-3 text-sm font-bold text-warm-900">
            <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Prescription-only medicines: check a valid prescription before handing over.
            {delivery.prescriptionId ? ` The patient attached prescription #${delivery.prescriptionId}.` : ""}
          </p>
        )}
        {delivery.note && <p className="text-sm text-ink-700">Patient's note: “{delivery.note}”</p>}

        {delivery.patient ? (
          <div className="grid gap-3 rounded-2xl bg-brand-50 p-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="font-bold text-ink-900">{delivery.patient.name}</p>
              {delivery.patient.phone && (
                <a href={`tel:${delivery.patient.phone}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-brand-700">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {delivery.patient.phone}
                </a>
              )}
            </div>
            {!isPickup && delivery.patient.addressLine && (
              <div className="min-w-0 text-sm text-ink-700">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {delivery.patient.addressLine}
                    {delivery.patient.landmark ? ` (near ${delivery.patient.landmark})` : ""}
                  </span>
                </p>
                {delivery.patient.latitude != null && delivery.patient.longitude != null && (
                  <a
                    className="font-bold text-brand-700 underline"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${delivery.patient.latitude},${delivery.patient.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>
            )}
          </div>
        ) : (
          delivery.status === "awaiting_pharmacy" && <p className="text-sm text-ink-500">The patient's name, phone and address show once you accept.</p>
        )}

        {delivery.riderName && delivery.status === "out_for_delivery" && (
          <p className="text-sm text-ink-700">
            Rider: <span className="font-bold">{delivery.riderName}</span> {delivery.riderPhone ? `(${delivery.riderPhone})` : ""} · sent {formatDate(delivery.dispatchedAt, true)}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {delivery.status === "awaiting_pharmacy" && (
            <>
              <Button onClick={() => run({ action: "accept", id: delivery.id })} loading={act.isPending && !dialog}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Accept order
              </Button>
              <Button variant="secondary" onClick={() => openDialog("decline")}>
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Decline
              </Button>
            </>
          )}
          {delivery.status === "accepted" &&
            (isPickup ? (
              <Button onClick={() => run({ action: "dispatch", id: delivery.id })} loading={act.isPending && !dialog}>
                <Store className="h-4 w-4" aria-hidden="true" />
                Ready for pickup
              </Button>
            ) : (
              <Button onClick={() => openDialog("dispatch")}>
                <Bike className="h-4 w-4" aria-hidden="true" />
                Send out with rider
              </Button>
            ))}
          {(delivery.status === "out_for_delivery" || delivery.status === "ready_for_pickup") && (
            <Button onClick={() => openDialog("complete")}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Hand over
            </Button>
          )}
          {delivery.status === "accepted" && (
            <Button variant="ghost" onClick={() => openDialog("decline")}>
              Cannot fill it
            </Button>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={dialog === "dispatch"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Send out with a rider"
        description="The patient gets the rider's name and phone number."
        confirmLabel="Send out"
        loading={act.isPending}
        onConfirm={() => run({ action: "dispatch", id: delivery.id, riderName: riderName.trim(), riderPhone: riderPhone.trim() })}
      >
        <Field label="Rider's name" id={`rider-name-${delivery.id}`}>
          <input id={`rider-name-${delivery.id}`} className={inputStyles} value={riderName} onChange={(e) => setRiderName(e.target.value)} maxLength={100} required />
        </Field>
        <Field label="Rider's phone" id={`rider-phone-${delivery.id}`}>
          <input id={`rider-phone-${delivery.id}`} type="tel" inputMode="tel" className={inputStyles} value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} maxLength={20} required />
        </Field>
        {dialogError && <p role="alert" className="font-bold text-red-700">{dialogError}</p>}
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === "complete"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Hand over the order"
        description="Ask the patient for the 4-digit code in their DocLabPharm app. Only hand over when the code matches."
        confirmLabel="Confirm handover"
        loading={act.isPending}
        onConfirm={() => run({ action: "complete", id: delivery.id, handoverCode: code.trim(), prescriptionChecked })}
      >
        <Field label="Patient's handover code" id={`code-${delivery.id}`}>
          <input
            id={`code-${delivery.id}`}
            className={cn(inputStyles, "text-center font-mono text-2xl tracking-[0.4em]")}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={4}
          />
        </Field>
        {delivery.requiresPrescription && (
          <label className="flex items-start gap-3 rounded-2xl bg-warm-50 p-3 font-bold text-warm-900">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-brand-600" checked={prescriptionChecked} onChange={(e) => setPrescriptionChecked(e.target.checked)} required />
            I have seen a valid prescription for the prescription-only medicines.
          </label>
        )}
        {dialogError && <p role="alert" className="font-bold text-red-700">{dialogError}</p>}
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === "decline"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Decline this order?"
        description="The patient is refunded in full and the stock goes back on your shelf."
        confirmLabel="Decline order"
        variant="danger"
        loading={act.isPending}
        onConfirm={() => run({ action: "decline", id: delivery.id, reason: reason.trim() })}
      >
        <Field label="Reason (the patient sees this)" id={`reason-${delivery.id}`}>
          <input id={`reason-${delivery.id}`} className={inputStyles} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={255} required placeholder="Out of stock" />
        </Field>
        {dialogError && <p role="alert" className="font-bold text-red-700">{dialogError}</p>}
      </ConfirmDialog>
    </li>
  );
}
