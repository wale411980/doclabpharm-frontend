export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  address: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
  password_confirmation: string;
  user_id: string;
};

export type ResetPasswordForCareRequest = ResetPasswordRequest & {
  role: "doctor" | "pharmacy" | "lab_technician";
};

export type RegisterDoctorRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  address: string;
  specializationId: string;
  role: string;
};

export type LoginDoctorRequest = {
  email: string;
  password: string;
  role: string;
};
