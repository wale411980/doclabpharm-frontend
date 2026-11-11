"use client";

import { useEffect, useState, type FormEvent } from "react";
import { UserRound } from "lucide-react";
import { API_URL, naira } from "@/site/basket";

type Doctor = {
  id: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  profileImage?: string | null;
  speciality?: string | null;
  specialization?: { name: string } | null;
};

/** Doctors who can take a consultation right now. Anyone can look; no sign-in. */
export function DoctorsOnline() {
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [chosen, setChosen] = useState<Doctor | null>(null);

  useEffect(() => {
    let stopped = false;
    const load = () =>
      fetch(`${API_URL}/doctors/online`, { headers: { Accept: "application/json" } })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((body) => {
          if (stopped) return;
          setDoctors(Array.isArray(body?.data) ? body.data : []);
          setFailed(false);
        })
        .catch(() => !stopped && setFailed(true));

    load();
    const timer = setInterval(load, 30000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  const list = doctors ?? [];

  // Nobody online: the booking form below is the way in, so this section stays out of the way.
  if (list.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="flex items-center gap-3 text-xl font-extrabold text-ink-900">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
        </span>
        {list.length === 1 ? "1 doctor online now" : `${list.length} doctors online now`}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((doctor) => (
          <li key={doctor.id} className="flex flex-col gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100">
            <div className="flex items-center gap-4">
              {doctor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doctor.profileImage} alt="" className="h-16 w-16 flex-none rounded-2xl object-cover" />
              ) : (
                <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <UserRound className="h-8 w-8" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold text-ink-900">
                  Dr {doctor.firstName ?? doctor.first_name} {doctor.lastName ?? doctor.last_name}
                </p>
                <p className="truncate text-[15px] text-ink-500">{doctor.specialization?.name ?? doctor.speciality ?? "General practice"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChosen(doctor)}
              aria-pressed={chosen?.id === doctor.id}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-lime px-5 text-base font-extrabold text-night hover:bg-[#d6fa85]"
            >
              Talk now
            </button>
          </li>
        ))}
      </ul>
      {chosen && <TalkNow doctor={chosen} onClose={() => setChosen(null)} />}
    </div>
  );
}


const input =
  "h-14 w-full min-w-0 rounded-2xl bg-white px-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500";

/** Pay for a doctor who is online now; the account is made after payment. */
function TalkNow({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const [fee, setFee] = useState<number | null>(null);
  const [complaint, setComplaint] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const name = `Dr ${doctor.firstName ?? doctor.first_name ?? ""} ${doctor.lastName ?? doctor.last_name ?? ""}`.trim();

  useEffect(() => {
    fetch(`${API_URL}/guest/doctor-options`, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => body && setFee(body.fee))
      .catch(() => undefined);
    try {
      const saved = JSON.parse(localStorage.getItem("dlp_contact") || "{}");
      setFirstName(saved.first_name || "");
      setLastName(saved.last_name || "");
      setPhone(saved.phone || "");
      setEmail(saved.email || "");
    } catch {
      // Nothing saved.
    }
    document.getElementById("talk-now")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [doctor.id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setProblem("");
    if (complaint.trim().length < 5) return setProblem("Tell the doctor briefly what is wrong.");
    if (!firstName.trim() || !lastName.trim()) return setProblem("Enter your first and last name.");
    if (!/^\+?[0-9 ]{10,16}$/.test(phone.trim())) return setProblem("Enter a phone number, like 0803 123 4567.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setProblem("Enter your email.");

    const contact = { first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim(), email: email.trim() };
    try {
      localStorage.setItem("dlp_contact", JSON.stringify(contact));
    } catch {
      // Not remembered.
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/guest/checkout`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ service_type: "consult", doctor_id: doctor.id, complaint: complaint.trim() }],
          contact,
          callback_url: `${window.location.origin}/checkout/complete`,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.payment?.authorization_url) {
        const first = body.errors ? (Object.values(body.errors)[0] as string[])[0] : null;
        setProblem(first || body.message || "We could not start your consultation. Please try again.");
        setBusy(false);
        return;
      }
      try {
        if (body.claim_token) localStorage.setItem(`dlp_claim_${body.payment.reference}`, body.claim_token);
        localStorage.setItem("dlp_last_booking", body.payment.reference);
      } catch {
        // They can sign in with Forgot password instead.
      }
      window.location.assign(body.payment.authorization_url);
    } catch {
      setProblem("No connection. Check your internet and try again.");
      setBusy(false);
    }
  };

  return (
    <form id="talk-now" onSubmit={submit} noValidate className="flex scroll-mt-28 flex-col gap-4 rounded-[28px] bg-white p-5 ring-2 ring-brand-500 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Talk to {name} now</h2>
          <p className="text-[15px] text-ink-700">Pay, then your chat or video call opens. If the doctor does not accept in a few minutes, you are refunded.</p>
        </div>
        <button type="button" onClick={onClose} className="min-h-11 flex-none rounded-full px-4 text-[15px] font-bold text-ink-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50">
          Close
        </button>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[15px] font-bold text-ink-900">What is wrong?</span>
        <textarea value={complaint} onChange={(event) => setComplaint(event.target.value)} rows={2} maxLength={1000} placeholder="For example: fever and headache for 3 days" className={`${input} h-auto py-3.5`} />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="First name" aria-label="First name" autoComplete="given-name" className={input} />
        <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Last name" aria-label="Last name" autoComplete="family-name" className={input} />
        <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" inputMode="tel" placeholder="Phone number" aria-label="Phone number" autoComplete="tel" className={input} />
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" inputMode="email" placeholder="Email" aria-label="Email" autoComplete="email" className={input} />
      </div>
      {problem && (
        <p role="alert" className="rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a]">
          {problem}
        </p>
      )}
      <button type="submit" disabled={busy} className="min-h-14 rounded-2xl bg-lime px-6 text-lg font-extrabold text-night hover:bg-[#d6fa85] disabled:opacity-60">
        {busy ? "Opening secure payment" : fee ? `Pay ${naira(fee)} and talk now` : "Pay and talk now"}
      </button>
    </form>
  );
}
