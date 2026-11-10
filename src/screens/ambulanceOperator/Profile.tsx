import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { Lock, Save } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, inputStyles } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import {
  useAmbulanceOperatorProfile,
  useUpdateAmbulanceOperatorProfile,
  type AmbulanceOperatorProfileInput,
} from "@/queries/use-ambulance-operator";
import type { AmbulanceOperatorProfile as Profile } from "@/types/verification";

/** Statuses in which the API refuses changes to the business name and CAC number. */
const IDENTITY_LOCKED = ["submitted", "approved", "suspended"];

const toForm = (profile: Profile): Record<keyof AmbulanceOperatorProfileInput, string> => ({
  businessName: profile.businessName ?? "",
  cacNumber: profile.cacNumber ?? "",
  firstName: profile.firstName ?? "",
  lastName: profile.lastName ?? "",
  phone: profile.phone ?? "",
  address: profile.address ?? "",
  city: profile.city ?? "",
  state: profile.state ?? "",
});

export default function AmbulanceOperatorProfile() {
  const { data, isLoading, isError, error, refetch } = useAmbulanceOperatorProfile();

  useEffect(() => {
    document.title = "Profile | DocLabPharm";
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader title="Business profile" intro="The details patients and our verification team see for your ambulance service." />
      {isLoading && <LoadingState label="Loading your profile" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load your profile.")} onRetry={() => refetch()} />}
      {data && <ProfileForm profile={data} />}
    </div>
  );
}

function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState(() => toForm(profile));
  const [formError, setFormError] = useState("");
  const update = useUpdateAmbulanceOperatorProfile();
  const identityLocked = IDENTITY_LOCKED.includes(profile.verificationStatus);

  const set = (field: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    const value = (field: keyof typeof form) => form[field].trim();
    const optional = (field: keyof typeof form) => value(field) || null;
    const input: AmbulanceOperatorProfileInput = {
      firstName: value("firstName"),
      lastName: value("lastName"),
      phone: value("phone"),
      address: optional("address"),
      city: optional("city"),
      state: optional("state"),
      // Locked fields are left out rather than resent.
      ...(identityLocked ? {} : { businessName: value("businessName"), cacNumber: optional("cacNumber") }),
    };
    try {
      const result = await update.mutateAsync(input);
      setForm(toForm(result.user));
      toast.success("Profile saved.");
    } catch (err) {
      setFormError(apiErrorMessage(err, "We could not save your profile."));
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-lg font-bold text-ink-900">Business</legend>
          {identityLocked && (
            <p className="flex items-start gap-2 rounded-2xl bg-sand p-3 text-sm text-ink-700">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              The business name and CAC number are locked while your verification is submitted or approved, because our
              review was based on them. Contact support if they need to change.
            </p>
          )}
          <Field id="businessName" label="Business name">
            <input id="businessName" className={inputStyles} value={form.businessName} onChange={set("businessName")} required disabled={identityLocked} maxLength={255} autoComplete="organization" />
          </Field>
          <Field id="cacNumber" label="CAC registration number" hint="As shown on your CAC certificate, for example RC1234567.">
            <input id="cacNumber" className={inputStyles} value={form.cacNumber} onChange={set("cacNumber")} disabled={identityLocked} maxLength={100} autoComplete="off" />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-lg font-bold text-ink-900">Contact person</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="First name">
              <input id="firstName" className={inputStyles} value={form.firstName} onChange={set("firstName")} required maxLength={255} autoComplete="given-name" />
            </Field>
            <Field id="lastName" label="Last name">
              <input id="lastName" className={inputStyles} value={form.lastName} onChange={set("lastName")} required maxLength={255} autoComplete="family-name" />
            </Field>
          </div>
          <Field id="phone" label="Phone number">
            <input id="phone" type="tel" className={inputStyles} value={form.phone} onChange={set("phone")} required maxLength={255} autoComplete="tel" />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-lg font-bold text-ink-900">Base location</legend>
          <Field id="address" label="Address">
            <input id="address" className={inputStyles} value={form.address} onChange={set("address")} maxLength={255} autoComplete="street-address" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="city" label="City or area">
              <input id="city" className={inputStyles} value={form.city} onChange={set("city")} maxLength={255} autoComplete="address-level2" />
            </Field>
            <Field id="state" label="State">
              <input id="state" className={inputStyles} value={form.state} onChange={set("state")} maxLength={255} autoComplete="address-level1" />
            </Field>
          </div>
        </fieldset>

        {formError && (
          <p role="alert" className="font-bold text-red-700">
            {formError}
          </p>
        )}
        <div>
          <Button type="submit" loading={update.isPending}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save profile
          </Button>
        </div>
      </form>
    </Card>
  );
}
