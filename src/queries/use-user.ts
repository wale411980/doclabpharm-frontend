import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type {
  GetDoctorPrescriptions,
  User,
  Doctor,
  Consultations,
  Medicines,
  GetAllMessages,
  GetMessagesConversationUser,
  UserDetails,
  UpdateUser,
  UpdatePassword,
  Amount,
  AcceptCall,
  DeclineCall,
  EndCall,
  UserAppointments,
  OrderHistory,
  UserLabTechnician,
  SelectTest,
  UserReport,
  UserNotification,
  Vitals,
  UserVitalsDetails,
  DoctorPublic,
} from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";
import { convertKeysToSnakeCase } from "@/utils/caseConverter";

type CheckoutPayload = {
  items: any[];
  paymentMethod: string;
};

export const useGetUserProfile = () => {
  return useQuery<User>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get(URIS.user.getUserProfile);
      return response.data;
    },
  });
};

// get all doctors
export const useGetAllDoctors = () => {
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get(URIS.user.getAllDoctors);
      return response.data;
    },
  });
};

// get doctor by id
export const useGetDoctorById = (doctorId: string) => {
  return useQuery<Doctor>({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const response = await api.get(`${URIS.user.getDoctorById}/${doctorId}`);
      return response.data.original;
    },
  });
};

export const useGetDoctorByIdPublic = (doctorId: string) => {
  return useQuery<DoctorPublic>({
    queryKey: ["doctorPublic", doctorId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.user.getDoctorByIdPublic}/${doctorId}`
      );
      return response.data.original;
    },
  });
};

export const usePatientDetails = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: UserDetails }) => {
      const response = await api.post(`${URIS.user.patientDetails}`, data);
      return response.data.original;
    },
  });
};

export const useGetConsultations = () => {
  return useQuery<Consultations[]>({
    queryKey: ["consultations"],
    queryFn: async () => {
      const response = await api.get(`${URIS.user.consultations}`);
      return response.data;
    },
  });
};

export const useGetMedicines = (options?: { enabled?: boolean }) => {
  return useQuery<Medicines[]>({
    queryKey: ["medicines"],
    queryFn: async () => {
      const response = await api.get(`${URIS.user.medicine}`);
      return response.data;
    },
    // Stock changes as pharmacies sell and restock: always refetch when a page
    // showing medicines is opened or the tab regains focus.
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useGetAllMessages = () => {
  const { user } = useAuth();
  return useQuery<GetAllMessages[]>({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      const response = await api.get(URIS.user.getAllMessages);
      return response.data;
    },
  });
};

export const useGetUserConversationMessages = (conversationId: number) => {
  return useQuery<GetMessagesConversationUser[]>({
    queryKey: ["userConversationMessages", conversationId],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.user.getAllMessagesConversation}/${conversationId}/messages`
      );
      return response.data;
    },
    enabled: !!conversationId, // ensures query only runs if conversationId is provided
    refetchInterval: 5000,
  });
};

export const useUserSendMessage = () => {
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
      receiverType: "Doctor" | "MydocLab\\Models\\Doctor";
      message: string;
    }) => {
      const data = convertKeysToSnakeCase({
        conversationId,
        receiverId,
        receiverType,
        message,
      });
      const response = await api.post(URIS.user.userSendMessages, data);
      return response.data;
    },

    // 👇 Optimistically update messages before server responds
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["userConversationMessages", newMessage.conversationId],
      });

      const previousMessages = queryClient.getQueryData([
        "userConversationMessages",
        newMessage.conversationId,
      ]);

      const optimisticMessage = {
        id: Date.now(), // temporary ID
        message: newMessage.message,
        createdAt: new Date().toISOString(),
        senderType: "MydocLab\\Models\\User",
      };

      // Optimistically update cache
      queryClient.setQueryData(
        ["userConversationMessages", newMessage.conversationId],
        (old: any) => [...(old || []), optimisticMessage]
      );

      return { previousMessages };
    },

    // 👇 On error, rollback
    onError: (_err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["userConversationMessages", newMessage.conversationId],
          context.previousMessages
        );
      }
    },

    // 👇 On success, refetch real data
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userConversationMessages", variables.conversationId],
      });
    },
  });
};

export const useUserUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUser) => {
      const response = await api.post(URIS.user.updateUserProfile, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUserVitals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Vitals) => {
      const response = await api.post(URIS.user.updateUserProfile, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUserUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: UpdatePassword) => {
      const response = await api.post(URIS.user.updateUserPassword, data);
      return response.data;
    },
  });
};

// get user wallet
export const useGetUserWallet = () => {
  return useQuery({
    queryKey: ["userWallet"],
    queryFn: async () => {
      const response = await api.get(URIS.user.getUserWallet);
      return response.data;
    },
  });
};

export const useUserGeneratePayment = () => {
  return useMutation({
    mutationFn: async (data: Amount) => {
      const response = await api.post(URIS.user.generatePayment, data);
      return response.data;
    },
  });
};

export const useUserAcceptCall = () => {
  return useMutation({
    mutationFn: async (data: AcceptCall) => {
      const response = await api.post(URIS.user.userAcceptCall, data);
      return response.data; // automatically camelCased
    },
  });
};

