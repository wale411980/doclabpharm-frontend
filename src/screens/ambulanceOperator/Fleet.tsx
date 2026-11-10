import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Ambulance, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, Pill, formatDate, inputStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { EmptyState, InlineError, Toggle } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { useDeleteVehicle, useOperatorVehicles, useSaveVehicle } from "@/queries/use-ambulance";
import type { AmbulanceVehicle, VehicleInput, VehicleType } from "@/types/marketplace";
import { useFleetLocation } from "./FleetLocation";

export const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "basic", label: "Basic life support" },
  { value: "advanced", label: "Advanced life support" },
  { value: "transport", label: "Patient transport" },
];

const typeLabel = (type: string) => VEHICLE_TYPES.find((t) => t.value === type)?.label ?? type;

/** The operator's ambulances: add, edit, remove, and switch each one on for requests. */
export default function Fleet() {
  const { data, isLoading, isError, error, refetch } = useOperatorVehicles();
  const { lastSentAt, error: locationError, sharing } = useFleetLocation();
  const [editing, setEditing] = useState<AmbulanceVehicle | "new" | null>(null);

  useEffect(() => {
    document.title = "Vehicles | DocLabPharm";
  }, []);

  const vehicles = data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Vehicles"
        intro="Switch a vehicle on when its crew is ready. This device then shares its location every 20 seconds so we can send the nearest ambulance. Keep this dashboard open on the crew's phone."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add vehicle
          </Button>
        }
      />

      {sharing.length > 0 && (
        <p className="flex flex-wrap items-center gap-2 rounded-3xl bg-brand-50 p-4 font-bold text-brand-800" role="status">
          <MapPin className="h-5 w-5 animate-pulse" aria-hidden="true" />
          Sharing location for {sharing.length} {sharing.length === 1 ? "vehicle" : "vehicles"}
          {lastSentAt ? ` · last sent ${new Date(lastSentAt).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", second: "2-digit" })}` : ""}
        </p>
      )}
      <InlineError>{locationError}</InlineError>

      {isLoading && <LoadingState label="Loading your vehicles" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your vehicles.")} onRetry={() => refetch()} />}
      {data && vehicles.length === 0 && (
        <EmptyState icon={Ambulance} title="No vehicles yet" action={<Button onClick={() => setEditing("new")}>Add your first vehicle</Button>}>
          Add each ambulance with its plate number and driver so patients know who is coming.
        </EmptyState>
      )}
      <ul className="flex flex-col gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={() => setEditing(vehicle)} />
        ))}
      </ul>
      {vehicles.length > 0 && (
        <p className="text-sm text-ink-500">
          Set your prices on the{" "}
          <Link to="/ambulance_operator/fares" className="font-bold text-brand-700 underline">
            Fares
          </Link>{" "}
          page.
        </p>
      )}

      {editing && <VehicleDialog vehicle={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function VehicleCard({ vehicle, onEdit }: { vehicle: AmbulanceVehicle; onEdit: () => void }) {
  const { sharing, start, stop } = useFleetLocation();
  const remove = useDeleteVehicle();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const on = sharing.includes(vehicle.id);
  const onTrip = vehicle.status === "busy";

  const toggle = async (next: boolean) => {
    setBusy(true);
    setError("");
    try {
      if (next) {
        await start(vehicle.id);
        toast.success(`${vehicle.plateNumber} is now available for requests.`);
      } else {
        await stop(vehicle.id);
        toast.success(`${vehicle.plateNumber} is offline.`);
      }
    } catch (e) {
      setError(e instanceof Error && !("response" in e) ? e.message : apiErrorMessage(e, "We could not change this vehicle."));
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    try {
      await remove.mutateAsync(vehicle.id);
      if (on) await stop(vehicle.id).catch(() => undefined);
      toast.success("Vehicle removed.");
      setConfirmDelete(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not remove this vehicle."));
      setConfirmDelete(false);
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink-900">{vehicle.plateNumber}</h2>
            <p className="text-sm text-ink-500">
              {typeLabel(vehicle.type)}
              {vehicle.hasParamedic ? " · Paramedic on board" : ""} · Driver {vehicle.driverName} ({vehicle.driverPhone})
            </p>
            {vehicle.equipment && <p className="text-sm text-ink-500">Equipment: {vehicle.equipment}</p>}
          </div>
          <Pill tone={onTrip ? "blue" : vehicle.status === "available" ? "brand" : "neutral"}>
            {onTrip ? "On a trip" : vehicle.status === "available" ? "Available" : "Offline"}
          </Pill>
        </div>
        <Toggle
          id={`vehicle-${vehicle.id}`}
          checked={on}
          disabled={busy}
          onChange={toggle}
          label="Available for requests"
          description={
            on
              ? `Sharing this device's location${vehicle.lastSeenAt ? ` · last seen ${formatDate(vehicle.lastSeenAt, true)}` : ""}`
              : vehicle.status === "available"
                ? "Marked available, but this device is not sharing its location. Switch on to keep it visible."
                : "Switch on when the crew is ready."
          }
        />
        <InlineError>{error}</InlineError>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onEdit}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(true)} disabled={onTrip}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove
          </Button>
        </div>
      </Card>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Remove ${vehicle.plateNumber}?`}
        description="It will no longer receive requests. Past trips stay on record."
        confirmLabel="Remove vehicle"
        variant="danger"
        loading={remove.isPending}
        onConfirm={doDelete}
      />
    </li>
  );
}

function VehicleDialog({ vehicle, onClose }: { vehicle: AmbulanceVehicle | null; onClose: () => void }) {
  const save = useSaveVehicle();
  const [form, setForm] = useState<VehicleInput>({
    plateNumber: vehicle?.plateNumber ?? "",
    type: vehicle?.type ?? "basic",
    hasParamedic: vehicle?.hasParamedic ?? false,
    equipment: vehicle?.equipment ?? "",
    driverName: vehicle?.driverName ?? "",
    driverPhone: vehicle?.driverPhone ?? "",
  });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const result = await save.mutateAsync({ id: vehicle?.id, input: { ...form, equipment: form.equipment?.trim() || undefined } });
      toast.success(result.message);
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e, "We could not save this vehicle."));
    }
  };

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={vehicle ? `Edit ${vehicle.plateNumber}` : "Add a vehicle"}
      description="Patients see the plate number, type and driver when you accept their request."
      confirmLabel={vehicle ? "Save changes" : "Add vehicle"}
      loading={save.isPending}
      onConfirm={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plate number" id="plate">
          <input id="plate" className={inputStyles} value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })} maxLength={20} required />
        </Field>
        <Field label="Type" id="vehicle-type">
          <select id="vehicle-type" className={inputStyles} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as VehicleType })}>
            {VEHICLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Driver's name" id="driver-name">
          <input id="driver-name" className={inputStyles} value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} maxLength={100} required />
        </Field>
        <Field label="Driver's phone" id="driver-phone">
          <input id="driver-phone" type="tel" inputMode="tel" className={inputStyles} value={form.driverPhone} onChange={(e) => setForm({ ...form, driverPhone: e.target.value })} maxLength={20} required />
        </Field>
      </div>
      <Field label="Equipment (optional)" id="equipment">
        <input id="equipment" className={inputStyles} value={form.equipment ?? ""} onChange={(e) => setForm({ ...form, equipment: e.target.value })} maxLength={255} placeholder="Oxygen, defibrillator, stretcher" />
      </Field>
      <label className="flex min-h-11 items-center gap-3 font-bold text-ink-900">
        <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={form.hasParamedic} onChange={(e) => setForm({ ...form, hasParamedic: e.target.checked })} />
        A paramedic rides with this vehicle
      </label>
      <InlineError>{error}</InlineError>
    </ConfirmDialog>
  );
}

