import { useState } from "react";
import { Search, Edit, Trash2, UserCheck, Users, Loader2 } from "lucide-react";
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
  useSuperAdminPatientList,
  useSuperAdminUpdatePatient,
  useSuperAdminDeletePatient,
  useSuperAdminPatientStats,
} from "@/queries";
import type { SuperAdminPatientUpdate } from "@/types";
import { toast } from "react-toastify";

export default function SuperAdminPatientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPatient, setEditingPatient] =
    useState<SuperAdminPatientUpdate | null>(null);
  const [editForm, setEditForm] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: patientList,
    refetch,
    isLoading: loadingPatients,
  } = useSuperAdminPatientList();
  const { data: patientStats } = useSuperAdminPatientStats();
  const { mutate: updatePatient } = useSuperAdminUpdatePatient();
  const { mutate: deletePatient } = useSuperAdminDeletePatient();

  if (loadingPatients) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const filteredPatients = patientList?.filter(
    (patient) =>
      patient.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const itemsPerPage = 15;
  const totalPages = Math.ceil((filteredPatients?.length ?? 0) / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients?.slice(startIndex, endIndex);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

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

  const handleEditPatient = (patient: SuperAdminPatientUpdate) => {
    setEditingPatient(patient);
    setEditForm({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone || "",
    });
  };

  const handleUpdatePatient = () => {
    if (!editingPatient) return;
    setIsLoading(true); // Start loading

    updatePatient(
      {
        id: editingPatient.id,
        data: editForm, // wrapped in `data` as expected
      },
      {
        onSuccess: () => {
          toast.success("Patient updated successfully!");
          setIsLoading(false); // Stop loading
          setEditingPatient(null);
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update patient. " + errMsg);
          setIsLoading(false); // Stop loading on error
        },
      }
    );
  };

  const handleDeletePatient = (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    setDeletingId(Number(id)); // Set the ID of the patient being deleted

    deletePatient(
      { id }, // wrap id in object as expected by mutation
      {
        onSuccess: () => {
          toast.success("Patient deleted successfully!");
          setDeletingId(Number(id)); // Set the ID of the patient being deleted        refetch()
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to delete patient. " + errMsg);
          setDeletingId(null); // Reset after error
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingPatient(null);
    setEditForm({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Manage Patients records & Directories
          </h1>
          <div className="relative w-full sm:w-auto sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Patients.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold truncate">
                    Total Patients
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate">
                    All registered Patients
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {patientStats?.totalPatients}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3 flex-shrink-0 ml-2">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold truncate">
                    Appiontments
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate">
                    All appiontments
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {patientStats?.appointment}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3 flex-shrink-0 ml-2">
                  <UserCheck className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold truncate">
                    Recent Visits
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate">
                    All recent visits
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {patientStats?.recentVisit}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3 flex-shrink-0 ml-2">
                  <UserCheck className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>

        {/* Table - Desktop View */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-green-700">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-green-700">
                      Account Id
                    </TableHead>
                    <TableHead className="font-semibold text-green-700">
                      Gender
                    </TableHead>
                    <TableHead className="font-semibold text-green-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-green-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPatients?.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={patient.profileImage || "/placeholder.svg"}
                              alt={patient.firstName}
                            />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {patient.firstName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{`${patient.firstName} ${patient.lastName}`}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {patient.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-700">
                        {patient.accountId}
                      </TableCell>
                      <TableCell className="font-medium text-green-700">
                        {patient.gender}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(patient.status)}
                          className={getStatusBadgeClass(patient.status)}
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeletePatient(patient.id)}
                            disabled={deletingId === patient.id}
                          >
                            {deletingId === patient.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {currentPatients?.map((patient) => (
            <Card key={patient.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={patient.profileImage || "/placeholder.svg"}
                      alt={patient.firstName}
                    />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {patient.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{`${patient.firstName} ${patient.lastName}`}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {patient.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(patient.status)}
                        className={`${getStatusBadgeClass(
                          patient.status
                        )} text-xs`}
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Account ID:</span>
                    <p className="font-medium text-green-700 truncate">
                      {patient.accountId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <p className="font-medium text-green-700">
                      {patient.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleEditPatient(patient)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDeletePatient(patient.id)}
                    disabled={deletingId === patient.id}
                  >
                    {deletingId === patient.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
                  className={`${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  } text-xs sm:text-sm`}
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-2 text-gray-400 text-sm">...</span>
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Number(page));
                      }}
                      isActive={currentPage === page}
                      className={`text-xs sm:text-sm h-8 w-8 sm:h-10 sm:w-10 ${
                        currentPage === page
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              {totalPages > 3 && (
                <>
                  <PaginationItem>
                    <span className="text-xs sm:text-sm text-gray-500 px-2">
                      ...
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(totalPages);
                      }}
                      isActive={currentPage === totalPages}
                      className={`${
                        currentPage === totalPages
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      } text-xs sm:text-sm h-8 w-8 sm:h-10 sm:w-10`}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={`${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  } text-xs sm:text-sm`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingPatient}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-semibold leading-tight">
                Edit Patient: {editingPatient?.firstName}{" "}
                {editingPatient?.lastName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {["firstName", "lastName", "email", "phone"].map((field) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field} className="text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field?.slice(1)}
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
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="w-full sm:w-auto order-2 sm:order-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePatient}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2"
                disabled={isLoading}
              >
                Update Patient
                {isLoading ? "Updating..." : "Update Patient"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
