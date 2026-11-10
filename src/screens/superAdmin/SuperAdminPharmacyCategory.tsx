import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

import {
  useGetSuperAdminPharmacyMedicineCategories,
  useGetSuperAdminPharmacyMedicineCategoriesById,
  useAddSuperAdminPharmacyMedicineCategory,
  useUpdateSuperAdminPharmacyDiagnosisByCategory,
  useDeleteSuperAdminPharmacyDiagnosisByCategory,
} from "@/queries";

import type {
  SuperAdminPharmacyMedicineCategory,
  AddPharmacyMedicineCategory,
  EditDiagnosticService,
} from "@/types";
import { toast } from "react-toastify";

export default function SuperAdminPharmacyCategory() {
  const { data: categoriesData, refetch } =
    useGetSuperAdminPharmacyMedicineCategories();
  const { mutate: addCategory, isPending: isPendingAdd } =
    useAddSuperAdminPharmacyMedicineCategory();
  const { mutate: updateDiagnosisByCategory, isPending: isPendingUpdate } =
    useUpdateSuperAdminPharmacyDiagnosisByCategory();
  const { mutate: deleteDiagnosisByCategory } =
    useDeleteSuperAdminPharmacyDiagnosisByCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [, setEditingService] = useState<
    (EditDiagnosticService & { id: number }) | null
  >(null);
  const [isEditCategoryServiceDialogOpen, setIsEditCategoryServiceDialogOpen] =
    useState(false);
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

  const resetForm = () => {
    setFormData({
      name: "",
      details: "", // Default value
      price: "", // Default value
      turnaround: "", // Default value
      status: "active", // Default value
      diagnosisCategoryId:
        PharmacyDiagnosisByCategoryId.diagnosisCategoryId ?? 0, // Default category ID
      groupType: "", // Default value
      id: 0, // Add this line
    });
  };

  const [, setManagementCategories] =
    useState<SuperAdminPharmacyMedicineCategory[]>();

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );
  const {
    data: PharmacyDiagnosisByCategoryId,
    isLoading: isCategoryServicesLoading,
    isError: isCategoryServicesError,
  } = useGetSuperAdminPharmacyMedicineCategoriesById(expandedCategoryId ?? 0, {
    enabled: expandedCategoryId !== null,
  });

  useEffect(() => {
    if (!expandedCategoryId || !PharmacyDiagnosisByCategoryId) return;

    setManagementCategories((prev) =>
      prev?.map((category) =>
        category.id === expandedCategoryId
          ? {
              ...category,
              services: PharmacyDiagnosisByCategoryId,
              serviceCount: PharmacyDiagnosisByCategoryId.name.length ?? 0,
              isExpanded: true,
            }
          : category
      )
    );
  }, [expandedCategoryId, PharmacyDiagnosisByCategoryId]);

  // write the function to handle adding a new category and show a toast notification
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: AddPharmacyMedicineCategory = {
        name: newCategoryName,
      };

      addCategory(newCategory, {
        onSuccess: () => {
          setNewCategoryName("");
          refetch();
          setShowAddCategoryDialog(false);
          toast.success("Category added successfully!");
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to add category. Please try again. " + errMsg);
        },
      });
    } else {
      toast.error("Please enter a valid category name.");
    }
  };

  // Filter categories
  const paginatedCategories = useMemo(() => {
    if (!categoriesData) return [];

    const filtered = categoriesData.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [categoriesData, searchTerm, currentPage]);

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategoryId((prevId) =>
      prevId === categoryId ? null : categoryId
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Drug Categories
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Button
              onClick={() => setShowAddCategoryDialog(true)}
              className="bg-green-700 hover:bg-green-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {paginatedCategories.map((category) => {
            const isExpanded = expandedCategoryId === category.id;

            return (
              <Card key={category.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="p-0 h-auto"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <h3 className="font-semibold text-lg text-green-700">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pl-7 space-y-3">
                      {isCategoryServicesLoading && <p>Loading services...</p>}
                      {isCategoryServicesError && (
                        <p className="text-red-600">Error loading services</p>
                      )}
                      <div
                        key={PharmacyDiagnosisByCategoryId?.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">
                            {PharmacyDiagnosisByCategoryId?.name}
                          </h4>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-yellow-50 border-yellow-300"
                          onClick={() => {
                            setEditingService(PharmacyDiagnosisByCategoryId);
                            setFormData({ ...PharmacyDiagnosisByCategoryId });
                            setIsEditCategoryServiceDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-red-50 border-red-300"
                          onClick={() => {
                            deleteDiagnosisByCategory(
                              PharmacyDiagnosisByCategoryId.id,
                              {
                                onSuccess: () => {
                                  refetch();
                                  toast.success(
                                    "Service deleted successfully from category"
                                  );
                                },
                                onError: (error: any) => {
                                  const errMsg = error?.response?.data?.message;
                                  toast.error(
                                    "Failed to delete service " + errMsg
                                  );
                                },
                              }
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">Page {currentPage}</span>

            <Button
              variant="outline"
              disabled={
                !categoriesData ||
                currentPage >=
                  Math.ceil(
                    categoriesData.filter((category) =>
                      category.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ).length / itemsPerPage
                  )
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
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Diagnosis Service in Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditCategoryServiceDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      updateDiagnosisByCategory(
                        {
                          id: formData.id,
                          data: { id: formData.id, name: formData.name },
                        },
                        {
                          onSuccess: () => {
                            toast.success("Service updated successfully");
                            setIsEditCategoryServiceDialogOpen(false);
                            refetch();
                            resetForm();
                          },
                          onError: (error: any) => {
                            const errMsg = error?.response?.data?.message;
                            toast.error("Failed to update service.  " + errMsg);
                          },
                        }
                      );
                    }}
                    className="flex-1 bg-green-700 hover:bg-green-700"
                    disabled={isPendingUpdate}
                  >
                    {isPendingUpdate ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Add Category Dialog */}
        <Dialog
          open={showAddCategoryDialog}
          onOpenChange={setShowAddCategoryDialog}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-teal-700">
                  Add New Category
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="categoryName"
                  className="text-sm font-medium text-teal-700"
                >
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  placeholder="Enter Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddCategoryDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  className="bg-green-700 hover:bg-green-700 text-white"
                  disabled={isPendingAdd}
                >
                  {isPendingAdd ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
