import type React from "react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDoctorLogin, useForgotPassword } from "@/queries/use-auth";
import { toast } from "react-toastify";
import { X, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "../OTPAndPhoneInput/ui/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type LoginTab = "email" | "phone";
type ForgotPasswordTab = "email" | "phone";

export function Login({
  isOpen,
  onClose,
  onOpenRegister,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}) {
  const { login } = useAuth();
  const { mutateAsync: logined } = useDoctorLogin();
  const { mutateAsync: forgotPassword } = useForgotPassword();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginTab>("email");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordTab, setForgotPasswordTab] =
    useState<ForgotPasswordTab>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsOtpModalOpen] = useState(false);
  const [role, setRole] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password || !role) {
      setError("Email, password and role are required.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await logined({ email, password, role });

      const user = res.data;
      const token = res.data.token;
      const userType = res.data.userType;

      login(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);

      navigate(`/${userType}/dashboard`);

      toast.success("Logged in successfully!", { position: "top-right" });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      toast.error("Login failed. Please try again.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setIsLoading(true);

      await forgotPassword({ email }); // await the async mutation

      toast.success(
        "If an account exists with this email, you will receive password reset instructions.",
        { position: "top-right" }
      );
    } catch (err: any) {

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Forgot password failed. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
  };

  const handleForgotPasswordTabChange = (tab: ForgotPasswordTab) => {
    setForgotPasswordTab(tab);
  };

  const handleCreateAccount = () => {
    onClose();
    onOpenRegister();
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpModalOpen(true);
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

          {!showForgotPassword ? (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-[#2E9063]">
                Hey there, welcome back
              </h2>
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <div className="mb-6 flex rounded-full bg-gray-200 p-1">
                <button
                  className={cn(
                    "flex-1 rounded-full py-2 text-center transition-all",
                    activeTab === "email"
                      ? "bg-[#2E9063] text-white"
                      : "text-[#2E9063]"
                  )}
                  onClick={() => handleTabChange("email")}
                >
                  Email
                </button>
              </div>

              <form className="space-y-4">
                {activeTab === "email" ? (
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2E9063] focus:outline-none"
                      pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
                      required
                    />
                  </div>
                ) : (
                  <PhoneInput placeholder="Phone Number" />
                )}

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

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-[#2E9063] hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors flex items-center justify-center"
                  onClick={handleLogin}
                  disabled={isLoading}
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
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-gray-600">
                Don't have an account yet?{" "}
                <button
                  className="text-[#2E9063] hover:underline"
                  onClick={handleCreateAccount}
                >
                  Create Account
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-[#2E9063]">
                Forgot your password?
              </h2>

              <div className="mb-6 flex rounded-full bg-gray-200 p-1">
                <button
                  className={cn(
                    "flex-1 rounded-full py-2 text-center transition-all",
                    forgotPasswordTab === "email"
                      ? "bg-[#2E9063] text-white"
                      : "text-[#2E9063]"
                  )}
                  onClick={() => handleForgotPasswordTabChange("email")}
                >
                  Email
                </button>
              </div>

              <p className="mb-4 text-[#2E9063]">
                Enter your{" "}
                {forgotPasswordTab === "email" ? "Email" : "Phone Number"} to
                reset it
              </p>

              <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
                {error && <p className="text-red-500 mb-2">{error}</p>}

                {forgotPasswordTab === "email" ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#2E9063] focus:outline-none"
                    pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
                    required
                  />
                ) : (
                  <PhoneInput placeholder="999078 88" />
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>

              <button
                className="mt-6 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowForgotPassword(false)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Login screen
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