export const useUserDeclineCall = () => {
  return useMutation({
    mutationFn: async (data: DeclineCall) => {
      const response = await api.post(URIS.user.userDeclineCall, data);
      return response.data; // automatically camelCased
    },
  });
};

export const useUserEndCall = () => {
  return useMutation({
    mutationFn: async (data: EndCall) => {
      const response = await api.post(URIS.user.userEndCall, data);
      return response.data; // automatically camelCased
    },
  });
};

// get user appointments
export const useGetUserAppointments = () => {
  return useQuery<UserAppointments[]>({
    queryKey: ["userAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userAppointments);
      return response.data;
    },
  });
};

export const usePatientVideoCall = () => {
  //   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      receiverId,
      receiverType,
    }: {
      conversationId: number;
      receiverId: number;
      receiverType: "Doctor";
    }) => {
      const data = convertKeysToSnakeCase({
        conversationId,
        receiverId,
        receiverType,
      });
      const response = await api.post(URIS.user.userVideoCall, data);
      return response.data;
    },
  });
};

// accept call
export const useUserAcceptCallMutation = () => {
  return useMutation({
    mutationFn: async (data: AcceptCall) => {
      const response = await api.post(URIS.user.userAcceptCall, data);
      return response.data;
    },
  });
};

// decline call
export const useUserDeclineCallMutation = () => {
  return useMutation({
    mutationFn: async (data: DeclineCall) => {
      const response = await api.post(URIS.user.userDeclineCall, data);
      return response.data;
    },
  });
};

// end call
export const useUserEndCallMutation = () => {
  return useMutation({
    mutationFn: async (data: EndCall) => {
      const response = await api.post(URIS.user.userEndCall, data);
      return response.data;
    },
  });
};

// get user order history
export const useGetUserOrderHistory = () => {
  return useQuery<OrderHistory[]>({
    queryKey: ["userOrderHistory"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userOrderHistory);
      return response.data;
    },
  });
};

// get user lab technician
export const useGetUserLabTechnician = () => {
  return useQuery<UserLabTechnician[]>({
    queryKey: ["userLabTechnician"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userLabTechnician);
      return response.data;
    },
  });
};

// get user lab technician by id
export const useGetUserLabTechnicianById = (id: number) => {
  return useQuery<SelectTest[]>({
    queryKey: ["userLabTechnicianById", id],
    queryFn: async () => {
      const response = await api.get(
        `${URIS.user.userLabTechnicianById}/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUserCheckout = () => {
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const response = await api.post(URIS.user.userCheckout, payload);
      return response.data;
    },
  });
};

// get user report
export const useGetUserReport = () => {
  return useQuery<UserReport[]>({
    queryKey: ["userReport"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userReport);
      return response.data.data.reports;
    },
  });
};

// get user notification
export const useGetUserNotification = () => {
  return useQuery<UserNotification[]>({
    queryKey: ["userNotification"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userNotification);
      return response.data;
    },
  });
};

// get user details
export const useGetUserVitals = () => {
  return useQuery<UserVitalsDetails>({
    queryKey: ["userVitals"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userVitalsDetails);
      return response.data.data;
    },
  });
};

// get patient's own prescription list
export const useGetUserPrescriptions = () => {
  return useQuery<GetDoctorPrescriptions[]>({
    queryKey: ["userPrescriptions"],
    queryFn: async () => {
      const response = await api.get(URIS.user.getUserPrescriptions);
      return response.data;
    },
  });
};

// A bookable test together with the laboratory that provides it
export type BookableTest = SelectTest & {
  labTechnician?: {
    id: number;
    firstName: string;
    lastName: string;
    businessName: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    profileImage: string | null;
  } | null;
};

// every active test of every laboratory (each test belongs to one laboratory)
export const useGetAllBookableTests = (enabled = true) => {
  return useQuery<BookableTest[]>({
    queryKey: ["allBookableTests"],
    queryFn: async () => {
      const response = await api.post(URIS.user.userDiagnosisList, {});
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled,
  });
};

export type UserVitalsPayload = {
  bloodPressure?: string | null;
  pulse?: number | null;
  dailySteps?: number | null;
  stepsGoal?: number | null;
  waterIntakeL?: number | null;
  waterGoalL?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
};

// record / update the vitals shown on the patient dashboard
export const useUpdateUserVitals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserVitalsPayload) => {
      const response = await api.post(URIS.user.userVitals, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userVitals"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export type UserLabAppointment = {
  id: number;
  userId: number;
  diagnosisId: number;
  orderId: number;
  labTechnicianId: number | null;
  status: "scheduled" | "rescheduled" | "completed" | "cancelled";
  date: string | null;
  time: string | null;
  reportsCount: number;
  diagnosis: { id: number; name: string; price: number } | null;
  labTechnician: {
    id: number;
    firstName: string;
    lastName: string;
    businessName: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    phone: string | null;
  } | null;
};

// the patient's own lab test appointments
export const useGetUserLabAppointments = () => {
  return useQuery<UserLabAppointment[]>({
    queryKey: ["userLabAppointments"],
    queryFn: async () => {
      const response = await api.get(URIS.user.userLabAppointments);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};
