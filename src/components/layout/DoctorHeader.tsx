import { Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetDoctorProfile } from "@/queries/use-doctor";
import { useLocation, Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

function DoctorHeader({ onMenuClick }: HeaderProps) {
  const { data: doctor } = useGetDoctorProfile();

  const location = useLocation();

  const routeTitleMap: Record<string, string> = {
    "/doctor/dashboard": "Dashboard",
    "/doctor/patients": "Patients",
    "/doctor/doctor-appointments": "Doctor Appointments",
    "/doctor/lab-appointments": "Lab Appointments",
    "/doctor/messages": "Messages",
    "/doctor/call-recordings": "Call Recordings",
    "/doctor/prescriptions": "Prescription",
    "/doctor/analytics": "Analytics",
    "/doctor/availability": "Daily Availability",
    "/doctor/wallet": "Wallet",
    "/doctor/settings": "Settings",
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

        <div className="text-2xl font-semibold" style={{ color: "#3A966C" }}>
          {pageTitle}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/doctor/wallet" className="h-5 w-5">
            <Wallet className="h-5 w-5" />
          </Link>

          <Avatar>
            <AvatarImage src={doctor?.profileImage ?? ""} alt="User" />
            <AvatarFallback>{`${doctor?.firstName} ${doctor?.lastName}`}</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
}

export default DoctorHeader;
