"use client";

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
  useAdminPharmacyList,
  useAdminUpdatePharmacy,
  useAdminDeletePharmacy,
} from "@/queries";
import type { AdminPharmacyUpdate, EditableAdminPharmacy } from "@/types";
import { toast } from "react-toastify";

export default function AdminPharmacyList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPharmacy, setEditingPharmacy] =
    useState<EditableAdminPharmacy | null>(null);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    speciality: "",
    experience: "",
    certifications: "",
    email: "",
    phone: "",
    about: "",
    status: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: pharmacyList,
    isLoading: loadingPharmacy,
    refetch,
  } = useAdminPharmacyList();
  const { mutate: updatePharmacy } = useAdminUpdatePharmacy();
  const { mutate: deletePharmacy } = useAdminDeletePharmacy();

  if (loadingPharmacy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const totalPharmacys = pharmacyList?.length;
  const availablePharmacys = pharmacyList?.filter(
    (pharmacy) => pharmacy.status === "active"
  ).length;

  const filteredPharmacys = pharmacyList?.filter(
    (pharmacy) =>
      pharmacy.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      pharmacy.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      pharmacy.speciality?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      pharmacy.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const itemsPerPage = 15;
  const totalPages = Math.ceil((filteredPharmacys?.length ?? 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPharmacys = filteredPharmacys?.slice(startIndex, endIndex);

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

  const handleEditPharmacy = (
    pharmacy: AdminPharmacyUpdate & { id: string | number }
  ) => {
    setEditingPharmacy(pharmacy);
    setEditForm({
      firstName: pharmacy.firstName,
      lastName: pharmacy.lastName,
      speciality: pharmacy.speciality,
      experience: pharmacy.experience || "",
      certifications: pharmacy.certifications,
      email: pharmacy.email,
      phone: pharmacy.phone || "",
      about: pharmacy.about,
      status: pharmacy.status,
      profileImage: pharmacy.profileImage || "",
    });
  };

  const handleUpdatePharmacy = () => {
    if (!editingPharmacy) return;
    setIsLoading(true); // Start loading
    updatePharmacy(
      {
        id: editingPharmacy.id,
        data: editForm,
      },
      {
        onSuccess: () => {
          toast.success("Pharmacy updated successfully!");
          setIsLoading(false); // Stop loading
          setEditingPharmacy(null);
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update pharmacy. " + errMsg);
          setIsLoading(false); // Stop loading on error
        },
      }
    );
  };

  const handleDeletePharmacy = (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this pharmacy?"))
      return;
    deletePharmacy(
      { id },
      {
        onSuccess: () => {
          toast.success("Pharmacy deleted successfully!");
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to delete pharmacy. " + errMsg);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingPharmacy(null);
    setEditForm({
      firstName: "",
      lastName: "",
      speciality: "",
      experience: "",
      certifications: "",
      email: "",
      phone: "",
      about: "",
      status: "",
      profileImage: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 md:text-3xl leading-tight">
            Manage Pharmacys records & Directories
          </h1>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Pharmacys.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:gap-6">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Total Pharmacys
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    All registered Pharmacys
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold">
                    {totalPharmacys}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Available
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    All available Pharmacys
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold">
                    {availablePharmacys}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2 sm:p-3">
                  <UserCheck className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {currentPharmacys?.map((pharmacy) => (
            <Card key={pharmacy.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={pharmacy.profileImage || "/placeholder.svg"}
                      alt={pharmacy.firstName}
                    />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {pharmacy.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{`${pharmacy.firstName} ${pharmacy.lastName}`}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {pharmacy.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(pharmacy.status)}
                        className={`${getStatusBadgeClass(
                          pharmacy.status
                        )} text-xs`}
                      >
                        {pharmacy.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-green-700 truncate ml-2">
                      {pharmacy.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Certification:</span>
                    <span className="font-medium text-green-700 truncate ml-2">
                      {pharmacy.certifications}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() =>
                      handleEditPharmacy({
                        ...pharmacy,
                        experience: pharmacy.experience ?? "",
                      })
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDeletePharmacy(pharmacy.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <Card className="hidden sm:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-green-700 min-w-[200px]">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[120px]">
                      Phone Number
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[150px]">
                      Certification
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
                  {currentPharmacys?.map((pharmacy) => (
                    <TableRow key={pharmacy.id} className="hover:bg-gray-50">
                      <TableCell className="min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                              src={pharmacy.profileImage || "/placeholder.svg"}
                              alt={pharmacy.firstName}
                            />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {pharmacy.firstName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{`${pharmacy.firstName} ${pharmacy.lastName}`}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {pharmacy.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-700 min-w-[120px]">
                        {pharmacy.phone}
                      </TableCell>
                      <TableCell className="font-medium text-green-700 min-w-[150px]">
                        <span className="truncate block">
                          {pharmacy.certifications}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <Badge
                          variant={getStatusBadgeVariant(pharmacy.status)}
                          className={getStatusBadgeClass(pharmacy.status)}
                        >
                          {pharmacy.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() =>
                              handleEditPharmacy({
                                ...pharmacy,
                                experience: pharmacy.experience ?? "",
                              })
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeletePharmacy(pharmacy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                  className={`${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  } text-xs sm:text-sm`}
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
                      className={`${
                        currentPage === pageNumber
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      } text-xs sm:text-sm min-w-[32px] h-8`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 3 && (
                <PaginationItem>
                  <span className="px-2 text-xs sm:text-sm text-gray-500">
                    ...
                  </span>
                </PaginationItem>
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
          open={!!editingPharmacy}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-semibold pr-8">
                Edit Pharmacy: {editingPharmacy?.firstName}{" "}
                {editingPharmacy?.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-4">
              {[
                "firstName",
                "lastName",
                "speciality",
                "experience",
                "certifications",
                "email",
                "phone",
                "about",
                "status",
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
                onClick={handleUpdatePharmacy}
                className="bg-green-600 hover:bg-green-700 text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Pharmacy"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
