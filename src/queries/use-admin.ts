import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AdminStats,
  AdminRecentUsers,
  AdminRecentWithdraw,
  AdminRecentAppointments,
  AdminAllWithdraw,
  AdminConversations,
  AdminConversationsMessages,
  AdminMessageSearch,
  AdminTransactionStats,
  AdminDoctorList,
  AdminDoctorUpdate,
  AdminLabList,
  AdminLabUpdate,
  AdminPharmacyList,
  AdminPharmacyUpdate,
  AdminPatientList,
  AdminPatientUpdate,
  AdminPatientStats,
  AdminLabAppointments,
  AdminConsultation,
  AdminAddConsultation,
  DiagnosisList,
  EditDiagnosticService,
  AddDiagnosticService,
  AddDiagnosisCategory,
  AdminOrderHistoryResponse,
  AdminReportsAdd,
  AdminReportsUpdate,
  AdminPharmacyMedicineCategory,
  Transaction,
  GetDiagnosisCategory,
  PatientReportsById,
  AdminAppointments,
  AdminMessagesStats,
  PatientReports,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

// get admin stats
export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminStats);
      return response.data;
    },
  });
};

// get all admin transactions
export const useAdminRecentTransactions = () => {
  return useQuery<Transaction[]>({
    queryKey: ["adminRecentTransactions"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminRecentTransactions);
      return response.data.data;
    },
  });
};

export const useAdminAllTransactions = (page: number) => {
  return useQuery({
    queryKey: ["adminRecentTransactions", page],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.adminRecentTransactions}?page=${page}`
      );
      return response.data;
    },
  });
};

// get all admin appointments
export const useAdminRecentAppointments = () => {
  return useQuery<AdminRecentAppointments[]>({
    queryKey: ["adminRecentAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminRecentAppointments);
      return response.data;
    },
  });
};

export const useAdminAllDoctorAppointments = () => {
  return useQuery<AdminRecentAppointments[]>({
    queryKey: ["adminAllDoctorAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminAllDoctorAppointments);
      return response.data;
    },
  });
};

export const useAdminAllLabAppointments = () => {
  return useQuery<AdminLabAppointments[]>({
    queryKey: ["adminAllLabAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminAllLabAppointments);
      return response.data;
    },
  });
};

// get all admin users
export const useAdminRecentUsers = () => {
  return useQuery<AdminRecentUsers[]>({
    queryKey: ["adminRecentUsers"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminRecentUsers);
      return response.data;
    },
  });
};

// get all admin withdraw
export const useAdminRecentWithdraw = () => {
  return useQuery<AdminRecentWithdraw[]>({
    queryKey: ["adminRecentWithdraw"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminRecentWithdraw);
      return response.data.data;
    },
  });
};

// get admin payment
export const useAdminAllWithdraw = () => {
  return useQuery<AdminAllWithdraw[]>({
    queryKey: ["adminAllWithdraw"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminAllWithdraw);
      return response.data.data;
    },
  });
};

// get admin transaction stats
export const useAdminTransactionStats = () => {
  return useQuery<AdminTransactionStats>({
    queryKey: ["adminTransactionStats"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminTransactionStats);
      return response.data;
    },
  });
};

// get admin conversation
export const useAdminConversation = () => {
  return useQuery<AdminConversations[]>({
    queryKey: ["adminConversation"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminConversations);
      return response.data.data;
    },
  });
};

// get admin conversation messages
export const useAdminConversationMessages = (conversationId: number) => {
  return useQuery<AdminConversationsMessages[]>({
    queryKey: ["adminConversationMessages", conversationId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.adminConversationsMessages}/${conversationId}/messages`
      );
      return response.data;
    },
    enabled: !!conversationId, // ensures query only runs if conversationId is provided
  });
};

