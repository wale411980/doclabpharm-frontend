import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  SuperAdminStats,
  SuperAdminRecentUsers,
  SuperAdminRecentWithdraw,
  SuperAdminRecentAppointments,
  SuperAdminAllWithdraw,
  SuperAdminConversations,
  SuperAdminConversationsMessages,
  SuperAdminMessageSearch,
  SuperAdminTransactionStats,
  SuperAdminDoctorList,
  SuperAdminDoctorUpdate,
  SuperAdminLabList,
  SuperAdminLabUpdate,
  SuperAdminPharmacyList,
  SuperAdminPharmacyUpdate,
  SuperAdminPatientList,
  SuperAdminPatientUpdate,
  SuperAdminPatientStats,
  SuperAdminLabAppointments,
  SuperAdminConsultation,
  SuperAdminAddConsultation,
  DiagnosisList,
  EditDiagnosticService,
  AddDiagnosticService,
  AddDiagnosisCategory,
  SuperAdminOrderHistoryResponse,
  SuperAdminReportsAdd,
  SuperAdminReportsUpdate,
  SuperAdminPharmacyMedicineCategory,
  SuperAdminTransaction,
  GetDiagnosisCategory,
  PatientReportsById,
  SuperAdminAppointments,
  SuperAdminMessagesStats,
  PatientReports,
  SuperAdminListAPIResponse,
  SuperAdminAdminUpdate,
  SuperAdminAddAdmin,
  SuperAdminCallRecordings,
  SuperAdminSettingsList,
  SuperAdminSettingsUpdate,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

// get admin stats
export const useSuperAdminStats = () => {
  return useQuery<SuperAdminStats>({
    queryKey: ["superAdminStats"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminStats);
      return response.data;
    },
  });
};

// get all admin transactions
export const useSuperAdminRecentTransactions = () => {
  return useQuery<SuperAdminTransaction[]>({
    queryKey: ["superAdminRecentTransactions"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminRecentTransactions
      );
      return response.data.data;
    },
  });
};

export const useSuperAdminAllTransactions = (page: number) => {
  return useQuery({
    queryKey: ["superAdminRecentTransactions", page],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminRecentTransactions}?page=${page}`
      );
      return response.data;
    },
  });
};

// get all admin appointments
export const useSuperAdminRecentAppointments = () => {
  return useQuery<SuperAdminRecentAppointments[]>({
    queryKey: ["superAdminRecentAppointments"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminRecentAppointments
      );
      return response.data;
    },
  });
};

export const useSuperAdminAllDoctorAppointments = () => {
  return useQuery<SuperAdminRecentAppointments[]>({
    queryKey: ["superAdminAllDoctorAppointments"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminAllDoctorAppointments
      );
      return response.data;
    },
  });
};

export const useSuperAdminAllLabAppointments = () => {
  return useQuery<SuperAdminLabAppointments[]>({
    queryKey: ["superAdminAllLabAppointments"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminAllLabAppointments
      );
      return response.data;
    },
  });
};

// get all admin users
export const useSuperAdminRecentUsers = () => {
  return useQuery<SuperAdminRecentUsers[]>({
    queryKey: ["superAdminRecentUsers"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminRecentUsers);
      return response.data;
    },
  });
};

// get all admin withdraw
export const useSuperAdminRecentWithdraw = () => {
  return useQuery<SuperAdminRecentWithdraw[]>({
    queryKey: ["superAdminRecentWithdraw"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminRecentWithdraw);
      return response.data.data;
    },
  });
};

// get admin payment
export const useSuperAdminAllWithdraw = () => {
  return useQuery<SuperAdminAllWithdraw[]>({
    queryKey: ["superAdminAllWithdraw"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminAllWithdraw);
      return response.data.data;
    },
  });
};

// get admin transaction stats
export const useSuperAdminTransactionStats = () => {
  return useQuery<SuperAdminTransactionStats>({
    queryKey: ["superAdminTransactionStats"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminTransactionStats
      );
      return response.data;
    },
  });
};

// get admin conversation
export const useSuperAdminConversation = () => {
  return useQuery<SuperAdminConversations[]>({
    queryKey: ["superAdminConversation"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminConversations);
      return response.data.data;
    },
  });
};

// get admin conversation messages
export const useSuperAdminConversationMessages = (conversationId: number) => {
  return useQuery<SuperAdminConversationsMessages[]>({
    queryKey: ["superAdminConversationMessages", conversationId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminConversationsMessages}/${conversationId}/messages`
      );
      return response.data;
    },
    enabled: !!conversationId, // ensures query only runs if conversationId is provided
  });
};

