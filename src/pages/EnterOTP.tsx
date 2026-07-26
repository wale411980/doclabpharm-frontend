import { useState, useRef } from "react";
import { Check, RefreshCw } from "lucide-react";
import { OTPInput } from "./OTPInput";
import { useVerifyEmailDoctor, useResendOtpDoctor } from "@/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "react-router-dom";

export function EnterOTP() {
  const location = useLocation();
  const email = location.state?.email;

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: verifyEmail } = useVerifyEmailDoctor();
  const { mutate: requestOTP, status } = useResendOtpDoctor();
  const isResending = status === "pending";

  const startCountdown = () => {
    setTimeLeft(300);
    setCanResend(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = (otp: string) => {
    if (!role) {
      setError("Please select a role before verifying.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    verifyEmail(
      { otp, email, role },
      {
        onSuccess: () => {
          setIsVerified(true);
          setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.href = "/"; // 🔁 Hard reload of the page
            // refetch()
          }, 1500);
        },
        onError: () => {
          setError("Invalid verification code. Please try again.");
          setIsVerifying(false);
        },
      }
    );
  };

  const handleResendOTP = () => {
    if (!role) {
      setError("Please select a role before resending the code.");
      return;
    }

    requestOTP(
      { email, role },
      {
        onSuccess: () => {
          startCountdown();
          setError(null);
        },
        onError: (err) => {
          const backendMessage = err?.message || "Failed to resend code.";
          setError(backendMessage);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center justify-center py-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-[#2E9063]">
            Verify Your Email
          </h2>
          <p className="mb-6 text-center text-gray-600">
            We've sent a 5-digit verification code to{" "}
            <span className="font-medium">{email}</span>
          </p>

          {/* Role Select */}
          <div className="mb-4 w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select your role
            </label>
            <Select
              onValueChange={(value) => {
                setRole(value);
                if (error) setError(null); // only clear error if one exists
              }}
            >
              <SelectTrigger
                className={`w-full ${!role && error ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="lab_technician">Lab Technician</SelectItem>
              </SelectContent>
            </Select>
            {!role && error && (
              <p className="mt-1 text-sm text-red-500">Role is required.</p>
            )}
          </div>

          {/* OTP Input */}
          <OTPInput length={5} onComplete={handleVerifyOTP} className="mb-6" />

          {/* Error */}
          {error && (
            <p className="mb-4 text-center text-sm text-red-500">{error}</p>
          )}

          {/* Verifying Spinner */}
          {isVerifying && (
            <div className="mb-4 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2E9063] border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-600">Verifying...</span>
            </div>
          )}

          {/* Success Message */}
          {isVerified && (
            <div className="mb-4 flex items-center justify-center text-[#2E9063]">
              <Check className="mr-2 h-5 w-5" />
              <span>Verification successful!</span>
            </div>
          )}

          {/* Resend or Countdown */}
          <div className="mt-4 text-center text-sm text-gray-600">
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="flex items-center justify-center text-[#2E9063] hover:underline disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#2E9063] border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Resend verification code
                  </>
                )}
              </button>
            ) : (
              <p>
                Didn't receive the code? You can resend in{" "}
                <span className="font-medium text-[#2E9063]">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
