import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  Pill,
  Settings,
  LogOut,
  Wallet,
  ChartLine,
  FileVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/dashboard-logo.png";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  onClose: () => void;
}

export function DoctorSidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: User, label: "Patients", href: "/doctor/patients" },
    { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
    {
      icon: MessageSquare,
      label: "Messages",
      href: "/doctor/messages",
      badge: 1,
    },
    {
      icon: FileVideo,
      label: "Call Recordings",
      href: "/doctor/call-recordings",
    },
    { icon: Pill, label: "Prescription", href: "/doctor/prescriptions" },
    { icon: ChartLine, label: "Analytics", href: "/doctor/analytics" },
    { icon: Calendar, label: "Availability", href: "/doctor/availability" },
    { icon: Wallet, label: "Wallet", href: "/doctor/wallet" },
    { icon: Settings, label: "Settings", href: "/doctor/settings" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = "/"; // 🔁 Hard reload of the page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside
      className="h-full w-64 bg-white text-white !z-50 flex flex-col justify-between"
      style={{ backgroundColor: "#ecf3f9" }}
    >
      <div>
        {/* Sidebar Header - shows always */}
        <div className="flex items-center justify-between p-4 pr-2 md:pr-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <img
              src={logo || "/placeholder.svg"}
              alt=""
              className="flex-shrink-0"
            />
            <span
              className="text-lg md:text-2xl font-bold truncate"
              style={{ color: "#3A966C" }}
            >
              DocLabPharm
            </span>
          </div>

          {/* Close icon - mobile only */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="md:hidden flex-shrink-0 p-2 -mr-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg
              className="h-5 w-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-8 space-y-1">
          {navItems.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-green-50 text-green-600"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                onClick={onClose}
              >
                <item.icon
                  className="h-5 w-5"
                  color="rgba(58, 150, 108, 0.7)"
                  size={48}
                  strokeWidth={2}
                />
                <span style={{ color: "rgba(58, 150, 108, 0.7)" }}>
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </aside>
  );
}
