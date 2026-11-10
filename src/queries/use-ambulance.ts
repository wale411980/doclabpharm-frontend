import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Paginated } from "@/types/verification";
import type {
  AmbulanceOffer,
  AmbulanceRequestInput,
  AmbulanceTrip,
  AmbulanceVehicle,
  Fares,
  PatientAmbulanceRequest,
  VehicleInput,
} from "@/types/marketplace";

/* ---------- Patient ---------- */

const historyKey = ["patient-ambulance-requests"] as const;
const rideKey = (id: number) => ["patient-ambulance-request", id] as const;
const ACTIVE = ["searching", "assigned", "arrived", "transporting"];

export const usePatientAmbulanceRequests = () =>
  useQuery<{ data: PatientAmbulanceRequest[] }>({
    queryKey: historyKey,
    queryFn: async () => (await api.get("/user/ambulance/requests")).data,
  });

/** Polled every 5 seconds while the request is live. */
export const usePatientAmbulanceRequest = (id: number) =>
  useQuery<PatientAmbulanceRequest>({
    queryKey: rideKey(id),
    queryFn: async () => (await api.get(`/user/ambulance/requests/${id}`)).data,
    refetchInterval: (query) => (!query.state.data || ACTIVE.includes(query.state.data.status) ? 5000 : false),
    refetchIntervalInBackground: true,
  });

export const useRequestAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation<PatientAmbulanceRequest, unknown, AmbulanceRequestInput>({
    mutationFn: async (input) => (await api.post("/user/ambulance/requests", input)).data,
    onSuccess: (ride) => {
      queryClient.setQueryData(rideKey(ride.id), ride);
      queryClient.invalidateQueries({ queryKey: historyKey });
    },
  });
};

export const useAmbulanceRideAction = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<PatientAmbulanceRequest, unknown, { action: "cancel" | "pay"; reason?: string }>({
    mutationFn: async ({ action, reason }) =>
      (await api.post(`/user/ambulance/requests/${id}/${action}`, action === "cancel" ? { reason: reason || undefined } : undefined)).data,
    onSuccess: (ride) => {
      queryClient.setQueryData(rideKey(id), ride);
      queryClient.invalidateQueries({ queryKey: historyKey });
    },
  });
};

/* ---------- Operator: fleet ---------- */

const vehiclesKey = ["operator-vehicles"] as const;

export const useOperatorVehicles = () =>
  useQuery<{ data: AmbulanceVehicle[] }>({
    queryKey: vehiclesKey,
    queryFn: async () => (await api.get("/ambulance-operator/vehicles")).data,
  });

export const useSaveVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, { id?: number; input: VehicleInput }>({
    mutationFn: async ({ id, input }) =>
      id ? (await api.put(`/ambulance-operator/vehicles/${id}`, input)).data : (await api.post("/ambulance-operator/vehicles", input)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: vehiclesKey }),
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, number>({
    mutationFn: async (id) => (await api.delete(`/ambulance-operator/vehicles/${id}`)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: vehiclesKey }),
  });
};

/** POST /ambulance-operator/vehicles/{id}/location, optionally switching availability. */
export async function sendVehicleLocation(id: number, latitude: number, longitude: number, available?: boolean) {
  return (
    await api.post(`/ambulance-operator/vehicles/${id}/location`, {
      latitude,
      longitude,
      ...(available === undefined ? {} : { available }),
    })
  ).data as { vehicle: Pick<AmbulanceVehicle, "id" | "status" | "latitude" | "longitude" | "lastSeenAt"> };
}

export const invalidateVehicles = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: vehiclesKey });

/* ---------- Operator: fares ---------- */

const faresKey = ["operator-fares"] as const;

export const useOperatorFares = () =>
  useQuery<Fares>({
    queryKey: faresKey,
    queryFn: async () => {
      const profile = (await api.get("/ambulance-operator/profile")).data;
      return { baseFare: Number(profile.baseFare ?? 15000), perKmFare: Number(profile.perKmFare ?? 500) };
    },
  });

export const useSaveFares = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; fares: Fares }, unknown, Fares>({
    mutationFn: async (input) => (await api.put("/ambulance-operator/fares", input)).data,
    onSuccess: (data) => queryClient.setQueryData(faresKey, data.fares),
  });
};

/* ---------- Operator: offers and trips ---------- */

const offersKey = ["operator-offers"] as const;
const tripsKey = ["operator-trips"] as const;

export const useOperatorOffers = () =>
  useQuery<{ data: AmbulanceOffer[] }>({
    queryKey: offersKey,
    queryFn: async () => (await api.get("/ambulance-operator/offers")).data,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

export const useOperatorTrips = (status: string, page: number, poll = false) =>
  useQuery<Paginated<AmbulanceTrip>>({
    queryKey: [...tripsKey, status, page],
    queryFn: async () => (await api.get("/ambulance-operator/trips", { params: { status: status || undefined, page } })).data,
    placeholderData: keepPreviousData,
    refetchInterval: poll ? 10_000 : false,
  });

export type TripAction =
  | { action: "accept" | "decline"; id: number }
  | { action: "arrived" | "transporting"; id: number }
  | { action: "complete"; id: number; tripKm?: number };

export const useTripAction = () => {
  const queryClient = useQueryClient();
  return useMutation<AmbulanceTrip, unknown, TripAction>({
    mutationFn: async (input) => {
      if (input.action === "accept" || input.action === "decline") {
        return (await api.post(`/ambulance-operator/requests/${input.id}/${input.action}`)).data;
      }
      const body = input.action === "complete" && input.tripKm !== undefined ? { tripKm: input.tripKm } : undefined;
      return (await api.post(`/ambulance-operator/trips/${input.id}/${input.action}`, body)).data;
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offersKey }),
        queryClient.invalidateQueries({ queryKey: tripsKey }),
        queryClient.invalidateQueries({ queryKey: vehiclesKey }),
      ]),
  });
};
