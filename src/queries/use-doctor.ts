import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type {
  Doctor,
  Availability,
  GetAllMessages,
  GetMessagesConversation,
  DoctorWallet,
  DoctorAppointment,
  DoctorStats,
  DoctorRecentAppointments,
  DoctorRecentMessages,
  DoctorRecentUser,
  DoctorAvailabilityHistory,
  DoctorUpdatePassword,
  GetDoctorPrescriptions,
  CreateDoctorPrescriptions,
  AddDoctorPrescription,
  GetAllPatients,
  UpdateDoctor,
  DoctorAcceptCall,
  DoctorDeclineCall,
  DoctorEndCall,
  DoctorAnalytics,
  DoctorGetUserDetails,
  RescheduleDoctorAppointment,
  UpdateDoctorAppointment,
  UploadDoctorVideoPayload,
  DoctorCallNote,
  DoctorCallRecordings,
  UserNotes,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";
import { convertKeysToSnakeCase } from "@/utils/caseConverter";

export const useGetDoctorProfile = () => {
  return useQuery<Doctor>({
    queryKey: ["doctorProfile"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.getDoctorProfile);
      return response.data.original;
    },
  });
};

export const useUpdateProfileSettings = () => {
  return useMutation({
    mutationFn: async ({
      doctorId,
      data,
    }: {
      doctorId: number;
      data: UpdateDoctor;
    }) => {
      const response = await api.put(
        `${URIS.doctor.updateDoctorProfile}/${doctorId}`,
        data
      );
      return response.data.original; // automatically camelCased
    },
  });
};

export const useSetAvailability = () => {
  return useMutation({
    mutationFn: async ({
      data,
      doctorId,
    }: {
      data: Availability;
      doctorId: number;
    }) => {
      const response = await api.post(
        `${URIS.doctor.availability}/${doctorId}`,
        data
      ); // 👈 send as camelCase — interceptors will convert
      return response.data.original; // 👈 comes back in camelCase automatically
    },
  });
};

export const useGetDoctorWallet = () => {
  return useQuery<DoctorWallet>({
    queryKey: ["doctorWallet"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorWallet);
      return response.data;
    },
  });
};

export const useGetDoctorAppointments = () => {
  return useQuery<DoctorAppointment[]>({
    queryKey: ["doctorAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorAppointments);
      return response.data;
    },
  });
};

export const useGetAllMessagesDoctor = () => {
  const { user } = useAuth();
  return useQuery<GetAllMessages[]>({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      const response = await api.get(URIS.user.getAllMessages);
      return response.data;
    },
  });
};

export const useGetDoctorConversationMessages = (conversationId: number) => {
  return useQuery<GetMessagesConversation[]>({
    queryKey: ["doctorConversationMessages", conversationId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.doctor.getAllMessagesConversation}/${conversationId}/messages`
      );
      return response.data;
    },
    enabled: !!conversationId, // ensures query only runs if conversationId is provided
    refetchInterval: 5000,
  });
};

export const useDoctorSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      receiverId,
      receiverType,
      message,
    }: {
      conversationId: number;
      receiverId: number;
      receiverType: "User" | "MydocLab\\Models\\User";
      message: string;
    }) => {
      const data = convertKeysToSnakeCase({
        conversationId,
        receiverId,
        receiverType,
        message,
      });
      const response = await api.post(URIS.doctor.doctorSendMessages, data);
      return response.data;
    },

    // 👇 Optimistically update messages before server responds
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["doctorConversationMessages", newMessage.conversationId],
      });

      const previousMessages = queryClient.getQueryData([
        "doctorConversationMessages",
        newMessage.conversationId,
      ]);

      const optimisticMessage = {
        id: Date.now(), // temporary ID
        message: newMessage.message,
        createdAt: new Date().toISOString(),
        senderType: "MydocLab\\Models\\Doctor",
      };

      // Optimistically update cache
      queryClient.setQueryData(
        ["doctorConversationMessages", newMessage.conversationId],
        (old: any) => [...(old || []), optimisticMessage]
      );

      return { previousMessages };
    },

    // 👇 On error, rollback
    onError: (_err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["doctorConversationMessages", newMessage.conversationId],
          context.previousMessages
        );
      }
    },

    // 👇 On success, refetch real data
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["doctorConversationMessages", variables.conversationId],
      });
    },
  });
};

export const useGetDoctorStats = () => {
  const { user } = useAuth();
  return useQuery<DoctorStats>({
    queryKey: ["doctorStats", user?.id],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorStats);
      return response.data;
    },
  });
};

export const useGetDoctorRecentAppointments = () => {
  return useQuery<DoctorRecentAppointments[]>({
    queryKey: ["doctorRecentAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorRecentAppointments);
      return response.data;
    },
  });
};

export const useGetDoctorRecentMessages = () => {
  return useQuery<DoctorRecentMessages[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorRecentMessages);
      return response.data;
    },
  });
};

export const useGetDoctorRecentUsers = () => {
  return useQuery<DoctorRecentUser[]>({
    queryKey: ["recentUser"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorRecentUsers);
      return response.data;
    },
  });
};

export const useGetDoctorAvailabilityHistory = (doctorId: number) => {
  return useQuery<DoctorAvailabilityHistory[]>({
    queryKey: ["doctorAvailabilityHistory", doctorId],
    queryFn: async () => {
      if (!doctorId) return [];
      const response = await api.get(
        `${URIS.doctor.doctorAvailabilityHistory}/${doctorId}`
      );
      return response.data.original;
    },
    enabled: !!doctorId, // Only run query if doctorId exists
  });
};

export const useDoctorUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: DoctorUpdatePassword }) => {
      const response = await api.post(
        `${URIS.doctor.doctorUpdatePassword}`,
        data
      );
      return response.data; // automatically camelCased
    },
  });
};

// get doctor prescription list
export const useGetDoctorPrescriptions = () => {
  return useQuery<GetDoctorPrescriptions[]>({
    queryKey: ["doctorPrescriptions"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.getDoctorPrescriptions);
      return response.data;
    },
  });
};

export const useGetDoctorPrescriptionDetails = (prescriptionId: number) => {
  return useQuery({
    queryKey: ["doctorPrescriptionDetails", prescriptionId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.doctor.viewDoctorPrescriptions}/${prescriptionId}`
      );
      return response.data;
    },
    enabled: !!prescriptionId, // Only run query if id exists
  });
};