// get admin messages search
export const useSuperAdminMessagesSearch = (search: string) => {
  return useQuery<SuperAdminMessageSearch[]>({
    queryKey: ["superAdminMessagesSearch", search],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminMessageSearch}?search=${search}`
      );
      return response.data;
    },
  });
};

// get admin messages stats
export const useSuperAdminMessagesStats = () => {
  return useQuery<SuperAdminMessagesStats>({
    queryKey: ["superAdminMessagesStats"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminMessagesStats);
      return response.data;
    },
  });
};

// delete admin conversation
export const useSuperAdminDeleteConversation = () => {
  return useMutation({
    mutationKey: ["superAdminDeleteConversation"],
    mutationFn: async ({ id }: { id: number }) => {
      const response = await api.delete(
        `${URIS.superAdmin.superAdminConversationDelete}/${id}`
      );
      return response.data;
    },
  });
};

// delete admin messages by id
export const useSuperAdminDeleteMessage = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.delete(
        `${URIS.superAdmin.superAdminConversationDeleteById}/${id}`
      );
      return response.data;
    },
  });
};

// get admin doctor
export const useSuperAdminDoctorList = () => {
  return useQuery<SuperAdminDoctorList[]>({
    queryKey: ["superAdminDoctorList"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminDoctorList);
      return response.data;
    },
  });
};

// update admin doctor
export const useSuperAdminUpdateDoctor = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: SuperAdminDoctorUpdate;
    }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminDoctorUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete admin doctor
export const useSuperAdminDeleteDoctor = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminDoctorDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useSuperAdminLabList = () => {
  return useQuery<SuperAdminLabList[]>({
    queryKey: ["superAdminLabList"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminLabList);
      return response.data;
    },
  });
};

export const useSuperAdminUpdateLab = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Omit<SuperAdminLabUpdate, "id">;
    }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminLabUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useSuperAdminDeleteLab = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminLabDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useSuperAdminPharmacyList = () => {
  return useQuery<SuperAdminPharmacyList[]>({
    queryKey: ["superAdminPharmacyList"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminPharmacyList);
      return response.data;
    },
  });
};

export const useSuperAdminUpdatePharmacy = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: SuperAdminPharmacyUpdate;
    }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminPharmacyUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useSuperAdminDeletePharmacy = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminPharmacyDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useSuperAdminPatientList = () => {
  return useQuery<SuperAdminPatientList[]>({
    queryKey: ["superAdminPatientList"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminPatientList);
      return response.data;
    },
  });
};

export const useSuperAdminUpdatePatient = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: SuperAdminPatientUpdate;
    }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminPatientUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useSuperAdminDeletePatient = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminPatientDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useSuperAdminPatientStats = () => {
  return useQuery<SuperAdminPatientStats>({
    queryKey: ["superAdminPatientStats"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminPatientStats);
      return response.data;
    },
  });
};

// get admin consultation
export const useSuperAdminConsultationList = () => {
  return useQuery<SuperAdminConsultation[]>({
    queryKey: ["superAdminConsultationList"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminConsultationList
      );
      return response.data;
    },
  });
};

// get admin consultation by id
export const useSuperAdminGetConsultation = (id?: number) => {
  return useQuery<SuperAdminConsultation>({
    queryKey: ["superAdminGetConsultation", id],
    queryFn: async () => {
      if (!id) throw new Error("No consultation ID provided");
      const response = await api.get(
        `${URIS.superAdmin.superAdminGetConsultation}/${id}`
      );
      return response.data;
    },
    enabled: !!id, // only run when id is provided
  });
};
// add admin consultation
export const useSuperAdminAddConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: SuperAdminAddConsultation }) => {
      const response = await api.post(
        URIS.superAdmin.superAdminAddConsultation,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the specific prescription details query to refetch latest data
      queryClient.invalidateQueries({
        queryKey: ["superAdminConsultationList"],
      });
    },
  });
};

//update admin consultation
export const useSuperAdminUpdateConsultation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: SuperAdminAddConsultation;
    }) => {
      const response = await api.put(
        `${URIS.superAdmin.superAdminUpdateConsultation}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete admin consultation
export const useSuperAdminDeleteConsultation = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.delete(
        `${URIS.superAdmin.superAdminDeleteConsultation}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get admin order histories
export const useSuperAdminOrderHistories = (page: number) => {
  return useQuery<SuperAdminOrderHistoryResponse>({
    queryKey: ["superAdminOrderHistories", page],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminOrderHistories}?page=${page}`
      );
      return response.data; // response.data should be the AdminOrderHistoryResponse object
    },
  });
};

