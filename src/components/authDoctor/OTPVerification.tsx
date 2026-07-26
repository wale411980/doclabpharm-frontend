import { useState, useEffect } from "react";
import { X, Check, RefreshCw } from "lucide-react";
import { OTPInput } from "../OTPAndPhoneInput/ui/OTPInput";
import { useVerifyEmailDoctor, useResendOtpDoctor } from "@/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OTPVerificationModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerificationSuccess: () => void;
}

export function OTPVerificationModal({
  isOpen,
  email,
  onClose,
  onVerificationSuccess,
}: OTPVerificationModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const { mutate: verifyEmail } = useVerifyEmailDoctor();
  const { mutate: requestOTP, status } = useResendOtpDoctor();
  const isResending = status === "pending";

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen && timeLeft > 0 && !canResend) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, timeLeft, canResend]);

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
            onVerificationSuccess();
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
          setTimeLeft(300);
          setCanResend(false);
          setError(null);
        },
        onError: (err) => {
          const backendMessage = err?.message || "Failed to resend code.";
          setError(backendMessage);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center justify-center py-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-[#2E9063]">
            Verify Your Email
          </h2>
          <p className="mb-6 text-center text-gray-600">
            We've sent a 5-digit verification code to{" "}
            <span className="font-medium">{email}</span>
          </p>

          <div className="mb-4 w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select your role
            </label>
            <Select onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="lab_technician">Lab Technician</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
