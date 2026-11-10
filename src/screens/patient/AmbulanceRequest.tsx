import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ambulance, ChevronRight, LocateFixed, MapPin } from "lucide-react";
import { Button, Card, Field, PageHeader, Pill, formatDate, inputStyles, type PillTone } from "@/components/dashboard/ui";
import { EmergencyCallLink, InlineError, Toggle, textareaStyles } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { ABUJA_AREAS, currentPosition, formatNaira, type Coordinates } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useGetUserProfile } from "@/queries";
import { usePatientAddresses } from "@/queries/use-checkout";
import { usePatientAmbulanceRequests, useRequestAmbulance } from "@/queries/use-ambulance";
import type { AmbulanceStatus, VehicleType } from "@/types/marketplace";

export const AMBULANCE_STATUS: Record<AmbulanceStatus, { label: string; tone: PillTone }> = {
  searching: { label: "Finding an ambulance", tone: "warm" },
  assigned: { label: "Ambulance on the way", tone: "blue" },
  arrived: { label: "Ambulance has arrived", tone: "brand" },
  transporting: { label: "On the way to hospital", tone: "blue" },
  completed: { label: "Trip completed", tone: "brand" },
  no_vehicle: { label: "No ambulance free", tone: "red" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

const ACTIVE: AmbulanceStatus[] = ["searching", "assigned", "arrived", "transporting"];

const VEHICLE_TYPES: { value: "any" | VehicleType; label: string }[] = [
  { value: "any", label: "Any ambulance (fastest)" },
  { value: "basic", label: "Basic life support" },
  { value: "advanced", label: "Advanced life support (with paramedic)" },
  { value: "transport", label: "Patient transport (not an emergency)" },
];

/** Request an ambulance like a ride; the nearest free one is asked first. */
export default function AmbulanceRequest() {
  const navigate = useNavigate();
  const request = useRequestAmbulance();
  const { data: history } = usePatientAmbulanceRequests();
  const { data: addresses } = usePatientAddresses();
  const { data: profile } = useGetUserProfile();

  const [position, setPosition] = useState<Coordinates | null>(null);
  const [positionSource, setPositionSource] = useState<string>("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [destinationArea, setDestinationArea] = useState("");
  const [vehicleType, setVehicleType] = useState<"any" | VehicleType>("any");
  const [emergency, setEmergency] = useState(true);
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Ambulance | DocLabPharm";
  }, []);

  useEffect(() => {
    const phone = (profile as { phone?: string | null } | undefined)?.phone;
    if (!contactPhone && phone) setContactPhone(String(phone));
  }, [profile, contactPhone]);

  const locate = async () => {
    setLocating(true);
    setLocationError("");
    try {
      setPosition(await currentPosition(10_000));
      setPositionSource("Your current location");
    } catch (e) {
      setLocationError((e as Error).message);
    } finally {
      setLocating(false);
    }
  };

  // In an emergency every second counts: ask for the location straight away.
  useEffect(() => {
    locate();
  }, []);

  const chooseSaved = (value: string) => {
    if (value.startsWith("address:")) {
      const address = addresses?.find((a) => String(a.id) === value.slice(8));
      if (!address) return;
      setPosition({ latitude: Number(address.latitude), longitude: Number(address.longitude) });
      setPositionSource(address.label);
      if (!pickupAddress) setPickupAddress(`${address.addressLine}${address.landmark ? `, near ${address.landmark}` : ""}`);
    } else if (value.startsWith("area:")) {
      const area = ABUJA_AREAS.find((a) => a.name === value.slice(5));
      if (!area) return;
      setPosition({ latitude: area.latitude, longitude: area.longitude });
      setPositionSource(`${area.name} (approximate)`);
    }
    setLocationError("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!position) return setError("We need to know where to send the ambulance. Use your location or choose your area.");
    if (!pickupAddress.trim()) return setError("Please describe the pickup point so the crew can find you.");
    const destination = ABUJA_AREAS.find((a) => a.name === destinationArea);
    try {
      const ride = await request.mutateAsync({
        pickupAddress: pickupAddress.trim(),
        pickupLatitude: position.latitude,
        pickupLongitude: position.longitude,
        destinationName: destinationName.trim() || destination?.name || undefined,
        destinationLatitude: destination?.latitude,
        destinationLongitude: destination?.longitude,
        vehicleType,
        emergency,
        contactPhone: contactPhone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      navigate(`/user/ambulance/${ride.id}`);
    } catch (e) {
      setError(apiErrorMessage(e, "We could not send your request. Please call 112."));
    }
  };

  const active = history?.data.find((ride) => ACTIVE.includes(ride.status));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-2 sm:py-4">
      <EmergencyCallLink />
      <PageHeader
        title="Request an ambulance"
        intro="We send your request to the nearest free ambulance from a verified operator. You pay the fare from your wallet after the trip. DocLabPharm does not replace the emergency services."
      />

      {active && (
        <Link
          to={`/user/ambulance/${active.id}`}
          className="flex items-center justify-between gap-3 rounded-3xl bg-warm-100 p-4 font-bold text-warm-900 ring-1 ring-warm-300"
        >
          <span>You already have a request in progress: {AMBULANCE_STATUS[active.status].label.toLowerCase()}.</span>
          <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
        </Link>
      )}

      <Card>
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-lg font-extrabold text-ink-900">Where should we pick you up?</legend>
            <div
              className={cn(
                "flex items-start gap-3 rounded-2xl p-4",
                position ? "bg-brand-50 text-brand-800" : "bg-sand text-ink-700"
              )}
              role="status"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="font-bold">
                {locating ? "Finding your location…" : position ? `Pickup point: ${positionSource}` : "Pickup location not set yet"}
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={locate} loading={locating}>
                <LocateFixed className="h-4 w-4" aria-hidden="true" />
                Use my current location
              </Button>
              <select aria-label="Or choose a saved address or area" className={cn(inputStyles, "sm:max-w-80")} value="" onChange={(e) => chooseSaved(e.target.value)}>
                <option value="">Or choose an address or area</option>
                {addresses && addresses.length > 0 && (
                  <optgroup label="My addresses">
                    {addresses.map((a) => (
                      <option key={a.id} value={`address:${a.id}`}>
                        {a.label}: {a.addressLine}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Areas in Abuja">
                  {ABUJA_AREAS.map((a) => (
                    <option key={a.name} value={`area:${a.name}`}>
                      {a.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <InlineError>{locationError}</InlineError>
            <Field label="Describe the pickup point" id="pickup" hint="Street, building, gate or landmark, so the crew can find you quickly.">
              <input id="pickup" className={inputStyles} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} maxLength={255} placeholder="Block C, Sunshine Estate gate, Lokogoma" required />
            </Field>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-lg font-extrabold text-ink-900">Going to (optional)</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Hospital or place" id="destination">
                <input id="destination" className={inputStyles} value={destinationName} onChange={(e) => setDestinationName(e.target.value)} maxLength={255} placeholder="National Hospital" />
              </Field>
              <Field label="Area" id="destination-area" hint="Helps us estimate the fare.">
                <select id="destination-area" className={inputStyles} value={destinationArea} onChange={(e) => setDestinationArea(e.target.value)}>
                  <option value="">Not sure</option>
                  {ABUJA_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type of ambulance" id="vehicle-type">
              <select id="vehicle-type" className={inputStyles} value={vehicleType} onChange={(e) => setVehicleType(e.target.value as "any" | VehicleType)}>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Phone the crew can call" id="contact-phone">
              <input id="contact-phone" type="tel" inputMode="tel" className={inputStyles} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} maxLength={20} autoComplete="tel" />
            </Field>
          </div>
          <Toggle id="emergency" checked={emergency} onChange={setEmergency} label="This is an emergency" description="Turn off for a planned transfer that is not urgent." />
          <Field label="Anything the crew should know? (optional)" id="notes">
            <textarea id="notes" className={cn(textareaStyles, "min-h-20")} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="Elderly man, breathing difficulty, 3rd floor" />
          </Field>

          <InlineError>{error}</InlineError>
          {error && (
            <a href="tel:112" className="font-bold text-red-800 underline">
              Call 112 now
            </a>
          )}
          <Button type="submit" loading={request.isPending} className="min-h-14 text-lg">
            <Ambulance className="h-6 w-6" aria-hidden="true" />
            Request ambulance
          </Button>
        </form>
      </Card>

      {history && history.data.length > 0 && (
        <section aria-labelledby="history-heading" className="flex flex-col gap-3">
          <h2 id="history-heading" className="text-lg font-extrabold text-ink-900">
            Your requests
          </h2>
          <ul className="flex flex-col gap-2">
            {history.data.map((ride) => (
              <li key={ride.id}>
                <Link
                  to={`/user/ambulance/${ride.id}`}
                  className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-brand-100 hover:ring-brand-300"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-bold text-ink-900">{ride.pickupAddress}</span>
                    <span className="text-sm text-ink-500">
                      {formatDate(ride.createdAt, true)}
                      {ride.finalFare ? ` · ${formatNaira(ride.finalFare)}` : ""}
                      {ride.paymentStatus === "unpaid" ? " · Not paid yet" : ""}
                    </span>
                  </div>
                  <Pill tone={AMBULANCE_STATUS[ride.status]?.tone ?? "neutral"}>{AMBULANCE_STATUS[ride.status]?.label ?? ride.status}</Pill>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-500" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