// get admin reports
export const useSuperAdminAppointments = () => {
  return useQuery<SuperAdminAppointments[]>({
    queryKey: ["superAdminAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminAppointments);
      return response.data.data;
    },
  });
};

// add super admin reports
export const useSuperAdminReportsAdd = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: SuperAdminReportsAdd }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminReportsAdd}`,
        data
      );
      return response.data;
    },
  });
};

// update admin report by id
export const useSuperAdminReportsUpdate = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: SuperAdminReportsUpdate;
    }) => {
      const response = await api.post(
        `${URIS.superAdmin.superAdminReportsUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete admin report by id
export const useSuperAdminReportsDelete = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await api.delete(
        `${URIS.superAdmin.superAdminReportsDelete}/${id}`
      );
      return response.data;
    },
  });
};

export const useSuperAdminLabTechnicianPatientReports = () => {
  return useQuery<PatientReports[]>({
    queryKey: ["superAdminLabTechnicianPatientReports"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminPatientReports);
      return response.data.data;
    },
  });
};

export const useSuperAdminLabTechnicianPatientReportById = (
  reportId: number
) => {
  return useQuery<PatientReportsById[]>({
    queryKey: ["superAdminLabTechnicianPatientReportById", reportId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminPatientReportById}/${reportId}`
      );
      return response.data.data;
    },
    enabled: !!reportId, // only fetch if id is truthy (non-zero)
  });
};

export const useGetSuperAdminLabTechnicianAllDiagnosisLst = () => {
  return useQuery<DiagnosisList[]>({
    queryKey: ["getAllDiagnosisList"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.getAllDiagnosisList);
      return response.data;
    },
  });
};

export const useAddSuperAdminLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async (data: AddDiagnosticService) => {
      const response = await api.post(URIS.superAdmin.addDiagnosisList, data);
      return response.data;
    },
  });
};

export const useUpdateSuperAdminLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: EditDiagnosticService;
    }) => {
      const response = await api.put(
        `${URIS.superAdmin.updateDiagnosisList}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteSuperAdminLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.superAdmin.deleteDiagnosisList}/${id}/delete`
      );
      return response.data;
    },
  });
};

export const useGetSuperAdminLabTechnicianDiagnosisByCategories = () => {
  return useQuery<GetDiagnosisCategory[]>({
    queryKey: ["getDiagnosisByCategories"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.getDiagnosisByCategories);
      return response.data;
    },
  });
};

export const useGetSuperAdminLabTechnicianDiagnosisByCategoryId = (
  categoryId: number,
  options = {}
) => {
  return useQuery<GetDiagnosisCategory>({
    queryKey: ["getDiagnosisByCategoryId", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.getDiagnosisByCategoryId}/${categoryId}`
      );
      return response.data;
    },
    enabled: !!categoryId, // only fetch if id is truthy (non-zero)
    ...options,
  });
};

