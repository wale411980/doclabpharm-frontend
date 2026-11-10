import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useGetDoctorById } from "@/queries/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function DoctorProfile() {
  const navigate = useNavigate();

  const { doctorId } = useParams();
  const { data: doctor, isLoading, error } = useGetDoctorById(doctorId || "");

  // State for selected date and time
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string, slotId: string) => {
    setSelectedTime(time);
    setSelectedSlotId(slotId);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedSlotId) {
      navigate(`/doctor/${doctorId}/patient-details?slot_id=${selectedSlotId}`);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Error Loading Doctor Profile
            </h2>
            <p className="text-gray-600">
              There was a problem loading the doctor's information. Please try
              again later.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Doctor's Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Doctor info */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative">
              {isLoading ? (
                <Skeleton className="w-full h-80" />
              ) : (
                <img
                  src={
                    doctor?.profileImage ||
                    "/placeholder.svg?height=400&width=600"
                  }
                  alt={`Dr. ${doctor?.firstName || "Profile"}`}
                  className="w-full h-80 object-cover"
                />
              )}
            </div>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-green-800">{`${doctor?.firstName} ${doctor?.lastName}`}</h2>
                  <p className="text-gray-600 mb-4">
                    {doctor?.speciality || "Specialist"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* About section */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">About</h3>
                    <p className="text-gray-700">{doctor?.about}</p>
                  </section>

                  {/* Time Availability */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">
                      Time Availability
                    </h3>
                    {doctor?.availabilities &&
                    doctor.availabilities.length > 0 ? (
                      doctor.availabilities.map((availability) => (
                        <div
                          key={availability.id}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <Clock className="h-4 w-4" />
                          <span className="capitalize">
                            {availability.dayOfWeek}
                          </span>
                          <span className="mx-2">:</span>
                          <span>
                            {availability.startTime} - {availability.endTime}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4" />
                        <span>Mon - Sat</span>
                        <span className="mx-2">:</span>
                        <span>10:00 am - 5:00 pm</span>
                      </div>
                    )}
                  </section>

                  {/* Certification */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">Certification</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: doctor?.certifications || "",
                      }}
                    />
                  </section>

                  {/* Experience */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">Experience</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: doctor?.experience || "",
                      }}
                    />
                  </section>

                  {/* Available dates */}
                  <section>
                    <h3 className="text-xl font-bold mb-3">Available dates</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {doctor?.availabilities.map((date, index) => {
                        const isSelected = date.date === selectedDate;
                        return (
                          <div
                            key={index}
                            onClick={() => handleDateSelect(date.date)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer transition",
                              isSelected && "bg-green-600 text-white",
                              !isSelected &&
                                "bg-white hover:border-green-600 hover:text-green-600"
                            )}
                          >
                            <span className="text-lg font-semibold capitalize">
                              {date.dayOfWeek}
                            </span>
                            <span className="text-lg font-semibold">
                              {date.date?.split("-")[2]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Time slots */}
                  <section>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {doctor?.availableSlots
                        .filter((slot) =>
                          slot.availableDate.startsWith(selectedDate)
                        )
                        .map((slot, index) => {
                          const isSelectedTime =
                            slot.availableTime === selectedTime;
                          const isBooked = slot.isBooked;

                          return (
                            <div
                              key={index}
                              onClick={() => {
                                if (!isBooked) {
                                  handleTimeSelect(slot.availableTime, slot.id);
                                }
                              }}
                              className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-md border transition",
                                isBooked
                                  ? "bg-red-500 text-white cursor-not-allowed opacity-70"
                                  : isSelectedTime
                                  ? "bg-green-600 text-white"
                                  : "bg-white hover:border-green-600 hover:text-green-600 cursor-pointer"
                              )}
                            >
                              <span className="text-lg font-semibold capitalize">
                                {slot.availableTime}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </section>

                  {/* Booking buttons */}
                  <section className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white 
             disabled:bg-gray-400 disabled:hover:bg-gray-400 
             disabled:text-white disabled:cursor-not-allowed"
                      size="lg"
                      onClick={handleNext}
                      disabled={
                        !selectedDate || !selectedTime || !selectedSlotId
                      }
                    >
                      Book Appointment
                    </Button>
                  </section>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
