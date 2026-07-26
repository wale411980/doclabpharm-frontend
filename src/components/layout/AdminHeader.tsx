import { useLocation } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

function AdminHeader({ onMenuClick }: HeaderProps) {
  const location = useLocation();

  const routeTitleMap: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/patients": "Patients",
    "/admin/doctors": "Doctors",
    "/admin/labs": "Lab Technicians",
    "/admin/pharmacists": "Pharmacists",
    "/admin/category": "Drug Category",
    "/admin/transactions": "Transactions",
    "/admin/appointments": "Appointments",
    "/admin/lab-diagnosis": "Lab Diagnosis",
    "/admin/payments": "Payments",
    "/admin/orders": "Orders",
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
      </header>
    </div>
  );
}

export default AdminHeader;
