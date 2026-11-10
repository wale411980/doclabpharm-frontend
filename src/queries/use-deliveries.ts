import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Paginated } from "@/types/verification";
import type { DeliverySettings, PatientDelivery, PharmacyDelivery } from "@/types/marketplace";

/* ---------- Patient: my orders ---------- */

const patientKey = ["patient-deliveries"] as const;

export const usePatientDeliveries = (page = 1) =>
  useQuery<Paginated<PatientDelivery>>({
    queryKey: [...patientKey, page],
    queryFn: async () => (await api.get("/user/deliveries", { params: { page } })).data,
    placeholderData: keepPreviousData,
    // Orders change as the pharmacy works on them.
    refetchInterval: (query) =>
      query.state.data?.data.some((d) => !["delivered", "declined", "expired", "cancelled"].includes(d.status)) ? 15_000 : false,
  });

export const useCancelPatientDelivery = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, number>({
    mutationFn: async (id) => (await api.post(`/user/deliveries/${id}/cancel`)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: patientKey }),
  });
};

/* ---------- Pharmacy: order queue ---------- */

const pharmacyKey = ["pharmacy-deliveries"] as const;

export const usePharmacyDeliveries = (status: string, page: number) =>
  useQuery<Paginated<PharmacyDelivery>>({
    queryKey: [...pharmacyKey, status, page],
    queryFn: async () => (await api.get("/pharmacy/deliveries", { params: { status: status || undefined, page } })).data,
    placeholderData: keepPreviousData,
    refetchInterval: 20_000,
  });

export type PharmacyDeliveryAction =
  | { action: "accept"; id: number }
  | { action: "dispatch"; id: number; riderName?: string; riderPhone?: string }
  | { action: "complete"; id: number; handoverCode: string; prescriptionChecked: boolean }
  | { action: "decline"; id: number; reason: string };

export const usePharmacyDeliveryAction = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, PharmacyDeliveryAction>({
    mutationFn: async (input) => {
      const base = `/pharmacy/deliveries/${input.id}`;
      switch (input.action) {
        case "accept":
          return (await api.post(`${base}/accept`)).data;
        case "dispatch":
          return (await api.post(`${base}/dispatch`, { riderName: input.riderName || undefined, riderPhone: input.riderPhone || undefined })).data;
        case "complete":
          return (await api.post(`${base}/complete`, { handoverCode: input.handoverCode, prescriptionChecked: input.prescriptionChecked })).data;
        case "decline":
          return (await api.post(`${base}/decline`, { reason: input.reason })).data;
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: pharmacyKey }),
  });
};

/* ---------- Pharmacy: delivery terms ---------- */

const settingsKey = ["pharmacy-delivery-settings"] as const;

/** The pharmacy's own delivery terms, read from its profile. */
export const usePharmacyDeliverySettings = () =>
  useQuery<DeliverySettings>({
    queryKey: settingsKey,
    queryFn: async () => {
      const data = (await api.get("/pharmacy")).data;
      const profile = data?.original ?? data;
      return {
        acceptingOrders: Boolean(profile.acceptingOrders ?? true),
        offersDelivery: Boolean(profile.offersDelivery ?? true),
        deliveryRadiusKm: Number(profile.deliveryRadiusKm ?? 10),
        deliveryBaseFee: Number(profile.deliveryBaseFee ?? 1000),
        deliveryFeePerKm: Number(profile.deliveryFeePerKm ?? 150),
        minOrderAmount: Number(profile.minOrderAmount ?? 0),
      };
    },
  });

export const useSavePharmacyDeliverySettings = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; settings: DeliverySettings }, unknown, Partial<DeliverySettings>>({
    mutationFn: async (input) => (await api.put("/pharmacy/delivery-settings", input)).data,
    onSuccess: (data) => queryClient.setQueryData(settingsKey, data.settings),
  });
};
