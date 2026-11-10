"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stethoscope, UserRound } from "lucide-react";
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

  if (doctors === null && !failed) {
    return <p className="py-10 text-lg text-ink-700" aria-busy="true">Checking which doctors are online</p>;
  }

  if (failed && doctors === null) {
    return (
      <p role="alert" className="rounded-3xl bg-white p-6 text-lg text-ink-700 ring-1 ring-brand-100">
        We could not load the doctors. Check your internet and refresh this page.
      </p>
    );
  }

  const list = doctors ?? [];

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 ring-1 ring-brand-100 sm:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
          <Stethoscope className="h-7 w-7 text-brand-700" aria-hidden="true" />
        </span>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">No doctor is online right now</h2>
        <p className="max-w-xl text-lg text-ink-700">
          This page updates by itself, so you can keep it open. If it is an emergency, call{" "}
          <a href="tel:112" className="font-bold text-brand-700 underline">
            112
          </a>
          .
        </p>
        <Link href="/tests" className="inline-flex min-h-14 items-center rounded-2xl bg-lime px-7 text-lg font-extrabold text-night hover:bg-[#d6fa85]">
          Book a lab test instead
        </Link>
      </div>
    );
  }

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
              Talk to this doctor
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[15px] text-ink-500">
        The chat or video call happens inside your DocLabPharm account, so you sign in or create one at this step.
      </p>
    </div>
  );
}
