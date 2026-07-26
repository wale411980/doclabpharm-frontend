import { useState } from "react";
import { useRegisterDoctor, useGetSpecializationList } from "@/queries";
import { OTPVerificationModal } from "./OTPVerification";
import { toast } from "react-toastify";
import { X, Eye, EyeOff, MapPin, Check, ChevronLeft } from "lucide-react";
import { PhoneInput } from "../OTPAndPhoneInput/ui/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import type { RegisterDoctorRequest } from "@/types";
type RegisterStep = 1 | 2 | 3 | 4;

export default function Register({
  isOpen,
  onClose,
  onOpenLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}) {
  const { mutateAsync: register } = useRegisterDoctor();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [specializationId, setSpecializationId] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<RegisterStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { data: specializationList } = useGetSpecializationList();

  const handleRegister = async () => {
    setError("");
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !city ||
      !state ||
      !address ||
      !role ||
      (role === "doctor" && !specializationId)
    ) {
      setError("All required fields must be filled.");
      return;
    }

    try {
      setIsLoading(true);
      const payload: any = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        city,
        address,
        state,
        role,
      };

      if (role === "doctor") {
        payload.specializationId = specializationId; // keep it as string
      }

      await register(payload as RegisterDoctorRequest);

      setStep(3);

      toast.success("Registration successful. Please login!", {
        position: "top-right",
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      toast.error("Registration failed. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as RegisterStep);
    } else if (step === 3) {
      // When registration is complete, show OTP verification
      setIsOtpModalOpen(true);
    }
  };

  const handleOtpVerificationSuccess = () => {
    setIsOtpModalOpen(false);
    setStep(4); // Move to the success screen
  };

  const handleLogin = () => {
    onClose();
    onOpenLogin();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>

          {step === 1 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-[#2E9063]">
                Sign Up Today!
              </h2>
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full rounded-lg border border-gray-300 p-3 pl-9 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full rounded-lg border border-gray-300 p-3 pl-9 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mb-4"></div>

                <div className="relative">
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value)}
                  >
                    <SelectTrigger className="pl-10 py-6 w-full rounded-lg border border-gray-300  focus:border-[#2E9063] focus:outline-none">
                      <SelectValue placeholder="Select Profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="lab_technician">
                        Lab Technician
                      </SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>

                {role === "doctor" && (
                  <div className="relative">
                    <Select
                      value={specializationId}
                      onValueChange={(value) => setSpecializationId(value)}
                    >
                      <SelectTrigger className="pl-10 py-6 w-full rounded-lg border border-gray-300 focus:border-[#2E9063] focus:outline-none">
                        <SelectValue placeholder="Select Specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializationList?.map((specialization) => (
                          <SelectItem
                            key={specialization.id}
                            value={specialization.id.toString()}
                          >
                            {specialization.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-lg border border-gray-300 p-3 pl-9 focus:border-[#2E9063] focus:outline-none"
                    pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>

                <PhoneInput
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                />

                <button
                  type="button"
                  className="w-full rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors"
                  onClick={handleNext}
                >
                  Next
                </button>
              </form>

              <div className="mt-6 text-center text-gray-600">
                Already have an account?{" "}
                <button
                  className="text-[#2E9063] hover:underline"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-[#2E9063]"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-[#2E9063]">
                Sign Up Today!
              </h2>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <button
                className="absolute left-6 top-6 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                <span className="text-sm">Back</span>
              </button>

              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-[#2E9063] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2E9063] focus:ring-[#2E9063]"
                  />
                
                  <span>
                    I accept the{" "}
                    <Link
                      to="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E9063] underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E9063] underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </div>

                <button
  type="button"
  className={`w-full rounded-lg py-3 text-white transition-colors flex items-center justify-center
  ${acceptTerms ? "bg-[#2E9063] hover:bg-[#267a53]" : "bg-gray-300 cursor-not-allowed"}
  `}
  onClick={handleRegister}
  disabled={!acceptTerms || isLoading}
>
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <div className="mt-6 flex justify-center">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <div className="h-2 w-2 rounded-full bg-[#2E9063]"></div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E9063]">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[#2E9063]">
                Registration Complete!
              </h2>
              <p className="mb-8 text-center text-gray-600">
                Your account has been created. Please verify your email to
                continue.
              </p>
              <button
                type="button"
                className="w-full max-w-xs rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors"
                onClick={handleNext}
              >
                Verify Email
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E9063]">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[#2E9063]">
                All Done!
              </h2>
              <p className="mb-8 text-center text-gray-600">
                Your account has been successfully created and verified.
              </p>
              <button
                type="button"
                className="w-full max-w-xs rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={isOtpModalOpen}
        email={email || "your email"}
        onClose={() => setIsOtpModalOpen(false)}
        onVerificationSuccess={handleOtpVerificationSuccess}
      />
    </>
  );
}
