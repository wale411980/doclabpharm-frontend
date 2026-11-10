import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Stethoscope, UserRound, Wallet, Zap } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, buttonStyles, inputStyles } from "@/components/dashboard/ui";
import { EmptyState, InlineError, textareaStyles } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useGetConsultations, useGetUserWallet } from "@/queries";
import { cardCallbackUrl, findInstantConsultForOrder, useCheckout, useOnlineDoctors } from "@/queries/use-checkout";
import type { OnlineDoctor, PaymentMethod } from "@/types/marketplace";
import { ChoiceCard } from "./Checkout";

/** "See a doctor now": pick an online doctor, describe the problem, pay, then wait for them to accept. */
export default function SeeDoctorNow() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useOnlineDoctors();
  const { data: consultations } = useGetConsultations();
  const { data: wallet } = useGetUserWallet();
  const checkout = useCheckout();

  const [doctor, setDoctor] = useState<OnlineDoctor | null>(null);
  const [serviceId, setServiceId] = useState<string>("");
  const [complaint, setComplaint] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("wallet");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.title = "See a doctor now | DocLabPharm";
  }, []);

  useEffect(() => {
    if (!serviceId && consultations?.length) {
      const virtual = consultations.find((c) => /virtual|online|video/i.test(c.name)) ?? consultations[0];
      setServiceId(String(virtual.id));
    }
  }, [consultations, serviceId]);

  const service = consultations?.find((c) => String(c.id) === serviceId);
  const price = Number(service?.price ?? 0);
  const balance = Number(wallet?.balance ?? 0);

  const pay = async () => {
    setFormError("");
    if (!doctor || !service) return;
    if (complaint.trim().length < 5) {
      setFormError("Please tell the doctor briefly what is wrong.");
      return;
    }
    try {
      const result = await checkout.mutateAsync({
        items: [
          { service_type: "consult", service_id: Number(service.id), doctor_id: doctor.id, mode: "now", complaint: complaint.trim() },
        ],
        paymentMethod: payment,
        callbackUrl: payment === "card" ? cardCallbackUrl() : undefined,
      });
      if (result.payment) {
        window.location.assign(result.payment.authorizationUrl);
        return;
      }
      const booking = await findInstantConsultForOrder(result.order!.id);
      navigate(booking ? `/user/consults/${booking.id}` : "/user/appointments");
    } catch (e) {
      setFormError(apiErrorMessage(e, "We could not send your request. Please try again."));
      refetch();
    }
  };

  const doctors = data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="See a doctor now"
        intro="Talk to a verified doctor in minutes by chat or video. If the doctor does not accept in time, you get your money back."
      />

      {isLoading && <LoadingState label="Finding doctors who are online" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load the doctors.")} onRetry={() => refetch()} />}

      {data && doctors.length === 0 && (
        <EmptyState
          icon={Stethoscope}
          title="No doctor is online right now"
          action={
            <Link to="/doctor/select" className={buttonStyles("primary")}>
              Book a time with a doctor
            </Link>
          }
        >
          Please try again in a few minutes, or book a time that suits you. If this is an emergency, call 112.
        </EmptyState>
      )}

      {doctors.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <section aria-labelledby="online-heading" className="flex min-w-0 flex-col gap-3">
            <h2 id="online-heading" className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
              </span>
              {doctors.length === 1 ? "1 doctor online" : `${doctors.length} doctors online`}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {doctors.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setDoctor(d)}
                    aria-pressed={doctor?.id === d.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-brand-700",
                      doctor?.id === d.id ? "ring-2 ring-brand-600" : "ring-brand-100 hover:ring-brand-300"
                    )}
                  >
                    {d.profileImage ? (
                      <img src={d.profileImage} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                        <UserRound className="h-7 w-7" aria-hidden="true" />
                      </span>
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-extrabold text-ink-900">
                        Dr {d.firstName} {d.lastName}
                      </span>
                      <span className="truncate text-sm text-ink-500">{d.specialization?.name ?? d.speciality ?? "General practice"}</span>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        Available now
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <Card className="flex flex-col gap-5 lg:sticky lg:top-4">
            {!doctor ? (
              <p className="text-ink-700">Choose a doctor to continue.</p>
            ) : (
              <>
                <h2 className="text-lg font-extrabold text-ink-900">
                  See Dr {doctor.firstName} {doctor.lastName}
                </h2>
                {consultations && consultations.length > 1 && (
                  <Field label="Type of consultation" id="consult-type">
                    <select id="consult-type" className={inputStyles} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                      {consultations.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} · {formatNaira(c.price)}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="What is wrong?" id="complaint" hint="The doctor reads this before accepting.">
                  <textarea
                    id="complaint"
                    className={textareaStyles}
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    maxLength={1000}
                    placeholder="For example: fever and headache since yesterday"
                  />
                </Field>
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-2 font-bold text-ink-900">Pay with</legend>
                  <ChoiceCard name="pay-now" checked={payment === "wallet"} onSelect={() => setPayment("wallet")} icon={Wallet} title="Wallet" text={`Balance: ${formatNaira(balance)}`} />
                  <ChoiceCard name="pay-now" checked={payment === "card"} onSelect={() => setPayment("card")} icon={CreditCard} title="Debit card" text="Pay on Paystack, then come back to wait for the doctor." />
                </fieldset>
                {payment === "wallet" && balance < price && (
                  <p className="rounded-2xl bg-warm-50 p-4 text-sm text-warm-900">
                    Your wallet is short.{" "}
                    <Link to="/user/wallet" className="font-bold underline">
                      Top up
                    </Link>{" "}
                    or pay by card.
                  </p>
                )}
                <InlineError>{formError}</InlineError>
                <Button onClick={pay} loading={checkout.isPending} disabled={!service || (payment === "wallet" && balance < price)}>
                  {payment === "card" ? `Pay ${formatNaira(price)} by card` : `Pay ${formatNaira(price)} and request`}
                </Button>
                <p className="text-sm text-ink-500">
                  The doctor has a few minutes to accept. If they don’t, the full amount goes back to your wallet.
                </p>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
