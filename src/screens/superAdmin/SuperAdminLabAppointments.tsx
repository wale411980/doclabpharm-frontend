import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar } from "lucide-react";
import {
  useSuperAdminAllLabAppointments,
  useSuperAdminReportsAdd,
  useSuperAdminReportsUpdate,
} from "@/queries";
import type { SuperAdminLabAppointments } from "@/types";
import { format, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload";

export default function SuperAdminLabAppointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<SuperAdminLabAppointments | null>(null);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState<{ imageUrl: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: allAppointments, isLoading } =
    useSuperAdminAllLabAppointments();
  const { mutate: addReport } = useSuperAdminReportsAdd();
  const { mutate: updateReport } = useSuperAdminReportsUpdate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedDate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Filter appointments based on selected status
  const filteredAppointments = allAppointments?.filter((appointment) => {
    const matchesStatus =
      selectedStatus === "all" || appointment.status === selectedStatus;

    const fullName =
      `${appointment.user.firstName} ${appointment.user.lastName}`.toLowerCase();
    const diagnosisName = appointment.diagnosis.name.toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      fullName.includes(search) || diagnosisName.includes(search);

    const matchesDate =
      !selectedDate || isSameDay(new Date(appointment.date), selectedDate);

    return matchesStatus && matchesSearch && matchesDate;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedAppointments = filteredAppointments?.slice(
    startIndex,
    endIndex
  );

  const totalPages = Math.ceil(
    (filteredAppointments?.length || 0) / itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600";
      case "rescheduled":
        return "text-orange-600";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Manage Appointments
          </h1>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search Appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={
                    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setSelectedDate(date);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardContent className="p-0">
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="space-y-4 p-4">
                {paginatedAppointments?.map(
                  (appointment: SuperAdminLabAppointments) => (
                    <Card key={appointment.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                appointment.user.profileImage ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {`${appointment.user.firstName} ${appointment.user.lastName}`
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {" "}
                              {`${appointment.user.firstName} ${appointment.user.lastName}`}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Diagnosis</p>
                            <p className="font-medium">
                              {appointment.diagnosis.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">
                              {format(new Date(appointment.date), "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <span
                            className={`text-sm font-medium capitalize ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </Card>
                  )
                )}

                <div className="flex justify-center mt-4 space-x-2 mb-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Patient</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments?.map(
                    (appointment: SuperAdminLabAppointments) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={
                                  appointment.user.profileImage ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {`${appointment.user.firstName} ${appointment.user.lastName}`
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900">{`${appointment.user.firstName} ${appointment.user.lastName}`}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.diagnosis.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {format(new Date(appointment.date), "dd/MM/yyyy")}
                          </p>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`text-sm font-medium capitalize ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuContent></DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-4 space-x-2 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            setOpenDialog(open);
            if (!open) {
              setIsEditing(false);
              setSummary("");
              setStatus("");
              setImage(null);
              setSelectedAppointment(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Test Report</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Upload Test Result</Label>
                <ImageUpload
                  onUploadComplete={(url: string) => {
                    setImage({ imageUrl: url });
                  }}
                />
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => {
                  if (!selectedAppointment || !status || !summary) {
                    toast.error("All fields are required.");
                    return;
                  }

                  const imageUrl = image?.imageUrl || "";

                  if (!imageUrl || !summary || !status) {
                    toast.error("All fields are required.");
                    return;
                  }

                  const payload = {
                    userId: Number(selectedAppointment.user.id),
                    diagnosisId: selectedAppointment.diagnosis.id,
                    bookingId: selectedAppointment.id,
                    summary,
                    status,
                    imageUrl,
                  };

                  const mutationArgs = {
                    id: selectedAppointment.id, // use report ID if available
                    data: payload,
                  };

                  const mutationFn = isEditing ? updateReport : addReport;

                  mutationFn(mutationArgs, {
                    onSuccess: () => {
                      toast.success(
                        isEditing ? "Report updated!" : "Report added!"
                      );
                      setOpenDialog(false);
                      setIsEditing(false);
                      setSummary("");
                      setStatus("");
                      setImage(null);
                      setSelectedAppointment(null);
                    },
                    onError: (err) => {
                      toast.error(
                        isEditing ? "Update failed." : "Failed to add report."
                      );
                      console.error("Mutation error:", err);
                    },
                  });
                }}
                className="w-full"
              >
                {isEditing ? "Update Report" : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
