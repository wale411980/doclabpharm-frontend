"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Eye, Edit, Trash2, List, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAdminConsultationList,
  useAdminGetConsultation,
  useAdminAddConsultation,
  useAdminUpdateConsultation,
  useAdminDeleteConsultation,
} from "@/queries";
import type { AdminConsultation, AdminAddConsultation } from "@/types";
import { format } from "date-fns";
import RichTextEditor from "../doctor/RichTextEditor";

export default function VirtualConsultationAdmin() {
  const [, setServices] = useState<AdminConsultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedService, setSelectedService] =
    useState<AdminConsultation | null>(null);
  const [activeTab, setActiveTab] = useState("all-services");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewServiceId, setViewServiceId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    price: "",
    includeDetails: "",
  });

  const {
    data: consultationLists,
    isLoading,
    refetch,
  } = useAdminConsultationList();
  const { data: consultationById, isLoading: isConsultationLoading } =
    useAdminGetConsultation(viewServiceId ?? undefined);

  const { mutate: addConsultation } = useAdminAddConsultation();
  const { mutate: updateConsultation } = useAdminUpdateConsultation();
  const { mutate: deleteConsultation } = useAdminDeleteConsultation();

  // Filter and search logic
  const filteredServices = useMemo(() => {
    if (!consultationLists) return [];
    return consultationLists.filter((service) => {
      const matchesSearch =
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.details?.toLowerCase().includes(searchQuery.toLowerCase());
      const serviceDate = new Date(service.createdAt);
      const isAfterStartDate = startDate
        ? serviceDate >= new Date(startDate)
        : true;
      const isBeforeEndDate = endDate ? serviceDate <= new Date(endDate) : true;
      return matchesSearch && isAfterStartDate && isBeforeEndDate;
    });
  }, [consultationLists, searchQuery, startDate, endDate]);

  if (isLoading || !consultationLists) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const extractDotList = (htmlString: string) => {
    if (!htmlString) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const listItems = Array.from(doc.querySelectorAll("li"));
    return listItems.map((li) => li.textContent?.trim() ?? "");
  };

  const isFormValid =
    formData.name?.trim() &&
    formData.details?.trim() &&
    formData.includeDetails?.trim() &&
    formData.price?.trim();

  const resetForm = () => {
    setFormData({
      name: "",
      details: "",
      price: "",
      includeDetails: "",
    });
  };

  const handleCreate = () => {
    const newServiceData: AdminAddConsultation = {
      name: formData.name,
      details: formData.details,
      price: formData.price,
      includeDetails: formData.includeDetails,
    };

    addConsultation(
      { data: newServiceData },
      {
        onSuccess: () => {
          refetch();
          setIsCreateModalOpen(false);
          resetForm();
        },
        onError: (err) => {
          console.error("Failed to create consultation:", err);
        },
      }
    );
  };

  const handleEdit = () => {
    if (!selectedService) return;

    const payload: AdminAddConsultation = {
      name: formData.name,
      details: formData.details,
      price: formData.price,
      includeDetails: formData.includeDetails,
    };

    updateConsultation(
      {
        id: selectedService.id,
        data: payload,
      },
      {
        onSuccess: () => {
          refetch();
          setIsEditModalOpen(false);
          setSelectedService(null);
          resetForm();
        },
        onError: (err) => {
          console.error("Failed to update consultation:", err);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedService) return;

    deleteConsultation(
      { id: selectedService.id },
      {
        onSuccess: () => {
          setServices((prev) =>
            prev.filter((s) => s.id !== selectedService.id)
          );
          refetch();
          setIsDeleteDialogOpen(false);
          setSelectedService(null);
        },
        onError: (err) => {
          console.error("Delete failed:", err);
        },
      }
    );
  };

  const openEditModal = (service: AdminConsultation) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      details: service.details,
      price: service.price?.toString(),
      includeDetails: service.includeDetails,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (service: AdminConsultation) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">
              Consultation
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 lg:text-base">
              Manage your consultation services.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Consultation
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="all-services" className="space-y-4 sm:space-y-6">
            {/* Services Header */}
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <h2 className="text-lg sm:text-xl font-semibold">
                All Consultation Services ({filteredServices.length})
              </h2>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3 sm:space-y-4">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search consultations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center w-full">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
                    <label
                      htmlFor="startDate"
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      From:
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
                    <label
                      htmlFor="endDate"
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      To:
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {filteredServices.length} of {consultationLists.length}{" "}
              consultations
            </p>

            {/* Services Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredServices?.map((service) => (
                <Card
                  key={service.id}
                  className="group hover:shadow-lg transition-shadow py-3 sm:py-4"
                >
                  <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg break-words">
                          {service.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                      {service.details}
                    </p>
                    <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-1">
                      {extractDotList(service.includeDetails).map(
                        (item, index) => (
                          <div key={index} className="break-words">
                            . {item}
                          </div>
                        )
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div className="flex items-baseline justify-between">
                      <div className="space-y-1">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          ₦ {service.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        Created At:{" "}
                        {format(new Date(service.createdAt), "dd/MM/yyyy")}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent text-xs sm:text-sm"
                        onClick={() => {
                          setViewServiceId(service.id);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent text-xs sm:text-sm"
                        onClick={() => openEditModal(service)}
                      >
                        <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(service)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="w-[95vw] max-w-lg max-h-[85vh] overflow-y-auto mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg">
                    Consultation Details
                  </DialogTitle>
                  <DialogDescription className="text-left">
                    {isConsultationLoading && (
                      <p className="text-sm">Loading...</p>
                    )}
                    {!isConsultationLoading && consultationById && (
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-lg sm:text-xl font-semibold break-words">
                          {consultationById.name}
                        </h2>
                        <p className="text-sm break-words">
                          {consultationById.details}
                        </p>
                        <div className="text-sm sm:text-base font-bold">
                          Price: ₦{consultationById.price?.toLocaleString()}
                        </div>
                        <div>
                          <strong className="text-sm sm:text-base">
                            Includes:
                          </strong>
                          <ul className="list-disc pl-4 sm:pl-6 mt-1 space-y-1">
                            {extractDotList(
                              consultationById.includeDetails
                            ).map((item, index) => (
                              <li
                                key={index}
                                className="text-xs sm:text-sm break-words"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {!isConsultationLoading && !consultationById && (
                      <p className="text-sm">No data available.</p>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => setIsViewDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {filteredServices.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-base sm:text-lg mb-2">
                  No consultations found
                </div>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="view-service" className="space-y-6">
            <div className="text-center py-8 sm:py-12">
              <Settings className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Service Configuration
              </h3>
              <p className="text-gray-500 text-sm">
                Configure and manage individual service settings
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedService(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {isCreateModalOpen
                ? "Create New Consultation"
                : "Edit Consultation"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isCreateModalOpen
                ? "Add a new consultation service to your platform."
                : "Update the consultation service details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Service name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter service name"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm">
                Details
              </Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, details: e.target.value }))
                }
                placeholder="Enter service details"
                rows={3}
                className="text-sm resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm">
                Price (₦)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="includeDetails" className="text-teal-800 text-sm">
                Include Details
              </Label>
              <div className="min-h-[120px]">
                <RichTextEditor
                  value={formData.includeDetails || ""}
                  onChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, includeDetails: value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedService(null);
                resetForm();
              }}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={isCreateModalOpen ? handleCreate : handleEdit}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2"
              disabled={!isFormValid}
            >
              {isCreateModalOpen ? "Create Service" : "Update Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              Delete Consultation Service
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm break-words">
              Are you sure you want to delete "{selectedService?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto order-1 sm:order-2"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