export const useAddSuperAdminLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (data: AddDiagnosisCategory) => {
      const response = await api.post(
        URIS.superAdmin.addDiagnosisCategory,
        data
      );
      return response.data;
    },
  });
};

export const useUpdateSuperAdminLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AddDiagnosisCategory;
    }) => {
      const response = await api.put(
        `${URIS.superAdmin.updateDiagnosisCategory}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteSuperAdminLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.superAdmin.deleteDiagnosisCategory}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get pharmacy medicine categories
export const useGetSuperAdminPharmacyMedicineCategories = () => {
  return useQuery<SuperAdminPharmacyMedicineCategory[]>({
    queryKey: ["superAdminPharmacyMedicineCategories"],
    queryFn: async () => {
      const response = await api.get(
        URIS.superAdmin.superAdminPharmacyMedicineCategories
      );
      return response.data;
    },
  });
};

// get pharmacy medicine categories by id
export const useGetSuperAdminPharmacyMedicineCategoriesById = (
  categoryId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["superAdminPharmacyMedicineCategoryById", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminPharmacyMedicineCategoriesById}/${categoryId}`
      );
      return response.data;
    },

    enabled: !!categoryId,
    ...options,
  });
};

// add new medicine category
export const useAddSuperAdminPharmacyMedicineCategory = () => {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await api.post(
        URIS.superAdmin.superAddAdminPharmacyMedicineCategory,
        data
      );
      return response.data;
    },
  });
};

export const useUpdateSuperAdminPharmacyDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AddDiagnosisCategory;
    }) => {
      const response = await api.put(
        `${URIS.superAdmin.updateAdminPharmacyMedicineCategory}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteSuperAdminPharmacyDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.superAdmin.deleteAdminPharmacyMedicineCategory}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get admin
export const useSuperAdminAdminList = (page = 1) => {
  return useQuery<SuperAdminListAPIResponse>({
    queryKey: ["superAdminAdminList", page],

    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminAdminList}?page=${page}`
      );
      return response.data;
    },
  });
};

// add admin
export const useSuperAdminAddAdmin = () => {
  return useMutation({
    mutationFn: async (data: SuperAdminAddAdmin) => {
      const response = await api.post(URIS.superAdmin.superAdminAddAdmin, data);
      return response.data;
    },
  });
};

// update admin
export const useSuperAdminUpdateAdmin = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: SuperAdminAdminUpdate;
    }) => {
      const response = await api.put(
        `${URIS.superAdmin.superAdminUpdateAdmin}/${id}/update`,
        data
      );
      return response.data;
    },
  });
};

// delete admin
export const useSuperAdminDeleteAdmin = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number | string }) => {
      const response = await api.delete(
        `${URIS.superAdmin.superAdminDeleteAdmin}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get call recordings
export const useSuperAdminCallRecordings = () => {
  return useQuery<SuperAdminCallRecordings[]>({
    queryKey: ["superAdminCallRecordings"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminCallRecordings);
      return response.data.recordings;
    },
  });
};

// get call recordings by id
export const useSuperAdminCallRecordingById = (id: number) => {
  return useQuery<SuperAdminCallRecordings>({
    queryKey: ["superAdminCallRecordingById", id],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.superAdmin.superAdminCallRecordingById}/${id}/download`
      );
      return response.data;
    },
    enabled: !!id, // only fetch if id is provided
  });
};

// get super admin settings list
export const useSuperAdminSettingsList = () => {
  return useQuery<SuperAdminSettingsList>({
    queryKey: ["superAdminSettingsList"],
    queryFn: async () => {
      const response = await api.get(URIS.superAdmin.superAdminSettingsList);
      return response.data.settings;
    },
  });
};

// update super admin settings
export const useSuperAdminSettingsUpdate = () => {
  return useMutation({
    mutationFn: async (data: SuperAdminSettingsUpdate) => {
      const response = await api.post(
        URIS.superAdmin.superAdminSettingsUpdate,
        data
      );
      return response.data;
    },
  });
};
