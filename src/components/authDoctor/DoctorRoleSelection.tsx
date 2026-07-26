import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "patient" | "caregiver";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (role: UserRole) => void;
}

export function DoctorRoleSelectionModal({
  isOpen,
  onClose,
  onContinue,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");

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

        <div className="flex flex-col items-center justify-center py-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#2E9063]">
            Hey there,
            <br />
            I'm a
          </h2>

          <div className="mb-6 w-full space-y-4">
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-center rounded-full py-3 text-center",
                selectedRole === "patient"
                  ? "bg-[#2E9063] text-white"
                  : "border border-gray-300 bg-white text-[#2E9063]"
              )}
              onClick={() => setSelectedRole("patient")}
            >
              Patient{" "}
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full border border-current">
                {selectedRole === "patient" && (
                  <span className="h-3 w-3 rounded-full bg-white" />
                )}
              </span>
            </button>

            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-center rounded-full py-3 text-center",
                selectedRole === "caregiver"
                  ? "bg-[#2E9063] text-white"
                  : "border border-gray-300 bg-white text-[#2E9063]"
              )}
              onClick={() => setSelectedRole("caregiver")}
            >
              Care Giver{" "}
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full border border-current">
                {selectedRole === "caregiver" && (
                  <span className="h-3 w-3 rounded-full bg-white" />
                )}
              </span>
            </button>
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-[#2E9063] py-3 text-white hover:bg-[#267a53] transition-colors"
            onClick={() => onContinue(selectedRole)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
