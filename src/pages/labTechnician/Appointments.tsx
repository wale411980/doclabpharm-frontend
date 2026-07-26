import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLabTechnicianMostRecentAppointments } from "@/queries";
import type { MostRecentAppointments } from "@/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";

// Calendar data
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export default function AppointmentsDashboard() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: mostRecentAppointments } =
    useLabTechnicianMostRecentAppointments();

  function generateCalendarDays(currentDate: Date): CalendarDay[] {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }); // Sunday
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    const today = new Date();
    const days: CalendarDay[] = [];
    let date = start;

    while (date <= end) {
      days.push({
        date: date.getDate(),
        isCurrentMonth: isSameMonth(date, currentDate),
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, currentDate),
      });
      date = addDays(date, 1);
    }

    return days;
  }

  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarDays = generateCalendarDays(selectedDate);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // showing loading while fetching the data
  if (!mostRecentAppointments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleDateClick = (day: CalendarDay) => {
    const clickedDate = new Date(selectedDate);
    clickedDate.setDate(day.date);
    setSelectedDate(clickedDate);
  };

  const handlePreviousMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const filteredTodaysAppointments = mostRecentAppointments.filter(
    (appointment: MostRecentAppointments) =>
      appointment.user.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.user.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredTodaysAppointments.length / itemsPerPage
  );

  // Slice appointments for the current page
  const paginatedAppointments = filteredTodaysAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Patient"
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="day" className="mb-6">
            <TabsContent value="day" className="mt-4">
              <Card className="bg-[#E6F2F0]">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 text-[#0A3A40]">
                    Appointment's Schedule
                  </h2>
                  <div className="space-y-4">
                    {paginatedAppointments.map((appointment) => (
                      <Card key={appointment.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-right mr-2">
                                <div className="font-semibold text-[#0A3A40]">
                                  {appointment.time}
                                </div>
                              </div>
                              <Avatar className="h-12 w-12 border-2 border-[#E6F2F0]">
                                <AvatarImage
                                  src={
                                    appointment.user.profileImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={appointment.user.firstName}
                                />
                                <AvatarFallback>
                                  {`${appointment.user.firstName} ${appointment.user.lastName}`
                                    ?.split(" ")
                                    ?.map((n) => n[0])
                                    ?.join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{`${appointment.user.firstName} ${appointment.user.lastName}`}</div>
                                <div className="text-sm text-gray-500">
                                  {appointment.diagnosis.name}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge
                                variant="outline"
                                className="bg-[#E6F2F0] text-[#0A3A40] font-normal"
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex justify-between items-center pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0A3A40]">
                  {format(selectedDate, "MMMM yyyy")}
                </h3>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePreviousMonth}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextMonth}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekdays.map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 font-normal",
                      day.isSelected && "bg-[#0A3A40] text-white",
                      day.isToday &&
                        !day.isSelected &&
                        "border border-[#0A3A40]",
                      !day.isCurrentMonth && "text-gray-400"
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    {day.date}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
