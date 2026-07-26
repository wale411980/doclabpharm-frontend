import { useSearchParams, useNavigate } from "react-router-dom";
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

interface AvailableSlot {
  id: number;
  availableDate: string;
  availableTime: string;
}

interface Specialization {
  name: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: Specialization;
  availableSlots: AvailableSlot[];
}

export default function AppointmentBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: checkout, isPending } = useUserCheckout();

  //   const serviceType = searchParams.get("type") || "";
  const consultation_type = searchParams.get("consultation_type") || "";
  const consultation_name = searchParams.get("name") || "";
  const complaint = searchParams.get("complaint") || "";
  const price = Number(searchParams.get("price") || 0);
  const doctorRaw = searchParams.get("doctor") || "{}";
  const slot_id = Number(searchParams.get("slot_id") || 0);
  const service_id = Number(searchParams.get("service_id"));

  let doctor: Doctor;
  try {
    doctor = JSON.parse(doctorRaw);
  } catch {
    doctor = {} as Doctor;
  }

  const selectedSlot = doctor?.availableSlots?.find(
    (s: any) => s.id === slot_id
  );
  const appointmentDate = selectedSlot?.availableDate?.split("T")[0] ?? "-";
  const appointmentTime = selectedSlot?.availableTime ?? "-";
  const doctorFullName = `Dr. ${doctor?.firstName ?? ""} ${
    doctor?.lastName ?? ""
  }`;
  const specialization = doctor?.specialization?.name ?? "-";

  const handleConfirm = () => {
    const payload = {
      items: [
        {
          service_type: "consult",
          service_id,
          doctor_id: doctor?.id,
          slot_id,
          complaint,
          consultation_type,
          consultation_name,
          price,
          name: doctorFullName,
          qty: 1,
        },
      ],
      paymentMethod: "wallet",
    };

    checkout(payload, {
      onSuccess: () => {
        toast.success("Consultation booked successfully");
        localStorage.removeItem("pendingBooking");
        navigate("/user/checkout-success");
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Checkout failed";
        setErrorMessage(message);
        toast.error(message);

        if (message === "Insufficient wallet balance.") {
          const pendingBooking = {
            complaint,
            consultationName: consultation_name,
            consultationPrice: price,
            consultationServiceId: service_id,
            consultationType: consultation_type,
            doctorId: doctor?.id,
            doctorName: doctorFullName,
            specialization,
            selectedDate: appointmentDate,
            selectedTime: appointmentTime,
            selectedSlotId: slot_id,
          };
          localStorage.setItem(
            "pendingConsultation",
            JSON.stringify(pendingBooking)
          );
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
                <p className="text-gray-600">₦{price.toLocaleString()}</p>
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
