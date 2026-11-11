"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Stethoscope } from "lucide-react";
import { API_URL, naira } from "@/site/basket";
import { SetPassword } from "./SetPassword";

type Booking = {
  status: "pending_payment" | "open" | "accepted" | "failed" | "expired" | "expiring" | "refund_failed";
  message: string;
  first_name: string | null;
  amount: number;
  specialty: string;
  when: string;
  confirm_by: string | null;
  doctor: string | null;
  can_set_password: boolean;
};

const dayTime = (value: string | null) => {
  if (!value) return "";
  const at = new Date(value);
  return `${at.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })} at ${at.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })}`;
};

/** After Paystack: the request is with our doctors; then the password (the account comes last). */
export function DoctorBooked() {
  const [reference, setReference] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [lost, setLost] = useState(false);
  const [hasClaim, setHasClaim] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let ref = params.get("reference") || params.get("trxref");
    try {
      ref = ref || localStorage.getItem("dlp_last_doctor_booking");
      setHasClaim(Boolean(ref && localStorage.getItem(`dlp_claim_${ref}`)));
    } catch {
      // Storage is blocked.
    }
    if (!ref) setLost(true);
    else setReference(ref);
  }, []);

  useEffect(() => {
    if (!reference) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/guest/doctor-request/${encodeURIComponent(reference)}`, { headers: { Accept: "application/json" } });
        if (res.status === 404) {
          setLost(true);
          return;
        }
        const body = (await res.json()) as Booking;
        if (stopped) return;
        setBooking(body);
        // Keep looking while payment is confirming (quickly) or a doctor is being found (slowly).
        if (body.status === "pending_payment" && tries.current++ < 20) timer = setTimeout(check, 3000);
        else if (body.status === "open") timer = setTimeout(check, 30000);
      } catch {
        if (!stopped && tries.current++ < 20) timer = setTimeout(check, 5000);
      }
    };
    check();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [reference]);

  const shell = "mx-auto flex max-w-2xl flex-col gap-6 py-10 sm:py-16";
  const title = "font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink-900 sm:text-6xl";

  if (lost) {
    return (
      <div className={shell}>
        <h1 className={title}>We could not find that booking</h1>
        <p className="text-lg text-ink-700">If you paid, your confirmation is in your email.</p>
        <Link href="/see-a-doctor" className="inline-flex min-h-14 w-fit items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night">
          Book a doctor
        </Link>
      </div>
    );
  }

  if (!booking || booking.status === "pending_payment") {
    return (
      <div className={shell} aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" aria-hidden="true" />
        <h1 className={title}>Confirming your payment</h1>
        <p className="text-lg text-ink-700">This takes a few seconds. Please keep this page open.</p>
      </div>
    );
  }

  if (booking.status !== "open" && booking.status !== "accepted") {
    return (
      <div className={shell}>
        <h1 className={title}>{booking.status === "failed" ? "Your booking was not completed" : "No doctor was free this time"}</h1>
        <p className="text-lg text-ink-700">{booking.message}</p>
        <Link href="/see-a-doctor" className="inline-flex min-h-14 w-fit items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night">
          Choose another time
        </Link>
      </div>
    );
  }

  const confirmed = booking.status === "accepted";

  return (
    <div className={shell}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime">
        {confirmed ? <Check className="h-9 w-9 text-night" aria-hidden="true" /> : <Stethoscope className="h-8 w-8 text-night" aria-hidden="true" />}
      </span>
      <div className="flex flex-col gap-2" aria-live="polite">
        <h1 className={title}>
          {confirmed ? "Your doctor is confirmed" : `We are finding your doctor${booking.first_name ? `, ${booking.first_name}` : ""}`}
        </h1>
        <p className="text-lg text-ink-700">
          {confirmed
            ? `${booking.doctor} will see you on ${dayTime(booking.when)}. Sign in a few minutes before to start your chat or video call.`
            : `We received ${naira(booking.amount)}. Verified doctors have been told, and we email you as soon as one confirms.`}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-brand-100 ring-1 ring-brand-100 sm:grid-cols-2">
        <div className="bg-white p-5">
          <dt className="text-sm font-semibold text-ink-500">Doctor</dt>
          <dd className="text-lg font-extrabold text-ink-900">{booking.doctor ?? booking.specialty}</dd>
        </div>
        <div className="bg-white p-5">
          <dt className="text-sm font-semibold text-ink-500">Your time</dt>
          <dd className="text-lg font-extrabold text-ink-900">{dayTime(booking.when)}</dd>
        </div>
      </dl>

      {!confirmed && booking.confirm_by && (
        <p className="text-[15px] text-ink-700">
          If no doctor confirms by {dayTime(booking.confirm_by)}, your card is refunded in full. You can close this page; we will email you.
        </p>
      )}

      {booking.can_set_password && hasClaim && reference ? (
        <SetPassword
          path={`/guest/doctor-request/${encodeURIComponent(reference)}/account`}
          claimKey={`dlp_claim_${reference}`}
          intro="Your consultation happens inside your DocLabPharm account. Choose a password now so you are ready when the doctor is."
        />
      ) : (
        <p className="text-[15px] text-ink-700">
          Your consultation happens inside your DocLabPharm account.{" "}
          <a href="/login" className="font-bold text-brand-700 underline">
            Sign in
          </a>{" "}
          with the email you booked with. New here? Use Forgot password on the sign in page to set one.
        </p>
      )}
    </div>
  );
}
