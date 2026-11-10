import { useState } from "react";
import { Search, Edit, Trash2, UserCheck, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useSuperAdminDoctorList,
  useSuperAdminUpdateDoctor,
  useSuperAdminDeleteDoctor,
} from "@/queries";
import type { SuperAdminDoctorUpdate } from "@/types";
import { toast } from "react-toastify";

export default function SuperAdminDoctorList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDoctor, setEditingDoctor] =
    useState<SuperAdminDoctorUpdate | null>(null);
  const [editForm, setEditForm] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    speciality: "",
    experience: "",
    certifications: "",
    email: "",
    phone: "",
    about: "",
    profileImage: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: doctorList,
    refetch,
    isLoading: loadingDoctors,
  } = useSuperAdminDoctorList();
  const { mutate: updateDoctor } = useSuperAdminUpdateDoctor();
  const { mutate: deleteDoctor } = useSuperAdminDeleteDoctor();

  if (loadingDoctors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const totalDoctors = doctorList?.length;
  const availableDoctors = doctorList?.filter(
    (doctor) => doctor.status === "active"
  ).length;

  const filteredDoctors = doctorList?.filter(
    (doctor) =>
      doctor.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const itemsPerPage = 15;
  const totalPages = Math.ceil((filteredDoctors?.length ?? 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors?.slice(startIndex, endIndex);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  const handleEditDoctor = (doctor: SuperAdminDoctorUpdate) => {
    setEditingDoctor(doctor);
    setEditForm({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      speciality: doctor.speciality,
      experience: doctor.experience,
      certifications: doctor.certifications,
      email: doctor.email,
      phone: doctor.phone || "",
      about: doctor.about,
      profileImage: doctor.profileImage,
      status: doctor.status,
    });
  };

  const handleUpdateDoctor = () => {
    if (!editingDoctor) return;
    setIsLoading(true); // Start loading
    updateDoctor(
      {
        id: editingDoctor.id,
        data: editForm, // wrapped in `data` as expected
      },
      {
        onSuccess: () => {
          toast.success("Doctor updated successfully!");
          setIsLoading(false); // Stop loading
          setEditingDoctor(null);
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update doctor. " + errMsg);
          setIsLoading(false); // Stop loading on error
        },
      }
    );
  };

  const handleDeleteDoctor = (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    deleteDoctor(
      { id }, // wrap id in object as expected by mutation
      {
        onSuccess: () => {
          toast.success("Doctor deleted successfully!");
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to delete doctor. " + errMsg);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingDoctor(null);
    setEditForm({
      id: 0,
      firstName: "",
      lastName: "",
      speciality: "",
      experience: "",
      certifications: "",
      email: "",
      phone: "",
      about: "",
      profileImage: "",
      status: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Manage Doctors records & Directories
          </h1>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Doctors.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:gap-6">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Total Doctors
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate">
                    All registered Doctors
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {totalDoctors}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3 flex-shrink-0">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Available
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate">
                    All available Doctors
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {availableDoctors}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3 flex-shrink-0">
                  <UserCheck className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="space-y-3 p-4">
                {currentDoctors?.map((doctor) => (
                  <Card key={doctor.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage
                              src={doctor.profileImage || "/placeholder.svg"}
                              alt={doctor.firstName}
                            />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {doctor.firstName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm">{`${doctor.firstName} ${doctor.lastName}`}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {doctor.email}
                            </p>
                            <p className="text-sm font-medium text-green-700 mt-1">
                              {doctor.speciality}
                            </p>
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(doctor.status)}
                            className={`${getStatusBadgeClass(
                              doctor.status
                            )} text-xs`}
                          >
                            {doctor.status}
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-600">
                          <div
                            className="line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: doctor.experience,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-green-700 min-w-[200px]">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[120px]">
                      Specialty
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[150px] hidden md:table-cell">
                      Experience
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[100px]">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDoctors?.map((doctor) => (
                    <TableRow key={doctor.id} className="hover:bg-gray-50">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                            <AvatarImage
                              src={doctor.profileImage || "/placeholder.svg"}
                              alt={doctor.firstName}
                            />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {doctor.firstName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{`${doctor.firstName} ${doctor.lastName}`}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {doctor.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-700 text-sm">
                        {doctor.speciality}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: doctor.experience,
                          }}
                          className="prose prose-sm max-w-none text-xs line-clamp-2"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(doctor.status)}
                          className={`${getStatusBadgeClass(
                            doctor.status
                          )} text-xs`}
                        >
                          {doctor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center px-2">
          <Pagination>
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={`text-xs sm:text-sm ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                      className={`text-xs sm:text-sm h-8 w-8 sm:h-10 sm:w-10 ${
                        currentPage === pageNumber
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={`text-xs sm:text-sm ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingDoctor}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-semibold">
                Edit Doctor: {editingDoctor?.firstName}{" "}
                {editingDoctor?.lastName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4 py-4">
              {/* Render Input fields */}
              {[
                "firstName",
                "lastName",
                "speciality",
                "experience",
                "certifications",
                "email",
                "phone",
                "about",
              ].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field} className="text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    value={editForm[field as keyof typeof editForm]}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [field]: e.target.value })
                    }
                    className="bg-gray-50 text-sm"
                  />
                </div>
              ))}

              {/* Render Status dropdown manually */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <select
                  id="status"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select a status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="text-sm bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateDoctor}
                className="bg-green-600 hover:bg-green-700 text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Doctor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
