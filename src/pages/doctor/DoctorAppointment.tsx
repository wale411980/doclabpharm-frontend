import { useState, useMemo, useEffect } from "react";
import {
  useGetDoctorAppointments,
  useUpdateDoctorAppointment,
  useRescheduleDoctorAppointment,
  useGetDoctorProfile,
} from "@/queries";
import {
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { DoctorAppointment } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const { data: doctorProfile } = useGetDoctorProfile();
  const {
    data: appointments = [],
    isLoading,
    refetch,
  } = useGetDoctorAppointments();
  const { mutate: updateAppointment, isPending: isUpdating } =
    useUpdateDoctorAppointment();
  const { mutate: rescheduleAppointment, isPending: isRescheduling } =
    useRescheduleDoctorAppointment();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");

  // State for modals
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showStartAppointment, setShowStartAppointment] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);

  const [cancelReason, setCancelReason] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  // New appointment form state
  const [newAppointmentForm, setNewAppointmentForm] = useState({
    patientName: "",
    date: "",
    time: "",
    duration: "",
    appointmentType: "",
    notes: "",
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    slotId: "",
    reason: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: DoctorAppointment) => {
      const fullName =
        `${appointment.user.firstName} ${appointment.user.lastName}`?.toLowerCase();
      const firstName = appointment.user.firstName?.toLowerCase();
      const lastName = appointment.user.lastName?.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        fullName.includes(searchLower) ||
        firstName.includes(searchLower) ||
        lastName.includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const appointmentDate = new Date(appointment.slot.availableDate);
      const matchesDateRange =
        (!dateFilter || appointmentDate >= new Date(dateFilter)) &&
        (!toDateFilter || appointmentDate <= new Date(toDateFilter));

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [appointments, searchTerm, statusFilter, dateFilter, toDateFilter]);

  // Get today's appointments
  const todaysAppointments = filteredAppointments.filter(
    (appointment: DoctorAppointment) => {
      const appointmentDate = new Date(appointment.slot.availableDate);
      const today = new Date();
      return appointmentDate.toDateString() === today.toDateString();
    }
  );

  const totalPages = Math.ceil(todaysAppointments.length / itemsPerPage);

  const paginatedTodaysAppointments = todaysAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().toDateString() ===
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ).toDateString();
      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 rounded ${
            isToday ? "bg-green-500 text-white" : ""
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, toDateFilter]);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
    setToDateFilter("");
  };

  const handleViewComplaint = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowComplaint(true);
  };

  const handleReschedule = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowReschedule(true);
  };

  const handleStartAppointment = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowStartAppointment(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col-reverse sm:flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Manage your appointments
            </h1>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <Input
                  type="date"
                  placeholder="From date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="flex-1 sm:w-36"
                />
              </div>
              <span className="text-sm hidden sm:inline">to</span>
              <Input
                type="date"
                placeholder="To date"
                value={toDateFilter}
                onChange={(e) => setToDateFilter(e.target.value)}
                className="w-full sm:w-36"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full sm:w-auto bg-transparent"
              >
                Clear Filters
              </Button>
            </div>

            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search patient"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="bg-green-50 p-4">
              <CardTitle className="text-lg">{"Today's Schedule"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {todaysAppointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No appointments scheduled for today
                </div>
              ) : (
                paginatedTodaysAppointments.map(
                  (appointment: DoctorAppointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center flex-shrink-0">
                            <div className="font-semibold text-base sm:text-lg">
                              {appointment.slot.availableTime}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              30 mins
                            </div>
                          </div>

                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                            <AvatarImage
                              src={
                                appointment.user.profileImage ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {appointment.user.firstName[0]}
                              {appointment.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base truncate">
                              {appointment.user.firstName}{" "}
                              {appointment.user.lastName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              {appointment?.consultation?.name}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:ml-auto">
                          <Badge
                            className={`${getStatusBadgeColor(
                              appointment.status
                            )} text-xs`}
                          >
                            {appointment.status}
                          </Badge>

                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewComplaint(appointment)}
                              className="text-xs px-2 py-1 h-8"
                            >
                              View Complaint
                            </Button>

                            {appointment.status !== "completed" &&
                              appointment.status !== "cancelled" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleReschedule(appointment)
                                    }
                                    className="text-xs px-2 py-1 h-8"
                                  >
                                    Reschedule
                                  </Button>

                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-8"
                                    onClick={() =>
                                      handleStartAppointment(appointment)
                                    }
                                  >
                                    Start
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          updateAppointment(
                                            {
                                              id: appointment.orderId,
                                              data: { status: "completed" },
                                            },
                                            {
                                              onSuccess: () => {
                                                refetch();
                                                toast.success(
                                                  "Appointment marked as completed",
                                                  {
                                                    position: "top-right",
                                                  }
                                                );
                                              },
                                              onError: (error: any) => {
                                                const errMsg =
                                                  error?.response?.data
                                                    ?.message;
                                                toast.error(
                                                  `Failed to mark appointment as completed. ${errMsg}`
                                                );
                                              },
                                            }
                                          );
                                        }}
                                      >
                                        Mark as Completed
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedAppointment(appointment);
                                          setShowCancelDialog(true);
                                        }}
                                      >
                                        Cancel Appointment
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
              <Dialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
              >
                <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reason" className="mb-2">
                        Reason for cancellation
                      </Label>
                      <Textarea
                        id="reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Enter reason"
                        required
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                        disabled={!cancelReason.trim() || isUpdating}
                        onClick={() => {
                          if (!selectedAppointment) return;

                          updateAppointment(
                            {
                              id: selectedAppointment.orderId,
                              data: {
                                status: "cancelled",
                                reason: cancelReason.trim(),
                              },
                            },
                            {
                              onSuccess: () => {
                                refetch();
                              },
                            }
                          );

                          refetch();
                          setShowCancelDialog(false);
                          setCancelReason("");
                        }}
                      >
                        {isUpdating ? "Cancelling..." : "Cancel Appointment"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4">
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
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-4 lg:space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-base sm:text-lg">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-gray-500 text-center p-1 sm:p-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Appointment Modal */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName" className="mb-2">
                Patient Name
              </Label>
              <Input
                id="patientName"
                value={newAppointmentForm.patientName}
                onChange={(e) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="date" className="mb-2">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newAppointmentForm.date}
                onChange={(e) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="time" className="mb-2">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newAppointmentForm.time}
                onChange={(e) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="duration" className="mb-2">
                Duration
              </Label>
              <Select
                value={newAppointmentForm.duration}
                onValueChange={(value) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    duration: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="appointmentType" className="mb-2">
                Appointment Type
              </Label>
              <Select
                value={newAppointmentForm.appointmentType}
                onValueChange={(value) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    appointmentType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="mb-2">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add notes here"
                value={newAppointmentForm.notes}
                onChange={(e) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewAppointment(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientNameReschedule">Patient Name</Label>
              <Input
                id="patientNameReschedule"
                value={
                  selectedAppointment
                    ? `${selectedAppointment.user.firstName} ${selectedAppointment.user.lastName}`
                    : ""
                }
                disabled
              />
            </div>

            <div>
              <Label htmlFor="slot">Select New Slot</Label>
              <Select
                value={rescheduleForm.slotId}
                onValueChange={(value) =>
                  setRescheduleForm((prev) => ({ ...prev, slotId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose available slot" />
                </SelectTrigger>
                <SelectContent>
                  {doctorProfile?.availableSlots
                    .filter((slot) => !slot.isBooked)
                    .map((slot) => {
                      const formattedDate = new Date(slot.availableDate)
                        .toISOString()
                        .split("T")[0]; // YYYY-MM-DD
                      return (
                        <SelectItem key={slot.id} value={String(slot.id)}>
                          {formattedDate} @ {slot.availableTime}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Rescheduling</Label>
              <Textarea
                id="reason"
                value={rescheduleForm.reason}
                onChange={(e) =>
                  setRescheduleForm((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="Explain why you're rescheduling"
                required
                className="min-h-[80px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReschedule(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                disabled={
                  !rescheduleForm.slotId ||
                  !rescheduleForm.reason ||
                  isRescheduling
                }
                onClick={() => {
                  if (!selectedAppointment) return;

                  rescheduleAppointment(
                    {
                      id: selectedAppointment.id,
                      data: {
                        slotId: Number(rescheduleForm.slotId),
                        reason: rescheduleForm.reason.trim(),
                      },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Appointment rescheduled successfully", {
                          position: "top-right",
                        });
                        refetch();
                        setShowReschedule(false);
                        setRescheduleForm({ slotId: "", reason: "" });
                      },
                      onError: (error: any) => {
                        const errMsg =
                          error?.response?.data?.message ||
                          "An error occurred while rescheduling.";
                        toast.error(
                          `Failed to reschedule appointment. ${errMsg}`,
                          { position: "top-right" }
                        );
                      },
                    }
                  );
                }}
              >
                {isRescheduling ? "Rescheduling..." : "Reschedule Appointment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Start Appointment Modal */}
      <Dialog
        open={showStartAppointment}
        onOpenChange={setShowStartAppointment}
      >
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Start Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                <AvatarImage
                  src={
                    selectedAppointment?.user.profileImage || "/placeholder.svg"
                  }
                />
                <AvatarFallback>
                  {selectedAppointment?.user.firstName[0]}
                  {selectedAppointment?.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-base sm:text-lg truncate">
                  {selectedAppointment?.user.firstName}{" "}
                  {selectedAppointment?.user.lastName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {selectedAppointment?.consultation?.name}
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium">Duration</div>
              <div className="text-sm text-gray-500">30 mins</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowStartAppointment(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                onClick={() =>
                  navigate("/doctor/messages", {
                    state: {
                      receiverId: selectedAppointment?.user?.id,
                      receiverType: "MydocLab\\Models\\User",
                      conversationId: 0,
                      contactName: `${selectedAppointment?.user?.firstName} ${selectedAppointment?.user?.lastName}`,
                      contactProfile: selectedAppointment?.user?.profileImage,
                      isNewChat: true,
                    },
                  })
                }
              >
                Start Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Complaint Modal */}
      <Dialog open={showComplaint} onOpenChange={setShowComplaint}>
        <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {selectedAppointment?.user.firstName}{" "}
              {selectedAppointment?.user.lastName}
              {"'s Complaint"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Current Complaint</h3>
              <p className="text-sm text-gray-600">
                {selectedAppointment?.message ||
                  "No complaint details available."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-medium">Consultation</h3>
                <p className="text-sm text-gray-600">
                  {selectedAppointment?.consultation?.name}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800 w-fit">Urgent</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
