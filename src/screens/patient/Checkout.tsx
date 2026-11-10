import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, FlaskConical, Home, Pill, ShoppingCart, Stethoscope, Store, Truck, Wallet, Zap } from "lucide-react";
import { Button, Card, Field, PageHeader, buttonStyles, inputStyles } from "@/components/dashboard/ui";
import { EmptyState, InlineError } from "@/components/dashboard/marketplace";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/apiError";
import { formatNaira } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useGetUserWallet } from "@/queries";
import {
  cardCallbackUrl,
  findInstantConsultForOrder,
  useCheckout,
  useCheckoutQuote,
  useOnlineDoctors,
} from "@/queries/use-checkout";
import type { CheckoutItem, DeliveryChoice, PaymentMethod } from "@/types/marketplace";
import { AddressPicker } from "./AddressPicker";

type Collection = "at_lab" | "home";
type ConsultMode = "scheduled" | "now";

/**
 * Checkout for everything in the cart: how medicines reach the patient, where
 * lab samples are taken, when consultations happen, and how to pay.
 */
export default function Checkout() {
  const navigate = useNavigate();
  const cart = useAuth().cartContext;
  const items = useMemo(() => cart?.items ?? [], [cart?.items]);

  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [collection, setCollection] = useState<Record<number, Collection>>({});
  const [collectionAddress, setCollectionAddress] = useState<number | null>(null);
  const [consultMode, setConsultMode] = useState<Record<number, ConsultMode>>({});
  const [payment, setPayment] = useState<PaymentMethod>("wallet");
  const [error, setError] = useState("");

  const { data: wallet } = useGetUserWallet();
  const { data: online } = useOnlineDoctors();
  const checkout = useCheckout();

  useEffect(() => {
    document.title = "Checkout | DocLabPharm";
  }, []);

  const hasMeds = items.some((item) => item.service_type === "med");
  const needsHomeAddress = items.some((item, i) => item.service_type === "lab" && collection[i] === "home");
  const onlineIds = new Set((online?.data ?? []).map((d) => d.id));

  const checkoutItems: CheckoutItem[] = items.map((item, i) => {
    if (item.service_type === "lab") return { ...item, collection: collection[i] ?? "at_lab" };
    if (item.service_type === "consult") {
      const mode = consultMode[i] ?? "scheduled";
      return mode === "now" ? { ...item, mode: "now" } : { ...item, mode: "scheduled" };
    }
    return { ...item, qty: item.qty || 1 };
  });

  const delivery: DeliveryChoice | undefined = hasMeds
    ? deliveryMethod === "delivery"
      ? { method: "delivery", addressId: deliveryAddress ?? undefined, phone: phone.trim() || undefined, note: note.trim() || undefined }
      : { method: "pickup", phone: phone.trim() || undefined, note: note.trim() || undefined }
    : undefined;

  const ready = !(hasMeds && deliveryMethod === "delivery" && !deliveryAddress) && !(needsHomeAddress && !collectionAddress);

  const quoteInput = ready && items.length > 0
    ? { items: checkoutItems, delivery, collectionAddressId: needsHomeAddress ? collectionAddress ?? undefined : undefined }
    : null;
  const quote = useCheckoutQuote(quoteInput);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
  const total = quote.data?.total ?? null;
  const balance = Number(wallet?.balance ?? 0);
  const walletShort = payment === "wallet" && total !== null && balance < total;

  const placeOrder = async () => {
    setError("");
    if (!quoteInput) {
      setError("Please choose an address first.");
      return;
    }
    try {
      const result = await checkout.mutateAsync({
        ...quoteInput,
        paymentMethod: payment,
        callbackUrl: payment === "card" ? cardCallbackUrl() : undefined,
      });
      if (result.payment) {
        // Paystack takes over; the cart is cleared once the payment is confirmed.
        window.location.assign(result.payment.authorizationUrl);
        return;
      }
      cart?.clearCart();
      toast.success("Order placed. Thank you!");
      const consult = items.some((item, i) => item.service_type === "consult" && consultMode[i] === "now")
        ? await findInstantConsultForOrder(result.order!.id).catch(() => undefined)
        : undefined;
      if (consult) navigate(`/user/consults/${consult.id}`);
      else if (hasMeds) navigate("/user/deliveries");
      else navigate("/user/checkout-success");
    } catch (e) {
      setError(apiErrorMessage(e, "We could not place your order. Please try again."));
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-1 py-2 sm:py-4">
        <PageHeader title="Checkout" />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/user/medicines/near-me" className={buttonStyles("primary")}>
                Find medicines
              </Link>
              <Link to="/patient/booking/select-test" className={buttonStyles("secondary")}>
                Book a test
              </Link>
            </div>
          }
        >
          Add medicines, tests or a consultation, then come back here to pay.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader title="Checkout" intro="Check your order, choose how you want it, then pay from your wallet or by card." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          {hasMeds && (
            <Card className="flex flex-col gap-5">
              <SectionTitle icon={Pill} title="Your medicines" />
              <ItemList items={items.map((item, i) => ({ item, i })).filter(({ item }) => item.service_type === "med")} />
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 font-bold text-ink-900">How do you want to get them?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ChoiceCard
                    name="delivery-method"
                    checked={deliveryMethod === "delivery"}
                    onSelect={() => setDeliveryMethod("delivery")}
                    icon={Truck}
                    title="Deliver to me"
                    text="A rider brings it to your address. Delivery fee is shown below."
                  />
                  <ChoiceCard
                    name="delivery-method"
                    checked={deliveryMethod === "pickup"}
                    onSelect={() => setDeliveryMethod("pickup")}
                    icon={Store}
                    title="I will pick it up"
                    text="Collect it at the pharmacy counter when it is ready. No delivery fee."
                  />
                </div>
              </fieldset>
              {deliveryMethod === "delivery" && <AddressPicker legend="Deliver to" value={deliveryAddress} onChange={setDeliveryAddress} />}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone for the pharmacy (optional)" id="delivery-phone" hint="We use your account phone if you leave this empty.">
                  <input id="delivery-phone" type="tel" inputMode="tel" className={inputStyles} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} autoComplete="tel" />
                </Field>
                <Field label="Note for the pharmacy (optional)" id="delivery-note">
                  <input id="delivery-note" className={inputStyles} value={note} onChange={(e) => setNote(e.target.value)} maxLength={255} placeholder="Call me at the gate" />
                </Field>
              </div>
              <p className="rounded-2xl bg-warm-50 p-4 text-sm text-warm-900">
                Some medicines need a prescription. The pharmacist will ask to see it before handing them over.
              </p>
            </Card>
          )}

          {items.some((item) => item.service_type === "lab") && (
            <Card className="flex flex-col gap-5">
              <SectionTitle icon={FlaskConical} title="Your lab tests" />
              {items.map((item, i) =>
                item.service_type !== "lab" ? null : (
                  <fieldset key={i} className="flex flex-col gap-3 border-t border-brand-100 pt-4 first-of-type:border-t-0 first-of-type:pt-0">
                    <legend className="sr-only">Where should {item.name} be taken?</legend>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-bold text-ink-900">{item.name}</p>
                      <p className="font-bold text-ink-900">{formatNaira(item.price)}</p>
                    </div>
                    <p className="text-sm text-ink-500">
                      {item.date} at {item.time}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ChoiceCard
                        name={`collection-${i}`}
                        checked={(collection[i] ?? "at_lab") === "at_lab"}
                        onSelect={() => setCollection((c) => ({ ...c, [i]: "at_lab" }))}
                        icon={FlaskConical}
                        title="At the lab"
                        text="Visit the lab at your booked time."
                      />
                      <ChoiceCard
                        name={`collection-${i}`}
                        checked={collection[i] === "home"}
                        onSelect={() => setCollection((c) => ({ ...c, [i]: "home" }))}
                        icon={Home}
                        title="Collect at home"
                        text="The lab sends someone to take your sample. A home visit fee applies."
                      />
                    </div>
                  </fieldset>
                )
              )}
              {needsHomeAddress && <AddressPicker legend="Collect my sample at" value={collectionAddress} onChange={setCollectionAddress} />}
            </Card>
          )}

          {items.some((item) => item.service_type === "consult") && (
            <Card className="flex flex-col gap-5">
              <SectionTitle icon={Stethoscope} title="Your consultations" />
              {items.map((item, i) => {
                if (item.service_type !== "consult") return null;
                const canSeeNow = onlineIds.has(Number(item.doctor_id));
                const mode = consultMode[i] ?? "scheduled";
                return (
                  <fieldset key={i} className="flex flex-col gap-3">
                    <legend className="sr-only">When do you want to see the doctor?</legend>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-bold text-ink-900">{item.name}</p>
                      <p className="font-bold text-ink-900">{formatNaira(item.price)}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ChoiceCard
                        name={`consult-${i}`}
                        checked={mode === "scheduled"}
                        onSelect={() => setConsultMode((m) => ({ ...m, [i]: "scheduled" }))}
                        icon={Stethoscope}
                        title="At my booked time"
                        text="The time you picked in the doctor's calendar."
                      />
                      <ChoiceCard
                        name={`consult-${i}`}
                        checked={mode === "now"}
                        disabled={!canSeeNow}
                        onSelect={() => setConsultMode((m) => ({ ...m, [i]: "now" }))}
                        icon={Zap}
                        title="See the doctor now"
                        text={canSeeNow ? "This doctor is online. They accept within a few minutes or you are refunded." : "This doctor is not online right now."}
                      />
                    </div>
                  </fieldset>
                );
              })}
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
          <Card className="flex flex-col gap-4">
            <h2 className="text-lg font-extrabold text-ink-900">Summary</h2>
            <dl className="flex flex-col gap-2 text-ink-700">
              <Row label={`Items (${items.length})`} value={formatNaira(subtotal)} />
              {quote.data?.deliveries.map((d) => (
                <Row
                  key={d.pharmacyId}
                  label={d.method === "delivery" ? `Delivery from ${d.pharmacy}${d.distanceKm ? ` (${d.distanceKm} km)` : ""}` : `Pickup at ${d.pharmacy}`}
                  value={d.method === "delivery" ? formatNaira(d.fee) : "Free"}
                />
              ))}
              {quote.data?.homeCollections.map((c) => (
                <Row key={c.labId} label={`Home sample collection by ${c.lab}`} value={formatNaira(c.fee)} />
              ))}
              <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-brand-100 pt-3">
                <dt className="font-extrabold text-ink-900">Total</dt>
                <dd className="text-2xl font-extrabold text-ink-900 tabular-nums">
                  {quote.isFetching && !quote.data ? "…" : total !== null ? formatNaira(total) : "—"}
                </dd>
              </div>
            </dl>
            {!ready && <p className="text-sm text-ink-500">Choose an address to see the delivery fee and total.</p>}
            {quote.isError && <InlineError>{apiErrorMessage(quote.error, "We could not price your order.")}</InlineError>}
          </Card>

          <Card className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 text-lg font-extrabold text-ink-900">Pay with</legend>
              <ChoiceCard
                name="payment"
                checked={payment === "wallet"}
                onSelect={() => setPayment("wallet")}
                icon={Wallet}
                title="My DocLabPharm wallet"
                text={`Balance: ${formatNaira(balance)}`}
              />
              <ChoiceCard
                name="payment"
                checked={payment === "card"}
                onSelect={() => setPayment("card")}
                icon={CreditCard}
                title="Debit card"
                text="Pay securely on Paystack. You will come back here after paying."
              />
            </fieldset>
            {walletShort && (
              <p className="rounded-2xl bg-warm-50 p-4 text-sm text-warm-900">
                Your wallet is {formatNaira((total ?? 0) - balance)} short.{" "}
                <Link to="/user/wallet" className="font-bold underline">
                  Top up your wallet
                </Link>{" "}
                or pay by card.
              </p>
            )}
            <InlineError>{error}</InlineError>
            {error === "Insufficient wallet balance." && (
              <Link to="/user/wallet" className={buttonStyles("secondary")}>
                Top up wallet
              </Link>
            )}
            <Button onClick={placeOrder} loading={checkout.isPending} disabled={!ready || !quote.data || walletShort} className="w-full">
              {payment === "card" ? "Continue to card payment" : `Pay ${total !== null ? formatNaira(total) : ""}`}
            </Button>
            <Link to="/user/cart" className="text-center text-sm font-bold text-brand-700 underline-offset-4 hover:underline">
              Back to cart
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Pill; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-lg font-extrabold text-ink-900">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      {title}
    </h2>
  );
}

function ItemList({ items }: { items: { item: { name: string; price: number; qty?: number }; i: number }[] }) {
  return (
    <ul className="flex flex-col divide-y divide-brand-100">
      {items.map(({ item, i }) => (
        <li key={i} className="flex items-baseline justify-between gap-3 py-2">
          <span className="min-w-0 text-ink-700">
            {item.name} <span className="text-ink-500">× {item.qty || 1}</span>
          </span>
          <span className="font-bold text-ink-900 tabular-nums">{formatNaira(Number(item.price) * (item.qty || 1))}</span>
        </li>
      ))}
    </ul>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 text-sm">{label}</dt>
      <dd className="shrink-0 font-bold tabular-nums">{value}</dd>
    </div>
  );
}

export function ChoiceCard({
  name,
  checked,
  onSelect,
  icon: Icon,
  title,
  text,
  disabled,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  icon: typeof Pill;
  title: string;
  text: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-2xl p-4 ring-1 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-700",
        disabled ? "cursor-not-allowed bg-sand opacity-60 ring-brand-100" : "cursor-pointer",
        !disabled && (checked ? "bg-brand-50 ring-2 ring-brand-600" : "bg-white ring-brand-100 hover:ring-brand-300")
      )}
    >
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onSelect} disabled={disabled} />
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", checked ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700")}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-bold text-ink-900">{title}</span>
        <span className="text-sm text-ink-500">{text}</span>
      </span>
    </label>
  );
}
