import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSuperAdminLogin, useForgotPassword } from "@/queries";
import { toast } from "react-toastify";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/OTPAndPhoneInput/ui/PhoneInput";

type LoginTab = "email" | "phone";
type ForgotPasswordTab = "email" | "phone";

export function SuperAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutateAsync: loggedIn } = useSuperAdminLogin();
  const { mutateAsync: forgotPassword } = useForgotPassword();

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

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await loggedIn({ email, password });

      const user = res.data;
      const token = res.data.token;
      const userType = res.data.userType;

      login(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      localStorage.setItem("userType", userType);

      navigate("/super-admin/dashboard");

      toast.success("Logged in successfully!", { position: "top-right" });
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

      await forgotPassword({ email });
      toast.success(
        "If an account exists with this email, you will receive password reset instructions on your email.",
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

  // Inside useEffect after login
  useEffect(() => {
    const audio = new Audio("/incoming-call.mp3");
    audio.loop = true;

    const enableAutoplay = () => {
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch((err) => console.warn("❌ Preload failed", err));

      window.removeEventListener("click", enableAutoplay);
    };

    window.addEventListener("click", enableAutoplay);

    return () => {
      window.removeEventListener("click", enableAutoplay);
    };
  }, []);

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
  };

  const handleForgotPasswordTabChange = (tab: ForgotPasswordTab) => {
    setForgotPasswordTab(tab);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpModalOpen(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-green-100"
      style={{
        background:
          "linear-gradient(76deg, rgba(58, 150, 108, 1) 0%, rgba(58, 150, 108, 1) 15%, rgba(12, 70, 84, 0.5) 55%, rgba(12, 70, 84, 0.5) 100%), url('../src/assets/take-appointment.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#2E9063]">
          Hey there, welcome back
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {!showForgotPassword ? (
          <>
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
                  required
                />
              ) : (
                <PhoneInput placeholder="Phone Number" />
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
  );
}
