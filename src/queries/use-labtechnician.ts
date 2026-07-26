import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  LabTechnician,
  DiagnosticService,
  LabTechnicianStats,
  LabTechnicianWallet,
  UpdateLabTechnician,
  PatientReports,
  PatientReportsById,
  MostRecentAppointments,
  GetAllPatientsLab,
  DiagnosisList,
  GetDiagnosisCategory,
  AddDiagnosisCategory,
  AddDiagnosticService,
  EditDiagnosticService,
  ReportsUpdate,
  ReportsAdd,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

export const useGetLabTechnicianProfile = () => {
  return useQuery<LabTechnician>({
    queryKey: ["labTechnicianProfile"],
    queryFn: async () => {
      const response = await api.get(
        URIS.labTechnician.getLabTechnicianProfile
      );
      return response.data.original;
    },
  });
};

export const useUpdateLabTechnicianProfileSettings = () => {
  return useMutation({
    mutationFn: async ({
      labTechnicianId,
      data,
    }: {
      labTechnicianId: number;
      data: UpdateLabTechnician;
    }) => {
      const response = await api.put(
        `${URIS.labTechnician.updateLabTechnicianProfile}/${labTechnicianId}`,
        data
      );
      return response.data;
    },
  });
};

export const useGetDiagnosis = () => {
  return useQuery<DiagnosticService>({
    queryKey: ["diagnosis"],
    queryFn: async () => {
      const response = await api.get(URIS.labTechnician.diagosis);
      return response.data;
    },
  });
};

// Update Diagnostic Service
export const useUpdateDiagnosticService = () => {
  return useMutation({
    mutationFn: async (data: DiagnosticService) => {
      const response = await api.put(
        `${URIS.labTechnician.updateDiagnosis}/${data.id}`,
        data
      );
      return response.data;
    },
  });
};

// Add Diagnostic Service
export const useAddDiagnosticService = () => {
  return useMutation({
    mutationFn: async (data: DiagnosticService) => {
      const response = await api.post(URIS.labTechnician.addDiagnosis, data);
      return response.data;
    },
  });
};

// Delete Diagnostic Service
export const useDeleteDiagnosticService = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${URIS.labTechnician.deleteDiagnosis}/${id}/delete`
      );
      return response.data;
    },
  });
};

export const useLabTechnicianStats = () => {
  return useQuery<LabTechnicianStats>({
    queryKey: ["labTechnicianStats"],
    queryFn: async () => {
      const response = await api.get(URIS.labTechnician.labTechnicianStats);
      return response.data;
    },
  });
};

// get lab technician wallet
export const useLabTechnicianWallet = () => {
  return useQuery<LabTechnicianWallet>({
    queryKey: ["labTechnicianWallet"],
    queryFn: async () => {
      const response = await api.get(URIS.labTechnician.labTechnicianWallet);
      return response.data;
    },
  });
};

// get patients reports
export const useLabTechnicianPatientReports = () => {
  return useQuery<PatientReports[]>({
    queryKey: ["labTechnicianPatientReports"],
    queryFn: async () => {
      const response = await api.get(
        URIS.labTechnician.labTechnicianPatientReports
      );
      return response.data.data;
    },
  });
};

// get patients reports by id
export const useLabTechnicianPatientReportById = (reportId: number) => {
  return useQuery<PatientReportsById[]>({
    queryKey: ["labTechnicianPatientReportById", reportId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.labTechnician.labTechnicianPatientReportById}/${reportId}`
      );
      return response.data.data;
    },
    enabled: !!reportId, // only fetch if id is truthy (non-zero)
  });
};

// delete patient report
export const useLabTechnicianPatientReportDelete = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.labTechnician.deletePatientReport}/${id}`
      );
      return response.data;
    },
  });
};

// get most recent appointments
export const useLabTechnicianMostRecentAppointments = () => {
  return useQuery<MostRecentAppointments[]>({
    queryKey: ["labTechnicianRecentAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.labTechnician.mostRecentAppointments);
      return response.data;
    },
  });
};

export const useGetLabTechnicianAllPatients = () => {
  return useQuery<GetAllPatientsLab[]>({
    queryKey: ["getAllPatients"],
    queryFn: async () => {
      const response = await api.get(URIS.labTechnician.getAllPatients);
      return response.data;
    },
  });
};

// get lab technician all diagnosis
export const useGetLabTechnicianAllDiagnosisLst = () => {
  return useQuery<DiagnosisList[]>({
    queryKey: ["getAllDiagnosisList"],
    queryFn: async () => {
      const response = await api.get(URIS.labTechnician.getAllDiagnosisList);
      return response.data;
    },
  });
};

// add lab technician diagnosis
export const useAddLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async (data: AddDiagnosticService) => {
      const response = await api.post(
        URIS.labTechnician.addDiagnosisList,
        data
      );
      return response.data;
    },
  });
};

// update lab technician diagnosis by id
export const useUpdateLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: EditDiagnosticService;
    }) => {
      const response = await api.put(
        `${URIS.labTechnician.updateDiagnosisList}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete lab technician diagnosis
export const useDeleteLabTechnicianDiagnosis = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.labTechnician.deleteDiagnosisList}/${id}/delete`
      );
      return response.data;
    },
  });
};

// get lab technician diagnosis by categories
export const useGetLabTechnicianDiagnosisByCategories = () => {
  return useQuery<GetDiagnosisCategory[]>({
    queryKey: ["getDiagnosisByCategories"],
    queryFn: async () => {
      const response = await api.get(
        URIS.labTechnician.getDiagnosisByCategories
      );
      return response.data;
    },
  });
};

// get lab technician diagnosis by category id
export const useGetLabTechnicianDiagnosisByCategoryId = (
  categoryId: number,
  options = {}
) => {
  return useQuery<GetDiagnosisCategory>({
    queryKey: ["getDiagnosisByCategoryId", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.labTechnician.getDiagnosisByCategoryId}/${categoryId}`
      );
      return response.data;
    },
    enabled: !!categoryId, // only fetch if id is truthy (non-zero)
    ...options,
  });
};

// add lab technician diagnosis by category
export const useAddLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (data: AddDiagnosisCategory) => {
      const response = await api.post(
        URIS.labTechnician.addDiagnosisCategory,
        data
      );
      return response.data;
    },
  });
};

// update lab technician diagnosis by category id
export const useUpdateLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AddDiagnosisCategory;
    }) => {
      const response = await api.put(
        `${URIS.labTechnician.updateDiagnosisCategory}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// delete lab technician diagnosis by category
export const useDeleteLabTechnicianDiagnosisByCategory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `${URIS.labTechnician.deleteDiagnosisCategory}/${id}/delete`
      );
      return response.data;
    },
  });
};

export const useReportsUpdate = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: ReportsUpdate;
    }) => {
      const response = await api.post(
        `${URIS.labTechnician.labTechnicianReportsUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useReportsDelete = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await api.delete(
        `${URIS.labTechnician.labTechnicianReportsDelete}/${id}`
      );
      return response.data;
    },
  });
};

// add lab reports
export const useReportsAdd = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: ReportsAdd }) => {
      const response = await api.post(
        `${URIS.labTechnician.labTechnicianReportsAdd}`,
        data
      );
      return response.data;
    },
  });
};
