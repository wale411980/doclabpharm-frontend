import { Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetLabTechnicianProfile } from "@/queries";
import { useLocation, Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

function LabTechnicianHeader({ onMenuClick }: HeaderProps) {
  const { data: labTechnician } = useGetLabTechnicianProfile();

  const location = useLocation();

  const routeTitleMap: Record<string, string> = {
    "/lab_technician/dashboard": "Dashboard",
    "/lab_technician/patients": "Patients",
    "/lab_technician/appointments": "Appointments",
    "/lab_technician/diagnosis": "Diagnosis",
    "/lab_technician/wallet": "Wallet",
    "/lab_technician/payments": "Payments",
    "/lab_technician/settings": "Settings",
  };

  const pageTitle = routeTitleMap[location.pathname] || "Dashboard";

  return (
    <div className="">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white p-4 shadow-sm">
        {/* Hamburger Icon */}
        <button
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="md:hidden p-2 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="text-2xl font-semibold text-green-700">{pageTitle}</div>

        <div className="flex items-center gap-4">
          <Link to="/lab_technician/wallet" className="h-5 w-5">
            <Wallet className="h-5 w-5" />
          </Link>

          <Avatar>
            <AvatarImage
              src={labTechnician?.profileImage ?? ""}
              alt="Lab_technician"
            />
            <AvatarFallback>{`${labTechnician?.firstName}  ${labTechnician?.lastName}`}</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
}

export default LabTechnicianHeader;
