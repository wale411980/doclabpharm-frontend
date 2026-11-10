import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { InlineError, Toggle } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { usePharmacyDeliverySettings, useSavePharmacyDeliverySettings } from "@/queries/use-deliveries";
import type { DeliverySettings } from "@/types/marketplace";

/** The pharmacy's own delivery terms: radius, fees, minimum order, and pausing orders. */
export default function DeliverySettingsPage() {
  const { data, isLoading, isError, error, refetch } = usePharmacyDeliverySettings();

  useEffect(() => {
    document.title = "Delivery settings | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Delivery settings"
        intro="Set how far you deliver and what you charge. DocLabPharm takes its pharmacy commission on the delivery fee too."
      />
      {isLoading && <LoadingState label="Loading your settings" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your settings.")} onRetry={() => refetch()} />}
      {data && <SettingsForm initial={data} />}
    </div>
  );
}

function SettingsForm({ initial }: { initial: DeliverySettings }) {
  const save = useSavePharmacyDeliverySettings();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const set = <K extends keyof DeliverySettings>(key: K, value: DeliverySettings[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const result = await save.mutateAsync(form);
      toast.success(result.message);
    } catch (e) {
      setError(apiErrorMessage(e, "We could not save your settings."));
    }
  };

  const exampleKm = 4;
  const example = Number(form.deliveryBaseFee) + Number(form.deliveryFeePerKm) * exampleKm;

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-5">
        <Toggle
          id="accepting-orders"
          checked={form.acceptingOrders}
          onChange={(v) => set("acceptingOrders", v)}
          label="Taking new orders"
          description={form.acceptingOrders ? "Patients can order from you." : "Paused: patients cannot order from you until you turn this back on."}
        />
        <Toggle
          id="offers-delivery"
          checked={form.offersDelivery}
          onChange={(v) => set("offersDelivery", v)}
          label="We deliver"
          description="Turn off if patients can only pick up at your counter."
        />
      </Card>

      {form.offersDelivery && (
        <Card className="flex flex-col gap-5">
          <h2 className="text-lg font-extrabold text-ink-900">Delivery area and fees</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Delivery radius (km)" id="radius" hint="From 1 to 50 km, measured from your map pin.">
              <input id="radius" type="number" min={1} max={50} step={0.5} className={inputStyles} value={form.deliveryRadiusKm} onChange={(e) => set("deliveryRadiusKm", Number(e.target.value))} required />
            </Field>
            <Field label="Base fee (₦)" id="base-fee" hint="Up to ₦20,000.">
              <input id="base-fee" type="number" min={0} max={20000} step={50} className={inputStyles} value={form.deliveryBaseFee} onChange={(e) => set("deliveryBaseFee", Number(e.target.value))} required />
            </Field>
            <Field label="Fee per km (₦)" id="per-km" hint="Up to ₦2,000. Distance is rounded up to the next km.">
              <input id="per-km" type="number" min={0} max={2000} step={10} className={inputStyles} value={form.deliveryFeePerKm} onChange={(e) => set("deliveryFeePerKm", Number(e.target.value))} required />
            </Field>
            <Field label="Minimum order (₦)" id="min-order" hint="0 for no minimum.">
              <input id="min-order" type="number" min={0} step={100} className={inputStyles} value={form.minOrderAmount} onChange={(e) => set("minOrderAmount", Number(e.target.value))} required />
            </Field>
          </div>
          <p className="rounded-2xl bg-brand-50 p-4 text-brand-900">
            Example: a patient {exampleKm} km away pays <span className="font-extrabold">{formatNaira(example)}</span> for delivery.
          </p>
        </Card>
      )}

      <InlineError>{error}</InlineError>
      <div>
        <Button type="submit" loading={save.isPending}>
          Save settings
        </Button>
      </div>
    </form>
  );
}
