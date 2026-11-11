"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Loader2 } from "lucide-react";
import { API_URL, naira, writeBasket, writeMedicines } from "@/site/basket";

type Booking = {
  status: "pending" | "paid" | "failed" | "refunded" | "refund_failed";
  message: string;
  first_name: string | null;
  amount: number;
  tests: { name: string; date: string | null; time: string | null; collection: string }[];
  medicines?: { name: string; qty: number }[];
  deliveries?: { pharmacy: string | null; method: string; address: string | null; handover_code: string | null }[];
  consult?: { booking_id: number; status: string; doctor: string | null } | null;
  can_set_password: boolean;
};

const when = (date: string | null, time: string | null) => {
  if (!date) return "";
  const day = new Date(`${date}T${time || "09:00"}:00`);
  return day.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" }) + (time ? `, ${day.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })}` : "");
};

/** After Paystack: confirm the booking, then offer a password (the account comes last). */
export function CheckoutComplete() {
  const [reference, setReference] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [lost, setLost] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [accountReady, setAccountReady] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let ref = params.get("reference") || params.get("trxref");
    if (!ref) {
      try {
        ref = localStorage.getItem("dlp_last_booking");
      } catch {
        ref = null;
      }
    }
    if (!ref) {
      setLost(true);
      return;
    }
    setReference(ref);
  }, []);

  useEffect(() => {
    if (!reference) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/guest/checkout/${encodeURIComponent(reference)}`, { headers: { Accept: "application/json" } });
        if (res.status === 404) {
          setLost(true);
          return;
        }
        const body = (await res.json()) as Booking;
        if (stopped) return;
        setBooking(body);
        if (body.status === "paid") {
          writeBasket([]);
          writeMedicines([]);
        }
        if (body.status === "pending" && tries.current++ < 20) timer = setTimeout(check, 3000);
      } catch {
        if (!stopped && tries.current++ < 20) timer = setTimeout(check, 3000);
      }
    };
    check();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [reference]);

  const claimToken = () => {
    try {
      return reference ? localStorage.getItem(`dlp_claim_${reference}`) : null;
    } catch {
      return null;
    }
  };

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    setAccountMessage("");
    if (password.length < 8) {
      setAccountMessage("Use at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/guest/checkout/${encodeURIComponent(reference!)}/account`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ claim_token: claimToken(), password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAccountMessage(body.message || "We could not save your password. Use Forgot password on the sign in page.");
      } else {
        // Same places the sign-in page keeps them, so the dashboard opens signed in.
        const { token, ...user } = body.data;
        localStorage.setItem("user", JSON.stringify({ ...user, token }));
        localStorage.setItem("token", token);
        localStorage.removeItem(`dlp_claim_${reference}`);
        setAccountReady(true);
      }
    } catch {
      setAccountMessage("No connection. Check your internet and try again.");
    }
    setSaving(false);
  };

  const shell = "mx-auto flex max-w-2xl flex-col gap-6 py-10 sm:py-16";

  if (lost) {
    return (
      <div className={shell}>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900">We could not find that booking</h1>
        <p className="text-lg text-ink-700">If you paid, your confirmation is in your email. You can also book again below.</p>
        <Link href="/tests" className="inline-flex min-h-14 w-fit items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night">
          See all tests
        </Link>
      </div>
    );
  }

  if (!booking || booking.status === "pending") {
    return (
      <div className={shell} aria-live="polite">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" aria-hidden="true" />
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900">Confirming your payment</h1>
        <p className="text-lg text-ink-700">This takes a few seconds. Please keep this page open.</p>
      </div>
    );
  }

  if (booking.status !== "paid") {
    return (
      <div className={shell}>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900">Your booking was not completed</h1>
        <p className="text-lg text-ink-700">{booking.message}</p>
        <Link href="/checkout" className="inline-flex min-h-14 w-fit items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night">
          Try again
        </Link>
      </div>
    );
  }

  const showPassword = booking.can_set_password && Boolean(claimToken()) && !accountReady;

  return (
    <div className={shell}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime">
        <Check className="h-9 w-9 text-night" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink-900 sm:text-6xl">
          {(booking.tests ?? []).length > 0 || booking.consult ? "You are booked" : "Order placed"}
          {booking.first_name ? `, ${booking.first_name}` : ""}
        </h1>
        <p className="text-lg text-ink-700">We received {naira(booking.amount)}. Your booking details are sent to your email.</p>
      </div>

      <ul className="flex flex-col gap-2">
        {(booking.tests ?? []).map((test, index) => (
          <li key={index} className="flex items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100">
            <CalendarCheck className="mt-0.5 h-6 w-6 flex-none text-brand-700" aria-hidden="true" />
            <div>
              <p className="text-lg font-extrabold text-ink-900">{test.name}</p>
              <p className="text-[15px] text-ink-700">
                {when(test.date, test.time)}
                {test.collection === "home" ? ", at your home" : ", at the lab"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {(booking.deliveries ?? []).map((delivery, index) => (
        <div key={index} className="rounded-3xl bg-white p-5 ring-1 ring-brand-100">
          <p className="text-lg font-extrabold text-ink-900">
            {delivery.method === "delivery" ? `${delivery.pharmacy} delivers to you` : `Pick up at ${delivery.pharmacy}`}
          </p>
          <p className="text-[15px] text-ink-700">{delivery.address}</p>
          <ul className="mt-2 text-[15px] text-ink-700">
            {(booking.medicines ?? []).map((medicine) => (
              <li key={medicine.name}>
                {medicine.qty} × {medicine.name}
              </li>
            ))}
          </ul>
          {delivery.handover_code && (
            <p className="mt-3 w-fit rounded-2xl bg-brand-50 px-4 py-2 text-[15px] font-bold text-ink-900">
              Your code: <span className="font-display text-xl tracking-widest">{delivery.handover_code}</span>. Give it only when you receive your medicine.
            </p>
          )}
        </div>
      ))}

      {booking.consult && (
        <div className="rounded-3xl bg-white p-5 ring-1 ring-brand-100">
          <p className="text-lg font-extrabold text-ink-900">{booking.consult.doctor ?? "Your doctor"} has been told you are waiting</p>
          <p className="text-[15px] text-ink-700">
            {showPassword
              ? "Choose a password below to open your chat or video call. If the doctor does not accept in a few minutes, you are refunded."
              : "Sign in to open your chat or video call."}
          </p>
          {accountReady && (
            <a href={`/user/consults/${booking.consult.booking_id}`} className="mt-3 inline-flex min-h-12 items-center rounded-2xl bg-lime px-6 text-base font-extrabold text-night">
              Open my consultation
            </a>
          )}
        </div>
      )}

      {showPassword && (
        <form onSubmit={createAccount} className="flex flex-col gap-4 rounded-[28px] bg-night p-6 text-white sm:p-7">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">See your result in one place</h2>
            <p className="mt-1 text-white/75">Choose a password and your account is ready. You can also skip this; your result still comes by email.</p>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[15px] font-bold">Choose a password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="h-14 w-full rounded-2xl bg-white px-4 text-base font-medium text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </label>
          {accountMessage && (
            <p role="alert" className="text-[15px] font-semibold text-[#ffb4a6]">
              {accountMessage}
            </p>
          )}
          <button type="submit" disabled={saving} className="min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night disabled:opacity-60">
            {saving ? "Saving" : "Save password"}
          </button>
        </form>
      )}

      {accountReady && (
        <div className="flex flex-col gap-4 rounded-[28px] bg-night p-6 text-white sm:p-7">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Your account is ready</h2>
          <a href="/user/dashboard" className="inline-flex min-h-14 w-fit items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night">
            Open my account
          </a>
        </div>
      )}

      {!showPassword && !accountReady && (
        <p className="text-[15px] text-ink-700">
          Already have an account with this email? <a href="/login" className="font-bold text-brand-700 underline">Sign in</a> to see this booking.
        </p>
      )}

      <Link href="/tests" className="w-fit text-[15px] font-bold text-brand-700 hover:underline">
        Book another test
      </Link>
    </div>
  );
}
