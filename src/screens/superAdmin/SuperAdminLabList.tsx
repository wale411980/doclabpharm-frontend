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
  useSuperAdminLabList,
  useSuperAdminUpdateLab,
  useSuperAdminDeleteLab,
} from "@/queries";
import type { SuperAdminLabUpdate } from "@/types";
import { toast } from "react-toastify";

export default function SuperAdminLabList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLab, setEditingLab] = useState<SuperAdminLabUpdate | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
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
    data: labList,
    refetch,
    isLoading: loadingLabs,
  } = useSuperAdminLabList();
  const { mutate: updateLab } = useSuperAdminUpdateLab();
  const { mutate: deleteLab } = useSuperAdminDeleteLab();

  if (loadingLabs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const totalLabs = labList?.length;
  const availableLabs = labList?.filter(
    (lab) => lab.status === "active"
  ).length;

  const filteredLabs = labList?.filter(
    (lab) =>
      lab.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      lab.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      lab.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const itemsPerPage = 15;
  const totalPages = Math.ceil((filteredLabs?.length ?? 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLabs = filteredLabs?.slice(startIndex, endIndex);

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

  const handleEditLab = (lab: SuperAdminLabUpdate) => {
    setEditingLab(lab);
    setEditForm({
      firstName: lab.firstName,
      lastName: lab.lastName,
      experience: lab.experience,
      certifications: lab.certifications,
      email: lab.email,
      phone: lab.phone || "",
      about: lab.about,
      profileImage: lab.profileImage,
      status: lab.status,
    });
  };

  const handleUpdateLab = () => {
    if (!editingLab) return;
    setIsLoading(true); // Start loading state
    updateLab(
      {
        id: editingLab.id,
        data: editForm, // wrapped in `data` as expected
      },
      {
        onSuccess: () => {
          toast.success("Lab updated successfully!");
          setIsLoading(false); // Stop loading
          setEditingLab(null);
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update lab. " + errMsg);
          setIsLoading(false); // Stop loading on error
        },
      }
    );
  };

  const handleDeleteLab = (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this lab?")) return;
    deleteLab(
      { id }, // wrap id in object as expected by mutation
      {
        onSuccess: () => {
          toast.success("Lab deleted successfully!");
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to delete lab. " + errMsg);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingLab(null);
    setEditForm({
      firstName: "",
      lastName: "",
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
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 md:text-3xl leading-tight">
            Manage Labs records & Directories
          </h1>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Labs.."
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
                    Total Labs
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    All registered Labs
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold">{totalLabs}</p>
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
                    All available Labs
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold">
                    {availableLabs}
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
          {currentLabs?.map((lab) => (
            <Card key={lab.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={lab.profileImage || "/placeholder.svg"}
                      alt={lab.firstName}
                    />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {lab.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{`${lab.firstName} ${lab.lastName}`}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {lab.email}
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(lab.status)}
                      className={`${getStatusBadgeClass(lab.status)} mt-1`}
                    >
                      {lab.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-green-700">
                      Certification:{" "}
                    </span>
                    <span className="text-gray-600">{lab.certifications}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">
                      Experience:{" "}
                    </span>
                    <div
                      dangerouslySetInnerHTML={{ __html: lab.experience }}
                      className="prose prose-sm max-w-none text-gray-600 line-clamp-2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleEditLab(lab)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDeleteLab(lab.id)}
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
                    <TableHead className="font-semibold text-green-700 min-w-[150px]">
                      Certification
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[200px]">
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
                  {currentLabs?.map((lab) => (
                    <TableRow key={lab.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                              src={lab.profileImage || "/placeholder.svg"}
                              alt={lab.firstName}
                            />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {lab.firstName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{`${lab.firstName} ${lab.lastName}`}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {lab.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-700">
                        {lab.certifications}
                      </TableCell>
                      <TableCell>
                        <div
                          dangerouslySetInnerHTML={{ __html: lab.experience }}
                          className="prose prose-sm max-w-none line-clamp-3"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(lab.status)}
                          className={getStatusBadgeClass(lab.status)}
                        >
                          {lab.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleEditLab(lab)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteLab(lab.id)}
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
          open={!!editingLab}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-semibold pr-6">
                Edit Lab: {editingLab?.firstName} {editingLab?.lastName}
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
                className="w-full sm:w-auto order-2 sm:order-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateLab}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Lab"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
