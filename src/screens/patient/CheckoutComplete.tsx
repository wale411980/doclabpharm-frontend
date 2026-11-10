import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, ErrorState, LoadingState, buttonStyles } from "@/components/dashboard/ui";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { findInstantConsultForOrder, useCardCheckoutStatus } from "@/queries/use-checkout";
import type { CardStatus } from "@/types/marketplace";

const COPY: Record<CardStatus, { icon: LucideIcon; title: string; tone: string }> = {
  paid: { icon: CheckCircle2, title: "Payment received", tone: "bg-brand-50 text-brand-700" },
  pending: { icon: Clock, title: "Waiting for your bank", tone: "bg-warm-100 text-warm-900" },
  failed: { icon: XCircle, title: "Payment did not go through", tone: "bg-red-100 text-red-800" },
  refunded: { icon: RotateCcw, title: "Payment refunded", tone: "bg-sky-100 text-sky-900" },
  refund_failed: { icon: RotateCcw, title: "We owe you a refund", tone: "bg-red-100 text-red-800" },
};

/** Paystack sends the patient here after a card payment (?reference=…). */
export default function CheckoutComplete() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reference = params.get("reference") || params.get("trxref");
  const { data, isLoading, isError, error, refetch } = useCardCheckoutStatus(reference);
  const cart = useAuth().cartContext;
  const [consultId, setConsultId] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Payment | DocLabPharm";
  }, []);

  // Once paid, the order exists: empty the cart and find a "see now" consultation.
  useEffect(() => {
    if (data?.status !== "paid" || !data.order) return;
    cart?.clearCart();
    findInstantConsultForOrder(data.order.id)
      .then((booking) => booking && setConsultId(booking.id))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status, data?.order?.id]);

  useEffect(() => {
    if (consultId) navigate(`/user/consults/${consultId}`, { replace: true });
  }, [consultId, navigate]);

  if (!reference) {
    return (
      <Shell>
        <ErrorState message="This page needs a payment reference. If you have just paid, check My orders or your wallet." />
        <Link to="/user/deliveries" className={buttonStyles("secondary")}>
          Go to my orders
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      {isLoading && <LoadingState label="Checking your payment with Paystack" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not check this payment.")} onRetry={() => refetch()} />}
      {data && (
        <Card className="flex flex-col items-center gap-4 text-center">
          {(() => {
            const copy = COPY[data.status] ?? COPY.pending;
            const Icon = copy.icon;
            return (
              <>
                <span className={cn("flex h-16 w-16 items-center justify-center rounded-full", copy.tone)}>
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <h1 className="text-2xl font-extrabold text-ink-900">{copy.title}</h1>
              </>
            );
          })()}
          <p className="max-w-md text-ink-700" role="status">
            {data.message}
          </p>
          {data.status === "pending" && <p className="text-sm text-ink-500">This page checks again every few seconds.</p>}
          {data.order && <p className="text-sm text-ink-500">Order {data.order.orderTrx}</p>}
          <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {data.status === "paid" && (
              <>
                <Link to="/user/deliveries" className={buttonStyles("primary")}>
                  Track my order
                </Link>
                <Link to="/user/appointments" className={buttonStyles("secondary")}>
                  My appointments
                </Link>
              </>
            )}
            {(data.status === "failed" || data.status === "refunded") && (
              <Link to="/user/checkout" className={buttonStyles("primary")}>
                Back to checkout
              </Link>
            )}
            {data.status === "refund_failed" && (
              <Link to="/user/support" className={buttonStyles("primary")}>
                Contact support
              </Link>
            )}
          </div>
        </Card>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-1 py-6 sm:py-10">{children}</div>;
}
