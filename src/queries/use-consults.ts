import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { BookingRow, ConsultRequest, InstantConsult } from "@/types/marketplace";

/* Doctor side of "see a doctor now". */

const presenceKey = ["doctor-presence"] as const;
const requestsKey = ["doctor-consult-requests"] as const;
const appointmentsKey = ["doctor-appointments-raw"] as const;

/** Whether the signed-in doctor is online, from their profile. */
export const useDoctorPresence = () =>
  useQuery<{ online: boolean }>({
    queryKey: presenceKey,
    queryFn: async () => {
      const data = (await api.get("/doctor")).data;
      const profile = data?.original ?? data;
      return { online: Boolean(profile?.isOnline) };
    },
  });

export const useSetDoctorPresence = () => {
  const queryClient = useQueryClient();
  return useMutation<{ online: boolean; message: string }, unknown, boolean>({
    mutationFn: async (online) => (await api.put("/doctor/presence", { online })).data,
    onSuccess: (data) => queryClient.setQueryData(presenceKey, { online: data.online }),
  });
};

/** Keeps the doctor visible to patients: POST /doctor/presence/ping. */
export async function pingDoctorPresence(): Promise<{ online: boolean; waiting: number }> {
  return (await api.post("/doctor/presence/ping")).data;
}

export const useConsultRequests = (enabled: boolean) =>
  useQuery<{ data: ConsultRequest[] }>({
    queryKey: requestsKey,
    queryFn: async () => (await api.get("/doctor/consult-requests")).data,
    enabled,
    refetchInterval: 10_000,
  });

/** The doctor's bookings; instant consultations in progress are picked from these. */
export const useDoctorBookings = () =>
  useQuery<BookingRow[]>({
    queryKey: appointmentsKey,
    queryFn: async () => {
      const data = (await api.get("/doctor/appointments")).data;
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 30_000,
  });

export const useConsultAction = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string; consult: InstantConsult },
    unknown,
    { id: number; action: "accept" | "decline" | "complete"; reason?: string }
  >({
    mutationFn: async ({ id, action, reason }) =>
      (await api.post(`/doctor/consults/${id}/${action}`, action === "decline" ? { reason: reason || undefined } : undefined)).data,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: requestsKey }),
        queryClient.invalidateQueries({ queryKey: appointmentsKey }),
      ]),
  });
};
