import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { BellRing } from "lucide-react";
import { pingDoctorPresence, useDoctorPresence } from "@/queries/use-consults";

/**
 * Mounted in the doctor dashboard layout. While the doctor is online it pings
 * the API every minute (a doctor with no ping for 2 minutes is hidden from
 * patients) and shows a banner when patients are waiting.
 */
export function DoctorPresenceKeeper() {
  const { data } = useDoctorPresence();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [waiting, setWaiting] = useState(0);
  const online = data?.online ?? false;

  useEffect(() => {
    if (!online) {
      setWaiting(0);
      return;
    }
    let cancelled = false;
    const ping = async () => {
      try {
        const result = await pingDoctorPresence();
        if (cancelled) return;
        setWaiting(result.waiting ?? 0);
        if (!result.online) {
          // The API took the doctor offline (for example after missed requests).
          queryClient.setQueryData(["doctor-presence"], { online: false });
        }
        if (result.waiting > 0) queryClient.invalidateQueries({ queryKey: ["doctor-consult-requests"] });
      } catch {
        /* a missed ping is retried next minute */
      }
    };
    ping();
    const timer = window.setInterval(ping, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [online, queryClient]);

  if (!online || waiting === 0 || pathname === "/doctor/see-now") return null;

  return (
    <Link
      to="/doctor/see-now"
      className="mb-4 flex items-center gap-3 rounded-3xl bg-warm-100 p-4 font-bold text-warm-900 ring-2 ring-warm-300"
      role="status"
    >
      <BellRing className="h-5 w-5 shrink-0 animate-pulse" aria-hidden="true" />
      {waiting === 1 ? "A patient is waiting to see you now." : `${waiting} patients are waiting to see you now.`} Open requests
    </Link>
  );
}
