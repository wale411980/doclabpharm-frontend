import { ShoppingCart, Bell, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfile } from "@/queries";
import { useLocation, Link } from "react-router-dom";
import { useCartCount } from "@/hooks/useCartCount";

interface HeaderProps {
  onMenuClick: () => void;
}

function UserHeader({ onMenuClick }: HeaderProps) {
  const { data: patient } = useGetUserProfile();
  const location = useLocation();
  const cartCount = useCartCount();

  const routeTitleMap: Record<string, string> = {
    "/user/dashboard": "Dashboard",
    "/user/profile": "My Profile",
    "/user/appointments": "Appointments",
    "/user/messages": "Messages",
    "/user/orders": "Order History",
    "/user/pharmacy": "Pharmacy",
    "/patient/booking/select-test": "Tests",
    "/user/results": "Results",
    "/user/hospitalview": "Hospital View",
    "/user/wallet": "Wallet",
    "/user/cart": "Cart",
    "/user/notifications": "Notifications",
  };

  const pageTitle = routeTitleMap[location.pathname] || "Dashboard";

  return (
    <div className="">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white p-4 shadow-sm">
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

        <div className="flex items-center gap-4" key={patient?.data?.id}>
          <Link to="/user/wallet" className="h-5 w-5">
            <Wallet className="h-5 w-5" />
          </Link>

          <Link to="/user/cart">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          <Link to="/user/notifications">
            <Bell className="h-5 w-5" />
          </Link>

          <Avatar>
            <AvatarImage src={patient?.data?.profileImage ?? ""} alt="User" />
            <AvatarFallback>{`${patient?.data?.firstName} ${patient?.data?.lastName}`}</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
}

export default UserHeader;
