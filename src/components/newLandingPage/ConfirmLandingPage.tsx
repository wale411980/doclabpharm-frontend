import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useUserCheckout } from "@/queries";

export default function ConfirmLandingPage() {
  const navigate = useNavigate();
  const { mutate: checkout, isPending } = useUserCheckout();

  // Step 1: Get data from localStorage
  const pendingBookingRaw = localStorage.getItem("pendingBooking");

  const pendingBooking = pendingBookingRaw ? JSON.parse(pendingBookingRaw) : {};

  const {
    consultation_type,
    consultName: consultation_name,
    consultPrice: price,
    complaint,
    consultServiceId,
    doctorId,
    doctorFirstName,
    doctorLastName,
    doctorSpecialization,
    selectedDate,
    selectedTime,
    selectedSlotId,
  } = pendingBooking;

  const doctorFullName = `Dr. ${doctorFirstName} ${doctorLastName}`;
  const specialization = doctorSpecialization;
  const appointmentDate = selectedDate;
  const appointmentTime = selectedTime;
  const service_id = Number(consultServiceId);
  const slot_id = Number(selectedSlotId);

  const handleConfirm = () => {
    const payload = {
      items: [
        {
          service_type: "consult",
          service_id,
          doctor_id: Number(doctorId),
          slot_id,
          complaint,
          consultation_type,
          consultation_name,
          price: Number(price),
          name: doctorFullName,
          qty: 1,
        },
      ],
      paymentMethod: "wallet",
    };

    checkout(payload, {
      onSuccess: () => {
        toast.success("Consultation booked successfully");

        navigate("/user/checkout-success");

        localStorage.removeItem("pendingBooking");
        localStorage.removeItem("PendingBookingConsultation");
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Checkout failed";
        setErrorMessage(message);
        toast.error(message);

        if (message === "Insufficient wallet balance." && pendingBookingRaw) {
          localStorage.setItem("PendingBookingConsultation", pendingBookingRaw);
        }
      },
    });
  };

  const [errorMessage, setErrorMessage] = useState("");

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
                <p className="text-gray-600">{consultation_name}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Date</p>
                <p className="text-gray-600">{appointmentDate}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Time</p>
                <p className="text-gray-600">{appointmentTime}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Price</p>
                <p className="text-gray-600">
                  ₦{Number(price).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="font-medium text-gray-700">Doctor Name</p>
                <p className="text-gray-600">{doctorFullName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Specialization</p>
                <p className="text-gray-600">{specialization}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Complaint</p>
                <p className="text-gray-600">{complaint}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-2 rounded-lg bg-gray-100 border-gray-300"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
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
