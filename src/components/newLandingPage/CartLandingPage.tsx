import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  TestTube2,
  Pill,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserCheckout } from "@/queries";
import { toast } from "react-toastify";
import { LoginModal } from "../authUser/Login";
import { RegisterModal } from "../authUser/Register";
import Register from "../authDoctor/Register";
import { Login } from "../authDoctor/Login";
import { RoleSelectionModal } from "../authUser/RoleSelection";
import { DoctorRoleSelectionModal } from "../authDoctor/DoctorRoleSelection";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CartLandingPage() {
  const auth = useAuth();
  const cartContext = useAuth().cartContext;
  const items = cartContext?.items ?? [];

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] =
    useState(false);
  const [isRoleSelectionModalOpenLogin, setIsRoleSelectionModalOpenLogin] =
    useState(false);
  const [isCaregiverRegisterOpen, setIsCaregiverRegisterOpen] = useState(false);
  const [isCaregiverLoginOpen, setIsCaregiverLoginOpen] = useState(false);

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

  const removeItem = cartContext?.removeItem ?? (() => {});
  const updateItem = cartContext?.updateItem ?? (() => {});
  const clearCart = cartContext?.clearCart ?? (() => {});
  const navigate = useNavigate();

  const { mutate: checkout, isPending } = useUserCheckout();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const [error, setError] = useState("");

  const handleCheckout = () => {
    if (!auth?.user) {
      openLoginModal();
      return;
    }

    const payload = {
      items: items.map((item) => ({ ...item, qty: item.qty || 1 })),
      paymentMethod: "wallet",
    };

    checkout(payload, {
      onSuccess: () => {
        toast.success("Checkout successful");
        clearCart();
        navigate("/user/checkout-success");
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message || "Checkout failed";
        setError(errMsg);
        toast.error("Checkout failed");
      },
    });
  };

  const renderIcon = (type: string) => {
    if (type === "consult")
      return <Stethoscope className="text-emerald-600 w-5 h-5" />;
    if (type === "lab")
      return <TestTube2 className="text-emerald-600 w-5 h-5" />;
    return <Pill className="text-emerald-600 w-5 h-5" />;
  };

  const renderLabel = (type: string) => {
    if (type === "consult") return "Consultation";
    if (type === "lab") return "Test";
    return "Medication";
  };

  if (items.length === 0) {
    return (
      <div>
        <Navbar currentPage="home" onNavigate={() => navigate("/")} />
        <div className="text-center py-65 px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate("/user/pharmacy")}
              className="bg-emerald-600 text-white"
            >
              Book an Appointment
            </Button>
            <Button
              onClick={() => navigate("/patient/booking/select-test")}
              variant="outline"
            >
              Book a Test
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="">
      <Navbar currentPage="home" onNavigate={() => navigate("/")} />

      <div className="max-w-4xl mx-auto pt-40 pb-40">
        <Button
          onClick={() => navigate("/user/wallet")}
          className="bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          Top-Up
        </Button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-700">
            Your Cart ({items.length})
          </h2>
          <Button
            variant="ghost"
            onClick={() => {
              clearCart();
              localStorage.removeItem("testBooking");
            }}
            className="text-red-600 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </Button>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {renderIcon(item.service_type)}
                  <h3 className="font-semibold text-gray-700">{item.name}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {renderLabel(item.service_type)}
                </span>
              </div>

              {item.service_type === "consult" && (
                <div className="text-sm text-green-700 font-semibold mb-1">
                  {/* {item.consultation_type} Consultation */}
                </div>
              )}

              <div className="text-sm text-gray-600 mb-3">
                ₦{item.price?.toLocaleString()} per unit
              </div>

              <div className="flex justify-between items-center">
                {item.service_type === "med" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateItem(index, {
                          qty: Math.max((item.qty || 1) - 1, 1),
                        })
                      }
                      disabled={(item.qty || 1) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.qty || 1}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateItem(index, { qty: (item.qty || 1) + 1 })
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-gray-700 font-medium">
                    Quantity: {item.qty || 1}
                  </div>
                )}

                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ₦{((item.qty || 1) * item.price).toLocaleString()}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (item.service_type === "lab" && items.length === 1) {
                        localStorage.removeItem("testBooking");
                      }
                      removeItem(index);
                    }}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-bold text-green-700">
              ₦{totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-green-700 text-white w-full sm:w-auto"
              onClick={handleCheckout}
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Checkout"}
            </Button>
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/doctor/select")}
              className="w-full sm:w-auto"
            >
              Add More Items
            </Button>
          </div>
        </div>
      </div>

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
      <Footer />
    </div>
  );
}
