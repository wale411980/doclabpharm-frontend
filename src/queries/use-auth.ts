import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest, LoginRequest, ForgotPassword, ResetPasswordRequest, ResetPasswordForCareRequest, RegisterDoctorRequest, LoginDoctorRequest, adminLoginRequest } from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userDetails: RegisterRequest) => {
      const response = await api.post(URIS.auth.register, userDetails);
      return response.data;
    }
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (userDetails: LoginRequest) => {
      const response = await api.post(URIS.auth.login, userDetails);
      return response.data;
    }
  });
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async ({ otp, email }: { otp: string; email: string }) => {
      const response = await api.post(URIS.auth.verifyOtp, { otp, email });
      return response.data;
    }
  });
}

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await api.post(URIS.auth.requestOtp, { email });
      return response.data;
    }
  });
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPassword) => {
      const response = await api.post(URIS.auth.forgotPassword, data);
      return response.data
    }
  })
}


export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await api.post(URIS.auth.resetPassword, data);
      return response.data
    }
  })
}

export const useResetPasswordForCare = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordForCareRequest) => {
      const response = await api.post(URIS.auth.resetPasswordDoctor, data);
      return response.data
    }
  })
}
export const useRegisterDoctor = () => {
  return useMutation({
    mutationFn: async (userDetails: RegisterDoctorRequest) => {
      const response = await api.post(URIS.auth.registerDoctor, userDetails);

      return response.data;
    }
  })
}

export const useDoctorLogin = () => {
  return useMutation({
    mutationFn: async (userDetails: LoginDoctorRequest) => {
      const response = await api.post(URIS.auth.loginDoctor, userDetails);
      return response.data;
    }
  });
}

export const useVerifyEmailDoctor = () => {
  return useMutation({
    mutationFn: async ({ otp, email, role }: { otp: string; email: string; role: string; }) => {
      const response = await api.post(URIS.auth.verifyOtpDoctor, { otp, email, role });
      return response.data;
    }
  });
}

export const useResendOtpDoctor = () => {
  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role:string; }) => {
      const response = await api.post(URIS.auth.requestOtpDoctor, { email, role });
      return response.data;
    }
  });
}

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (userDetails: adminLoginRequest) => {
      const response = await api.post(URIS.auth.adminLogin, userDetails);
      return response.data;
    }
  });
}

export const useSuperAdminLogin = () => {
  return useMutation({
    mutationFn: async (userDetails: adminLoginRequest) => {
      const response = await api.post(URIS.auth.superAdminLogin, userDetails);
      return response.data;
    }
  });
}
