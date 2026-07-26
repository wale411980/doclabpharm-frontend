"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Eye,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useSuperAdminLabTechnicianPatientReports,
  useSuperAdminLabTechnicianPatientReportById,
  useGetSuperAdminLabTechnicianAllDiagnosisLst,
  useAddSuperAdminLabTechnicianDiagnosis,
  useUpdateSuperAdminLabTechnicianDiagnosis,
  useDeleteSuperAdminLabTechnicianDiagnosis,
  useGetSuperAdminLabTechnicianDiagnosisByCategories,
  useGetSuperAdminLabTechnicianDiagnosisByCategoryId,
  useAddSuperAdminLabTechnicianDiagnosisByCategory,
  useUpdateSuperAdminLabTechnicianDiagnosisByCategory,
  useDeleteSuperAdminLabTechnicianDiagnosisByCategory,
  useSuperAdminReportsUpdate,
  useSuperAdminReportsDelete,
  useSuperAdminReportsAdd,
} from "@/queries";
import type {
  DiagnosisList,
  EditDiagnosticService,
  AddDiagnosticService,
  AddDiagnosisCategory,
} from "@/types";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ImageUpload from "@/components/ImageUpload";

const categories = [
  "All Categories",
  "Blood Tests",
  "Imaging",
  "Microbiology",
  "Urinalysis",
];

