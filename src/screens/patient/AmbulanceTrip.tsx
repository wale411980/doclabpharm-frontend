import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Ambulance, CheckCircle2, Phone, Siren, Wallet } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, Pill, buttonStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Detail, EmergencyCallLink, InlineError, Timeline } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { useAmbulanceRideAction, usePatientAmbulanceRequest } from "@/queries/use-ambulance";
import { AMBULANCE_STATUS } from "./AmbulanceRequest";

const VEHICLE_LABEL = { basic: "Basic life support", advanced: "Advanced life support", transport: "Patient transport" } as const;

/** Live status of an ambulance request, refreshed every 5 seconds. */
export default function AmbulanceTrip() {
  const id = Number(useParams().id);
  const { data: ride, isLoading, isError, error, refetch } = usePatientAmbulanceRequest(id);
  const action = useAmbulanceRideAction(id);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    document.title = "Your ambulance | DocLabPharm";
  }, []);

  const cancel = async () => {
    try {
      await action.mutateAsync({ action: "cancel" });
      toast.success("Your request has been cancelled.");
      setConfirmCancel(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not cancel this request."));
      setConfirmCancel(false);
    }
  };

  const pay = async () => {
    setPayError("");
    try {
      await action.mutateAsync({ action: "pay" });
      toast.success("Thank you. The fare has been paid.");
    } catch (e) {
      setPayError(apiErrorMessage(e, "We could not take the fare from your wallet."));
    }
  };

  const steps = [
    { key: "searching", label: "Finding the nearest ambulance" },
    { key: "assigned", label: "Ambulance on the way to you" },
    { key: "arrived", label: "Ambulance has arrived" },
    { key: "transporting", label: "On the way to hospital" },
    { key: "completed", label: "Trip completed" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-1 py-2 sm:py-4">
      <EmergencyCallLink />
      {isLoading && <LoadingState label="Loading your request" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load this request.")} onRetry={() => refetch()} />}
      {ride && (
        <>
          <Card className="flex flex-col gap-5">
            <div className="flex flex-col gap-2" role="status" aria-live="polite">
              <Pill tone={AMBULANCE_STATUS[ride.status]?.tone ?? "neutral"}>{AMBULANCE_STATUS[ride.status]?.label ?? ride.status}</Pill>
              <h1 className="text-2xl font-extrabold text-ink-900">
                {ride.status === "searching" && "We are finding an ambulance"}
                {ride.status === "assigned" &&
                  (ride.vehicle?.etaMinutes != null ? `Arriving in about ${ride.vehicle.etaMinutes} min` : "An ambulance is on the way")}
                {ride.status === "arrived" && "Your ambulance is here"}
                {ride.status === "transporting" && "On the way to hospital"}
                {ride.status === "completed" && "Trip completed"}
                {ride.status === "no_vehicle" && "No ambulance is free right now"}
                {ride.status === "cancelled" && "Request cancelled"}
              </h1>
              {ride.status === "searching" && (
                <p className="flex items-center gap-2 text-ink-700">
                  <Siren className="h-5 w-5 animate-pulse text-red-700" aria-hidden="true" />
                  We ask the nearest free ambulance first. This page updates by itself.
                </p>
              )}
              {ride.status === "no_vehicle" && (
                <p className="font-bold text-red-800">Please call {ride.emergencyNumber || "112"} now for emergency help.</p>
              )}
            </div>

            {ride.status === "no_vehicle" && (
              <a href={`tel:${ride.emergencyNumber || "112"}`} className={buttonStyles("danger", "min-h-14 text-lg")}>
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {ride.emergencyNumber || "112"}
              </a>
            )}

            {ride.vehicle && ride.operator && (
              <div className="flex flex-col gap-4 rounded-3xl bg-sky-50 p-4 text-sky-950 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-800">
                    <Ambulance className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-extrabold">{ride.operator.name}</p>
                    <p className="text-sm">
                      {VEHICLE_LABEL[ride.vehicle.type] ?? ride.vehicle.type}
                      {ride.vehicle.hasParamedic ? " · Paramedic on board" : ""}
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3">
                  <Detail label="Plate number">{ride.vehicle.plateNumber}</Detail>
                  <Detail label="Driver">{ride.vehicle.driverName}</Detail>
                </dl>
                <a href={`tel:${ride.vehicle.driverPhone}`} className={buttonStyles("primary")}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call the driver ({ride.vehicle.driverPhone})
                </a>
              </div>
            )}

            {ride.status !== "no_vehicle" && ride.status !== "cancelled" && (
              <Timeline steps={steps} current={ride.status} finished={ride.status === "completed"} />
            )}

            <dl className="grid gap-3 sm:grid-cols-2">
              <Detail label="Pickup">{ride.pickupAddress}</Detail>
              {ride.destinationName && <Detail label="Going to">{ride.destinationName}</Detail>}
              {ride.status !== "completed" && ride.estimatedFare != null && (
                <Detail label="Estimated fare">{formatNaira(ride.estimatedFare)}</Detail>
              )}
            </dl>

            {ride.status === "completed" && (
              <div className="flex flex-col gap-3 rounded-3xl bg-brand-50 p-5">
                <p className="flex items-center gap-2 font-bold text-brand-800">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  Fare: {formatNaira(ride.finalFare ?? ride.estimatedFare)}
                </p>
                {ride.paymentStatus === "paid" && <p className="text-ink-700">Paid from your wallet. We hope you are feeling better.</p>}
                {ride.paymentStatus === "waived" && <p className="text-ink-700">There is nothing to pay for this trip.</p>}
                {ride.paymentStatus === "unpaid" && (
                  <>
                    <p className="text-ink-700">Your wallet did not have enough at the end of the trip. Please pay the fare now.</p>
                    <InlineError>{payError}</InlineError>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button onClick={pay} loading={action.isPending}>
                        <Wallet className="h-4 w-4" aria-hidden="true" />
                        Pay {formatNaira(ride.finalFare)} from wallet
                      </Button>
                      <Link to="/user/wallet" className={buttonStyles("secondary")}>
                        Top up wallet
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {(ride.status === "searching" || ride.status === "assigned") && (
              <div className="flex flex-col gap-1">
                <Button variant="secondary" onClick={() => setConfirmCancel(true)}>
                  Cancel request
                </Button>
                <p className="text-center text-sm text-ink-500">Free of charge until the ambulance arrives.</p>
              </div>
            )}

            {(ride.status === "no_vehicle" || ride.status === "cancelled") && (
              <Link to="/user/ambulance" className={buttonStyles("secondary")}>
                Make a new request
              </Link>
            )}
          </Card>
        </>
      )}
      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel the ambulance?"
        description="Only cancel if you no longer need it. There is no charge before the ambulance arrives."
        confirmLabel="Yes, cancel"
        variant="danger"
        loading={action.isPending}
        onConfirm={cancel}
      />
    </div>
  );
}
