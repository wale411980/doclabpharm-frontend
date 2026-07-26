import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  BankAccount,
  Withdraw,
  ReadMessage,
  DeviceTokenType,
  SpecializationList,
  GetDiagnosisCategory,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

// how to save bank account
export const useSaveBankAccount = () => {
  return useMutation({
    mutationFn: async (data: BankAccount) => {
      const response = await api.post(URIS.general.saveBankAccount, data);
      return response.data;
    },
  });
};

// how to withdraw money
export const useWithdrawMoney = () => {
  return useMutation({
    mutationFn: async (data: Withdraw) => {
      const response = await api.post(URIS.general.withdrawMoney, data);
      return response.data;
    },
  });
};

// read message
export const useReadMessage = () => {
  return useMutation({
    mutationFn: async (data: ReadMessage) => {
      const response = await api.post(URIS.general.readMessages, data);
      return response.data;
    },
  });
};

// send device token and device type to backend
export const useSendDeviceToken = () => {
  return useMutation({
    mutationFn: async (data: DeviceTokenType) => {
      const response = await api.post(URIS.general.sendDeviceToken, data);
      return response.data;
    },
  });
};

// get doctor specialization list
export const useGetSpecializationList = () => {
  return useQuery<SpecializationList[]>({
    queryKey: ["specializationList"],
    queryFn: async () => {
      const response = await api.get(URIS.general.specializationList);
      return response.data.data;
    },
  });
};

// get doctor specialization list by id
export const useGetSpecializationsDoctorList = (specializationId: number) => {
  return useQuery<SpecializationList[]>({
    queryKey: ["specializationsDoctorList", specializationId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.general.specializationsDoctorList}/${specializationId}`
      );
      return response.data;
    },
    enabled: !!specializationId, // Only run if specializationId is provided
  });
};

export const useAllDiagnosisList = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(URIS.general.diagnosisListPublic);
      return response.data;
    },
  });
};

export const useDiagnosisListByGroupType = () => {
  return useMutation({
    mutationFn: async (payload: { group_type: string }) => {
      const response = await api.post(
        URIS.general.diagnosisListPublic,
        payload
      );
      return response.data;
    },
  });
};

export const useGetDiagnosisCategories = () => {
  return useQuery<GetDiagnosisCategory[]>({
    queryKey: ["getDiagnosisCategories"],
    queryFn: async () => {
      const response = await api.get(URIS.general.diagnosisCategories);
      return response.data;
    },
  });
};

// queries/index.ts
export const useDiagnosisListByGroupAndCategory = () => {
  return useMutation({
    mutationFn: async ({
      group_type,
      diagnosis_category_id,
    }: {
      group_type: "group" | "individual";
      diagnosis_category_id: number;
    }) => {
      const response = await api.post(URIS.general.diagnosisListPublic, {
        group_type,
        diagnosis_category_id,
      });
      return response.data;
    },
  });
};

// diagnosis search mutation
export const useDiagnosisSearch = () => {
  return useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await api.post(URIS.search.diagnosisSearch, {
        query: searchQuery,
      });
      return response.data;
    },
  });
};
