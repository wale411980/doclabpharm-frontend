"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LocateFixed, Phone, Siren } from "lucide-react";
import { API_URL, naira } from "@/site/basket";
import { cn } from "@/lib/utils";

type Ride = {
  id: number;
  status: "searching" | "assigned" | "arrived" | "transporting" | "completed" | "cancelled" | "no_ambulance" | string;
  pickup_address: string;
  estimated_fare: number | null;
  final_fare: number | null;
  payment_status: string | null;
  operator: { name: string; phone: string | null } | null;
  vehicle: { plate_number: string; driver_name: string | null; driver_phone: string | null; has_paramedic: boolean; eta_minutes: number | null } | null;
};

const TOKEN_KEY = "dlp_ambulance";
const ACTIVE = ["searching", "assigned", "arrived", "transporting"];

const field =
  "h-14 w-full min-w-0 rounded-2xl bg-white px-4 text-base font-medium text-ink-900 ring-1 ring-inset ring-brand-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-[#ff5a3c]";

/**
 * Ask for an ambulance with a name, a phone number and a place. No account,
 * no payment up front: the fare is paid after the trip.
 */
export function RequestAmbulance() {
  const [token, setToken] = useState<string | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [point, setPoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_KEY));
      const saved = JSON.parse(localStorage.getItem("dlp_contact") || "{}");
      setName(saved.first_name || "");
      setPhone(saved.phone || "");
    } catch {
      // Nothing remembered.
    }
    fetch(`${API_URL}/guest/areas`, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => body?.areas && setAreas(body.areas))
      .catch(() => undefined);
  }, []);

  // Follow the trip every few seconds while it is live.
  useEffect(() => {
    if (!token) return;
    let stopped = false;

    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/guest/ambulance/${token}`, { headers: { Accept: "application/json" } });
        if (res.status === 404) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          return;
        }
        const body = (await res.json()) as Ride;
        if (stopped) return;
        setRide(body);
        const unpaid = body.status === "completed" && body.payment_status === "unpaid";
        if (ACTIVE.includes(body.status) || unpaid) timer.current = setTimeout(check, unpaid ? 15000 : 5000);
      } catch {
        if (!stopped) timer.current = setTimeout(check, 5000);
      }
    };
    check();

    return () => {
      stopped = true;
      clearTimeout(timer.current);
    };
  }, [token]);

  const locate = () => {
    if (!navigator.geolocation) {
      setProblem("This phone cannot share its location. Choose your area instead.");
      return;
    }
    setLocating(true);
    setProblem("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPoint({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setProblem("We could not get your location. Choose your area instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setProblem("");
    if (!name.trim()) return setProblem("Enter your name.");
    if (!/^\+?[0-9 ]{10,16}$/.test(phone.trim())) return setProblem("Enter a phone number the crew can call, like 0803 123 4567.");
    if (!point && !area) return setProblem("Share your location or choose your area.");
    if (!address.trim()) return setProblem("Say where the ambulance should come to: street, building or landmark.");

    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/guest/ambulance`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { first_name: name.trim(), phone: phone.trim() },
          ...(point ?? { area }),
          address: address.trim(),
          notes: notes.trim() || null,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const first = body.errors ? (Object.values(body.errors)[0] as string[])[0] : null;
        setProblem(first || body.message || "We could not send your request. Call 112.");
      } else {
        try {
          localStorage.setItem(TOKEN_KEY, body.token);
        } catch {
          // The page still follows this trip until it is closed.
        }
        setRide(body);
        setToken(body.token);
      }
    } catch {
      setProblem("No connection. Call 112.");
    }
    setBusy(false);
  };

  const act = async (path: "cancel" | "pay") => {
    if (!token) return;
    setBusy(true);
    setProblem("");
    try {
      const res = await fetch(`${API_URL}/guest/ambulance/${token}/${path}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(path === "pay" ? { callback_url: `${window.location.origin}/request-ambulance` } : {}),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) setProblem(body.message || "That did not work. Please try again.");
      else if (path === "pay") window.location.assign(body.payment.authorization_url);
      else setRide(body);
    } catch {
      setProblem("No connection. Please try again.");
    }
    setBusy(false);
  };

  const startAgain = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setRide(null);
  };

  const call112 = (
    <a href="tel:112" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-white px-6 text-lg font-extrabold text-[#7a1d0a] ring-2 ring-inset ring-[#ff5a3c]">
      <Phone className="h-5 w-5" aria-hidden="true" />
      Call 112
    </a>
  );

  if (token && ride) {
    const live = ACTIVE.includes(ride.status);
    const headline: Record<string, string> = {
      searching: "Finding the nearest ambulance",
      assigned: "An ambulance is on its way",
      arrived: "The ambulance has arrived",
      transporting: "On the way to hospital",
      completed: "Trip finished",
      cancelled: "Request cancelled",
    };
    const unpaid = ride.status === "completed" && ride.payment_status === "unpaid";

    return (
      <div className="flex flex-col gap-5" aria-live="polite">
        <div className={cn("flex flex-col gap-4 rounded-[28px] p-6 sm:p-8", live ? "bg-[#ff5a3c] text-white" : "bg-white text-ink-900 ring-1 ring-brand-100")}>
          <Siren className={cn("h-10 w-10", ride.status === "searching" && "animate-pulse")} aria-hidden="true" />
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight">{headline[ride.status] ?? "No ambulance is free right now"}</h2>
          {ride.status === "searching" && <p className="text-lg">Keep this page open. If the person is in danger, call 112 now as well.</p>}
          {ride.status === "assigned" && ride.vehicle?.eta_minutes != null && (
            <p className="text-2xl font-extrabold">About {ride.vehicle.eta_minutes} minutes away</p>
          )}
          {!live && ride.status !== "completed" && ride.status !== "cancelled" && <p className="text-lg">Please call 112 now. You can also try again in a moment.</p>}
          <p className={cn("text-[15px]", live ? "text-white/90" : "text-ink-700")}>Coming to: {ride.pickup_address}</p>
        </div>

        {ride.vehicle && (
          <div className="rounded-3xl bg-white p-5 ring-1 ring-brand-100">
            <p className="text-lg font-extrabold text-ink-900">{ride.operator?.name}</p>
            <p className="text-[15px] text-ink-700">
              Plate {ride.vehicle.plate_number}
              {ride.vehicle.driver_name ? `, driver ${ride.vehicle.driver_name}` : ""}
              {ride.vehicle.has_paramedic ? ", paramedic on board" : ""}
            </p>
            {ride.vehicle.driver_phone && (
              <a href={`tel:${ride.vehicle.driver_phone}`} className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-night px-5 text-base font-extrabold text-white">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call the driver
              </a>
            )}
          </div>
        )}

        {(ride.estimated_fare || ride.final_fare) && (
          <p className="text-[15px] text-ink-700">
            {ride.final_fare ? `Fare: ${naira(ride.final_fare)}.` : `Estimated fare: ${naira(ride.estimated_fare ?? 0)}. You pay after the trip.`}
            {ride.payment_status === "paid" ? " Paid. Thank you." : ""}
          </p>
        )}

        {problem && (
          <p role="alert" className="rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a]">
            {problem}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {unpaid && (
            <button type="button" onClick={() => act("pay")} disabled={busy} className="min-h-14 rounded-2xl bg-lime px-7 text-lg font-extrabold text-night disabled:opacity-60">
              Pay {naira(ride.final_fare ?? 0)} now
            </button>
          )}
          {live && call112}
          {(ride.status === "searching" || ride.status === "assigned") && (
            <button type="button" onClick={() => act("cancel")} disabled={busy} className="min-h-14 rounded-2xl px-6 text-base font-bold text-ink-700 ring-1 ring-inset ring-brand-200 hover:bg-white disabled:opacity-60">
              Cancel request
            </button>
          )}
          {!live && !unpaid && (
            <button type="button" onClick={startAgain} className="min-h-14 rounded-2xl bg-night px-7 text-lg font-extrabold text-white">
              New request
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-[28px] bg-white p-5 ring-1 ring-brand-100 sm:p-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[15px] font-bold text-ink-900">Your name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[15px] font-bold text-ink-900">Phone number</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" className={field} />
        </label>
      </div>

      <fieldset className="min-w-0">
        <legend className="mb-1.5 text-[15px] font-bold text-ink-900">Where should the ambulance come?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className={cn("flex min-h-14 items-center justify-center gap-2 rounded-2xl px-4 text-base font-extrabold ring-1 ring-inset", point ? "bg-night text-white ring-night" : "bg-brand-50 text-ink-900 ring-brand-200")}
          >
            <LocateFixed className="h-5 w-5" aria-hidden="true" />
            {point ? "Location shared" : locating ? "Finding you" : "Use my location"}
          </button>
          <select
            value={area}
            onChange={(event) => {
              setArea(event.target.value);
              setPoint(null);
            }}
            aria-label="Or choose your area"
            className={cn(field, "appearance-none font-bold")}
          >
            <option value="">Or choose your area</option>
            {areas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <input value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" placeholder="Street, building or landmark" aria-label="Street, building or landmark" className={cn(field, "mt-3")} />
      </fieldset>

      <label className="block">
        <span className="mb-1.5 block text-[15px] font-bold text-ink-900">What happened? (optional)</span>
        <input value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={500} placeholder="For example: chest pain, accident, in labour" className={field} />
      </label>

      {problem && (
        <p role="alert" className="rounded-2xl bg-[#fff1ed] px-4 py-3 text-[15px] font-semibold text-[#7a1d0a]">
          {problem}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={busy} className="min-h-16 flex-1 rounded-2xl bg-[#ff5a3c] px-6 text-xl font-extrabold text-white transition-transform hover:bg-[#e94a2d] active:scale-[0.98] disabled:opacity-60">
          {busy ? "Sending" : "Send an ambulance"}
        </button>
        {call112}
      </div>
      <p className="text-sm text-ink-500">No account and no payment now. You pay the fare after the trip. The nearest free ambulance is asked first.</p>
    </form>
  );
}