export default function SuperAdminDiagnosis() {
  const { data: PatientReports, refetch: patientReportsRefetch } =
    useSuperAdminLabTechnicianPatientReports();
  const { data: LabTechnicianAllDiagnosisLst, refetch } =
    useGetSuperAdminLabTechnicianAllDiagnosisLst();
  const {
    data: LabTechnicianDiagnosisByCategories,
    refetch: refetchCategories,
  } = useGetSuperAdminLabTechnicianDiagnosisByCategories();
  const { mutate: addDiagnosis, isPending: isPendingAddDiagnosis } =
    useAddSuperAdminLabTechnicianDiagnosis();
  const { mutate: updateDiagnosis, isPending: isPendingUpdateDiagnosis } =
    useUpdateSuperAdminLabTechnicianDiagnosis();
  const { mutate: deleteDiagnosis, isPending: isPendingDeleteDiagnosis } =
    useDeleteSuperAdminLabTechnicianDiagnosis();
  const {
    mutate: addDiagnosisByCategory,
    isPending: pendingAddDiagnosisByCategory,
  } = useAddSuperAdminLabTechnicianDiagnosisByCategory();
  const {
    mutate: updateDiagnosisByCategory,
    isPending: pendinguUpdateDiagnosisByCategory,
  } = useUpdateSuperAdminLabTechnicianDiagnosisByCategory();
  const {
    mutate: deleteDiagnosisByCategory,
    isPending: pendingDeleteDiagnosisByCategory,
  } = useDeleteSuperAdminLabTechnicianDiagnosisByCategory();
  const { mutate: reportsUpdate, isPending: isUpdatingReport } =
    useSuperAdminReportsUpdate();
  const { mutate: reportsDelete, isPending: isDeletingReport } =
    useSuperAdminReportsDelete();
  const { mutate: addReport, isPending: isAddingReport } =
    useSuperAdminReportsAdd();

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState<AddDiagnosticService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [managementCategories, setManagementCategories] = useState<
    AddDiagnosisCategory[]
  >([]);
  const [isEditReportDialogOpen, setIsEditReportDialogOpen] = useState(false);
  const [reportEditData, setReportEditData] = useState({
    userId: 0,
    diagnosisId: 0,
    status: "normal",
    imageUrl: "",
    summary: "",
    id: 0, // for identifying which report to update
  });

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );

  const {
    data: LabTechnicianDiagnosisByCategoryId,
    isLoading: isCategoryServicesLoading,
    isError: isCategoryServicesError,
  } = useGetSuperAdminLabTechnicianDiagnosisByCategoryId(
    expandedCategoryId ?? 0,
    {
      enabled: expandedCategoryId !== null,
    }
  );

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isReportViewDialogOpen, setIsReportViewDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<
    (EditDiagnosticService & { id: number }) | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const ITEMS_PER_PAGE = 15;

  const [currentReportPage, setCurrentReportPage] = useState(1);
  const REPORTS_PER_PAGE = 15;

  useEffect(() => {
    if (!expandedCategoryId || !LabTechnicianDiagnosisByCategoryId) return;
    setManagementCategories((prev) =>
      prev?.map((category) =>
        category.id === expandedCategoryId
          ? {
              ...category,
              services: LabTechnicianDiagnosisByCategoryId,
              serviceCount: LabTechnicianDiagnosisByCategoryId.name.length ?? 0,
              isExpanded: true,
            }
          : category
      )
    );
  }, [expandedCategoryId, LabTechnicianDiagnosisByCategoryId]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    price: "",
    turnaround: "",
    status: "active",
    diagnosisCategoryId: 0,
    groupType: "",
    id: 0,
  });

  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [newReportData, setNewReportData] = useState({
    userId: 0,
    diagnosisId: 0,
    bookingId: 0,
    status: "normal",
    imageUrl: "",
    summary: "",
  });

  const [categoryFormData, setCategoryFormData] =
    useState<AddDiagnosisCategory>({
      id: 0,
      name: "",
    });

  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    price: "",
    duration: "",
    status: "active",
  });

  const [isEditCategoryServiceDialogOpen, setIsEditCategoryServiceDialogOpen] =
    useState(false);

  const { data: PatientReportById } =
    useSuperAdminLabTechnicianPatientReportById(selectedReportId ?? 0);

  // Filter services
  const sortedServices = useMemo(() => {
    if (!LabTechnicianAllDiagnosisLst) return [];
    return [...LabTechnicianAllDiagnosisLst]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest to oldest
      })
      .filter((service: DiagnosisList) => {
        const matchesSearch = service.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "All Categories" ||
          service.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [LabTechnicianAllDiagnosisLst, searchTerm, selectedCategory]);

  // Filter reports
  const paginatedReports = useMemo(() => {
    if (!PatientReports) return [];

    const filtered = PatientReports.filter((report) =>
      `${report?.user?.firstName} ${report?.user?.lastName}`
        .toLowerCase()
        .includes(reportSearchTerm.toLowerCase())
    )
      .filter((report) =>
        selectedStatus === "All Status" || selectedStatus === ""
          ? true
          : report.status === selectedStatus
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest to oldest
      });

    const startIndex = (currentReportPage - 1) * REPORTS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + REPORTS_PER_PAGE);
  }, [PatientReports, reportSearchTerm, selectedStatus, currentReportPage]);

  const totalFilteredReports = useMemo(() => {
    if (!PatientReports) return 0;

    return PatientReports.filter((report) =>
      `${report?.user?.firstName} ${report?.user?.lastName}`
        .toLowerCase()
        .includes(reportSearchTerm.toLowerCase())
    ).filter((report) =>
      selectedStatus === "All Status" || selectedStatus === ""
        ? true
        : report.status === selectedStatus
    ).length;
  }, [PatientReports, reportSearchTerm, selectedStatus]);

  // Filter categories
  const paginatedCategories = useMemo(() => {
    if (!LabTechnicianDiagnosisByCategories) return [];

    const filtered = LabTechnicianDiagnosisByCategories.filter((category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    ).sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Newest to oldest
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filtered.slice(startIndex, endIndex);
  }, [LabTechnicianDiagnosisByCategories, categorySearchTerm, currentPage]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedServices.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedServices, currentPage]);

  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);

  const resetForm = () => {
    setFormData({
      name: "",
      details: "",
      price: "",
      turnaround: "",
      status: "active",
      diagnosisCategoryId: 0,
      groupType: "",
      id: 0,
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ id: 0, name: "" });
  };

  const handleAddService = () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.turnaround ||
      !formData.status ||
      !formData.diagnosisCategoryId ||
      !formData.groupType ||
      !formData.details
    )
      return;

    const newService: AddDiagnosticService = {
      name: formData.name,
      details: formData.details,
      price: Number.parseInt(formData.price),
      turnaround: formData.turnaround,
      status: formData.status,
      diagnosisCategoryId: formData.diagnosisCategoryId,
      groupType: formData.groupType,
      id: formData.id,
    };

    addDiagnosis(newService, {
      onSuccess: (data) => {
        resetForm();
        setIsAddDialogOpen(false);
        refetch();
        toast.success("Service added successfully");

        console.log("Service added successfully:", data);
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message;
        toast.error("Failed to add service. " + errMsg);
      },
    });

    setServices([...(services ?? []), newService]);
  };

  const handleAddCategory = () => {
    if (!categoryFormData.name) return;

    const newCategory = {
      id: Date.now(),
      name: categoryFormData.name,
      serviceCount: 0,
      isExpanded: false,
      services: [],
    };

    addDiagnosisByCategory(newCategory, {
      onSuccess: () => {
        resetCategoryForm();
        setIsAddCategoryDialogOpen(false);
        refetchCategories();
        toast.success("Category added successfully");
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message;
        toast.error("Failed to add category. " + errMsg);
      },
    });

    setManagementCategories([...(managementCategories ?? []), newCategory]);
  };

  const handleEditService = () => {
    if (
      !editingService ||
      !formData.name ||
      !formData.turnaround ||
      !formData.details ||
      !formData.groupType ||
      !formData.diagnosisCategoryId ||
      !formData.status ||
      !formData.price
    )
      return;

    const updatedServices = (services ?? []).map((service) =>
      service.id === editingService.id
        ? {
            ...service,
            name: formData.name,
            details: formData.details,
            price: Number.parseInt(formData.price),
            turnaround: formData.turnaround,
            status: formData.status,
            diagnosisCategoryId: formData.diagnosisCategoryId,
            groupType: formData.groupType,
          }
        : service
    );

    //update the service
    updateDiagnosis(
      {
        id: editingService.id,
        data: { ...formData, price: Number(formData.price) },
      },
      {
        onSuccess: (data) => {
          resetForm();
          setIsEditDialogOpen(false);
          refetch();
          toast.success("Service updated successfully");
          console.log("Service updated successfully:", data);
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update service. " + errMsg);
        },
      }
    );

    setServices(updatedServices);
    setEditingService(null);
  };

  // delete service
  const handleDeleteService = (serviceId: number) => {
    deleteDiagnosis(serviceId, {
      onSuccess: (data) => {
        refetch();
        toast.success("Service deleted successfully");
        console.log("Service deleted successfully:", data);
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message;
        toast.error("Failed to delete service. " + errMsg);
      },
    });
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategoryId((prevId) =>
      prevId === categoryId ? null : categoryId
    );
  };

  const openEditDialog = (service: DiagnosisList) => {
    setEditingService({ ...service }); // Ensure id is included
    setFormData({
      name: service.name,
      details: service.details,
      price: service.price.toString(),
      turnaround: service.turnaround,
      status: service.status,
      diagnosisCategoryId: service.diagnosisCategoryId,
      groupType: service.groupType,
      id: service.id,
    });
    setIsEditDialogOpen(true);
  };

  const openEditCategoryDialog = (
    LabTechnicianDiagnosisByCategoryId: DiagnosisList
  ) => {
    setEditingService(LabTechnicianDiagnosisByCategoryId);
    setCategoryFormData({
      id: LabTechnicianDiagnosisByCategoryId.id,
      name: LabTechnicianDiagnosisByCategoryId.name,
    });
    setIsEditCategoryServiceDialogOpen(true);
  };

  const openReportDialog = (reportId: number) => {
    setSelectedReportId(reportId);
    setIsReportViewDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "normal":
        return "default";
      case "abnormal":
        return "secondary";
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySearchTerm]);

  useEffect(() => {
    setCurrentReportPage(1);
  }, [reportSearchTerm, selectedStatus]);

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-full sm:max-w-2xl grid-cols-3 mb-4 sm:mb-6 h-auto">
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-green-700 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2"
            >
              <span className="hidden sm:inline">Diagnostic Services</span>
              <span className="sm:hidden">Services</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-green-700 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2"
            >
              <span className="hidden sm:inline">Diagnosis Categories</span>
              <span className="sm:hidden">Categories</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-green-700 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2"
            >
              <span className="hidden sm:inline">Patient Reports</span>
              <span className="sm:hidden">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Diagnostic Service  */}

          <TabsContent value="services" className="space-y-4 sm:space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog
                  open={isCategoryDialogOpen}
                  onOpenChange={setIsCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto sm:min-w-[150px] justify-between bg-transparent"
                    >
                      <span className="truncate">{selectedCategory}</span>
                      <Filter className="h-4 w-4 ml-2 flex-shrink-0" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[300px] mx-auto">
                    <DialogHeader>
                      <DialogTitle>Filter by Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category ? "default" : "ghost"
                          }
                          className="w-full justify-start text-left"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsCategoryDialogOpen(false);
                          }}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-700 hover:bg-green-700 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add New Services</span>
                    <span className="sm:hidden">Add Service</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[500px] mx-auto max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      Add New Diagnostic Service
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="service-name">Service Name</Label>
                      <Input
                        id="service-name"
                        placeholder="e.g Complete Blood Count (CBC)"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="details">Description</Label>
                      <Textarea
                        id="details"
                        placeholder="Describe what this diagnostic service tests for and any preparation required"
                        value={formData.details}
                        onChange={(e) =>
                          setFormData({ ...formData, details: e.target.value })
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="0"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="turnaround">Turnaround Time</Label>
                        <Input
                          id="turnaround"
                          placeholder="e.g 24 hours"
                          value={formData.turnaround}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              turnaround: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="groupType">Group Type</Label>
                        <Select
                          value={formData.groupType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, groupType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Group Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">
                              Individual
                            </SelectItem>
                            <SelectItem value="group">Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="diagnosisCategoryId">Category</Label>
                        <Select
                          value={
                            formData.diagnosisCategoryId
                              ? String(formData.diagnosisCategoryId)
                              : ""
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              diagnosisCategoryId: Number(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {paginatedCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      This service will be available for new diagnostic requests
                    </p>
                    <Button
                      onClick={handleAddService}
                      className="w-full bg-green-700 hover:bg-green-700"
                      disabled={isPendingAddDiagnosis}
                    >
                      {isPendingAddDiagnosis ? "Adding..." : "Add Service"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedServices.map((service) => (
                <Card key={service.id} className="relative py-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg text-blue-900 line-clamp-2">
                          {service.name}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                          {service.categoryName}
                        </p>
                      </div>
                      <Badge
                        variant={service.status ? "default" : "secondary"}
                        className="bg-green-100 text-green-800 text-xs flex-shrink-0"
                      >
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-3">
                      {service.details}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="font-semibold text-base sm:text-lg">
                          ₦{service.price.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Turnaround: {service.turnaround}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(service)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="flex-1 text-red-600 hover:text-red-700"
                        disabled={isPendingDeleteDiagnosis}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                        {isPendingDeleteDiagnosis ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
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
                <div className="px-4 py-2 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
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
            )}
          </TabsContent>

          {/* Diagnosis Categories */}
          <TabsContent value="categories" className="space-y-4 sm:space-y-6">
            {/* Categories Header */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog
                  open={isAddCategoryDialogOpen}
                  onOpenChange={setIsAddCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-green-700 hover:bg-green-700 w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[400px] mx-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name" className="py-2">
                          Category Name
                        </Label>
                        <Input
                          id="category-name"
                          placeholder="Enter Category name"
                          value={categoryFormData.name}
                          onChange={(e) =>
                            setCategoryFormData({
                              ...categoryFormData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddCategoryDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddCategory}
                          className="flex-1 bg-green-700 hover:bg-green-700"
                          disabled={pendingAddDiagnosisByCategory}
                        >
                          {pendingAddDiagnosisByCategory
                            ? "Adding..."
                            : "Add Category"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {paginatedCategories.map((category) => {
                const isExpanded = expandedCategoryId === category.id;
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <div className="p-3 sm:p-4">
                      <div
                        className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150 p-2"
                        onClick={() => toggleCategoryExpansion(category.id)}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base sm:text-lg text-green-700 truncate">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pl-4 sm:pl-7 space-y-3">
                          {isCategoryServicesLoading && (
                            <p className="text-sm">Loading services...</p>
                          )}
                          {isCategoryServicesError && (
                            <p className="text-red-600 text-sm">
                              Error loading services
                            </p>
                          )}
                          <div
                            key={LabTechnicianDiagnosisByCategoryId?.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm sm:text-base truncate">
                                {LabTechnicianDiagnosisByCategoryId?.name}
                              </h4>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {/* Edit Button */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:bg-yellow-50 border-yellow-300 flex-shrink-0 bg-transparent"
                              onClick={() => {
                                if (LabTechnicianDiagnosisByCategoryId) {
                                  openEditCategoryDialog(
                                    LabTechnicianDiagnosisByCategoryId as DiagnosisList
                                  );
                                  setEditingService(
                                    LabTechnicianDiagnosisByCategoryId as DiagnosisList
                                  );
                                  setCategoryFormData({
                                    name: LabTechnicianDiagnosisByCategoryId.name,
                                    id: LabTechnicianDiagnosisByCategoryId.id,
                                  });
                                  setIsEditCategoryServiceDialogOpen(true);
                                }
                              }}
                            >
                              <Edit className="h-4 w-4 text-yellow-600" />
                            </Button>
                            {/* Delete Button */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-50 border-red-300 flex-shrink-0 bg-transparent"
                              disabled={pendingDeleteDiagnosisByCategory}
                              onClick={() => {
                                deleteDiagnosisByCategory(
                                  LabTechnicianDiagnosisByCategoryId?.id ?? 0,
                                  {
                                    onSuccess: () => {
                                      refetchCategories();
                                      toast.success(
                                        "Service deleted successfully from category"
                                      );
                                    },
                                    onError: (error: any) => {
                                      const errMsg =
                                        error?.response?.data?.message;
                                      toast.error(
                                        "Failed to delete service " + errMsg
                                      );
                                    },
                                  }
                                );
                              }}
                            >
                              {pendingDeleteDiagnosisByCategory ? (
                                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}

              <div className="flex justify-center items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">Page {currentPage}</span>
                <Button
                  variant="outline"
                  disabled={
                    LabTechnicianDiagnosisByCategories &&
                    LabTechnicianDiagnosisByCategories.filter((category) =>
                      category.name
                        .toLowerCase()
                        .includes(categorySearchTerm.toLowerCase())
                    ).length <=
                      currentPage * ITEMS_PER_PAGE
                  }
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>

              <Dialog
                open={isEditCategoryServiceDialogOpen}
                onOpenChange={setIsEditCategoryServiceDialogOpen}
              >
                <DialogContent className="w-[95vw] max-w-[500px] mx-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Edit Diagnosis Service in Category
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={categoryFormData.name}
                        onChange={(e) =>
                          setCategoryFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setIsEditCategoryServiceDialogOpen(false)
                        }
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          updateDiagnosisByCategory(
                            {
                              id: categoryFormData.id,
                              data: {
                                id: categoryFormData.id,
                                name: categoryFormData.name,
                              },
                            },
                            {
                              onSuccess: () => {
                                toast.success("Service updated successfully");
                                setIsEditCategoryServiceDialogOpen(false);
                                setCategoryFormData({ id: 0, name: "" });
                                refetchCategories();
                              },
                              onError: (error: any) => {
                                const errMsg = error?.response?.data?.message;
                                toast.error(
                                  "Failed to update service " + errMsg
                                );
                              },
                            }
                          );
                        }}
                        className="flex-1 bg-green-700 hover:bg-green-700"
                        disabled={pendinguUpdateDiagnosisByCategory}
                      >
                        {pendinguUpdateDiagnosisByCategory
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Patient reports */}
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            {/* Reports Search and Filter */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reports..."
                    value={reportSearchTerm}
                    onChange={(e) => setReportSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reports Table */}
            <Card>
              {" "}
              {/* Removed overflow-hidden from here */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Patient</TableHead>
                      <TableHead className="min-w-[120px]">Test</TableHead>

                      <TableHead className="min-w-[70px]">Action</TableHead>
                      <TableHead className="min-w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[100px]">
                            {`${report.user?.firstName} ${report?.user?.lastName}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[120px]">
                            {report?.diagnosis?.name}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReportDialog(report?.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  if (
                                    !report?.userId ||
                                    !report?.diagnosisId ||
                                    !report?.bookingId
                                  ) {
                                    toast.error("Missing report data");
                                    return;
                                  }

                                  setNewReportData({
                                    userId: report.userId,
                                    diagnosisId: report.diagnosisId,
                                    bookingId: report.bookingId,
                                    status: "normal",
                                    imageUrl: "",
                                    summary: "",
                                  });

                                  setIsAddReportDialogOpen(true);
                                }}
                              >
                                Add
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setReportEditData({
                                    userId: report.userId ?? 0,
                                    diagnosisId: report.diagnosisId ?? 0,
                                    status: report.status,
                                    imageUrl: report.imageUrl ?? "",
                                    summary: report.summary ?? "",
                                    id: report.id,
                                  });
                                  setIsEditReportDialogOpen(true);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  if (!report?.id) {
                                    toast.error("Report ID not found.");
                                    return;
                                  }
                                  reportsDelete(
                                    { id: report.id },
                                    {
                                      onSuccess: () => {
                                        toast.success(
                                          "Report deleted successfully"
                                        );
                                        patientReportsRefetch();
                                      },
                                      onError: (error: any) => {
                                        const errMsg =
                                          error?.response?.data?.message;
                                        toast.error(
                                          "Failed to delete report. " + errMsg
                                        );
                                      },
                                    }
                                  );
                                }}
                                disabled={isDeletingReport}
                              >
                                {isDeletingReport ? "Deleting..." : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    <Dialog
                      open={isEditReportDialogOpen}
                      onOpenChange={setIsEditReportDialogOpen}
                    >
                      <DialogContent className="w-[95vw] max-w-[500px] mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Report</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Status</Label>
                            <Select
                              value={reportEditData.status}
                              onValueChange={(value) =>
                                setReportEditData((prev) => ({
                                  ...prev,
                                  status: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="abnormal">
                                  Abnormal
                                </SelectItem>
                                <SelectItem value="critical">
                                  Critical
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Summary</Label>
                            <Textarea
                              value={reportEditData.summary}
                              onChange={(e) =>
                                setReportEditData((prev) => ({
                                  ...prev,
                                  summary: e.target.value,
                                }))
                              }
                              className="min-h-[80px]"
                            />
                          </div>
                          <div>
                            <Label>Report Image</Label>
                            <ImageUpload
                              onUploadComplete={(url: string) =>
                                setReportEditData((prev) => ({
                                  ...prev,
                                  imageUrl: url,
                                }))
                              }
                            />
                            {reportEditData.imageUrl && (
                              <img
                                src={
                                  reportEditData.imageUrl || "/placeholder.svg"
                                }
                                alt="Uploaded preview"
                                className="mt-2 w-32 h-32 object-cover rounded border"
                              />
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                            <Button
                              onClick={() => {
                                reportsUpdate(
                                  {
                                    id: reportEditData.id,
                                    data: {
                                      userId: reportEditData.userId,
                                      diagnosisId: reportEditData.diagnosisId,
                                      status: reportEditData.status,
                                      imageUrl: reportEditData.imageUrl,
                                      summary: reportEditData.summary,
                                    },
                                  },
                                  {
                                    onSuccess: () => {
                                      toast.success(
                                        "Report updated successfully"
                                      );
                                      setIsEditReportDialogOpen(false);
                                    },
                                    onError: (error: any) => {
                                      const errMsg =
                                        error?.response?.data?.message;
                                      toast.error(
                                        "Failed to update report " + errMsg
                                      );
                                    },
                                  }
                                );
                              }}
                              className="flex-1 sm:flex-initial"
                              disabled={isUpdatingReport}
                            >
                              {isUpdatingReport ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditReportDialogOpen(false)}
                              className="flex-1 sm:flex-initial"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isAddReportDialogOpen}
                      onOpenChange={setIsAddReportDialogOpen}
                    >
                      <DialogContent className="w-[95vw] max-w-[500px] mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add Report</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Status</Label>
                            <Select
                              value={newReportData.status}
                              onValueChange={(value) =>
                                setNewReportData((prev) => ({
                                  ...prev,
                                  status: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="abnormal">
                                  Abnormal
                                </SelectItem>
                                <SelectItem value="critical">
                                  Critical
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Summary</Label>
                            <Textarea
                              value={newReportData.summary}
                              onChange={(e) =>
                                setNewReportData((prev) => ({
                                  ...prev,
                                  summary: e.target.value,
                                }))
                              }
                              className="min-h-[80px]"
                            />
                          </div>

                          <div>
                            <Label>Report Image</Label>
                            <ImageUpload
                              onUploadComplete={(url: string) =>
                                setNewReportData((prev) => ({
                                  ...prev,
                                  imageUrl: url,
                                }))
                              }
                            />
                            {newReportData.imageUrl && (
                              <img
                                src={newReportData.imageUrl}
                                alt="Uploaded preview"
                                className="mt-2 w-32 h-32 object-cover rounded border"
                              />
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                            <Button
                              onClick={() => {
                                if (
                                  !newReportData.userId ||
                                  !newReportData.diagnosisId ||
                                  !newReportData.bookingId
                                ) {
                                  toast.error("Missing required fields");
                                  return;
                                }

                                addReport(
                                  { data: newReportData },
                                  {
                                    onSuccess: () => {
                                      toast.success(
                                        "Report added successfully"
                                      );
                                      setIsAddReportDialogOpen(false);
                                      patientReportsRefetch();
                                    },
                                    onError: (error: any) => {
                                      const errMsg =
                                        error?.response?.data?.message;
                                      toast.error(
                                        "Failed to add report " + errMsg
                                      );
                                    },
                                  }
                                );
                              }}
                              disabled={isAddingReport}
                            >
                              {isAddingReport ? "Saving..." : "Save Report"}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => setIsAddReportDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableBody>
                </Table>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Showing {(currentReportPage - 1) * REPORTS_PER_PAGE + 1} to{" "}
                {Math.min(
                  currentReportPage * REPORTS_PER_PAGE,
                  totalFilteredReports
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentReportPage === 1}
                  onClick={() => setCurrentReportPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    currentReportPage * REPORTS_PER_PAGE >= totalFilteredReports
                  }
                  onClick={() => setCurrentReportPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Service to Category Dialog */}
        <Dialog
          open={isAddServiceDialogOpen}
          onOpenChange={setIsAddServiceDialogOpen}
        >
          <DialogContent className="w-[95vw] max-w-[400px] mx-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-test-name">Test Name</Label>
                <Input
                  id="service-test-name"
                  placeholder="Complete Blood Count (CBC)"
                  value={serviceFormData.name}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="service-price">Price (₦)</Label>
                <Input
                  id="service-price"
                  type="number"
                  placeholder="Enter price"
                  value={serviceFormData.price}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      price: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="service-duration">Result Duration</Label>
                <Input
                  id="service-duration"
                  placeholder="Enter Result Duration"
                  value={serviceFormData.duration}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[95vw] max-w-[500px] mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Diagnostic Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-service-name">Service Name</Label>
                <Input
                  id="edit-service-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-details">Description</Label>
                <Textarea
                  id="edit-details"
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (₦)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-turnaround">Turnaround Time</Label>
                  <Input
                    id="edit-turnaround"
                    value={formData.turnaround}
                    onChange={(e) =>
                      setFormData({ ...formData, turnaround: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="groupType">Group Type</Label>
                  <Select
                    value={formData.groupType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, groupType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Group Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="diagnosisCategoryId">Category</Label>
                  <Select
                    value={
                      formData.diagnosisCategoryId
                        ? String(formData.diagnosisCategoryId)
                        : ""
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        diagnosisCategoryId: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {paginatedCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                This service will be available for new diagnostic requests
              </p>
              <Button
                onClick={handleEditService}
                className="w-full bg-green-700 hover:bg-green-700"
                disabled={isPendingUpdateDiagnosis}
              >
                {isPendingUpdateDiagnosis ? "Updating..." : "Update Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Report View Dialog */}
        <Dialog
          open={isReportViewDialogOpen}
          onOpenChange={setIsReportViewDialogOpen}
        >
          <DialogContent className="w-[95vw] max-w-[600px] mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  Report Details
                </DialogTitle>
              </div>
            </DialogHeader>
            {!PatientReportById || PatientReportById.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-10">
                Loading report...
              </p>
            ) : (
              PatientReportById.map((report) => (
                <div key={report.id} className="space-y-6 mb-10 border-b pb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      Report #{report.id}
                    </h2>
                    <Badge variant={getStatusBadgeVariant(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Patient Information
                      </h4>
                      <p className="font-medium">
                        {report.user?.firstName} {report.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Patient ID: {report.user?.id}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Requested By
                      </h4>
                      <p className="font-medium">
                        Dr. {report.doctor?.firstName} {report.doctor?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Service
                      </h4>
                      <p className="font-medium">{report.diagnosis?.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Request Date
                      </h4>
                      <p className="text-sm">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">
                      Test Results
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <img
                        src={report.imageUrl || "/placeholder.svg"}
                        alt="test result"
                        className="w-full h-auto rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">
                      Summary
                    </h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {report.summary}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsReportViewDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ))
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
