import { useEffect, useId, useState } from "react";
import { Check, LocateFixed, MapPin, Plus } from "lucide-react";
import { Button, Field, inputStyles } from "@/components/dashboard/ui";
import { InlineError } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { ABUJA_AREAS, currentPosition } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useAddPatientAddress, usePatientAddresses } from "@/queries/use-checkout";
import type { PatientAddress } from "@/types/marketplace";

/**
 * Choose one of the patient's saved addresses, or add a new one (with the
 * phone's location, or an Abuja area when location is off).
 */
export function AddressPicker({
  value,
  onChange,
  legend,
}: {
  value: number | null;
  onChange: (id: number) => void;
  legend: string;
}) {
  const { data: addresses, isLoading, isError, error } = usePatientAddresses();
  const [adding, setAdding] = useState(false);

  // Pick the default address the first time the list arrives.
  useEffect(() => {
    if (value === null && addresses && addresses.length > 0) {
      onChange((addresses.find((a) => a.isDefault) ?? addresses[0]).id);
    }
    if (addresses && addresses.length === 0) setAdding(true);
  }, [addresses, value, onChange]);

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 font-bold text-ink-900">{legend}</legend>
      {isLoading && <p className="text-ink-500">Loading your addresses…</p>}
      {isError && <InlineError>{apiErrorMessage(error, "We could not load your addresses.")}</InlineError>}
      {addresses && addresses.length > 0 && (
        <ul className="flex flex-col gap-2">
          {addresses.map((address) => (
            <AddressOption key={address.id} address={address} selected={value === address.id} onSelect={() => onChange(address.id)} />
          ))}
        </ul>
      )}
      {adding ? (
        <NewAddressForm
          onSaved={(id) => {
            onChange(id);
            setAdding(false);
          }}
          onCancel={addresses && addresses.length > 0 ? () => setAdding(false) : undefined}
        />
      ) : (
        <div>
          <Button variant="ghost" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a new address
          </Button>
        </div>
      )}
    </fieldset>
  );
}

function AddressOption({ address, selected, onSelect }: { address: PatientAddress; selected: boolean; onSelect: () => void }) {
  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-700",
          selected ? "bg-brand-50 ring-2 ring-brand-600" : "bg-white ring-brand-100 hover:ring-brand-300"
        )}
      >
        <input type="radio" name="address" className="sr-only" checked={selected} onChange={onSelect} />
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            selected ? "bg-brand-600 text-white" : "ring-2 ring-brand-200"
          )}
          aria-hidden="true"
        >
          {selected && <Check className="h-4 w-4" />}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-bold text-ink-900">{address.label}</span>
          <span className="break-words text-sm text-ink-500">
            {address.addressLine}
            {address.landmark ? ` (near ${address.landmark})` : ""}, {address.city}
          </span>
        </span>
      </label>
    </li>
  );
}

function NewAddressForm({ onSaved, onCancel }: { onSaved: (id: number) => void; onCancel?: () => void }) {
  const id = useId();
  const add = useAddPatientAddress();
  const [label, setLabel] = useState("Home");
  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const locate = async () => {
    setLocating(true);
    setError("");
    try {
      setPosition(await currentPosition());
      setArea("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLocating(false);
    }
  };

  const save = async () => {
    setError("");
    const fromArea = ABUJA_AREAS.find((a) => a.name === area);
    const point = position ?? (fromArea ? { latitude: fromArea.latitude, longitude: fromArea.longitude } : null);
    if (!addressLine.trim()) return setError("Please type your street address.");
    if (!point) return setError("Please use your current location or choose your area, so we can work out the distance.");
    try {
      const saved = await add.mutateAsync({
        label: label.trim() || "Home",
        addressLine: addressLine.trim(),
        landmark: landmark.trim() || undefined,
        city: "Abuja",
        state: "FCT",
        latitude: point.latitude,
        longitude: point.longitude,
      });
      onSaved(saved.id);
    } catch (e) {
      setError(apiErrorMessage(e, "We could not save this address."));
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-sand p-4 ring-1 ring-brand-100">
      <p className="font-bold text-ink-900">New address</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name for this address" id={`${id}-label`}>
          <input id={`${id}-label`} className={inputStyles} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home, Office…" maxLength={50} />
        </Field>
        <Field label="Nearest landmark (optional)" id={`${id}-landmark`}>
          <input id={`${id}-landmark`} className={inputStyles} value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Opposite Shoprite" maxLength={150} />
        </Field>
      </div>
      <Field label="Street address" id={`${id}-line`}>
        <input id={`${id}-line`} className={inputStyles} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="House number and street" maxLength={255} autoComplete="street-address" />
      </Field>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-ink-700">Where is it on the map?</span>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="secondary" onClick={locate} loading={locating}>
            <LocateFixed className="h-4 w-4" aria-hidden="true" />
            Use my current location
          </Button>
          <span className="text-sm text-ink-500 sm:px-1">or</span>
          <select
            aria-label="Choose your area"
            className={cn(inputStyles, "sm:max-w-64")}
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              if (e.target.value) setPosition(null);
            }}
          >
            <option value="">Choose your area in Abuja</option>
            {ABUJA_AREAS.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        {position && (
          <p className="flex items-center gap-2 text-sm font-bold text-brand-700">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Location found. We will use it for this address.
          </p>
        )}
      </div>
      <InlineError>{error}</InlineError>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={save} loading={add.isPending}>
          Save address
        </Button>
      </div>
    </div>
  );
}
