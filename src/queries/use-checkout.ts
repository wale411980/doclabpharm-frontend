import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  BookingRow,
  CardStatusResult,
  CheckoutInput,
  CheckoutQuote,
  CheckoutResult,
  InstantConsult,
  NearbyMedicine,
  OnlineDoctor,
  PatientAddress,
} from "@/types/marketplace";

/* ---------- Saved addresses ---------- */

const addressesKey = ["patient-addresses"] as const;

export const usePatientAddresses = () =>
  useQuery<PatientAddress[]>({
    queryKey: addressesKey,
    queryFn: async () => {
      const data = (await api.get("/user/addresses")).data;
      return Array.isArray(data) ? data : data?.data ?? [];
    },
  });

export type NewAddressInput = {
  label: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
};

export const useAddPatientAddress = () => {
  const queryClient = useQueryClient();
  return useMutation<PatientAddress, unknown, NewAddressInput>({
    mutationFn: async (input) => (await api.post("/user/addresses", input)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressesKey }),
  });
};

/* ---------- Checkout ---------- */

/** The checkout body in the API's own shape (cart items already use snake_case). */
function checkoutBody(input: Omit<CheckoutInput, "paymentMethod"> & { paymentMethod?: CheckoutInput["paymentMethod"] }) {
  return {
    items: input.items,
    paymentMethod: input.paymentMethod,
    delivery: input.delivery,
    collectionAddressId: input.collectionAddressId,
    callbackUrl: input.callbackUrl,
  };
}

export const useCheckoutQuote = (input: Omit<CheckoutInput, "paymentMethod"> | null) =>
  useQuery<CheckoutQuote>({
    queryKey: ["checkout-quote", input],
    queryFn: async () => (await api.post("/user/checkout/quote", checkoutBody(input!))).data,
    enabled: !!input && input.items.length > 0,
    retry: false,
    staleTime: 30_000,
  });

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation<CheckoutResult, unknown, CheckoutInput>({
    mutationFn: async (input) => (await api.post("/user/checkout", checkoutBody(input))).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWallet"] });
      queryClient.invalidateQueries({ queryKey: ["patient-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments-raw"] });
    },
  });
};

/** Where Paystack sends the patient back: confirms the card payment. */
export const useCardCheckoutStatus = (reference: string | null) =>
  useQuery<CardStatusResult>({
    queryKey: ["card-checkout", reference],
    queryFn: async () => (await api.get(`/user/checkout/card/${encodeURIComponent(reference!)}`)).data,
    enabled: !!reference,
    retry: false,
    // Keep asking while Paystack has not confirmed yet.
    refetchInterval: (query) => (query.state.data?.status === "pending" ? 4000 : false),
  });

/** The address Paystack should send the patient back to after paying. */
export const cardCallbackUrl = () => `${window.location.origin}/user/checkout/complete`;

/* ---------- Medicines near me ---------- */

export type NearbyMedicineParams = { q: string; lat: number; lng: number; delivers: boolean };

export const useNearbyMedicines = (params: NearbyMedicineParams | null) =>
  useQuery<{ data: NearbyMedicine[]; meta: { count: number } }>({
    queryKey: ["nearby-medicines", params],
    queryFn: async () =>
      (
        await api.get("/nearby/medicines", {
          params: { q: params!.q, lat: params!.lat, lng: params!.lng, delivers: params!.delivers ? 1 : undefined },
        })
      ).data,
    enabled: !!params && params.q.trim().length >= 2,
    retry: false,
  });

/* ---------- See a doctor now ---------- */

export const useOnlineDoctors = () =>
  useQuery<{ data: OnlineDoctor[]; count: number }>({
    queryKey: ["doctors-online"],
    queryFn: async () => (await api.get("/doctors/online")).data,
    refetchInterval: 30_000,
  });

const consultKey = (id: number) => ["patient-consult", id] as const;

export const usePatientConsult = (id: number) =>
  useQuery<InstantConsult>({
    queryKey: consultKey(id),
    queryFn: async () => (await api.get(`/user/consults/${id}`)).data,
    refetchInterval: (query) => (query.state.data?.status === "waiting" || !query.state.data ? 4000 : false),
  });

export const useCancelPatientConsult = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; consult: InstantConsult }>({
    mutationFn: async () => (await api.post(`/user/consults/${id}/cancel`)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: consultKey(id) }),
  });
};

/** All of the patient's bookings, to find the consultation an order created. */
export async function fetchPatientBookings(): Promise<BookingRow[]> {
  const data = (await api.get("/user/appointment")).data;
  return Array.isArray(data) ? data : [];
}

export async function findInstantConsultForOrder(orderId: number): Promise<BookingRow | undefined> {
  const bookings = await fetchPatientBookings();
  return bookings.find((b) => Number(b.orderId) === Number(orderId) && b.mode === "instant");
}

export const usePatientBookings = () =>
  useQuery<BookingRow[]>({ queryKey: ["patient-appointments-raw"], queryFn: fetchPatientBookings });
