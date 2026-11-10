import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AmbulanceOperatorProfile } from "@/types/verification";

const profileKey = ["ambulance-operator-profile"] as const;

export const useAmbulanceOperatorProfile = () =>
  useQuery<AmbulanceOperatorProfile>({
    queryKey: profileKey,
    queryFn: async () => (await api.get("/ambulance-operator/profile")).data,
  });

/** Fields left out are not changed. */
export type AmbulanceOperatorProfileInput = Partial<
  Pick<
    AmbulanceOperatorProfile,
    "businessName" | "cacNumber" | "firstName" | "lastName" | "phone" | "address" | "city" | "state"
  >
>;

export const useUpdateAmbulanceOperatorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; user: AmbulanceOperatorProfile }, unknown, AmbulanceOperatorProfileInput>({
    mutationFn: async (input) => (await api.put("/ambulance-operator/profile", input)).data,
    onSuccess: (data) => queryClient.setQueryData(profileKey, data.user),
  });
};
