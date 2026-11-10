import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Bike, KeyRound, Package, Phone, Store } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, PageHeader, Pill, buttonStyles, formatDate, type PillTone } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Pagination } from "@/components/dashboard/Pagination";
import { Countdown, EmptyState, Timeline } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { useCancelPatientDelivery, usePatientDeliveries } from "@/queries/use-deliveries";
import type { DeliveryStatus, PatientDelivery } from "@/types/marketplace";

export const DELIVERY_STATUS: Record<DeliveryStatus, { label: string; tone: PillTone }> = {
  awaiting_pharmacy: { label: "Waiting for pharmacy", tone: "warm" },
  accepted: { label: "Being prepared", tone: "blue" },
  out_for_delivery: { label: "On the way", tone: "blue" },
  ready_for_pickup: { label: "Ready to collect", tone: "brand" },
  delivered: { label: "Delivered", tone: "brand" },
  declined: { label: "Declined, refunded", tone: "red" },
  expired: { label: "No response, refunded", tone: "red" },
  cancelled: { label: "Cancelled, refunded", tone: "neutral" },
};

const OPEN: DeliveryStatus[] = ["awaiting_pharmacy", "accepted", "out_for_delivery", "ready_for_pickup"];

/** The patient's medicine orders, with each one's progress and handover code. */
export default function MyDeliveries() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = usePatientDeliveries(page);

  useEffect(() => {
    document.title = "My orders | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="My orders"
        intro="Follow your medicine orders here. Give the 4-digit code to the rider or pharmacist only when you have your medicines."
        actions={
          <Link to="/user/medicines/near-me" className={buttonStyles("secondary")}>
            Find medicines
          </Link>
        }
      />
      {isLoading && <LoadingState label="Loading your orders" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your orders.")} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState
          icon={Package}
          title="No orders yet"
          action={
            <Link to="/user/medicines/near-me" className={buttonStyles("primary")}>
              Find medicines near me
            </Link>
          }
        >
          When you buy medicines, you can follow them here from the pharmacy to your door.
        </EmptyState>
      )}
      {data && data.data.length > 0 && (
        <>
          <ul className="flex flex-col gap-4">
            {data.data.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </ul>
          <Pagination page={data.currentPage} lastPage={data.lastPage} total={data.total} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function DeliveryCard({ delivery }: { delivery: PatientDelivery }) {
  const [confirming, setConfirming] = useState(false);
  const cancel = useCancelPatientDelivery();
  const status = DELIVERY_STATUS[delivery.status] ?? { label: delivery.status, tone: "neutral" as PillTone };
  const open = OPEN.includes(delivery.status);
  const isPickup = delivery.method === "pickup";
  const medicines = delivery.items.filter((item) => item.type === "med");
  const total = delivery.items.reduce((sum, item) => sum + Number(item.price), 0);

  const steps = [
    { key: "awaiting_pharmacy", label: "Order sent to the pharmacy", hint: delivery.acceptBy ? `They have until ${formatDate(delivery.acceptBy, true)} to accept.` : undefined },
    { key: "accepted", label: "Pharmacy is preparing your order", hint: formatDate(delivery.acceptedAt, true) },
    isPickup
      ? { key: "ready_for_pickup", label: "Ready to collect at the counter", hint: formatDate(delivery.dispatchedAt, true) }
      : { key: "out_for_delivery", label: "On the way to you", hint: formatDate(delivery.dispatchedAt, true) },
    { key: "delivered", label: isPickup ? "Collected" : "Delivered", hint: formatDate(delivery.completedAt, true) },
  ];

  const stopped =
    delivery.status === "declined"
      ? "The pharmacy could not fill this order. Your money is back in your wallet."
      : delivery.status === "expired"
        ? "The pharmacy did not respond in time. Your money is back in your wallet."
        : delivery.status === "cancelled"
          ? "This order was cancelled. Your money is back in your wallet."
          : undefined;

  const handleCancel = async () => {
    try {
      const result = await cancel.mutateAsync(delivery.id);
      toast.success(result.message);
      setConfirming(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not cancel this order."));
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink-900">{delivery.pharmacy?.name ?? "Pharmacy"}</h2>
            <p className="text-sm text-ink-500">
              Order #{delivery.orderId} · {isPickup ? "Pickup" : "Delivery"} · {formatNaira(total)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={status.tone}>{status.label}</Pill>
            {delivery.status === "awaiting_pharmacy" && <Countdown until={delivery.acceptBy} expiredLabel="Checking…" />}
          </div>
        </div>

        {open && delivery.handoverCode && (
          <div className="flex flex-col items-center gap-1 rounded-3xl bg-brand-900 p-5 text-center text-white sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <KeyRound className="h-6 w-6 shrink-0 text-brand-200" aria-hidden="true" />
              <div>
                <p className="font-bold">Your handover code</p>
                <p className="text-sm text-brand-100">Only share it when you have your medicines in hand.</p>
              </div>
            </div>
            <p className="font-mono text-4xl font-extrabold tracking-[0.3em]" aria-label={`Handover code ${delivery.handoverCode.split("").join(" ")}`}>
              {delivery.handoverCode}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Timeline steps={steps} current={delivery.status} stopped={stopped} finished={delivery.status === "delivered"} />
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col divide-y divide-brand-100 rounded-2xl bg-sand px-4">
              {medicines.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-3 py-2.5">
                  <span className="min-w-0 text-ink-700">
                    {item.name} <span className="text-ink-500">× {item.quantity}</span>
                  </span>
                  <span className="font-bold tabular-nums text-ink-900">{formatNaira(item.price)}</span>
                </li>
              ))}
              {Number(delivery.fee) > 0 && (
                <li className="flex items-baseline justify-between gap-3 py-2.5">
                  <span className="text-ink-700">Delivery{delivery.distanceKm ? ` (${delivery.distanceKm} km)` : ""}</span>
                  <span className="font-bold tabular-nums text-ink-900">{formatNaira(delivery.fee)}</span>
                </li>
              )}
            </ul>
            {delivery.requiresPrescription && open && (
              <p className="rounded-2xl bg-warm-50 p-3 text-sm text-warm-900">
                This order has prescription-only medicines. Have your prescription ready to show.
              </p>
            )}
            {delivery.riderName && delivery.status === "out_for_delivery" && (
              <div className="flex flex-col gap-2 rounded-2xl bg-sky-50 p-4 text-sky-900">
                <p className="flex items-center gap-2 font-bold">
                  <Bike className="h-5 w-5" aria-hidden="true" />
                  {delivery.riderName} is bringing your order
                </p>
                {delivery.riderPhone && (
                  <a href={`tel:${delivery.riderPhone}`} className="inline-flex items-center gap-2 font-bold underline">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {delivery.riderPhone}
                  </a>
                )}
              </div>
            )}
            {isPickup && delivery.pharmacy?.address && open && (
              <p className="flex items-start gap-2 text-sm text-ink-700">
                <Store className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Collect at {delivery.pharmacy.address}
              </p>
            )}
            {!isPickup && delivery.addressLine && <p className="text-sm text-ink-500">Delivering to {delivery.addressLine}</p>}
            <div className="flex flex-wrap gap-2">
              {delivery.pharmacy?.phone && open && (
                <a href={`tel:${delivery.pharmacy.phone}`} className={buttonStyles("secondary")}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call pharmacy
                </a>
              )}
              {delivery.status === "awaiting_pharmacy" && (
                <Button variant="danger" onClick={() => setConfirming(true)}>
                  Cancel order
                </Button>
              )}
              {delivery.pharmacy && (
                <Link
                  to={`/user/support/new?providerType=pharmacy&providerId=${delivery.pharmacy.id}&orderId=${delivery.orderId}`}
                  className={buttonStyles("ghost")}
                >
                  Get help with this order
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Cancel this order?"
        description="The pharmacy has not accepted it yet, so you can cancel for free. The full amount goes back to your DocLabPharm wallet."
        confirmLabel="Yes, cancel order"
        variant="danger"
        loading={cancel.isPending}
        onConfirm={handleCancel}
      />
    </li>
  );
}
