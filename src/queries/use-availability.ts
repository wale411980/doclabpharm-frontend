import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

export type ProviderKind = "lab_technician" | "pharmacy";

export type ProviderAvailabilityEntry = {
  id: number;
  date: string; // yyyy-MM-dd
  dayOfWeek: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

export type ProviderAvailabilityInput = {
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

const availabilityUri = (kind: ProviderKind) =>
  kind === "pharmacy"
    ? URIS.pharmacy.pharmacyAvailability
    : URIS.labTechnician.labTechnicianAvailability;

// availability the signed-in lab technician / pharmacy has published
export const useGetProviderAvailability = (kind: ProviderKind) => {
  return useQuery<ProviderAvailabilityEntry[]>({
    queryKey: ["providerAvailability", kind],
    queryFn: async () => {
      const response = await api.get(availabilityUri(kind));
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};

// create or replace the availability window of one or more dates
export const useSetProviderAvailability = (kind: ProviderKind) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entries: ProviderAvailabilityInput[]) => {
      // same payload shape as the doctor availability endpoint
      const response = await api.post(availabilityUri(kind), {
        availabilities: entries.map((entry) => ({
          dayOfWeek: entry.date,
          startTime: entry.startTime,
          endTime: entry.endTime,
        })),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerAvailability", kind] });
    },
  });
};

export const useDeleteProviderAvailability = (kind: ProviderKind) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`${availabilityUri(kind)}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerAvailability", kind] });
    },
  });
};

export type LabAvailability = {
  labTechnicianId: number;
  // false = the laboratory has not published any availability yet
  hasSchedule: boolean;
  availabilities: ProviderAvailabilityEntry[];
  date: string | null;
  window: ProviderAvailabilityEntry | null;
  slots: string[]; // e.g. "10:30 AM"
};

// patient side: when can a laboratory take a test appointment
// (usePublicRoute: for the landing-page booking flow, before the patient signs in)
export const useGetLabAvailability = (
  labId: number,
  date?: string,
  usePublicRoute = false
) => {
  return useQuery<LabAvailability>({
    queryKey: ["labAvailability", labId, date ?? ""],
    queryFn: async () => {
      const base = usePublicRoute
        ? URIS.general.labAvailabilityPublic
        : URIS.user.userLabAvailability;
      const response = await api.get(
        `${base}/${labId}`,
        { params: date ? { date } : undefined }
      );
      return response.data;
    },
    enabled: !!labId,
  });
};
