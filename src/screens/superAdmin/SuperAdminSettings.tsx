import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  DollarSign,
  UserCheck,
  Stethoscope,
  Pill,
  FlaskConical,
  Edit3,
  Clock,
  Shield,
} from "lucide-react";
import {
  useSuperAdminSettingsList,
  useSuperAdminSettingsUpdate,
} from "@/queries";
import type { SuperAdminSettingsList, SuperAdminSettingsUpdate } from "@/types";
import { toast } from "react-toastify";

export default function SuperAdminSettings() {
  const [currentData, setCurrentData] = useState<SuperAdminSettingsList>({
    adminCommission: "0",
    doctorCommission: "0",
    pharmacyCommission: "0",
    doctorAppointmentDuration: "0",
    labTechnicianCommission: "0",
    doctorRegistrationEnabled: "0",
    pharmacyRegistrationEnabled: "0",
    labTechnicianRegistrationEnabled: "0",
  });

  const [formData, setFormData] = useState<SuperAdminSettingsUpdate>(() => ({
    adminCommission: 0,
    doctorCommission: 0,
    pharmacyCommission: 0,
    doctorAppointmentDuration: 0,
    labTechnicianCommission: 0,
    doctorRegistrationEnabled: 0,
    pharmacyRegistrationEnabled: 0,
    labTechnicianRegistrationEnabled: 0,
  }));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: updateSettings, isPending: isUpdating } =
    useSuperAdminSettingsUpdate();

  const { data: settings, isLoading, refetch } = useSuperAdminSettingsList();

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setCurrentData(settings);
      setFormData({
        adminCommission: parseFloat(settings.adminCommission),
        doctorCommission: parseFloat(settings.doctorCommission),
        pharmacyCommission: parseFloat(settings.pharmacyCommission),
        doctorAppointmentDuration: parseInt(settings.doctorAppointmentDuration),
        labTechnicianCommission: parseFloat(settings.labTechnicianCommission),
        doctorRegistrationEnabled: parseInt(settings.doctorRegistrationEnabled),
        pharmacyRegistrationEnabled: parseInt(
          settings.pharmacyRegistrationEnabled
        ),
        labTechnicianRegistrationEnabled: parseInt(
          settings.labTechnicianRegistrationEnabled
        ),
      });
    }
  }, [settings]);

  const formatCommission = (value: number | undefined) =>
    typeof value === "number" ? `${(value * 100).toFixed(1)}%` : "--";

  const handleInputChange = (
    field: keyof SuperAdminSettingsUpdate,
    value: number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "boolean" ? (value ? 1 : 0) : value,
    }));
  };

  const handleSave = () => {
    updateSettings(formData, {
      onSuccess: () => {
        toast.success("Settings updated successfully");
        refetch();
        // Convert number values back to string for currentData
        setCurrentData({
          adminCommission: formData.adminCommission.toString(),
          doctorCommission: formData.doctorCommission.toString(),
          pharmacyCommission: formData.pharmacyCommission.toString(),
          doctorAppointmentDuration:
            formData.doctorAppointmentDuration.toString(),
          labTechnicianCommission: formData.labTechnicianCommission.toString(),
          doctorRegistrationEnabled:
            formData.doctorRegistrationEnabled.toString(),
          pharmacyRegistrationEnabled:
            formData.pharmacyRegistrationEnabled.toString(),
          labTechnicianRegistrationEnabled:
            formData.labTechnicianRegistrationEnabled.toString(),
        });
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message;
        toast.error("Failed to update settings. " + errMsg);
        // Optionally show toast/error here
      },
    });
  };

  const registrationSettings = [
    {
      title: "Doctor Registration",
      enabled: currentData.doctorRegistrationEnabled === "1",
      icon: Stethoscope,
      description: "Allow new doctor registrations",
    },
    {
      title: "Pharmacy Registration",
      enabled: currentData.pharmacyRegistrationEnabled === "1",
      icon: Pill,
      description: "Allow new pharmacy registrations",
    },
    {
      title: "Lab Technician Registration",
      enabled: currentData.labTechnicianRegistrationEnabled === "1",
      icon: FlaskConical,
      description: "Allow new lab technician registrations",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  System Settings
                </h1>
                <p className="text-gray-600">
                  Manage commission rates and registration settings
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Update System Settings</DialogTitle>
                  <DialogDescription>
                    Modify commission rates and registration settings for the
                    platform.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Commission Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Commission Rates
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminCommission">
                          Admin Commission (%)
                        </Label>
                        <Input
                          id="adminCommission"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.adminCommission}
                          onChange={(e) =>
                            handleInputChange(
                              "adminCommission",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="doctorCommission">
                          Doctor Commission (%)
                        </Label>
                        <Input
                          id="doctorCommission"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.doctorCommission}
                          onChange={(e) =>
                            handleInputChange(
                              "doctorCommission",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pharmacyCommission">
                          Pharmacy Commission (%)
                        </Label>
                        <Input
                          id="pharmacyCommission"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.pharmacyCommission}
                          onChange={(e) =>
                            handleInputChange(
                              "pharmacyCommission",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labTechnicianCommission">
                          Lab Technician Commission (%)
                        </Label>
                        <Input
                          id="labTechnicianCommission"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.labTechnicianCommission}
                          onChange={(e) =>
                            handleInputChange(
                              "labTechnicianCommission",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Appointment Duration */}
                  {formData.doctorAppointmentDuration !== undefined && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Appointment Settings
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="doctorAppointmentDuration">
                            Doctor Appointment Duration (minutes)
                          </Label>
                          <Input
                            id="doctorAppointmentDuration"
                            type="number"
                            min="5"
                            max="120"
                            value={formData.doctorAppointmentDuration}
                            onChange={(e) =>
                              handleInputChange(
                                "doctorAppointmentDuration",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Registration Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Registration Settings
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="doctorRegistration">
                            Doctor Registration
                          </Label>
                          <p className="text-sm text-gray-500">
                            Allow new doctors to register
                          </p>
                        </div>
                        <Switch
                          id="doctorRegistration"
                          checked={formData.doctorRegistrationEnabled === 1}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "doctorRegistrationEnabled",
                              checked
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="pharmacyRegistration">
                            Pharmacy Registration
                          </Label>
                          <p className="text-sm text-gray-500">
                            Allow new pharmacies to register
                          </p>
                        </div>
                        <Switch
                          id="pharmacyRegistration"
                          checked={formData.pharmacyRegistrationEnabled === 1}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "pharmacyRegistrationEnabled",
                              checked
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="labRegistration">
                            Lab Technician Registration
                          </Label>
                          <p className="text-sm text-gray-500">
                            Allow new lab technicians to register
                          </p>
                        </div>
                        <Switch
                          id="labRegistration"
                          checked={
                            formData.labTechnicianRegistrationEnabled === 1
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "labTechnicianRegistrationEnabled",
                              checked
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Commission Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Commission Rates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow py-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {formatCommission(Number(settings?.adminCommission))}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Admin Commission</CardTitle>
                <CardDescription>Commission rate for admin</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow py-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {formatCommission(Number(settings?.doctorCommission))}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">
                  Doctor Commission
                </CardTitle>
                <CardDescription>Commission rate for doctors</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow py-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {formatCommission(Number(settings?.pharmacyCommission))}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">
                  Pharmacy Commission
                </CardTitle>
                <CardDescription>
                  Commission rate for pharmacies
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow py-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <FlaskConical className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {formatCommission(
                      Number(settings?.labTechnicianCommission)
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">
                  Lab Technician Commission
                </CardTitle>
                <CardDescription>
                  Commission rate for lab technicians
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointment Duration */}
        {currentData.doctorAppointmentDuration && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Appointment Settings
            </h2>
            <Card className="hover:shadow-md transition-shadow py-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {currentData.doctorAppointmentDuration} min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">
                  Doctor Appointment Duration
                </CardTitle>
                <CardDescription>
                  Default duration for doctor appointments
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Registration Settings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Registration Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrationSettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow py-4"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge
                        variant={setting.enabled ? "default" : "secondary"}
                        className={
                          setting.enabled
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                      >
                        {setting.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-1">
                      {setting.title}
                    </CardTitle>
                    <CardDescription>{setting.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