export const useCreateDoctorPrescription = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: CreateDoctorPrescriptions }) => {
      const response = await api.post(
        URIS.doctor.createDoctorPrescriptions,
        data
      );
      return response.data; // automatically camelCased
    },
  });
};

export const useAddDoctorPrescriptionMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      prescriptionId,
    }: {
      prescriptionId: number;
      data: AddDoctorPrescription;
    }) => {
      const response = await api.post(
        `${URIS.doctor.addDoctorPrescriptions}/${prescriptionId}`,
        data
      );
      return response.data; // automatically camelCased
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific prescription details query to refetch latest data
      queryClient.invalidateQueries({
        queryKey: ["doctorPrescriptionDetails", variables.prescriptionId],
      });

      // Optional: Invalidate list of all prescriptions if needed
      queryClient.invalidateQueries({
        queryKey: ["doctorPrescriptions"],
      });
    },
  });
};

export const useGetDoctorAllPatients = () => {
  return useQuery<GetAllPatients[]>({
    queryKey: ["getAllPatients"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.getAllPatients);
      return response.data;
    },
  });
};

export const useDoctorVideoCall = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      receiverId,
      receiverType,
    }: {
      conversationId: number;
      receiverId: number;
      receiverType: "User";
    }) => {
      const data = convertKeysToSnakeCase({
        conversationId,
        receiverId,
        receiverType,
      });
      const response = await api.post(URIS.doctor.doctorVideoCall, data);
      return response.data;
    },
  });
};

// accept call
export const useDoctorAcceptCallMutation = () => {
  return useMutation({
    mutationFn: async (data: DoctorAcceptCall) => {
      const response = await api.post(URIS.doctor.doctorAcceptCall, data);
      return response.data;
    },
  });
};

// decline call
export const useDoctorDeclineCallMutation = () => {
  return useMutation({
    mutationFn: async (data: DoctorDeclineCall) => {
      const response = await api.post(URIS.doctor.doctorDeclineCall, data);
      return response.data;
    },
  });
};

// end call
export const useDoctorEndCallMutation = () => {
  return useMutation({
    mutationFn: async (data: DoctorEndCall) => {
      const response = await api.post(URIS.doctor.doctorEndCall, data);
      return response.data;
    },
  });
};

// get doctor analytics
export const useGetDoctorAnalytics = () => {
  return useQuery<DoctorAnalytics>({
    queryKey: ["doctorAnalytics"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorAnalytics);
      return response.data;
    },
  });
};

// get user details by id
export const useGetUserById = (userId: number) => {
  return useQuery<DoctorGetUserDetails>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get(`${URIS.user.getUserById}/${userId}`);
      return response.data.data;
    },
  });
};

export const useGetUserNotesById = (userId: number) => {
  return useQuery<UserNotes[]>({
    queryKey: ["userNotes", userId],
    queryFn: async () => {
      const response = await api.get(`${URIS.user.getUserNotesById}/${userId}`);
      return response.data.notes;
    },
  });
};

// update doctor appointment by id
export const useUpdateDoctorAppointment = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateDoctorAppointment;
    }) => {
      const response = await api.post(
        `${URIS.doctor.doctorAppointmentUpdate}/${id}`,
        data
      );
      return response.data;
    },
  });
};

// reschedule doctor appointment by id
export const useRescheduleDoctorAppointment = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: RescheduleDoctorAppointment;
    }) => {
      const response = await api.post(
        `${URIS.doctor.doctorAppointmentReschedule}/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useUploadDoctorVideo = () => {
  return useMutation<string, Error, UploadDoctorVideoPayload>({
    mutationFn: async ({ video, callId }) => {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("call_id", callId.toString());

      for (const [k, v] of formData.entries()) console.log(k, v);

      const response = await api.post(URIS.doctor.doctorVideoUpload, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
      });
      return response.data; // or response.data if different shape
    },
  });
};

// doctor call note
export const useDoctorCallNote = () => {
  return useMutation({
    mutationFn: async (data: DoctorCallNote) => {
      const response = await api.post(URIS.doctor.doctorCallNote, data);
      return response.data;
    },
  });
};

export const useDoctorCallRecordings = () => {
  return useQuery<DoctorCallRecordings[]>({
    queryKey: ["doctorCallRecordings"],
    queryFn: async () => {
      const response = await api.get(URIS.doctor.doctorCallRecordings);
      return response.data;
    },
  });
};
