import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { InlineError } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { useOperatorFares, useSaveFares } from "@/queries/use-ambulance";
import type { Fares as FaresType } from "@/types/marketplace";

/** The operator's fares: a base fare plus a price per kilometre. */
export default function Fares() {
  const { data, isLoading, isError, error, refetch } = useOperatorFares();

  useEffect(() => {
    document.title = "Fares | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Fares"
        intro="Patients pay from their wallet when the trip ends: the base fare plus the price per kilometre. DocLabPharm keeps its ambulance commission and the rest goes to your wallet."
      />
      {isLoading && <LoadingState label="Loading your fares" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your fares.")} onRetry={() => refetch()} />}
      {data && <FaresForm initial={data} />}
    </div>
  );
}

function FaresForm({ initial }: { initial: FaresType }) {
  const save = useSaveFares();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const result = await save.mutateAsync(form);
      toast.success(result.message);
    } catch (e) {
      setError(apiErrorMessage(e, "We could not save your fares."));
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Base fare (₦)" id="base-fare" hint="Up to ₦500,000.">
            <input id="base-fare" type="number" min={0} max={500000} step={500} className={inputStyles} value={form.baseFare} onChange={(e) => setForm({ ...form, baseFare: Number(e.target.value) })} required />
          </Field>
          <Field label="Price per km (₦)" id="per-km-fare" hint="Up to ₦20,000. Rounded up to the next km.">
            <input id="per-km-fare" type="number" min={0} max={20000} step={50} className={inputStyles} value={form.perKmFare} onChange={(e) => setForm({ ...form, perKmFare: Number(e.target.value) })} required />
          </Field>
        </div>
        <p className="rounded-2xl bg-brand-50 p-4 text-brand-900">
          Example: a 10 km trip costs the patient <span className="font-extrabold">{formatNaira(Number(form.baseFare) + Number(form.perKmFare) * 10)}</span>.
        </p>
      </Card>
      <InlineError>{error}</InlineError>
      <div>
        <Button type="submit" loading={save.isPending}>
          Save fares
        </Button>
      </div>
    </form>
  );
}
