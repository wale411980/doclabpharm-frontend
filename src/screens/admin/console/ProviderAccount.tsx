import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Ban, Percent, ShieldCheck, Undo2 } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, Pill, buttonStyles, formatDate, inputStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { InlineError, StatTile } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { humanize } from "@/lib/marketplace";
import { isProviderRole, providerRoleLabel, type ProviderRole } from "@/lib/providerTypes";
import { useBanProvider, useEnforcementHistory, useSetProviderCommission } from "@/queries/use-admin-console";
import { useVerificationDetail } from "@/queries/use-verification";
import { ADMIN_STATUS } from "@/screens/admin/verification/adminCopy";
import type { VerificationStatus } from "@/types/verification";

const ACTION_LABEL: Record<string, string> = {
  sla_breach: "Missed a support deadline",
  warning: "Warning sent",
  sent_for_review: "Taken off DocLabPharm for review",
  banned: "Banned",
  unbanned: "Ban lifted",
  reinstated: "Ban lifted",
};

const WHAT_BAN_DOES: Record<ProviderRole, string> = {
  pharmacy: "pauses their orders and refunds every patient with an order not yet delivered (stock goes back)",
  doctor: "takes them offline and refunds every patient with an upcoming or ongoing consultation",
  lab_technician: "stops home collection and refunds every patient with a test not yet done",
  ambulance_operator: "takes their ambulances offline and cancels any assigned trip",
};

