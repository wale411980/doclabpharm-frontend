"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { API_URL, naira } from "@/site/basket";
import { cn } from "@/lib/utils";

type Options = {
  bookable: boolean;
  fee: number | null;
  specialties: { id: number; name: string }[];
  first_hour: number;
  last_hour: number;
  notice_minutes: number;
};

type Errors = Record<string, string>;

const pad = (n: number) => String(n).padStart(2, "0");
const isoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const hourLabel = (hour: number) => `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? "pm" : "am"}`;

const field =
  "w-full min-w-0 rounded-2xl bg-white px-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500";

/**
 * Always there, whether or not a doctor is online: say what kind of doctor,
 * when, and what is wrong; pay; a verified doctor confirms. No account first.
 */
export function BookDoctor() {
  const [options, setOptions] = useState<Options | null>(null);
  const [failed, setFailed] = useState(false);
  const [specialty, setSpecialty] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState<number | null>(null);
  const [complaint, setComplaint] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/guest/doctor-options`, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setOptions)
      .catch(() => setFailed(true));
    try {
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
  }, []);

  // Each of the next 7 days with the hours a doctor still has time to confirm.
  const days = useMemo(() => {
    if (!options) return [];
    const earliest = Date.now() + (options.notice_minutes + 10) * 60000;
    const list: { value: string; top: string; bottom: string; hours: number[] }[] = [];
    for (let offset = 0; offset < 8 && list.length < 7; offset++) {
      const day = new Date();
      day.setDate(day.getDate() + offset);
      const hours: number[] = [];
      for (let h = options.first_hour; h < options.last_hour; h++) {
        const at = new Date(day);
        at.setHours(h, 0, 0, 0);
        if (at.getTime() >= earliest) hours.push(h);
      }
      if (hours.length === 0) continue;
      list.push({
        value: isoDate(day),
        top: offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : day.toLocaleDateString("en-NG", { weekday: "short" }),
        bottom: day.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
        hours,
      });
    }
    return list;
  }, [options]);

  useEffect(() => {
    if (days.length > 0 && !days.some((day) => day.value === date)) setDate(days[0].value);
  }, [days, date]);

  const hours = days.find((day) => day.value === date)?.hours ?? [];

  useEffect(() => {
    if (hour !== null && !hours.includes(hour)) setHour(null);
  }, [hours, hour]);

  if (failed) {
    return (
      <p role="alert" className="rounded-3xl bg-white p-6 text-lg text-ink-700 ring-1 ring-brand-100">
        We could not load the booking form. Check your internet and refresh this page.
      </p>
    );
  }

  if (!options) {
    return <div className="min-h-40" aria-busy="true" />;
  }

  if (!options.bookable) {
    return (
      <div className="rounded-[28px] bg-white p-6 ring-1 ring-brand-100 sm:p-8">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Doctor bookings open soon</h2>
        <p className="mt-3 max-w-xl text-lg text-ink-700">
          We are verifying our first doctors. You can book a lab test today, and if it is an emergency call{" "}
          <a href="tel:112" className="font-bold text-brand-700 underline">
            112
          </a>
          .
        </p>
        <a href="/tests" className="mt-5 inline-flex min-h-14 items-center rounded-2xl bg-lime px-7 text-lg font-extrabold text-night hover:bg-[#d6fa85]">
          Book a lab test
        </a>
      </div>
    );
  }

  const check = (): Errors => {
    const found: Errors = {};
    if (hour === null) found.time = "Choose a time";
    if (complaint.trim().length < 5) found.complaint = "Tell the doctor briefly what is wrong";
    if (!firstName.trim()) found.first_name = "Enter your first name";
    if (!lastName.trim()) found.last_name = "Enter your last name";
    if (!/^\+?[0-9 ]{10,16}$/.test(phone.trim())) found.phone = "Enter a phone number we can call, like 0803 123 4567";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "Enter the email we should confirm your doctor to";
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
      document.getElementById(`d-${Object.keys(found)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const contact = { first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim(), email: email.trim() };
    try {
      localStorage.setItem("dlp_contact", JSON.stringify(contact));
    } catch {
      // Not remembered for next time.
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/guest/doctor-request`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          specialization_id: specialty,
          date,
          time: `${pad(hour!)}:00`,
          complaint: complaint.trim(),
          callback_url: `${window.location.origin}/see-a-doctor/booked`,
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body.payment?.authorization_url) {
        const first = body.errors ? (Object.values(body.errors)[0] as string[])[0] : null;
        setProblem(first || body.message || "We could not start your booking. Please try again.");
        setBusy(false);
        return;
      }

      try {
        if (body.claim_token) localStorage.setItem(`dlp_claim_${body.payment.reference}`, body.claim_token);
        localStorage.setItem("dlp_last_doctor_booking", body.payment.reference);
      } catch {
        // They can still set a password later with "Forgot password".
      }
      window.location.assign(body.payment.authorization_url);
    } catch {
      setProblem("No connection. Check your internet and try again.");
      setBusy(false);
    }
  };

  const chip = (active: boolean) =>
    cn(
      "flex-none rounded-2xl px-4 font-bold ring-1 ring-inset transition-colors",
      active ? "bg-night text-white ring-night" : "bg-white text-ink-700 ring-brand-200 hover:bg-brand-50"
    );
  const label = "mb-1.5 block text-[15px] font-bold text-ink-900";
  const heading = "text-lg font-extrabold text-ink-900";
  const error = (key: string) => errors[key] && <span className="mt-1.5 block text-sm font-semibold text-[#b3261e]">{errors[key]}</span>;
  const fee = options.fee ?? 0;

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex min-w-0 flex-col gap-7 rounded-[28px] bg-white p-5 ring-1 ring-brand-100 sm:p-7">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Book a time with a doctor</h2>
          <p className="mt-1 text-[17px] text-ink-700">Tell us what you need. A verified doctor confirms, and you talk by chat or video.</p>
        </div>

        <fieldset className="min-w-0">
          <legend className={heading}>What kind of doctor?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" aria-pressed={specialty === null} onClick={() => setSpecialty(null)} className={cn(chip(specialty === null), "min-h-12")}>
              General doctor
            </button>
            {options.specialties.map((item) => (
              <button key={item.id} type="button" aria-pressed={specialty === item.id} onClick={() => setSpecialty(item.id)} className={cn(chip(specialty === item.id), "min-h-12")}>
                {item.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-500">Not sure? Choose General doctor. They will refer you if you need a specialist.</p>
        </fieldset>

        <fieldset className="min-w-0" id="d-time">
          <legend className={heading}>When?</legend>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((day) => (
              <button key={day.value} type="button" aria-pressed={date === day.value} onClick={() => setDate(day.value)} className={cn(chip(date === day.value), "flex min-h-16 min-w-[84px] flex-col items-center justify-center")}>
                <span className="text-sm font-semibold opacity-80">{day.top}</span>
                <span className="text-base">{day.bottom}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {hours.map((slot) => (
              <button key={slot} type="button" aria-pressed={hour === slot} onClick={() => setHour(slot)} className={cn(chip(hour === slot), "min-h-12 px-1 text-[15px]")}>
                {hourLabel(slot)}
              </button>
            ))}
          </div>
          {error("time")}
        </fieldset>

        <label className="block">
          <span className={heading}>What is wrong?</span>
          <textarea
            id="d-complaint"
            value={complaint}
            onChange={(event) => setComplaint(event.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="For example: fever and headache for 3 days"
            className={cn(field, "mt-3 py-3.5")}
          />
          <span className="mt-1.5 block text-sm text-ink-500">Only the doctor who takes your booking sees your name with this.</span>
          {error("complaint")}
        </label>

        <fieldset className="min-w-0">
          <legend className={heading}>Your details</legend>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={label}>First name</span>
              <input id="d-first_name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" className={cn(field, "h-14")} />
              {error("first_name")}
            </label>
            <label className="block">
              <span className={label}>Last name</span>
              <input id="d-last_name" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" className={cn(field, "h-14")} />
              {error("last_name")}
            </label>
            <label className="block">
              <span className={label}>Phone number</span>
              <input id="d-phone" value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" className={cn(field, "h-14")} />
              {error("phone")}
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input id="d-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" inputMode="email" autoComplete="email" className={cn(field, "h-14")} />
              {error("email")}
            </label>
          </div>
        </fieldset>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-24">
        <div className="flex flex-col gap-4 rounded-[28px] bg-night p-6 text-white sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <span className="text-lg font-bold">Consultation</span>
            <span className="font-display text-4xl font-extrabold tracking-tight text-lime">{naira(fee)}</span>
          </div>
          <ul className="flex flex-col gap-2 text-[15px] text-white/85">
            <li>No account needed to book.</li>
            <li>We email you as soon as a doctor confirms.</li>
            <li>If no doctor confirms by 1 hour before your time, your card is refunded in full.</li>
          </ul>
          {problem && (
            <p role="alert" className="rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a]">
              {problem}
            </p>
          )}
          <button type="submit" disabled={busy} className="min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night transition-transform hover:bg-[#d6fa85] active:scale-[0.98] disabled:opacity-60">
            {busy ? "Opening secure payment" : `Pay ${naira(fee)} and book`}
          </button>
          <p className="flex items-start gap-2 text-sm text-white/75">
            <Lock className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
            Card, bank transfer or USSD, secured by Paystack.
          </p>
        </div>
      </aside>
    </form>
  );
}
