import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check, RefreshCw } from "lucide-react";
import { OTPInput } from "./OTPInput";
import { useVerifyEmail, useResendOtp } from "@/queries";

type LocationState = {
  email: string;
};

export default function EnterOTPPatient() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const email = state?.email;

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true); // Start with true

  const { mutate: verifyEmail } = useVerifyEmail();

  const { mutate: requestOTP, status } = useResendOtp();
  const isResending = status === "pending";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !canResend) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, canResend]);

  const handleVerifyOTP = (otp: string) => {
    if (!email) return;

    setIsVerifying(true);
    setError(null);

    verifyEmail(
      { otp, email },
      {
        onSuccess: () => {
          setIsVerified(true);
          setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.href = "/"; // 🔁 Hard reload of the page
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
    if (!email) return;

    requestOTP(
      { email },
      {
        onSuccess: () => {
          setTimeLeft(300); // 5 minutes
          setCanResend(false);
          setError(null);
        },
        onError: (err) => {
          setError(`Failed to resend code: ${err.message}`);
        },
      }
    );
  };

  if (!email) {
    return (
      <div className="p-4 text-red-500">
        No email found. Please return and try again.
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center py-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-[#2E9063]">
            Verify Your Email
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Enter the 5-digit code sent to{" "}
            <span className="font-medium">{email}</span>
          </p>

          <OTPInput length={5} onComplete={handleVerifyOTP} className="mb-6" />

          {error && (
            <p className="mb-4 text-center text-sm text-red-500">{error}</p>
          )}

          {isVerifying && (
            <div className="mb-4 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2E9063] border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-600">Verifying...</span>
            </div>
          )}

          {isVerified && (
            <div className="mb-4 flex items-center justify-center text-[#2E9063]">
              <Check className="mr-2 h-5 w-5" />
              <span>Verification successful!</span>
            </div>
          )}

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
                You can resend code in{" "}
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
