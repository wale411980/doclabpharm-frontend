"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Lock, Minus, Plus, X } from "lucide-react";
import { API_URL, naira, readBasket, readMedicines, writeBasket, writeMedicines, type BasketMedicine, type BasketTest } from "@/site/basket";
import { cn } from "@/lib/utils";

const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const timeLabel = (time: string) => {
  const hour = Number(time.slice(0, 2));
  return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "pm" : "am"}`;
};

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function nextDays(): { value: string; top: string; bottom: string }[] {
  const list = [];
  for (let offset = 1; list.length < 8; offset++) {
    const day = new Date();
    day.setDate(day.getDate() + offset);
    if (day.getDay() === 0) continue; // no sample visits on Sundays
    list.push({
      value: isoDate(day),
      top: offset === 1 ? "Tomorrow" : day.toLocaleDateString("en-NG", { weekday: "short" }),
      bottom: day.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  return list;
}

type Errors = Record<string, string>;

const field =
  "h-14 w-full min-w-0 rounded-2xl bg-white px-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500";

/**
 * One page to order: the basket, when our nurse should come (for tests), the
 * address everything comes to, and who it is for. Nobody is sent to a lab or
 * a pharmacy. Payment comes next; an account comes last.
 */
export function Checkout() {
  const days = useMemo(nextDays, []);
  const [tests, setTests] = useState<BasketTest[] | null>(null);
  const [meds, setMeds] = useState<BasketMedicine[]>([]);
  const [date, setDate] = useState(days[0].value);
  const [time, setTime] = useState("09:00");
  const [areas, setAreas] = useState<string[]>([]);
  const [paymentsReady, setPaymentsReady] = useState(true);
  const [area, setArea] = useState("");
  const [line, setLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [problem, setProblem] = useState("");
  const [areaProblem, setAreaProblem] = useState("");
  const [fees, setFees] = useState<{ visit: number; delivery: number } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTests(readBasket());
    setMeds(readMedicines());
    try {
      setArea(localStorage.getItem("dlp_area") || "");
      // Details typed last time, or the signed-in account's own.
      const account = JSON.parse(localStorage.getItem("user") || "{}");
      const saved = JSON.parse(localStorage.getItem("dlp_contact") || "{}");
      setFirstName(saved.first_name || account.firstName || account.first_name || "");
      setLastName(saved.last_name || account.lastName || account.last_name || "");
      setPhone(saved.phone || account.phone || "");
      setEmail(saved.email || account.email || "");
    } catch {
      // Nothing saved from last time.
    }
    fetch(`${API_URL}/guest/areas`, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (body?.areas) setAreas(body.areas);
        if (body && body.payments_ready === false) setPaymentsReady(false);
      })
      .catch(() => undefined);
  }, []);

  const list = tests ?? [];
  const subtotal = list.reduce((sum, test) => sum + test.price, 0) + meds.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = list.length + meds.reduce((sum, item) => sum + item.qty, 0);

  const items = useMemo(
    () => [
      ...list.map((test) => ({ service_type: "lab", service_id: test.id, lab_technician_id: test.lab_id, date, time })),
      ...meds.map((item) => ({ service_type: "med", product_id: item.id, qty: item.qty })),
    ],
    [list, meds, date, time]
  );

  // The nurse visit and delivery cost depend on the area, so ask once it is chosen.
  useEffect(() => {
    setAreaProblem("");
    setFees(null);
    if (!area || items.length === 0) return;

    const controller = new AbortController();
    fetch(`${API_URL}/guest/checkout/quote`, {
      method: "POST",
      signal: controller.signal,
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ items, address: { area } }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (res.ok) setFees({ visit: Number(body.nurse_visit_fee) || 0, delivery: Number(body.delivery_fee) || 0 });
        else if (res.status === 422 && body.message) setAreaProblem(body.message);
      })
      .catch(() => undefined);

    try {
      localStorage.setItem("dlp_area", area);
    } catch {
      // Not remembered.
    }
    return () => controller.abort();
  }, [area, items]);

  // Before the area is known: the visit fee shown on the test, and delivery to be confirmed.
  const visitEstimate = () => {
    const perLab = new Map<number, number>();
    list.forEach((test) => perLab.set(test.lab_id, test.visit_fee ?? 0));
    return Array.from(perLab.values()).reduce((sum, fee) => sum + fee, 0);
  };
  const visitFee = fees?.visit ?? visitEstimate();
  const deliveryFee = fees?.delivery ?? 0;
  const total = subtotal + visitFee + deliveryFee;

  const removeTest = (id: number) => {
    const next = list.filter((test) => test.id !== id);
    setTests(next);
    writeBasket(next);
  };

  const changeMedicine = (id: number, qty: number) => {
    const next = meds.map((item) => (item.id === id ? { ...item, qty: Math.max(0, Math.min(qty, item.max, 20)) } : item)).filter((item) => item.qty > 0);
    setMeds(next);
    writeMedicines(next);
  };

  const check = (): Errors => {
    const found: Errors = {};
    if (!area) found.area = "Choose your area";
    if (!line.trim()) found.line = "Enter your house address";
    if (!firstName.trim()) found.first_name = "Enter your first name";
    if (!lastName.trim()) found.last_name = "Enter your last name";
    if (!/^\+?[0-9 ]{10,16}$/.test(phone.trim())) found.phone = "Enter a phone number we can call, like 0803 123 4567";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "Enter your email";
    return found;
  };
  // After the first try, each message goes away as soon as its field is right.
  const errors: Errors = attempted ? check() : {};

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setProblem("");
    setAttempted(true);

    const found = check();
    if (Object.keys(found).length > 0) {
      document.getElementById(`f-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (areaProblem) return;

    const contact = { first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim(), email: email.trim() };
    try {
      localStorage.setItem("dlp_contact", JSON.stringify(contact));
    } catch {
      // Not remembered for next time.
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/guest/checkout`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          contact,
          address: { area, line: line.trim(), landmark: landmark.trim() || null },
          callback_url: `${window.location.origin}/checkout/complete`,
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body.payment?.authorization_url) {
        const first = body.errors ? (Object.values(body.errors)[0] as string[])[0] : null;
        setProblem(first || body.message || "We could not start your order. Please try again.");
        setBusy(false);
        return;
      }

      try {
        if (body.claim_token) localStorage.setItem(`dlp_claim_${body.payment.reference}`, body.claim_token);
        localStorage.setItem("dlp_last_booking", body.payment.reference);
      } catch {
        // They can still set a password later with "Forgot password".
      }
      window.location.assign(body.payment.authorization_url);
    } catch {
      setProblem("No connection. Check your internet and try again.");
      setBusy(false);
    }
  };

  if (tests === null) {
    return <div className="min-h-[50vh]" aria-busy="true" />;
  }

  if (list.length === 0 && meds.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 py-16 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900">Your basket is empty</h1>
        <p className="text-lg text-ink-700">Pick a test or a medicine and you will be back here in one tap. No account needed.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/tests" className="inline-flex min-h-14 items-center rounded-2xl bg-lime px-8 text-lg font-extrabold text-night hover:bg-[#d6fa85]">
            Book a test
          </Link>
          <Link href="/medicines" className="inline-flex min-h-14 items-center rounded-2xl bg-night px-8 text-lg font-extrabold text-white">
            Order medicine
          </Link>
        </div>
      </div>
    );
  }

  const chip = (active: boolean) =>
    cn(
      "flex-none rounded-2xl px-4 font-bold ring-1 ring-inset transition-colors",
      active ? "bg-night text-white ring-night" : "bg-white text-ink-700 ring-brand-200 hover:bg-brand-50"
    );
  const card = "rounded-[28px] bg-white p-5 ring-1 ring-brand-100 sm:p-7";
  const heading = "font-display text-2xl font-extrabold tracking-tight text-ink-900";
  const label = "mb-1.5 block text-[15px] font-bold text-ink-900";
  const error = (key: string) => errors[key] && <span className="mt-1.5 block text-sm font-semibold text-[#b3261e]">{errors[key]}</span>;
  const blocked = busy || Boolean(areaProblem) || !paymentsReady;
  const comes = list.length > 0 && meds.length > 0 ? "Our nurse and your medicine come to this address." : list.length > 0 ? "Our nurse comes to this address to take your sample." : "We deliver your medicine to this address.";

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-6 pb-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:pb-0">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-5xl">{list.length > 0 ? "Book your test" : "Your order"}</h1>
          <p className="text-lg text-ink-700">We come to you. One page, then you pay. No account needed.</p>
        </div>

        <section className={card} aria-labelledby="h-basket">
          <h2 id="h-basket" className={heading}>
            Your basket
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-brand-100">
            {list.map((test) => (
              <li key={`t${test.id}`} className="flex items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold leading-snug text-ink-900">{test.name}</p>
                  <p className="text-sm text-ink-500">Sample taken at your home by our nurse</p>
                </div>
                <span className="text-[17px] font-extrabold text-ink-900">{naira(test.price)}</span>
                <button type="button" onClick={() => removeTest(test.id)} aria-label={`Remove ${test.name}`} className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-ink-500 hover:bg-brand-50 hover:text-ink-900">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            ))}
            {meds.map((item) => (
              <li key={`m${item.id}`} className="flex items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold leading-snug text-ink-900">{item.name}</p>
                  <p className="text-sm text-ink-500">{item.pack ? `${item.pack}. ` : ""}Delivered to you</p>
                </div>
                <div className="flex flex-none items-center gap-1 rounded-full bg-brand-50 p-1">
                  <button type="button" onClick={() => changeMedicine(item.id, item.qty - 1)} aria-label={`One less ${item.name}`} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white">
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="min-w-5 text-center font-extrabold">{item.qty}</span>
                  <button type="button" onClick={() => changeMedicine(item.id, item.qty + 1)} disabled={item.qty >= Math.min(item.max, 20)} aria-label={`One more ${item.name}`} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white disabled:opacity-40">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <span className="w-20 text-right text-[17px] font-extrabold text-ink-900">{naira(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <Link href="/tests" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-brand-700 hover:underline">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add a test
            </Link>
            <Link href="/medicines" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-brand-700 hover:underline">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add medicine
            </Link>
          </div>
          {meds.some((item) => item.prescription_only) && (
            <p className="mt-3 rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a]">
              Some of these need a prescription. Our pharmacist will ask to see it before sending them, and refunds you if you do not have one.
            </p>
          )}
        </section>

        {list.length > 0 && (
          <section className={card} aria-labelledby="h-when">
            <h2 id="h-when" className={heading}>
              When should our nurse come?
            </h2>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Day">
              {days.map((day) => (
                <button key={day.value} type="button" aria-pressed={date === day.value} onClick={() => setDate(day.value)} className={cn(chip(date === day.value), "flex min-h-16 min-w-[84px] flex-col items-center justify-center")}>
                  <span className="text-sm font-semibold opacity-80">{day.top}</span>
                  <span className="text-base">{day.bottom}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="group" aria-label="Time">
              {TIMES.map((slot) => (
                <button key={slot} type="button" aria-pressed={time === slot} onClick={() => setTime(slot)} className={cn(chip(time === slot), "min-h-12 text-[15px]")}>
                  {timeLabel(slot)}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className={card} aria-labelledby="h-address">
          <h2 id="h-address" className={heading}>
            Where are you?
          </h2>
          <p className="mt-1 text-[15px] text-ink-700">{comes}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Your area in Abuja</span>
              <select id="f-area" value={area} onChange={(event) => setArea(event.target.value)} className={cn(field, "appearance-none")}>
                <option value="">Choose your area</option>
                {areas.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {error("area")}
            </label>
            <label className="block">
              <span className={label}>House address</span>
              <input id="f-line" value={line} onChange={(event) => setLine(event.target.value)} autoComplete="street-address" placeholder="House number and street" className={field} />
              {error("line")}
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Landmark (optional)</span>
              <input value={landmark} onChange={(event) => setLandmark(event.target.value)} placeholder="Something nearby that is easy to find" className={field} />
            </label>
            {areaProblem && (
              <p role="alert" className="rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a] sm:col-span-2">
                {areaProblem}
              </p>
            )}
          </div>
        </section>

        <section className={card} aria-labelledby="h-you">
          <h2 id="h-you" className={heading}>
            Who is it for?
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={label}>First name</span>
              <input id="f-first_name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" className={field} />
              {error("first_name")}
            </label>
            <label className="block">
              <span className={label}>Last name</span>
              <input id="f-last_name" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" className={field} />
              {error("last_name")}
            </label>
            <label className="block">
              <span className={label}>Phone number</span>
              <input id="f-phone" value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" className={field} />
              {error("phone")}
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input id="f-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" inputMode="email" autoComplete="email" placeholder="Your result or receipt is sent here" className={field} />
              {error("email")}
            </label>
          </div>
        </section>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-24">
        <div className="flex flex-col gap-4 rounded-[28px] bg-night p-6 text-white sm:p-7">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Summary</h2>
          <dl className="flex flex-col gap-2.5 text-[16px]">
            <div className="flex justify-between gap-4">
              <dt className="text-white/75">
                {count} {count === 1 ? "item" : "items"}
              </dt>
              <dd className="font-bold">{naira(subtotal)}</dd>
            </div>
            {list.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/75">Nurse visit to your home</dt>
                <dd className="font-bold">{naira(visitFee)}</dd>
              </div>
            )}
            {meds.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/75">Delivery</dt>
                <dd className="font-bold">{fees ? naira(deliveryFee) : "Choose your area"}</dd>
              </div>
            )}
            <div className="mt-1 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
              <dt className="text-lg font-bold">Total</dt>
              <dd className="font-display text-4xl font-extrabold tracking-tight text-lime">{naira(total)}</dd>
            </div>
          </dl>

          {problem && (
            <p role="alert" className="rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a]">
              {problem}
            </p>
          )}
          {!paymentsReady && (
            <p role="alert" className="rounded-2xl bg-white/10 px-4 py-3 text-[15px] font-semibold">
              Online payment is being switched on. Please check back shortly.
            </p>
          )}

          <button type="submit" disabled={blocked} className="hidden min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night transition-transform hover:bg-[#d6fa85] active:scale-[0.98] disabled:opacity-60 lg:block">
            {busy ? "Opening secure payment" : `Pay ${naira(total)}`}
          </button>
          <p className="flex items-start gap-2 text-sm text-white/75">
            <Lock className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
            Card, bank transfer or USSD, secured by Paystack.
          </p>
        </div>
      </aside>

      {/* Phones: the total and the pay button stay in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-brand-100 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-500">Total</p>
          <p className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{naira(total)}</p>
        </div>
        <button type="submit" disabled={blocked} className="min-h-14 flex-1 rounded-2xl bg-lime px-4 text-lg font-extrabold text-night active:scale-[0.98] disabled:opacity-60">
          {busy ? "Opening payment" : "Pay now"}
        </button>
      </div>
    </form>
  );
}