// get admin messages search
export const useAdminMessagesSearch = (search: string) => {
  return useQuery<AdminMessageSearch[]>({
    queryKey: ["adminMessagesSearch", search],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.adminMessageSearch}?search=${search}`
      );
      return response.data;
    },
  });
};

// get admin messages stats
export const useAdminMessagesStats = () => {
  return useQuery<AdminMessagesStats>({
    queryKey: ["adminMessagesStats"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminMessagesStats);
      return response.data;
    },
  });
};

// delete admin conversation
export const useAdminDeleteConversation = () => {
  return useMutation({
    mutationKey: ["adminDeleteConversation"],
    mutationFn: async ({ id }: { id: number }) => {
      const response = await api.delete(
        `${URIS.admin.adminConversationDelete}/${id}`
      );
      return response.data;
    },
  });
};

// delete admin messages by id
export const useAdminDeleteMessage = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.delete(
        `${URIS.admin.adminConversationDeleteById}/${id}`
      );
      return response.data;
    },
  });
};

// get admin doctor
export const useAdminDoctorList = () => {
  return useQuery<AdminDoctorList[]>({
    queryKey: ["adminDoctorList"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminDoctorList);
      return response.data;
    },
  });
};

// update admin doctor
export const useAdminUpdateDoctor = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: AdminDoctorUpdate;
    }) => {
      const response = await api.post(
        `${URIS.admin.adminDoctorUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete admin doctor
export const useAdminDeleteDoctor = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(`${URIS.admin.adminDoctorDelete}/${id}`);
      return response.data;
    },
  });
};

export const useAdminLabList = () => {
  return useQuery<AdminLabList[]>({
    queryKey: ["adminLabList"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminLabList);
      return response.data;
    },
  });
};

export const useAdminUpdateLab = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Omit<AdminLabUpdate, "id">;
    }) => {
      const response = await api.post(
        `${URIS.admin.adminLabUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useAdminDeleteLab = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(`${URIS.admin.adminLabDelete}/${id}`);
      return response.data;
    },
  });
};

export const useAdminPharmacyList = () => {
  return useQuery<AdminPharmacyList[]>({
    queryKey: ["adminPharmacyList"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminPharmacyList);
      return response.data;
    },
  });
};

export const useAdminUpdatePharmacy = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: AdminPharmacyUpdate;
    }) => {
      const response = await api.post(
        `${URIS.admin.adminPharmacyUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useAdminDeletePharmacy = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(
        `${URIS.admin.adminPharmacyDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useAdminPatientList = () => {
  return useQuery<AdminPatientList[]>({
    queryKey: ["adminPatientList"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminPatientList);
      return response.data;
    },
  });
};

export const useAdminUpdatePatient = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: AdminPatientUpdate;
    }) => {
      const response = await api.post(
        `${URIS.admin.adminPatientUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useAdminDeletePatient = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(`${URIS.admin.adminPatientDelete}/${id}`);
      return response.data;
    },
  });
};

export const useAdminPatientStats = () => {
  return useQuery<AdminPatientStats>({
    queryKey: ["adminPatientStats"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminPatientStats);
      return response.data;
    },
  });
};

// get admin consultation
export const useAdminConsultationList = () => {
  return useQuery<AdminConsultation[]>({
    queryKey: ["adminConsultationList"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminConsultationList);
      return response.data;
    },
  });
};

// get admin consultation by id
export const useAdminGetConsultation = (id?: number) => {
  return useQuery<AdminConsultation>({
    queryKey: ["adminGetConsultation", id],
    queryFn: async () => {
      if (!id) throw new Error("No consultation ID provided");
      const response = await api.get(
        `${URIS.admin.adminGetConsultation}/${id}`
      );
      return response.data;
    },
    enabled: !!id, // only run when id is provided
  });
};
// add admin consultation
export const useAdminAddConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: AdminAddConsultation }) => {
      const response = await api.post(URIS.admin.adminAddConsultation, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the specific prescription details query to refetch latest data
      queryClient.invalidateQueries({
        queryKey: ["adminConsultationList"],
      });
    },
  });
};

