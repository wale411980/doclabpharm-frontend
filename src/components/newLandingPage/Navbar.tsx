import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Phone, Mail, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { PageType } from "./IndexPage";
import greenLogo from "@/assets/greenLogo.png";
import { LoginModal } from "../authUser/Login";
import { RegisterModal } from "../authUser/Register";
import Register from "../authDoctor/Register";
import { Login } from "../authDoctor/Login";
import { RoleSelectionModal } from "../authUser/RoleSelection";
import { DoctorRoleSelectionModal } from "../authDoctor/DoctorRoleSelection";
import { useCartCount } from "@/hooks/useCartCount";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const { user } = useAuth();

  const dashboardPathByRole: Record<string, string> = {
    user: "/user/dashboard",
    doctor: "/doctor/dashboard",
    pharmacy: "/pharmacy/dashboard",
    admin: "/admin/dashboard",
    lab_technician: "/lab_technician/dashboard",
    super_admin: "/super-admin/dashboard",
  };
  const goToDashboard = () => {
    const path = user?.userType
      ? dashboardPathByRole[user.userType] ?? "/user/dashboard"
      : "/user/dashboard";
    navigate(path);
  };

  const cartCount = useCartCount();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] =
    useState(false);
  const [isRoleSelectionModalOpenLogin, setIsRoleSelectionModalOpenLogin] =
    useState(false);
  const [isCaregiverRegisterOpen, setIsCaregiverRegisterOpen] = useState(false);
  const [isCaregiverLoginOpen, setIsCaregiverLoginOpen] = useState(false);

  const navItems = [
    {
      label: "Lab Tests",
      page: "explore-health-tests" as PageType,
      hasDropdown: true,
    },
    { label: "Speak to a Doctor", page: "book-appointment" as PageType },
    { label: "Vaccines", page: "vaccines" as PageType },
    { label: "About Us", page: "about-us" as PageType },
    // { label: "FAQs", page: "home" as PageType },
  ];

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

  return (
    <>
      {/* Top Bar */}
      <div className="bg-teal-700 text-white text-sm py-2 px-2 sm:px-4 fixed top-0 w-full z-50">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8">
          <span className="text-center sm:text-left text-xs sm:text-sm lg:text-xl leading-tight">
            Need help getting started? Get in with a health advisor
          </span>
          <div className="flex flex-col xs:flex-row sm:flex-row items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base lg:text-xl whitespace-nowrap">
                + 234 9078 8468
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base lg:text-xl break-all sm:break-normal">
                info@doclabpharm.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md fixed top-16 sm:top-8 w-full z-40 border-b">
        <div className="container mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
          <div className="flex justify-between items-center h-12 sm:h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-1 sm:gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate("home")}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                <img
                  src={greenLogo || "/placeholder.svg"}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700 leading-tight">
                Doclabpharm
              </span>
            </motion.div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  className={`flex items-center gap-1 text-gray-700 hover:text-green-700 transition-colors text-lg ${
                    currentPage === item.page
                      ? "text-green-700 font-medium"
                      : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onNavigate(item.page)}
                >
                  {item.label}
                  {/* {item.hasDropdown && <ChevronDown className="w-4 h-4" />} */}
                </motion.button>
              ))}
            </div>

            {/* Desktop Actions - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={openRegisterModal}
                    className="text-lg"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={openLoginModal}
                    className="text-lg"
                  >
                    Login
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={goToDashboard}
                  className="text-lg"
                >
                  Dashboard
                </Button>
              )}

              <Button
                className="bg-emerald-700 hover:bg-emerald-700 text-base"
                onClick={() => onNavigate("book-appointment")}
              >
                Book Appointment
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/patient/cart")}
              >
                <div className="relative">
                  <ShoppingCart style={{ width: "32px", height: "32px" }} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Button>
            </div>

            {/* Mobile Menu Button and Cart - Visible on mobile and tablet */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/patient/cart")}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 border border-gray-300 hover:bg-gray-100"
                  >
                    <Menu className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 sm:w-80 md:w-96">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="pb-4 border-b">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Menu
                      </h2>
                    </div>
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className={`justify-start text-left h-12 ${
                          currentPage === item.page
                            ? "text-green-700 font-medium bg-green-50"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          onNavigate(item.page);
                          setIsOpen(false);
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <div className="border-t pt-4 space-y-3">
                      {!isLoggedIn ? (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 text-gray-700"
                            onClick={() => {
                              setIsOpen(false);
                              openRegisterModal();
                            }}
                          >
                            Get Started
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-12 text-gray-700"
                            onClick={() => {
                              setIsOpen(false);
                              openLoginModal();
                            }}
                          >
                            Login
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-gray-700"
                          onClick={() => {
                            setIsOpen(false);
                            goToDashboard();
                          }}
                        >
                          Dashboard
                        </Button>
                      )}

                      <Button
                        className="w-full bg-green-700 hover:bg-green-700 h-12"
                        onClick={() => {
                          onNavigate("book-appointment");
                          setIsOpen(false);
                        }}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

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
