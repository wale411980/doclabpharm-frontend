import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useUserCheckout } from "@/queries";

interface PendingConsultation {
  complaint: string;
  consultationName: string;
  consultationPrice: number;
  consultationServiceId: number;
  consultationType: string;
  doctorId: number;
  doctorName: string;
  selectedDate: string;
  selectedSlotId: number;
  selectedTime: string;
  specialization: string;
}

export default function ConfirmAfterFundingWallet() {
  const navigate = useNavigate();
  const { mutate: checkout, isPending } = useUserCheckout();
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingData, setBookingData] = useState<PendingConsultation | null>(
    null
  );

  useEffect(() => {
    const saved = localStorage.getItem("pendingConsultation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBookingData(parsed);
      } catch (e) {
        console.error("Failed to parse booking data:", e);
      }
    }
  }, []);

  const handleConfirm = () => {
    if (!bookingData) return;

    const payload = {
      items: [
        {
          service_type: "consult",
          service_id: bookingData.consultationServiceId,
          doctor_id: bookingData.doctorId,
          slot_id: bookingData.selectedSlotId,
          complaint: bookingData.complaint,
          consultation_type: bookingData.consultationType,
          consultation_name: bookingData.consultationName,
          price: bookingData.consultationPrice,
          name: bookingData.doctorName,
          qty: 1,
        },
      ],
      paymentMethod: "wallet",
    };

    checkout(payload, {
      onSuccess: () => {
        toast.success("Consultation booked successfully");
        localStorage.removeItem("pendingConsultation");
        navigate("/user/checkout-success");
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Checkout failed";
        setErrorMessage(message);
        toast.error(message);
      },
    });
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500">
          No pending consultation found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-heading-text mb-6 text-center md:text-left">
          Appointment Booking
        </h1>
        <Card className="rounded-xl shadow-lg bg-white border-none py-4">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-heading-text">
              Booking Summary
            </h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-700">Consultation</p>
                <p className="text-gray-600">{bookingData.consultationName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Date</p>
                <p className="text-gray-600">{bookingData.selectedDate}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Time</p>
                <p className="text-gray-600">{bookingData.selectedTime}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Price</p>
                <p className="text-gray-600">
                  ₦{bookingData.consultationPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-700">Doctor Name</p>
                <p className="text-gray-600">{bookingData.doctorName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Specialization</p>
                <p className="text-gray-600">{bookingData.specialization}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Complaint</p>
                <p className="text-gray-600">{bookingData.complaint}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
            <Button
              className="w-full sm:w-auto px-8 py-2 rounded-lg bg-green-700 text-white hover:bg-green-600"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Confirm"}
            </Button>
          </CardFooter>

          {errorMessage === "Insufficient wallet balance." && (
            <div className="mt-4 flex justify-center">
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md"
                onClick={() => navigate("/user/wallet")}
              >
                Fund Wallet
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