//update admin consultation
export const useAdminUpdateConsultation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: AdminAddConsultation;
    }) => {
      const response = await api.put(
        `${URIS.admin.adminUpdateConsultation}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete admin consultation
export const useAdminDeleteConsultation = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.delete(
        `${URIS.admin.adminDeleteConsultation}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get admin order histories
export const useAdminOrderHistories = (page: number) => {
  return useQuery<AdminOrderHistoryResponse>({
    queryKey: ["adminOrderHistories", page],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.adminOrderHistories}?page=${page}`
      );
      return response.data; // response.data should be the AdminOrderHistoryResponse object
    },
  });
};

// get admin reports
export const useAdminAppointments = () => {
  return useQuery<AdminAppointments[]>({
    queryKey: ["adminAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminAppointments);
      return response.data.data;
    },
  });
};

// add admin reports
export const useAdminReportsAdd = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: AdminReportsAdd }) => {
      const response = await api.post(`${URIS.admin.adminReportsAdd}`, data);
      return response.data;
    },
  });
};

// update admin report by id
export const useAdminReportsUpdate = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: AdminReportsUpdate;
    }) => {
      const response = await api.post(
        `${URIS.admin.adminReportsUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete admin report by id
export const useAdminReportsDelete = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await api.delete(
        `${URIS.admin.adminReportsDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useAdminLabTechnicianPatientReports = () => {
  return useQuery<PatientReports[]>({
    queryKey: ["adminLabTechnicianPatientReports"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.adminPatientReports);
      return response.data.data;
    },
  });
};

export const useAdminLabTechnicianPatientReportById = (reportId: number) => {
  return useQuery<PatientReportsById[]>({
    queryKey: ["adminLabTechnicianPatientReportById", reportId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.adminPatientReportById}/${reportId}`
      );
      return response.data.data;
    },
    enabled: !!reportId, // only fetch if id is truthy (non-zero)
  });
};

export const useGetAdminLabTechnicianAllDiagnosisLst = () => {
  return useQuery<DiagnosisList[]>({
    queryKey: ["getAllDiagnosisList"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.getAllDiagnosisList);
      return response.data;
    },
  });
};

export const useAddAdminLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async (data: AddDiagnosticService) => {
      const response = await api.post(URIS.admin.addDiagnosisList, data);
      return response.data;
    },
  });
};

export const useUpdateAdminLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: EditDiagnosticService;
    }) => {
      const response = await api.put(
        `${URIS.admin.updateDiagnosisList}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteAdminLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.admin.deleteDiagnosisList}/${id}/delete`
      );
      return response.data;
    },
  });
};

export const useGetAdminLabTechnicianDiagnosisByCategories = () => {
  return useQuery<GetDiagnosisCategory[]>({
    queryKey: ["getDiagnosisByCategories"],
    queryFn: async () => {
      const response = await api.get(URIS.admin.getDiagnosisByCategories);
      return response.data;
    },
  });
};

export const useGetAdminLabTechnicianDiagnosisByCategoryId = (
  categoryId: number,
  options = {}
) => {
  return useQuery<GetDiagnosisCategory>({
    queryKey: ["getDiagnosisByCategoryId", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.getDiagnosisByCategoryId}/${categoryId}`
      );
      return response.data;
    },
    enabled: !!categoryId, // only fetch if id is truthy (non-zero)
    ...options,
  });
};

export const useAddAdminLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (data: AddDiagnosisCategory) => {
      const response = await api.post(URIS.admin.addDiagnosisCategory, data);
      return response.data;
    },
  });
};

export const useUpdateAdminLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AddDiagnosisCategory;
    }) => {
      const response = await api.put(
        `${URIS.admin.updateDiagnosisCategory}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteAdminLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.admin.deleteDiagnosisCategory}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get pharmacy medicine categories
export const useGetAdminPharmacyMedicineCategories = () => {
  return useQuery<AdminPharmacyMedicineCategory[]>({
    queryKey: ["adminPharmacyMedicineCategories"],
    queryFn: async () => {
      const response = await api.get(
        URIS.admin.adminPharmacyMedicineCategories
      );
      return response.data;
    },
  });
};

// get pharmacy medicine categories by id
export const useGetAdminPharmacyMedicineCategoriesById = (
  categoryId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["adminPharmacyMedicineCategoryById", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.admin.adminPharmacyMedicineCategoriesById}/${categoryId}`
      );
      return response.data;
    },

    enabled: !!categoryId,
    ...options,
  });
};

// add new medicine category
export const useAddAdminPharmacyMedicineCategory = () => {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await api.post(
        URIS.admin.addAdminPharmacyMedicineCategory,
        data
      );
      return response.data;
    },
  });
};

export const useUpdateAdminPharmacyDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AddDiagnosisCategory;
    }) => {
      const response = await api.put(
        `${URIS.admin.updateAdminPharmacyMedicineCategory}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteAdminPharmacyDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.admin.deleteAdminPharmacyMedicineCategory}/${id}/delete`
      );
      return response.data;
    },
  });
};
