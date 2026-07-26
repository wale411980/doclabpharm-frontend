import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  Pharmacy,
  PharmacyStats,
  PharmacyWallet,
  UpdatePharmacy,
  PharmacyOrders,
  PharmacyMedicineCategory,
  AddPharmacyMedicine,
  UpdatePharmacyMedicineCategory,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

export const useGetPharmacyProfile = () => {
  return useQuery<Pharmacy>({
    queryKey: ["pharmacyProfile"],
    queryFn: async () => {
      const response = await api.get(URIS.pharmacy.getPharmacyProfile);
      return response.data.original;
    },
  });
};

export const useUpdatePharmacyProfileSettings = () => {
  return useMutation({
    mutationFn: async ({
      pharmacyId,
      data,
    }: {
      pharmacyId: number;
      data: UpdatePharmacy;
    }) => {
      const response = await api.put(
        `${URIS.pharmacy.updatePharmacyProfile}/${pharmacyId}`,
        data
      );
      return response.data;
    },
  });
};

export const usePharmacyStats = () => {
  return useQuery<PharmacyStats>({
    queryKey: ["pharmacyStats"],
    queryFn: async () => {
      const response = await api.get(URIS.pharmacy.pharmacyStats);
      return response.data;
    },
  });
};

export const usePharmacyWallet = () => {
  return useQuery<PharmacyWallet>({
    queryKey: ["pharmacyWallet"],
    queryFn: async () => {
      const response = await api.get(URIS.pharmacy.pharmacyWallet);
      return response.data;
    },
  });
};

// get pharmacy medicine categories
export const useGetPharmacyMedicineCategories = () => {
  return useQuery<PharmacyMedicineCategory[]>({
    queryKey: ["pharmacyMedicineCategories"],
    queryFn: async () => {
      const response = await api.get(URIS.pharmacy.pharmacyMedicineCategories);
      return response.data;
    },
  });
};

// get pharmacy medicine categories by id
export const useGetPharmacyMedicineCategoriesById = (
  categoryId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["pharmacyMedicineCategoriesById", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.pharmacy.pharmacyMedicineCategoriesById}/${categoryId}`
      );
      return response.data;
    },

    enabled: !!categoryId,
    ...options,
  });
};

// add new medicine category
export const useAddPharmacyMedicineCategory = () => {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await api.post(
        URIS.pharmacy.addPharmacyMedicineCategory,
        data
      );
      return response.data;
    },
  });
};

// update pharmacy medicine category
export const useUpdatePharmacyMedicineCategory = () => {
  return useMutation({
    mutationFn: async ({
      categoryId,
      data,
    }: {
      categoryId: number;
      data: UpdatePharmacyMedicineCategory;
    }) => {
      const response = await api.put(
        `${URIS.pharmacy.updatePharmacyMedicineCategory}/${categoryId}`,
        data
      );
      return response.data;
    },
  });
};

// delete pharmacy medicine category
export const useDeletePharmacyMedicineCategory = () => {
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await api.delete(
        `${URIS.pharmacy.deletePharmacyMedicineCategory}/${categoryId}/delete`
      );
      return response.data;
    },
  });
};

// get all pharmacy medicine
export const useGetPharmacyMedicines = () => {
  return useQuery({
    queryKey: ["pharmacyMedicines"],
    queryFn: async () => {
      const response = await api.get(URIS.pharmacy.pharmacyMedicines);
      return response.data;
    },
  });
};

// get pharmacy medicine by id
export const useGetPharmacyMedicineById = (medicineId: string) => {
  return useQuery({
    queryKey: ["pharmacyMedicineById", medicineId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.pharmacy.pharmacyMedicineById}/${medicineId}`
      );
      return response.data;
    },
  });
};

// add new pharmacy medicine
export const useAddPharmacyMedicine = () => {
  return useMutation({
    mutationFn: async (data: AddPharmacyMedicine) => {
      const response = await api.post(URIS.pharmacy.addPharmacyMedicine, data);
      return response.data;
    },
  });
};

// update pharmacy medicine
export const useUpdatePharmacyMedicine = () => {
  return useMutation({
    mutationFn: async ({
      medicineId,
      data,
    }: {
      medicineId: number;
      data: AddPharmacyMedicine;
    }) => {
      const response = await api.put(
        `${URIS.pharmacy.updatePharmacyMedicine}/${medicineId}`,
        data
      );
      return response.data;
    },
  });
};

// update pharmacy medicine quantity
export const useUpdatePharmacyMedicineQuantity = () => {
  return useMutation({
    mutationFn: async ({
      medicineId,
      data,
    }: {
      medicineId: number;
      data: { quantity: number };
    }) => {
      const response = await api.put(
        `${URIS.pharmacy.updatePharmacyMedicineQuantity}/${medicineId}`,
        data
      );
      return response.data;
    },
  });
};

// delete pharmacy medicine
export const useDeletePharmacyMedicine = () => {
  return useMutation({
    mutationFn: async (medicineId: number) => {
      const response = await api.delete(
        `${URIS.pharmacy.deletePharmacyMedicine}/${medicineId}/delete`
      );
      return response.data;
    },
  });
};

// get pharmacy orders
export const useGetPharmacyOrders = () => {
  return useQuery<PharmacyOrders[]>({
    queryKey: ["pharmacyOrders"],
    queryFn: async () => {
      const response = await api.get(URIS.pharmacy.pharmacyOrders);
      return response.data.original.orders;
    },
  });
};

// get pharmacy order by id
export const useGetPharmacyOrderById = (
  orderId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["pharmacyOrderById", orderId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.pharmacy.pharmacyOrderById}/${orderId}`
      );
      return response.data.original.orders[0];
    },
    enabled: !!orderId,
    ...options,
  });
};

// approve pharmacy order by id
export const useApprovePharmacyOrder = () => {
  return useMutation({
    mutationFn: async (data: {
      orderId: number;
      payload: { reason: string; status: string };
    }) => {
      const response = await api.post(
        `${URIS.pharmacy.approvePharmacyOrder}/${data.orderId}`,
        data.payload
      );
      return response.data;
    },
  });
};

// approve pharmacy order individually by id
export const useApprovePharmacyOrderIndividually = () => {
  return useMutation({
    mutationFn: async (data: {
      itemId: number;
      payload: { reason: string; status: string };
    }) => {
      const response = await api.post(
        `${URIS.pharmacy.approvePharmacyOrderIndividually}/${data.itemId}`,
        data.payload
      );
      return response.data;
    },
  });
};
