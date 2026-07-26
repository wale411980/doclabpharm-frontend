import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Loader2,
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
  useGetPharmacyMedicineCategories,
  useGetPharmacyMedicineCategoriesById,
  useAddPharmacyMedicineCategory,
  useUpdatePharmacyMedicineCategory,
  useDeletePharmacyMedicineCategory,
} from "@/queries";
import type {
  PharmacyMedicineCategory,
  AddPharmacyMedicineCategory,
  UpdatePharmacyMedicineCategory,
} from "@/types";
import { toast } from "react-toastify";

export default function ProductCategory() {
  const { data: categoriesData, refetch } = useGetPharmacyMedicineCategories();
  const { mutate: addCategory, isPending: isPendingAdd } =
    useAddPharmacyMedicineCategory();
  const { mutate: updateCategory } = useUpdatePharmacyMedicineCategory();
  const { mutate: deleteCategory } = useDeletePharmacyMedicineCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [, setEditingService] = useState<
    (AddPharmacyMedicineCategory & { id: number }) | null
  >(null);
  const [categoryFormData, setCategoryFormData] =
    useState<UpdatePharmacyMedicineCategory>({
      id: 0,
      name: "",
    });
  const [isEditCategoryServiceDialogOpen, setIsEditCategoryServiceDialogOpen] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [, setManagementCategories] = useState<PharmacyMedicineCategory[]>();

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );
  const {
    data: PharmacyDiagnosisByCategoryId,
    isLoading: isCategoryServicesLoading,
    isError: isCategoryServicesError,
  } = useGetPharmacyMedicineCategoriesById(expandedCategoryId ?? 0, {
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
              serviceCount: PharmacyDiagnosisByCategoryId.length,
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

  const openEditCategoryDialog = (
    PharmacyDiagnosisByCategoryId: PharmacyMedicineCategory
  ) => {
    setEditingService(PharmacyDiagnosisByCategoryId);
    setCategoryFormData({
      id: PharmacyDiagnosisByCategoryId.id,
      name: PharmacyDiagnosisByCategoryId.name,
    });
    setIsEditCategoryServiceDialogOpen(true);
  };

  // Sort and paginate categories
  const sortedAndPaginatedCategories = useMemo(() => {
    if (!categoriesData) return [];

    const sorted = [...categoriesData].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const filtered = sorted.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
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
          {sortedAndPaginatedCategories.map((category) => {
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
                          className="hover:bg-yellow-50 border-yellow-300 flex-shrink-0 bg-transparent"
                          onClick={() => {
                            if (PharmacyDiagnosisByCategoryId) {
                              openEditCategoryDialog(
                                PharmacyDiagnosisByCategoryId as PharmacyMedicineCategory
                              );
                              setEditingService(
                                PharmacyDiagnosisByCategoryId as PharmacyMedicineCategory
                              );
                              setCategoryFormData({
                                name: PharmacyDiagnosisByCategoryId.name,
                                id: PharmacyDiagnosisByCategoryId.id,
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
                          onClick={() => {
                            setIsLoading(true);
                            deleteCategory(
                              PharmacyDiagnosisByCategoryId?.id ?? 0,
                              {
                                onSuccess: () => {
                                  refetch();
                                  toast.success(
                                    "Service deleted successfully from category"
                                  );
                                  setIsLoading(false); // Stop loading
                                },
                                onError: (error: any) => {
                                  const errMsg = error?.response?.data?.message;
                                  toast.error(
                                    "Failed to delete service " + errMsg
                                  );
                                  setIsLoading(false); // Stop loading on error
                                },
                              }
                            );
                          }}
                        >
                          {isLoading ? (
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

          {/* Pagination Controls */}
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
                categoriesData &&
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

        <Dialog
          open={isEditCategoryServiceDialogOpen}
          onOpenChange={setIsEditCategoryServiceDialogOpen}
        >
          <DialogContent className="w-[95vw] max-w-[500px] mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Diagnosis Service in Category</DialogTitle>
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
                  onClick={() => setIsEditCategoryServiceDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsLoading(true); // Start loading

                    updateCategory(
                      {
                        categoryId: categoryFormData.id,
                        data: {
                          id: categoryFormData.id,
                          name: categoryFormData.name,
                        },
                      },
                      {
                        onSuccess: () => {
                          toast.success("Service updated successfully");
                          setIsLoading(false); // Stop loading
                          setIsEditCategoryServiceDialogOpen(false);
                          setCategoryFormData({ id: 0, name: "" });
                          refetch();
                        },
                        onError: (error: any) => {
                          const errMsg = error?.response?.data?.message;
                          toast.error("Failed to update service " + errMsg);
                          setIsLoading(false); // Stop loading on error
                        },
                      }
                    );
                  }}
                  className="flex-1 bg-green-700 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
