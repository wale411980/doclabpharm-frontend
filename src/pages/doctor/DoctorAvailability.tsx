import { useState, useEffect } from "react";
import { format, addMonths, subMonths, isToday, isTomorrow } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSetAvailability, useGetDoctorAvailabilityHistory } from "@/queries";
import { useAuth } from "@/hooks/useAuth";
import type { Availability, DoctorAvailabilityHistory } from "@/types";
import { toast } from "react-toastify";

const DoctorAvailability = () => {
  const { user } = useAuth();

  const doctorId = user?.id; // This would come from auth context in a real app
  // Current date
  const today = new Date();

  // States
  const [date, setDate] = useState<Date>(today);
  const [month, setMonth] = useState<Date>(today);
  const [isAvailable] = useState(true);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [availabilityHistory, setAvailabilityHistory] = useState<
    DoctorAvailabilityHistory[]
  >([]);
  const [filteredHistory, setFilteredHistory] = useState<
    DoctorAvailabilityHistory[]
  >([]);
  const [startMonth, setStartMonth] = useState<Date>(subMonths(today, 1));
  const [endMonth, setEndMonth] = useState<Date>(today);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Use the setAvailability mutation
  const { mutate: setAvailability, isPending } = useSetAvailability();

  const { data: historyData, refetch } = useGetDoctorAvailabilityHistory(
    doctorId ?? 0
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const paginatedHistory = sortedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate time options (24-hour format)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Format time for display (24h to 12h)
  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Check if the selected date is valid (today or tomorrow)
  const isValidDate = (date: Date) => {
    return isToday(date) || isTomorrow(date);
  };

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && isValidDate(newDate)) {
      setDate(newDate);
    }
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    setMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  // Filter history by month
  const filterHistoryByRange = (start: Date, end: Date) => {
    const filtered = availabilityHistory.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    setFilteredHistory(filtered);
  };

  const resetFilter = () => {
    const defaultStart = subMonths(today, 1);
    const defaultEnd = today;
    setStartMonth(defaultStart);
    setEndMonth(defaultEnd);
    filterHistoryByRange(defaultStart, defaultEnd);
  };

  // Handle save availability
  const handleSaveAvailability = () => {
    if (!isAvailable) return;

    const formattedDate = format(date, "yyyy-MM-dd");

    // Validate time selection
    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    // Prepare data and doctorId for mutation
    const availabilityData: Availability = {
      availabilities: [
        {
          dayOfWeek: formattedDate,
          startTime: startTime,
          endTime: endTime,
          isAvailable: isAvailable,
        },
      ],
    };

    // Call the mutation
    if (typeof doctorId !== "number") {
      toast.error("Doctor ID is missing. Please log in again.", {
        position: "top-right",
      });
      return;
    }

    setAvailability(
      { data: availabilityData, doctorId },
      {
        onSuccess: () => {
          // setAvailabilityHistory((prev) => [newHistoryItem, ...prev])
          refetch();
          toast.success("Availability set successfully!", {
            position: "top-right",
          });
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error(
            "Failed to set availability. Please try again. " + errMsg,
            { position: "top-right" }
          );
        },
      }
    );
  };

  // Initialize history data
  useEffect(() => {
    if (historyData) {
      setAvailabilityHistory(historyData);
      filterHistoryByRange(startMonth, endMonth);
    }
  }, [historyData]);

  useEffect(() => {
    filterHistoryByRange(startMonth, endMonth);
  }, [availabilityHistory, startMonth, endMonth]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHistory]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Set Availability Section */}
        <Card className="py-4">
          <CardHeader>
            <CardDescription>
              Set your daily working hours and manage exceptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{format(month, "MMM yyyy")}</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={(date) => !isValidDate(date)}
                  className="rounded-md border"
                />
              </div>

              {/* Availability Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Availability for {format(date, "EEEE, MMMM d, yyyy")}
                </h3>

                {isAvailable && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Select
                          value={startTime}
                          onValueChange={setStartTime}
                          disabled={!isAvailable}
                        >
                          <SelectTrigger id="start-time" className="w-full">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={`start-${time}`} value={time}>
                                {formatTimeForDisplay(time)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Select
                          value={endTime}
                          onValueChange={setEndTime}
                          disabled={!isAvailable}
                        >
                          <SelectTrigger id="end-time" className="w-full">
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={`end-${time}`} value={time}>
                                {formatTimeForDisplay(time)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">
                        Current Schedule
                      </h4>
                      <div className="p-3 bg-muted rounded-md flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span>
                          Available from {formatTimeForDisplay(startTime)} to{" "}
                          {formatTimeForDisplay(endTime)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  className="w-full mt-6 bg-green-700 hover:bg-green-800 cursor-pointer"
                  onClick={handleSaveAvailability}
                  disabled={!isAvailable || isPending}
                >
                  {isPending ? "Saving..." : "Save Availability"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability History Section */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Availability History</CardTitle>
            <CardDescription>
              Filter your availability records by month range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Date range filter */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="mb-2 block">Start Month</Label>
                <Calendar
                  mode="single"
                  selected={startMonth}
                  onSelect={(date) => date && setStartMonth(date)}
                  month={startMonth}
                  onMonthChange={setStartMonth}
                  className="border rounded-md"
                />
              </div>

              <div>
                <Label className="mb-2 block">End Month</Label>
                <Calendar
                  mode="single"
                  selected={endMonth}
                  onSelect={(date) => date && setEndMonth(date)}
                  month={endMonth}
                  onMonthChange={setEndMonth}
                  className="border rounded-md"
                />
              </div>

              <div className="mt-4 md:mt-0">
                <Button
                  variant="outline"
                  onClick={resetFilter}
                  className="w-full bg-green-700 text-white cursor-pointer hover:bg-green-800 hover:text-white"
                >
                  Reset Filter
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Start time</TableHead>
                    <TableHead>End time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistory.length > 0 ? (
                    paginatedHistory.map((item: DoctorAvailabilityHistory) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.date
                            ? format(new Date(item.date), "MMM d, EEE")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{item.startTime}</TableCell>
                        <TableCell>{item.endTime}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No availability data in selected range
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorAvailability;