/** One provider's account: support record, enforcement history, ban or lift, and (super admin) commission. */
export default function ProviderAccount({ basePath }: { basePath: string }) {
  const { type: typeParam, id: idParam } = useParams();
  const type = (isProviderRole(typeParam) ? typeParam : "pharmacy") as ProviderRole;
  const id = Number(idParam);
  const isSuperAdmin = basePath === "/super-admin";

  const history = useEnforcementHistory(type, id);
  const detail = useVerificationDetail(type, id);

  useEffect(() => {
    document.title = "Provider account | DocLabPharm";
  }, []);

  const provider = detail.data?.provider;
  const name = provider ? provider.businessName || `${provider.firstName} ${provider.lastName}` : `${providerRoleLabel(type)} #${id}`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <Link to={`${basePath}/support/scorecard`} className="inline-flex min-h-11 items-center gap-2 self-start font-bold text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Scorecard
      </Link>
      <PageHeader
        title={name}
        intro={`${providerRoleLabel(type)}${provider?.city ? ` · ${provider.city}` : ""}${provider?.email ? ` · ${provider.email}` : ""}`}
        actions={
          <>
            <Link to={`${basePath}/verifications/${type}/${id}`} className={buttonStyles("secondary")}>
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Verification file
            </Link>
            <Link to={`${basePath}/support?providerType=${type}&providerId=${id}`} className={buttonStyles("ghost")}>
              Their tickets
            </Link>
          </>
        }
      />

      {history.isLoading && <LoadingState label="Loading the provider's record" />}
      {history.isError && <ErrorState message={apiErrorMessage(history.error, "We could not load this provider.")} onRetry={() => history.refetch()} />}
      {history.data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatTile
              label="Missed deadlines (30 days)"
              value={history.data.breachesLast30Days}
              tone={history.data.breachesLast30Days >= 3 ? "red" : "neutral"}
              hint="3 = warning · 5 = review"
            />
            <StatTile label="Account" value={history.data.status === "banned" ? "Banned" : humanize(history.data.status)} tone={history.data.status === "banned" ? "red" : "brand"} />
            <StatTile
              label="Verification"
              value={ADMIN_STATUS[history.data.verificationStatus as VerificationStatus]?.label ?? humanize(history.data.verificationStatus)}
            />
          </div>

          <BanPanel type={type} id={id} name={name} banned={history.data.status === "banned"} />
          {isSuperAdmin && <CommissionPanel type={type} id={id} />}

          <section aria-labelledby="history-heading" className="flex flex-col gap-3">
            <h2 id="history-heading" className="text-lg font-extrabold text-ink-900">
              Enforcement history
            </h2>
            {history.data.history.length === 0 ? (
              <p className="rounded-3xl bg-white p-4 text-ink-500 ring-1 ring-brand-100">Nothing recorded. This provider has a clean record.</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {history.data.history.map((event) => (
                  <li key={event.id} className="flex flex-col gap-1 rounded-3xl bg-white p-4 ring-1 ring-brand-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={event.action === "banned" || event.action === "sent_for_review" ? "red" : event.action === "unbanned" || event.action === "reinstated" ? "brand" : "warm"}>
                        {ACTION_LABEL[event.action] ?? humanize(event.action)}
                      </Pill>
                      <span className="text-sm text-ink-500">
                        {formatDate(event.createdAt, true)} · {event.actorType ? `by ${event.actorType.split("\\").pop()?.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()} #${event.actorId}` : "automatic"}
                      </span>
                    </div>
                    {event.reason && <p className="break-words text-ink-900">{event.reason}</p>}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function BanPanel({ type, id, name, banned }: { type: ProviderRole; id: number; name: string; banned: boolean }) {
  const mutation = useBanProvider(type, id);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!reason.trim()) return setError("Please give a reason. It is recorded and sent to the provider.");
    try {
      const result = await mutation.mutateAsync({ action: banned ? "unban" : "ban", reason: reason.trim() });
      toast.success(result.refundedItems ? `${result.message} ${result.refundedItems} item(s) refunded to patients.` : result.message);
      setOpen(false);
      setReason("");
    } catch (e) {
      setError(apiErrorMessage(e, "That did not work."));
    }
  };

  return (
    <Card className={banned ? "flex flex-col gap-3 bg-red-50 ring-red-200" : "flex flex-col gap-3"}>
      <h2 className="text-lg font-extrabold text-ink-900">{banned ? "This provider is banned" : "Remove from DocLabPharm"}</h2>
      <p className="text-ink-700">
        {banned
          ? "They cannot sign in and patients cannot see them. Lifting the ban lets them sign in again, but they stay suspended until you re-approve them in verification."
          : `A ban blocks sign-in, suspends their verification, ${WHAT_BAN_DOES[type]}. Everyone affected is told.`}
      </p>
      <div>
        <Button variant={banned ? "secondary" : "danger"} onClick={() => setOpen(true)}>
          {banned ? <Undo2 className="h-4 w-4" aria-hidden="true" /> : <Ban className="h-4 w-4" aria-hidden="true" />}
          {banned ? "Lift ban" : "Ban provider"}
        </Button>
      </div>
      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setError("");
        }}
        title={banned ? `Lift the ban on ${name}?` : `Ban ${name}?`}
        description={
          banned
            ? "They will be able to sign in again but stay suspended until re-approved in verification."
            : "This takes effect immediately and cannot be undone quickly."
        }
        confirmLabel={banned ? "Lift ban" : "Ban and refund patients"}
        variant={banned ? "primary" : "danger"}
        loading={mutation.isPending}
        onConfirm={submit}
      >
        {!banned && (
          <ul className="list-disc space-y-1 pl-5 text-ink-700">
            <li>Blocks their sign-in and ends their sessions.</li>
            <li>Suspends their verification, so patients cannot find them.</li>
            <li>
              <span className="font-bold text-ink-900">Refunds patients in full</span> to their wallets: it {WHAT_BAN_DOES[type]}.
            </li>
          </ul>
        )}
        <Field label="Reason" id="ban-reason" hint="Recorded in the enforcement history and emailed to the provider.">
          <textarea id="ban-reason" className={`${inputStyles} min-h-24`} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} required />
        </Field>
        <InlineError>{error}</InlineError>
      </ConfirmDialog>
    </Card>
  );
}

function CommissionPanel({ type, id }: { type: ProviderRole; id: number }) {
  const mutation = useSetProviderCommission(type, id);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<string | null>(null);

  const save = async (percent: number | null) => {
    setError("");
    if (percent !== null && (Number.isNaN(percent) || percent < 0 || percent > 50)) {
      return setError("Enter a rate from 0 to 50%.");
    }
    try {
      const result = await mutation.mutateAsync(percent);
      toast.success(result.message);
      setCurrent(result.commissionPercent === null ? "the standard rate" : `${result.commissionPercent}%`);
      if (percent === null) setValue("");
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setError(
        status === 419
          ? "The API refused this change with a security (CSRF) error. The /super-admin/providers/* route needs to be added to the API's CSRF exemptions before rates can be changed here."
          : apiErrorMessage(e, "We could not change the commission.")
      );
    }
  };

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
        <Percent className="h-5 w-5 text-brand-700" aria-hidden="true" />
        Commission for this provider
      </h2>
      <p className="text-ink-700">
        Give this provider their own rate (up to 50%), or put them back on the standard rate from settings. It applies to new orders only.
        {current && <span className="font-bold"> Now: {current}.</span>}
      </p>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          save(value === "" ? NaN : Number(value));
        }}
      >
        <div className="sm:w-48">
          <Field label="Rate (%)" id="provider-rate">
            <input id="provider-rate" type="number" min={0} max={50} step={0.5} className={inputStyles} value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 7.5" />
          </Field>
        </div>
        <Button type="submit" loading={mutation.isPending && mutation.variables !== null}>
          Set rate
        </Button>
        <Button variant="secondary" onClick={() => save(null)} loading={mutation.isPending && mutation.variables === null}>
          Use standard rate
        </Button>
      </form>
      <InlineError>{error}</InlineError>
      <p className="text-sm text-ink-500">The API does not show a provider's current custom rate here; the provider sees it on their earnings page.</p>
    </Card>
  );
}
