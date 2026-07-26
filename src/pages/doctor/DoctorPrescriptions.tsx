import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  useGetDoctorPrescriptions,
  useGetDoctorPrescriptionDetails,
  useCreateDoctorPrescription,
  useAddDoctorPrescriptionMedicine,
  useSearchMedicine,
} from "@/queries";
import type {
  GetDoctorPrescriptions,
  CreateDoctorPrescriptions,
  AddDoctorPrescription,
  Medicine,
} from "@/types";
import { toast } from "react-toastify";

export default function DoctorPrescriptions() {
  const {
    data: prescriptionsData,
    isLoading: isLoadingPrescriptions,
    refetch,
  } = useGetDoctorPrescriptions();

  const { mutate: createPrescription, isPending: isPendingPrescription } =
    useCreateDoctorPrescription();
  const {
    mutate: addPrescriptionMedicine,
    isPending: isPendingAddPrescription,
  } = useAddDoctorPrescriptionMedicine();

  const { mutate: searchMedicines } = useSearchMedicine();

  const [prescriptions, setPrescriptions] = useState<
    CreateDoctorPrescriptions[]
  >([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    number | null
  >(null);
  const {
    data: prescriptionDetailsData,
    isLoading,
    isError,
  } = useGetDoctorPrescriptionDetails(
    typeof selectedPrescriptionId === "number" ? selectedPrescriptionId : 0
  );

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState<number | null>(null);
  const [medicineSuggestions, setMedicineSuggestions] = useState<Medicine[]>(
    []
  );
  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // New prescription form state
  const [newPrescription, setNewPrescription] = useState<
    Partial<CreateDoctorPrescriptions>
  >({
    accountId: "",
    notes: "",
    patientName: "",
  });

  // Add prescription form state
  const [addPrescription, setAddPrescription] = useState<AddDoctorPrescription>(
    {
      medicineName: "",
      medicineId: 0,
      dosage: "",
      other: "",
      frequency: "",
      instructions: "",
    }
  );

  const filteredPrescriptions = (prescriptionsData ?? []).filter(
    (prescription) =>
      prescription?.user.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      prescription?.user.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const sortedPrescriptions = [...(filteredPrescriptions ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedPrescriptions.length / itemsPerPage);

  const paginatedPrescriptions = sortedPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading)
    return <div className="text-center">Loading prescription details...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load details.</div>
    );

  const handleViewPrescription = (prescription: GetDoctorPrescriptions) => {
    setSelectedPrescriptionId(prescription.id); // triggers fetch

    setIsDetailsOpen(true);
  };

  // write the function to create a new prescription

  const handleCreatePrescription = () => {
    createPrescription(
      { data: newPrescription as CreateDoctorPrescriptions },
      {
        onSuccess: () => {
          refetch();
          setIsNewPrescriptionOpen(false); // Close the dialog
          setNewPrescription({
            // Reset the form
            accountId: "",
            notes: "",
            patientName: "",
          });
          // Optionally, you can also trigger a refetch or show a success toast here
          toast.success("Prescription created successfully!");
        },
        onError: (error: any) => {
          // Optionally, show a user-facing error message or toast
          const errMsg = error?.response?.data?.message;
          toast.error(
            "Failed to create prescription. Please try again., " + errMsg
          );
        },
      }
    );
  };

  const resetAddPrescriptionForm = () => {
    setAddPrescription({
      medicineName: "",
      medicineId: 0,
      dosage: "",
      other: "",
      frequency: "",
      instructions: "",
    });
    setMedicineSuggestions([]);
  };

  // write the function to add prescription
  const handleAddPrescription = () => {
    const medicineIdToSend = addPrescription.medicineId || 0;

    addPrescriptionMedicine(
      {
        data: { ...addPrescription, medicineId: medicineIdToSend },
        prescriptionId: selectedPrescriptionId!,
      },
      {
        onSuccess: () => {
          toast.success("Medicine added successfully");
          resetAddPrescriptionForm();
          setIsAddPrescriptionOpen(false); // close dialog
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to add medicine. " + errMsg);
        },
      }
    );
  };

  const handleCancelPrescription = (id: number) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === Number(id)
          ? { ...prescription, status: "Completed" }
          : prescription
      )
    );
    setOptionsOpen(null);
  };

  if (isLoadingPrescriptions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      <div className="">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search prescriptions"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => setIsNewPrescriptionOpen(true)}
          >
            <Plus size={18} />
            <span>New Prescription</span>
          </Button>
        </div>

        <div className="bg-green-50 rounded-lg p-3 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-green-900 mb-4">
            Today's Prescription
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {paginatedPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg p-3 sm:p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border flex-shrink-0">
                      <img
                        src={
                          prescription.user.profileImage || "/placeholder.svg"
                        }
                        alt={`${prescription.user.firstName} ${prescription.user.lastName}`}
                      />
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {prescription.user.firstName}{" "}
                        {prescription.user.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {prescription.notes}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {prescription.status === "active" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs">
                        Completed
                      </Badge>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-7 bg-transparent"
                      onClick={() => {
                        setSelectedPrescriptionId(prescription.id); // set the current prescription ID
                        setIsAddPrescriptionOpen(true); // open dialog
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 h-7 bg-transparent"
                      onClick={() => handleViewPrescription(prescription)}
                    >
                      View
                    </Button>
                    <Popover
                      open={optionsOpen === prescription.id}
                      onOpenChange={(open) =>
                        setOptionsOpen(open ? prescription.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              // Toggle logic ensures button click sets the state correctly
                              setOptionsOpen(
                                optionsOpen === prescription.id
                                  ? null
                                  : prescription.id
                              );
                            }}
                          ></Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-32 p-0" align="end">
                        <div className="flex flex-col">
                          <button
                            className="px-4 py-2 text-left hover:bg-gray-100 text-green-800 font-medium text-sm"
                            onClick={() => {
                              // Handle edit
                              setOptionsOpen(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 text-left hover:bg-gray-100 text-red-500 font-medium text-sm"
                            onClick={() =>
                              handleCancelPrescription(prescription.id)
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No prescriptions found
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mt-4">
            <div>
              <DialogTitle className="text-lg sm:text-xl text-green-900 font-bold">
                Prescription Details
              </DialogTitle>
            </div>
            <div className="">
              <Badge
                className={
                  prescriptionDetailsData?.status === "active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {prescriptionDetailsData?.status}
              </Badge>
            </div>
          </div>

          {prescriptionDetailsData && (
            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-semibold">{`${prescriptionDetailsData?.user?.firstName} ${prescriptionDetailsData?.user?.lastName}`}</h3>
              <p className="text-gray-500 mt-2 mb-2 text-sm sm:text-base">
                Patient's Condition:
              </p>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                {prescriptionDetailsData?.notes}
              </p>

              {/* Mobile-friendly table */}
              <div className="mt-4">
                <div className="hidden sm:block">
                  <table className="w-full text-left text-sm border border-gray-200">
                    <thead className="bg-green-100 text-green-900 font-semibold">
                      <tr>
                        <th className="p-2 border-b">Medication</th>
                        <th className="p-2 border-b">Dosage</th>
                        <th className="p-2 border-b">Frequency</th>
                        <th className="p-2 border-b">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionDetailsData?.drugs?.map(
                        (drug: {
                          id: number;
                          dosage: string;
                          frequency: string;
                          instructions: string;
                          medicine?: {
                            name: string;
                          };
                        }) => (
                          <tr key={drug.id} className="border-t">
                            <td className="p-2">
                              {drug?.medicine?.name || "-"}
                            </td>
                            <td className="p-2">{drug?.dosage || "-"}</td>
                            <td className="p-2">{drug?.frequency || "-"}</td>
                            <td className="p-2">{drug?.instructions || "-"}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card layout */}
                <div className="sm:hidden space-y-3">
                  {prescriptionDetailsData?.drugs?.map(
                    (drug: {
                      id: number;
                      dosage: string;
                      frequency: string;
                      instructions: string;
                      medicine?: {
                        name: string;
                      };
                    }) => (
                      <div
                        key={drug.id}
                        className="bg-gray-50 rounded-lg p-3 border"
                      >
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                              Medication
                            </span>
                            <p className="text-sm">
                              {drug?.medicine?.name || "-"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                                Dosage
                              </span>
                              <p className="text-sm">{drug?.dosage || "-"}</p>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                                Frequency
                              </span>
                              <p className="text-sm">
                                {drug?.frequency || "-"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                              Notes
                            </span>
                            <p className="text-sm">
                              {drug?.instructions || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Prescription Dialog */}
      <Dialog
        open={isNewPrescriptionOpen}
        onOpenChange={setIsNewPrescriptionOpen}
      >
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-lg sm:text-xl text-green-900 font-bold">
              Create New Prescription
            </DialogTitle>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="patientName"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Patient Name
              </label>
              <Input
                id="patientName"
                value={newPrescription.patientName}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    patientName: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="accountId"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Patient Account ID
              </label>
              <Input
                id="accountId"
                value={newPrescription.accountId}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    accountId: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Patient's Condition
              </label>
              <Input
                id="notes"
                value={newPrescription.notes}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    notes: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNewPrescriptionOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto"
                onClick={handleCreatePrescription}
                disabled={isPendingPrescription}
              >
                {isPendingPrescription ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Prescription Dialog */}
      <Dialog
        open={isAddPrescriptionOpen}
        onOpenChange={setIsAddPrescriptionOpen}
      >
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-lg sm:text-xl text-green-900 font-bold">
              Add Prescription
            </DialogTitle>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="medicineName"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Medication
              </label>
              <Input
                id="medicineName"
                value={addPrescription.medicineName}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddPrescription({
                    ...addPrescription,
                    medicineName: value,
                    medicineId: 0, // reset to 0 when user is typing freely
                  });

                  if (value.length >= 2) {
                    searchMedicines(
                      { query: value },
                      {
                        onSuccess: (data: Medicine[]) => {
                          setMedicineSuggestions(data);
                        },
                        onError: () => {
                          setMedicineSuggestions([]);
                        },
                      }
                    );
                  } else {
                    setMedicineSuggestions([]);
                  }
                }}
                className="w-full"
              />
              {medicineSuggestions.length > 0 && (
                <div className="border rounded-md bg-white shadow-sm mt-1 max-h-40 overflow-y-auto z-10 relative">
                  {medicineSuggestions.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="px-3 py-2 hover:bg-green-100 cursor-pointer text-sm"
                      onClick={() => {
                        setAddPrescription({
                          ...addPrescription,
                          medicineName: medicine.name,
                          medicineId: medicine.id, // set id here
                        });
                        setMedicineSuggestions([]);
                      }}
                    >
                      {medicine.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="dosage"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Dosage
              </label>
              <Input
                id="dosage"
                value={addPrescription.dosage}
                onChange={(e) =>
                  setAddPrescription({
                    ...addPrescription,
                    dosage: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Frequency
              </label>
              <Input
                id="frequency"
                placeholder="eg., Once Daily"
                value={addPrescription.frequency}
                onChange={(e) =>
                  setAddPrescription({
                    ...addPrescription,
                    frequency: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-green-800 mb-1"
              >
                Note (Optional)
              </label>
              <Input
                id="instructions"
                value={addPrescription.instructions}
                onChange={(e) =>
                  setAddPrescription({
                    ...addPrescription,
                    instructions: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  resetAddPrescriptionForm();
                  setIsAddPrescriptionOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                className="bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto"
                onClick={() => {
                  handleAddPrescription();
                  setIsAddPrescriptionOpen(false); // close after submit
                }}
                disabled={isPendingAddPrescription}
              >
                {isPendingAddPrescription
                  ? "Creating..."
                  : "Create Prescription"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
