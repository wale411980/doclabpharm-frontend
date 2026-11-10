import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Ambulance, CheckCircle2, MapPin, Navigation, Phone, Siren } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, Pill, buttonStyles, inputStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Countdown, Detail, EmptyState, Timeline } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { useOperatorOffers, useOperatorTrips, useTripAction, type TripAction } from "@/queries/use-ambulance";
import type { AmbulanceOffer, AmbulanceTrip } from "@/types/marketplace";
import { useFleetLocation } from "./FleetLocation";

const mapsLink = (lat: number | null, lng: number | null) =>
  lat != null && lng != null ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null;

/** Live dispatch: answer requests within 60 seconds and move active trips along. */
export default function Dispatch() {
  const offers = useOperatorOffers();
  const assigned = useOperatorTrips("assigned", 1, true);
  const arrived = useOperatorTrips("arrived", 1, true);
  const transporting = useOperatorTrips("transporting", 1, true);
  const { sharing } = useFleetLocation();

  useEffect(() => {
    document.title = "Dispatch | DocLabPharm";
  }, []);

  const active = [...(transporting.data?.data ?? []), ...(arrived.data?.data ?? []), ...(assigned.data?.data ?? [])];
  const offerList = offers.data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader title="Dispatch" intro="Requests for your vehicles appear here. Each one waits 60 seconds, then goes to the next nearest ambulance." />

      {sharing.length === 0 && (
        <div className="flex flex-col gap-3 rounded-3xl bg-warm-50 p-4 text-warm-900 ring-1 ring-warm-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold">No vehicle is switched on from this device, so you will not get new requests.</p>
          <Link to="/ambulance_operator/vehicles" className={buttonStyles("secondary", "shrink-0")}>
            Switch on a vehicle
          </Link>
        </div>
      )}

      <section aria-labelledby="offers-heading" className="flex flex-col gap-3">
        <h2 id="offers-heading" className="text-lg font-extrabold text-ink-900">
          New requests
        </h2>
        {offers.isLoading && <LoadingState label="Checking for requests" />}
        {offers.isError && <ErrorState message={apiErrorMessage(offers.error, "We could not load requests.")} onRetry={() => offers.refetch()} />}
        {offers.data && offerList.length === 0 && (
          <p className="rounded-3xl bg-white p-4 text-ink-500 ring-1 ring-brand-100">No requests right now. This page checks every few seconds.</p>
        )}
        <ul className="flex flex-col gap-3">
          {offerList.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="active-heading" className="flex flex-col gap-3">
        <h2 id="active-heading" className="text-lg font-extrabold text-ink-900">
          Active trips
        </h2>
        {active.length === 0 ? (
          <EmptyState icon={Ambulance} title="No active trip">
            Accepted requests show here with the patient's exact pickup and phone number.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {active.map((trip) => (
              <ActiveTrip key={trip.id} trip={trip} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function OfferCard({ offer }: { offer: AmbulanceOffer }) {
  const act = useTripAction();
  const answer = async (action: "accept" | "decline") => {
    try {
      await act.mutateAsync({ action, id: offer.id });
      toast.success(action === "accept" ? "Accepted. Head to the patient now." : "Passed to the next ambulance.");
    } catch (e) {
      toast.error(apiErrorMessage(e, "This request is no longer available."));
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-4 ring-2 ring-red-300">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {offer.emergency ? (
              <Pill tone="red">
                <Siren className="h-3.5 w-3.5" aria-hidden="true" />
                Emergency
              </Pill>
            ) : (
              <Pill tone="neutral">Planned transfer</Pill>
            )}
            {offer.offeredVehicle && <Pill tone="blue">For {offer.offeredVehicle.plateNumber}</Pill>}
          </div>
          <Countdown until={offer.offerExpiresAt} expiredLabel="Passing on…" />
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <Detail label="Pickup area">{offer.pickupAddress}</Detail>
          {offer.destinationName && <Detail label="Going to">{offer.destinationName}</Detail>}
          <Detail label="You are about">{offer.etaMinutes != null ? `${offer.etaMinutes} min away` : "—"}</Detail>
          <Detail label="Estimated fare">
            {formatNaira(offer.estimatedFare)}
            {offer.tripKm ? ` (${offer.tripKm} km)` : ""}
          </Detail>
        </dl>
        {offer.notes && <p className="rounded-2xl bg-sand p-3 text-ink-900">“{offer.notes}”</p>}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => answer("accept")} loading={act.isPending && act.variables?.action === "accept"} disabled={act.isPending} className="min-h-14 text-lg">
            Accept
          </Button>
          <Button variant="secondary" onClick={() => answer("decline")} loading={act.isPending && act.variables?.action === "decline"} disabled={act.isPending} className="min-h-14">
            Decline
          </Button>
        </div>
      </Card>
    </li>
  );
}

function ActiveTrip({ trip }: { trip: AmbulanceTrip }) {
  const act = useTripAction();
  const [completing, setCompleting] = useState(false);
  const [km, setKm] = useState(trip.tripKm ? String(trip.tripKm) : "");
  const pickupMap = mapsLink(trip.pickupLatitude, trip.pickupLongitude);
  const destinationMap = mapsLink(trip.destinationLatitude, trip.destinationLongitude);

  const run = async (input: TripAction, success: string) => {
    try {
      await act.mutateAsync(input);
      toast.success(success);
      setCompleting(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "That did not work. Please try again."));
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-ink-500">
            Trip #{trip.id}
            {trip.vehicle ? ` · ${trip.vehicle.plateNumber}` : ""}
          </p>
          <h3 className="text-xl font-extrabold text-ink-900">{trip.patientName ?? "Patient"}</h3>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="flex items-start gap-2 text-ink-900">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
              <span>
                <span className="block text-sm text-ink-500">Pickup</span>
                <span className="font-bold">{trip.pickupAddress}</span>
              </span>
            </p>
            {trip.destinationName && (
              <p className="flex items-start gap-2 text-ink-900">
                <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                <span>
                  <span className="block text-sm text-ink-500">Going to</span>
                  <span className="font-bold">{trip.destinationName}</span>
                </span>
              </p>
            )}
            {trip.notes && <p className="rounded-2xl bg-sand p-3 text-ink-900">“{trip.notes}”</p>}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {trip.contactPhone && (
                <a href={`tel:${trip.contactPhone}`} className={buttonStyles("secondary")}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {trip.contactPhone}
                </a>
              )}
              {trip.status === "assigned" && pickupMap && (
                <a href={pickupMap} target="_blank" rel="noreferrer" className={buttonStyles("ghost")}>
                  Directions to pickup
                </a>
              )}
              {trip.status === "transporting" && destinationMap && (
                <a href={destinationMap} target="_blank" rel="noreferrer" className={buttonStyles("ghost")}>
                  Directions to hospital
                </a>
              )}
            </div>
          </div>
          <Timeline
            current={trip.status}
            steps={[
              { key: "assigned", label: "Drive to the patient" },
              { key: "arrived", label: "With the patient" },
              { key: "transporting", label: "Taking them to hospital" },
              { key: "completed", label: "Trip completed" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {trip.status === "assigned" && (
            <Button onClick={() => run({ action: "arrived", id: trip.id }, "The patient has been told you have arrived.")} loading={act.isPending} className="min-h-14 text-lg">
              We have arrived
            </Button>
          )}
          {trip.status === "arrived" && (
            <>
              <Button onClick={() => run({ action: "transporting", id: trip.id }, "Trip started.")} loading={act.isPending} className="min-h-14 text-lg">
                Patient on board: leaving now
              </Button>
              <Button variant="secondary" onClick={() => setCompleting(true)}>
                Finish without transport
              </Button>
            </>
          )}
          {trip.status === "transporting" && (
            <Button onClick={() => setCompleting(true)} className="min-h-14 text-lg">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              Complete trip
            </Button>
          )}
        </div>
      </Card>
      <ConfirmDialog
        open={completing}
        onOpenChange={setCompleting}
        title="Complete this trip"
        description="Enter the distance you actually drove with the patient. The fare is taken from the patient's wallet now."
        confirmLabel="Complete trip"
        loading={act.isPending}
        onConfirm={() => run({ action: "complete", id: trip.id, tripKm: km ? Number(km) : undefined }, "Trip completed. Thank you.")}
      >
        <Field label="Distance driven (km)" id={`km-${trip.id}`} hint={trip.tripKm ? `Estimated: ${trip.tripKm} km. Leave as is if that is right.` : "Leave empty to use the estimate."}>
          <input id={`km-${trip.id}`} type="number" min={0} max={500} step={0.1} inputMode="decimal" className={inputStyles} value={km} onChange={(e) => setKm(e.target.value)} />
        </Field>
        {trip.estimatedFare != null && <Detail label="Estimated fare">{formatNaira(trip.estimatedFare)}</Detail>}
      </ConfirmDialog>
    </li>
  );
}
