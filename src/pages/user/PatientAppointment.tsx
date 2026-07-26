import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetUserAppointments } from "@/queries";
import type { UserAppointments } from "@/types";
import { useNavigate } from "react-router-dom";

export default function AppointmentDashboard() {
  const navigate = useNavigate();
  const { data: userAppointments } = useGetUserAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDay]);

  if (!userAppointments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const sortedAppointments = [...userAppointments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredAppointments = sortedAppointments.filter(
    (appointment: UserAppointments) => {
      if (selectedDay === null) return true;
      const appointmentDate = new Date(appointment.createdAt);
      const isSameDay =
        appointmentDate.getDate() === selectedDay &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear();
      return isSameDay;
    }
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: format(date, "MMM dd, yyyy"),
      time: format(date, "HH:mm"),
    };
  };

  // Calendar logic
  const currentMonth = format(currentDate, "MMMM yyyy");
  const calendarDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date): number[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  };

  const getStartDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getStartDayOfMonth(currentDate);

  const now = new Date();

  const canMessage = (appointment: UserAppointments) => {
    const { status, slot } = appointment;

    // Check for valid status
    const validStatus = status === "scheduled" || status === "rescheduled";
    if (!validStatus || !slot?.availableDate || !slot?.availableTime)
      return false;

    // Combine availableDate and availableTime into a full Date
    const fullDateTimeString = `${slot.availableDate.split("T")[0]} ${
      slot.availableTime
    }`;
    const appointmentDate = new Date(fullDateTimeString);

    // Get time 10 minutes before appointment
    const tenMinutesBefore = new Date(
      appointmentDate.getTime() - 10 * 60 * 1000
    );

    // Check if current time is after or equal to 10 minutes before appointment
    return now >= tenMinutesBefore;
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0 pb-4">
          {selectedDay && (
            <Button
              variant="ghost"
              className="w-fit text-sm text-green-700 hover:text-green-800"
              onClick={() => setSelectedDay(null)}
            >
              ← Show all appointments
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar */}
            <div className="w-full lg:w-1/3">
              <Card className="bg-white shadow-sm lg:sticky lg:top-4">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">
                      {currentMonth}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-green-50"
                        onClick={handlePrevMonth}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-green-50"
                        onClick={handleNextMonth}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-2">
                    {calendarDays.map((day) => (
                      <div
                        key={day}
                        className="text-xs font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
                    {[...Array(startDay).fill(null), ...daysInMonth].map(
                      (day, index) =>
                        day ? (
                          <Button
                            key={index}
                            variant={day === selectedDay ? "default" : "ghost"}
                            className={cn(
                              "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg text-xs sm:text-sm font-medium",
                              day === selectedDay
                                ? "bg-green-700 text-white hover:bg-green-800"
                                : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                            )}
                            onClick={() => setSelectedDay(day)}
                          >
                            {day}
                          </Button>
                        ) : (
                          <div
                            key={index}
                            className="h-8 w-8 sm:h-9 sm:w-9"
                          ></div>
                        )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Section */}
            <div className="w-full lg:w-2/3">
              {/* Mobile Card Layout */}
              <div className="block sm:hidden space-y-4">
                {paginatedAppointments?.map((appointment) => {
                  const dateTime = formatDateTime(
                    appointment.slot?.availableDate
                  );
                  return (
                    <Card key={appointment.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-green-800">
                              Dr.{" "}
                              {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment?.consultation?.name}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="text-sm">
                              <div className="font-medium">{dateTime.date}</div>
                              <div className="text-gray-600">
                                {appointment.slot?.availableTime}
                              </div>
                            </div>
                          </div>
                          <div className="py-4">
                            {canMessage(appointment) && (
                              <Button
                                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                                onClick={() =>
                                  navigate("/user/messages", {
                                    state: {
                                      receiverId: appointment?.doctor?.id,
                                      receiverType: "MydocLab\\Models\\Doctor",
                                      conversationId: 0,
                                      contactName: `${appointment?.doctor?.firstName} ${appointment?.doctor?.lastName}`,
                                      contactProfile:
                                        appointment?.doctor?.profileImage,
                                      isNewChat: true,
                                    },
                                  })
                                }
                              >
                                Message
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Tablet Card Layout */}
              <div className="hidden sm:block xl:hidden space-y-3">
                {paginatedAppointments.map((appointment) => {
                  const dateTime = formatDateTime(
                    appointment.slot?.availableDate
                  );
                  return (
                    <Card
                      key={appointment.id}
                      className="shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-green-800 text-lg">
                                  Dr.{" "}
                                  {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                  {appointment?.consultation?.name}
                                </p>
                              </div>
                              <div className="text-right sm:text-left md:text-right">
                                <div className="font-medium text-gray-900">
                                  {dateTime.date}
                                </div>
                                <div className="text-green-700 font-medium">
                                  {appointment.slot?.availableTime}
                                </div>
                              </div>
                              <div className="py-4">
                                {canMessage(appointment) && (
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                                    onClick={() =>
                                      navigate("/user/messages", {
                                        state: {
                                          receiverId: appointment?.doctor?.id,
                                          receiverType:
                                            "MydocLab\\Models\\Doctor",
                                          conversationId: 0,
                                          contactName: `${appointment?.doctor?.firstName} ${appointment?.doctor?.lastName}`,
                                          contactProfile:
                                            appointment?.doctor?.profileImage,
                                          isNewChat: true,
                                        },
                                      })
                                    }
                                  >
                                    Message
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden xl:block bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-green-800 font-semibold min-w-[200px]">
                          Doctor
                        </TableHead>
                        <TableHead className="text-green-800 font-semibold min-w-[150px]">
                          Date & Time
                        </TableHead>
                        <TableHead className="text-green-800 font-semibold min-w-[120px]">
                          Type
                        </TableHead>
                        <TableHead className="text-green-800 font-semibold min-w-[120px]">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAppointments.map((appointment) => {
                        const dateTime = formatDateTime(
                          appointment.slot?.availableDate
                        );
                        return (
                          <TableRow key={appointment.id}>
                            <TableCell className="py-4">
                              <div className="font-medium text-green-800">
                                Dr.{" "}
                                {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <div className="font-medium">
                                  {dateTime.date}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {appointment.slot?.availableTime}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <span className="text-sm">
                                {appointment?.consultation?.name}
                              </span>
                            </TableCell>
                            <TableCell className="py-4">
                              {canMessage(appointment) && (
                                <Button
                                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                                  onClick={() =>
                                    navigate("/user/messages", {
                                      state: {
                                        receiverId: appointment?.doctor?.id,
                                        receiverType:
                                          "MydocLab\\Models\\Doctor",
                                        conversationId: 0,
                                        contactName: `${appointment?.doctor?.firstName} ${appointment?.doctor?.lastName}`,
                                        contactProfile:
                                          appointment?.doctor?.profileImage,
                                        isNewChat: true,
                                      },
                                    })
                                  }
                                >
                                  Message
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {paginatedAppointments.length === 0 && (
                <Card className="shadow-sm">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">
                      {selectedDay
                        ? "No appointments found for the selected date."
                        : "No appointments found."}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between items-center mt-4 mb-16">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </Button>

                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>

                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
