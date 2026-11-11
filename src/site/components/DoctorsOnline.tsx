"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { API_URL } from "@/site/basket";

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
            <a
              href="/user/see-doctor-now"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-lime px-5 text-base font-extrabold text-night hover:bg-[#d6fa85]"
            >
              Talk now
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[15px] text-ink-500">
        Talking now happens inside your DocLabPharm account, so you sign in at this step. Or book a time below without an account.
      </p>
    </div>
  );
}
