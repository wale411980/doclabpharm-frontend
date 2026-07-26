"use client";

import { useState, useEffect } from "react";

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
import { useSuperAdminAllDoctorAppointments } from "@/queries";
import type { SuperAdminRecentAppointments } from "@/types";
import { isSameDay } from "date-fns";

export default function SuperAdminDoctorAppointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: allAppointments, isLoading } =
    useSuperAdminAllDoctorAppointments();

  // Reset to first page when filters change
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
    const consultationName = appointment?.consultation?.name.toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      fullName.includes(search) || consultationName.includes(search);

    const matchesDate =
      !selectedDate ||
      isSameDay(new Date(appointment.slot.availableDate), selectedDate);

    return matchesStatus && matchesSearch && matchesDate;
  });

  const paginatedAppointments = filteredAppointments?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
                  (appointment: SuperAdminRecentAppointments) => (
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
                            <p className="text-gray-500">Consultation</p>
                            <p className="font-medium">
                              {appointment?.consultation?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-medium">
                              {appointment.slot.availableTime}
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

                <div className="flex items-center justify-center gap-4 mt-6 mb-10">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Patient</TableHead>
                    <TableHead>Consultation</TableHead>
                    <TableHead>Time</TableHead>

                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments?.map(
                    (appointment: SuperAdminRecentAppointments) => (
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
                              {appointment?.consultation?.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {appointment.slot.availableTime}
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
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-center gap-4 mt-6 mb-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
