import { useState } from "react";
import { ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginModal } from "../authUser/Login";
import { RegisterModal } from "../authUser/Register";
import Register from "../authDoctor/Register";
import { Login } from "../authDoctor/Login";
import { RoleSelectionModal } from "../authUser/RoleSelection";
import { DoctorRoleSelectionModal } from "../authDoctor/DoctorRoleSelection";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { LabTestsDropDown } from "./LabTestsDropDown";
import { NavbarLoggedIn } from "./NavbarLoggedIn";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] =
    useState(false);
  const [isRoleSelectionModalOpenLogin, setIsRoleSelectionModalOpenLogin] =
    useState(false);
  const [isCaregiverRegisterOpen, setIsCaregiverRegisterOpen] = useState(false);
  const [isCaregiverLoginOpen, setIsCaregiverLoginOpen] = useState(false);

  const handleMouseEnter = (tooltip: string) => {
    setActiveTooltip(tooltip);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const openLoginModal = () => {
  //   setIsLoginModalOpen(true)
  // }

  // const closeLoginModal = () => {
  //   setIsLoginModalOpen(false)
  // }

  const openRegisterModal = () => {
    setIsRoleSelectionModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const openLoginModal = () => {
    setIsRoleSelectionModalOpenLogin(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleRoleSelection = (role: "patient" | "caregiver") => {
    setIsRoleSelectionModalOpen(false);
    if (role === "patient") {
      setIsRegisterModalOpen(true);
    } else {
      setIsCaregiverRegisterOpen(true);
    }
  };

  const handleRoleSelectionLogin = (role: "patient" | "caregiver") => {
    setIsRoleSelectionModalOpenLogin(false);
    if (role === "patient") {
      setIsLoginModalOpen(true);
    } else {
      setIsCaregiverLoginOpen(true);
    }
  };

  if (user) {
    return <NavbarLoggedIn />;
  }

  return (
    <>
      <header
        className="w-full py-3"
        style={{
          background:
            "linear-gradient(259.87deg, rgba(12, 70, 84, 0.6) 14.19%, rgba(58, 150, 108, 0.99) 84.69%)",
        }}
      >
        <div className="mx-auto flex  items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo - always visible */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="" />
              <span className="ml-2 text-lg font-bold text-white sm:text-xl">
                DocLabPharm
              </span>
            </Link>
          </div>

          {/* Mobile menu button - only visible on small screens */}
          <button
            className="ml-2 rounded-md p-2 text-white md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Navigation - visible on medium and larger screens */}
          <div className="hidden md:flex mx-4 flex-1 max-w-3xl">
            <div className="flex w-full items-center justify-center rounded-full bg-white px-6 py-2">
              <nav className="flex items-center space-x-4 lg:space-x-6">
                <LabTestsDropDown />
                <a
                  href="#"
                  className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
                >
                  All Tests
                </a>
                <a
                  href="#"
                  className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
                >
                  Speak to a Doctor
                </a>
                <a
                  href="#"
                  className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
                >
                  Kits
                </a>
                <a
                  href="#"
                  className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
                >
                  Vaccines
                </a>
              </nav>
            </div>
          </div>

          {/* Icons and Auth Buttons - visible on medium and larger screens */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Profile Icon */}
            <div className="relative">
              <div
                className={cn(
                  "flex items-center transition-all duration-200 rounded-full",
                  activeTooltip === "profile" ? "bg-[#E6E6E6] pr-4" : ""
                )}
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E6E6]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C12.7625 10 15 7.7625 15 5C15 2.2375 12.7625 0 10 0C7.2375 0 5 2.2375 5 5C5 7.7625 7.2375 10 10 10ZM10 12.5C6.6625 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3375 12.5 10 12.5Z"
                      fill="#808080"
                    />
                  </svg>
                </button>
                <span
                  className={cn(
                    "text-gray-700 font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
                    activeTooltip === "profile"
                      ? "max-w-20 ml-2 opacity-100"
                      : "max-w-0 opacity-0"
                  )}
                >
                  Profile
                </span>
              </div>
            </div>

            {/* Doctor Icon */}
            <div className="relative">
              <div
                className={cn(
                  "flex items-center transition-all duration-200 rounded-full",
                  activeTooltip === "doctor" ? "bg-[#E6E6E6] pr-4" : ""
                )}
                onMouseEnter={() => handleMouseEnter("doctor")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E6E6]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM15 11.5C15 11.78 14.78 12 14.5 12H12V14.5C12 14.78 11.78 15 11.5 15H8.5C8.22 15 8 14.78 8 14.5V12H5.5C5.22 12 5 11.78 5 11.5V8.5C5 8.22 5.22 8 5.5 8H8V5.5C8 5.22 8.22 5 8.5 5H11.5C11.78 5 12 5.22 12 5.5V8H14.5C14.78 8 15 8.22 15 8.5V11.5Z"
                      fill="#808080"
                    />
                  </svg>
                </button>
                <span
                  className={cn(
                    "text-gray-700 font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
                    activeTooltip === "doctor"
                      ? "max-w-20 ml-2 opacity-100"
                      : "max-w-0 opacity-0"
                  )}
                >
                  Doctor
                </span>
              </div>
            </div>

            {/* Laboratories Icon */}
            <div className="relative">
              <div
                className={cn(
                  "flex items-center transition-all duration-200 rounded-full",
                  activeTooltip === "laboratories" ? "bg-[#E6E6E6] pr-4" : ""
                )}
                onMouseEnter={() => handleMouseEnter("laboratories")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E6E6]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 18H2V7H18V18ZM10 0L0 5V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V5L10 0ZM10 12C8.9 12 8 11.1 8 10C8 8.9 8.9 8 10 8C11.1 8 12 8.9 12 10C12 11.1 11.1 12 10 12Z"
                      fill="#808080"
                    />
                  </svg>
                </button>
                <span
                  className={cn(
                    "text-gray-700 font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
                    activeTooltip === "laboratories"
                      ? "max-w-32 ml-2 opacity-100"
                      : "max-w-0 opacity-0"
                  )}
                >
                  Laboratories
                </span>
              </div>
            </div>

            {/* Login and Register Buttons */}
            <button
              onClick={openLoginModal}
              className="rounded-full border border-white px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Login
            </button>
            <button
              onClick={openRegisterModal}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#2E9063] hover:bg-gray-100 transition-colors"
            >
              Register
            </button>

            {/* Shopping Cart - only visible on medium and larger screens */}
            <div className="relative">
              <button className="flex items-center justify-center text-white">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2196F3] text-[10px] font-medium text-white">
                0
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - only visible when menu is open */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col p-4 gap-4 mt-2">
            <a
              href="#"
              className="text-white font-medium flex items-center justify-between"
            >
              Lab Tests <ChevronDown className="h-4 w-4" />
            </a>
            <a href="#" className="text-white font-medium">
              All Tests
            </a>
            <a href="#" className="text-white font-medium">
              Speak to a Doctor
            </a>
            <a href="#" className="text-white font-medium">
              Kits
            </a>
            <a href="/testing" className="text-white font-medium">
              Vaccines
            </a>

            <div className="h-px w-full bg-gray-600 my-2"></div>

            {/* Login and Register Buttons in Mobile Menu */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full rounded-lg border border-white py-2 text-white hover:bg-white/10 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openRegisterModal();
                }}
                className="w-full rounded-lg bg-white py-2 text-[#2E9063] hover:bg-gray-100 transition-colors"
              >
                Register
              </button>
            </div>

            <div className="h-px w-full bg-gray-600 my-2"></div>

            {/* Mobile-only icon labels */}
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6E6E6] mr-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 10C12.7625 10 15 7.7625 15 5C15 2.2375 12.7625 0 10 0C7.2375 0 5 2.2375 5 5C5 7.7625 7.2375 10 10 10ZM10 12.5C6.6625 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3375 12.5 10 12.5Z"
                    fill="#808080"
                  />
                </svg>
              </div>
              <span className="text-white font-medium">Profile</span>
            </div>

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6E6E6] mr-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM15 11.5C15 11.78 14.78 12 14.5 12H12V14.5C12 14.78 11.78 15 11.5 15H8.5C8.22 15 8 14.78 8 14.5V12H5.5C5.22 12 5 11.78 5 11.5V8.5C5 8.22 5.22 8 5.5 8H8V5.5C8 5.22 8.22 5 8.5 5H11.5C11.78 5 12 5.22 12 5.5V8H14.5C14.78 8 15 8.22 15 8.5V11.5Z"
                    fill="#808080"
                  />
                </svg>
              </div>
              <span className="text-white font-medium">Doctor</span>
            </div>

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6E6E6] mr-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 18H2V7H18V18ZM10 0L0 5V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V5L10 0ZM10 12C8.9 12 8 11.1 8 10C8 8.9 8.9 8 10 8C11.1 8 12 8.9 12 10C12 11.1 11.1 12 10 12Z"
                    fill="#808080"
                  />
                </svg>
              </div>
              <span className="text-white font-medium">Laboratories</span>
            </div>

            {/* Shopping Cart in mobile menu */}
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6E6E6] mr-3 relative">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                    fill="#808080"
                  />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2196F3] text-[10px] font-medium text-white">
                  0
                </span>
              </div>
              <span className="text-white font-medium">Cart</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onOpenRegister={() => {
          closeLoginModal();
          openRegisterModal();
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onOpenLogin={() => {
          closeRegisterModal();
          openLoginModal();
        }}
      />

      {isCaregiverRegisterOpen && (
        <Register
          isOpen={isCaregiverRegisterOpen}
          onClose={() => setIsCaregiverRegisterOpen(false)}
          onOpenLogin={() => {
            setIsCaregiverRegisterOpen(false);
            openLoginModal();
          }}
        />
      )}

      {isCaregiverLoginOpen && (
        <Login
          isOpen={isCaregiverLoginOpen}
          onClose={() => setIsCaregiverLoginOpen(false)}
          onOpenRegister={() => {
            setIsCaregiverLoginOpen(false);
            openRegisterModal();
          }}
        />
      )}

      <RoleSelectionModal
        isOpen={isRoleSelectionModalOpen}
        onClose={() => setIsRoleSelectionModalOpen(false)}
        onContinue={handleRoleSelection}
      />

      <DoctorRoleSelectionModal
        isOpen={isRoleSelectionModalOpenLogin}
        onClose={() => setIsRoleSelectionModalOpenLogin(false)}
        onContinue={handleRoleSelectionLogin}
      />
    </>
  );
}
