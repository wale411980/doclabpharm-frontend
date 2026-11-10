import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Siren } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { currentPosition } from "@/lib/marketplace";
import { invalidateVehicles, sendVehicleLocation, useOperatorOffers } from "@/queries/use-ambulance";

/**
 * Location sharing for the operator's vehicles while they are switched on
 * for requests. Lives in the dashboard layout so it keeps running on every
 * page: every ~20 seconds it sends this device's position for each vehicle
 * that is on (the API only offers requests to vehicles seen in the last 5
 * minutes).
 */

const STORAGE_KEY = "doclab_sharing_vehicles";
const INTERVAL_MS = 20_000;

type FleetLocation = {
  sharing: number[];
  start: (vehicleId: number) => Promise<void>;
  stop: (vehicleId: number) => Promise<void>;
  lastSentAt: number | null;
  error: string;
};

const Context = createContext<FleetLocation | null>(null);

export function useFleetLocation(): FleetLocation {
  const value = useContext(Context);
  if (!value) throw new Error("useFleetLocation must be used inside FleetLocationProvider");
  return value;
}

function readStored(): number[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]).filter((n) => Number.isFinite(n)) : [];
  } catch {
    return [];
  }
}

export function FleetLocationProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [sharing, setSharing] = useState<number[]>(readStored);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const [error, setError] = useState("");
  const sharingRef = useRef(sharing);
  sharingRef.current = sharing;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sharing));
    } catch {
      /* private mode: sharing just won't survive a reload */
    }
  }, [sharing]);

  const sendAll = useCallback(async () => {
    const ids = sharingRef.current;
    if (ids.length === 0) return;
    try {
      const { latitude, longitude } = await currentPosition(15_000);
      await Promise.all(ids.map((id) => sendVehicleLocation(id, latitude, longitude, true)));
      setLastSentAt(Date.now());
      setError("");
    } catch (e) {
      setError(e instanceof Error && !("response" in e) ? e.message : apiErrorMessage(e, "We could not send your location."));
    }
  }, []);

  // Keep sending while at least one vehicle is on.
  useEffect(() => {
    if (sharing.length === 0) return;
    sendAll();
    const timer = window.setInterval(sendAll, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [sharing.length, sendAll]);

  const start = useCallback(
    async (vehicleId: number) => {
      const { latitude, longitude } = await currentPosition(15_000);
      await sendVehicleLocation(vehicleId, latitude, longitude, true);
      setLastSentAt(Date.now());
      setError("");
      setSharing((ids) => (ids.includes(vehicleId) ? ids : [...ids, vehicleId]));
      await invalidateVehicles(queryClient);
    },
    [queryClient]
  );

  const stop = useCallback(
    async (vehicleId: number) => {
      setSharing((ids) => ids.filter((id) => id !== vehicleId));
      try {
        const { latitude, longitude } = await currentPosition(10_000);
        await sendVehicleLocation(vehicleId, latitude, longitude, false);
      } finally {
        await invalidateVehicles(queryClient);
      }
    },
    [queryClient]
  );

  return <Context.Provider value={{ sharing, start, stop, lastSentAt, error }}>{children}</Context.Provider>;
}

/** Shown on every operator page when a request is waiting for an answer. */
export function OfferBanner() {
  const { data } = useOperatorOffers();
  const { pathname } = useLocation();
  const count = data?.data.length ?? 0;
  if (count === 0 || pathname === "/ambulance_operator/dispatch") return null;
  return (
    <Link
      to="/ambulance_operator/dispatch"
      className="mb-4 flex items-center gap-3 rounded-3xl bg-red-700 p-4 font-extrabold text-white shadow-lg"
      role="alert"
    >
      <Siren className="h-6 w-6 shrink-0 animate-pulse" aria-hidden="true" />
      {count === 1 ? "New ambulance request. Answer within 60 seconds." : `${count} ambulance requests waiting. Answer within 60 seconds.`}
    </Link>
  );
}
