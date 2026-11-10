import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { InlineError, Toggle } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { useHomeCollectionSettings, useSaveHomeCollectionSettings } from "@/queries/use-labs";
import type { HomeCollectionSettings } from "@/types/marketplace";

/** Whether the lab sends someone to take samples at patients' homes, how far, and for what fee. */
export default function HomeCollectionPage() {
  const { data, isLoading, isError, error, refetch } = useHomeCollectionSettings();

  useEffect(() => {
    document.title = "Home sample collection | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Home sample collection"
        intro="Offer to take samples at the patient's home. The fee is charged once per order and DocLabPharm takes its lab commission on it."
      />
      {isLoading && <LoadingState label="Loading your settings" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your settings.")} onRetry={() => refetch()} />}
      {data && <Form initial={data} />}
    </div>
  );
}

function Form({ initial }: { initial: HomeCollectionSettings }) {
  const save = useSaveHomeCollectionSettings();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

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

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-5">
        <Toggle
          id="offers-home"
          checked={form.offersHomeCollection}
          onChange={(v) => setForm((f) => ({ ...f, offersHomeCollection: v }))}
          label="We collect samples at home"
          description="Patients can choose home collection at checkout when they are within your radius."
        />
        {form.offersHomeCollection && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Home visit fee (₦)" id="home-fee" hint="Up to ₦50,000, once per order.">
              <input id="home-fee" type="number" min={0} max={50000} step={100} className={inputStyles} value={form.homeCollectionFee} onChange={(e) => setForm((f) => ({ ...f, homeCollectionFee: Number(e.target.value) }))} required />
            </Field>
            <Field label="How far you travel (km)" id="home-radius" hint="From 1 to 50 km from your lab's map pin.">
              <input id="home-radius" type="number" min={1} max={50} step={0.5} className={inputStyles} value={form.homeCollectionRadiusKm} onChange={(e) => setForm((f) => ({ ...f, homeCollectionRadiusKm: Number(e.target.value) }))} required />
            </Field>
          </div>
        )}
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
