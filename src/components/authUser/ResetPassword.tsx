import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPassword, useResetPasswordForCare } from "@/queries/use-auth";
import { toast } from "react-toastify";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const user_id = searchParams.get("userId");
  const role = searchParams.get("role");
  const navigate = useNavigate();
  const { mutateAsync: resetPassword } = useResetPassword();
  const { mutateAsync: resetPasswordForCare } = useResetPasswordForCare();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  const validatePassword = (password: string) => {
    setError(null);
    let strength: "weak" | "medium" | "strong" = "weak";

    if (password.length >= 8) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const passedChecks = [
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChars,
      ].filter(Boolean).length;

      if (passedChecks >= 3) {
        strength = "strong";
      } else if (passedChecks >= 2) {
        strength = "medium";
      }
    }

    setPasswordStrength(password ? strength : null);
    return strength !== "weak";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Please use a stronger password");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        token: token || "",
        password: newPassword,
        password_confirmation: confirmPassword,
        user_id: user_id || "",
      };

      /* role is only present on caregiver reset links; without it this is a
         patient reset and goes to the original endpoint. */
      if (role) {
        await resetPasswordForCare({ ...payload, role: role as any });
      } else {
        await resetPassword(payload);
      }

      setIsSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      const fe = err?.response?.data?.errors;
      const first = fe && typeof fe === "object" ? Object.values(fe)[0] : null;
      const msg = Array.isArray(first)
        ? String(first[0])
        : err?.response?.data?.message ||
          "Failed to reset password. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white shadow rounded-lg">
        <h2 className="mb-2 text-center text-2xl font-bold text-[#2E9063]">
          Reset Your Password
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Please create a new password for your account
        </p>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* New Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-[#2E9063] focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {newPassword && (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-gray-200">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getPasswordStrengthColor()
                        )}
                        style={{
                          width:
                            passwordStrength === "weak"
                              ? "33%"
                              : passwordStrength === "medium"
                              ? "66%"
                              : "100%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {passwordStrength === "weak"
                        ? "Weak"
                        : passwordStrength === "medium"
                        ? "Medium"
                        : "Strong"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Use at least 8 characters, including uppercase, lowercase,
                    numbers, and symbols.
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(
                  "w-full rounded-lg border p-3 pr-10 focus:outline-none",
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2E9063]"
                )}
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

            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}

            {error && (
              <div className="flex items-start rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="ml-2">Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E9063]">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#2E9063]">
              Password Reset Successful
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full max-w-xs rounded-lg bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
