import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { InlineError, Toggle } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { useMarketplaceSettings, useSaveMarketplaceSettings } from "@/queries/use-admin-console";
import type { MarketplaceSettings } from "@/types/marketplace";

const BEARERS: { value: MarketplaceSettings["paystackFeeBearer"]; label: string }[] = [
  { value: "account", label: "DocLabPharm pays the whole fee (default)" },
  { value: "subaccount", label: "Providers pay the whole fee" },
  { value: "all-proportional", label: "Shared in proportion to each share" },
  { value: "all", label: "Shared equally" },
];

/** Super admin settings: commission rates, payment fees, response deadlines and sign-ups. */
export default function MarketplaceSettingsPage() {
  const { data, isLoading, isError, error, refetch } = useMarketplaceSettings();

  useEffect(() => {
    document.title = "Settings | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader title="Settings" intro="Rates and deadlines for the whole marketplace. Commission changes apply to new orders only." />
      {isLoading && <LoadingState label="Loading settings" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load settings.")} onRetry={() => refetch()} />}
      {data && <SettingsForm initial={data} />}
    </div>
  );
}

function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <Field label={label} id={id} hint={hint}>
      <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} className={inputStyles} value={Number.isNaN(value) ? "" : value} onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))} required />
    </Field>
  );
}

function SettingsForm({ initial }: { initial: MarketplaceSettings }) {
  const save = useSaveMarketplaceSettings();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const set = <K extends keyof MarketplaceSettings>(key: K) => (value: MarketplaceSettings[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const result = await save.mutateAsync(form);
      toast.success(result.message || "Settings saved.");
    } catch (e) {
      setError(apiErrorMessage(e, "We could not save the settings."));
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-ink-900">Commission (Walex Biz's share, %)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="doctor-commission" label="Doctors" value={form.doctorCommission} onChange={set("doctorCommission")} min={0} max={100} step={0.5} hint="Default 15%" />
          <NumberField id="pharmacy-commission" label="Pharmacies (medicines and delivery)" value={form.pharmacyCommission} onChange={set("pharmacyCommission")} min={0} max={100} step={0.5} hint="Default 10%" />
          <NumberField id="lab-commission" label="Labs (tests and home collection)" value={form.labTechnicianCommission} onChange={set("labTechnicianCommission")} min={0} max={100} step={0.5} hint="Default 10%" />
          <NumberField id="ambulance-commission" label="Ambulance operators" value={form.ambulanceOperatorCommission} onChange={set("ambulanceOperatorCommission")} min={0} max={100} step={0.5} hint="Default 10%" />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-ink-900">Card payments</h2>
        <Field label="Who pays Paystack's fee on split payments" id="fee-bearer">
          <select id="fee-bearer" className={inputStyles} value={form.paystackFeeBearer} onChange={(e) => set("paystackFeeBearer")(e.target.value as MarketplaceSettings["paystackFeeBearer"])}>
            {BEARERS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-ink-900">Response deadlines</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="pharmacy-accept" label="Pharmacy must accept within (minutes)" value={form.pharmacyAcceptMinutes} onChange={set("pharmacyAcceptMinutes")} min={5} max={120} hint="5–120, default 15" />
          <NumberField id="doctor-accept" label="Doctor must accept “see now” within (minutes)" value={form.doctorAcceptMinutes} onChange={set("doctorAcceptMinutes")} min={1} max={30} hint="1–30, default 3" />
          <NumberField id="support-hours" label="Support reply deadline (hours)" value={form.supportResponseHours} onChange={set("supportResponseHours")} min={1} max={168} hint="1–168, default 24. Urgent and safety: 2 hours." />
        </div>
        <NumberField id="appointment-duration" label="Booked consultation length (minutes)" value={form.doctorAppointmentDuration} onChange={set("doctorAppointmentDuration")} min={0} max={100} />
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-extrabold text-ink-900">New provider sign-ups</h2>
        <Toggle id="reg-doctor" checked={form.doctorRegistrationEnabled} onChange={set("doctorRegistrationEnabled")} label="Doctors can sign up" />
        <Toggle id="reg-pharmacy" checked={form.pharmacyRegistrationEnabled} onChange={set("pharmacyRegistrationEnabled")} label="Pharmacies can sign up" />
        <Toggle id="reg-lab" checked={form.labTechnicianRegistrationEnabled} onChange={set("labTechnicianRegistrationEnabled")} label="Labs can sign up" />
        <Toggle id="reg-ambulance" checked={form.ambulanceOperatorRegistrationEnabled} onChange={set("ambulanceOperatorRegistrationEnabled")} label="Ambulance operators can sign up" />
      </Card>

      <InlineError>{error}</InlineError>
      <div>
        <Button type="submit" loading={save.isPending}>
          Save settings
        </Button>
      </div>
    </form>
  );
}
