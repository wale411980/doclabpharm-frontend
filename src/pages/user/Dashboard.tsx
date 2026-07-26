import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Nurse from "@/assets/nurse-book.png";
import Drugs from "@/assets/Essential-drug.png";
import { useAuth } from "@/hooks/useAuth";
import AvailableDoctors from "./DoctorBooking/AvailableDoctors";
import { Calendar, ArrowRight, FileText, Clock, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  useGetUserAppointments,
  useGetUserReport,
  useUserVitals,
  useGetUserVitals,
  useSendDeviceToken,
} from "@/queries";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { requestDeviceToken } from "@/lib/getDeviceToken";

export default function HealthDashboard() {
  const navigate = useNavigate();

  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [pendingType, setPendingType] = useState<
    "booking" | "consultation" | null
  >(null);

  useEffect(() => {
    const pendingBooking = localStorage.getItem("PendingBookingConsultation");
    const pendingConsultation = localStorage.getItem("pendingConsultation");

    if (pendingBooking) {
      setPendingType("booking");
      setShowPendingDialog(true);
    } else if (pendingConsultation) {
      setPendingType("consultation");
      setShowPendingDialog(true);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const { user } = useAuth();
  const [showDoctors] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heightCm: "",
    weightKg: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedVitals, setEditedVitals] = useState({ ...vitals });
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const { data: getUserVitals } = useGetUserVitals();

  const { mutate: sendDeviceToken } = useSendDeviceToken();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const askForNotification = async () => {
        const alreadyAsked = localStorage.getItem(
          "notificationPermissionAsked"
        );
        const existingToken = localStorage.getItem("deviceToken");

        if (!alreadyAsked && !existingToken) {
          const token = await requestDeviceToken();

          if (token) {
            try {
              await sendDeviceToken({
                deviceToken: token,
                deviceType: "web",
              });

              localStorage.setItem("deviceToken", token);
              localStorage.setItem("deviceType:", "web");
              toast.success("Push notifications enabled!", {
                position: "top-right",
              });
            } catch (err) {
              console.error("Failed to send token to backend", err);
              toast.error("Could not register for notifications", {
                position: "top-right",
              });
            }
          } else {
            toast.info("Push notification permission was not granted", {
              position: "top-right",
            });
          }

          localStorage.setItem("notificationPermissionAsked", "true");
        }
      };

      askForNotification();
    }, 9000); // 9 seconds delay

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const alreadyAsked = localStorage.getItem("notificationPermissionAsked");
    const existingToken = localStorage.getItem("deviceToken");

    if (!alreadyAsked && !existingToken) {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowNotifications = async () => {
    setShowNotificationPrompt(false);

    try {
      const token = await requestDeviceToken();
      if (token) {
        await sendDeviceToken({
          deviceToken: token,
          deviceType: "web",
        });
        localStorage.setItem("deviceToken", token);
        localStorage.setItem("deviceType:", "web");
        toast.success("Push notifications enabled!", { position: "top-right" });
      } else {
        toast.info("Notification permission was denied.", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Notification setup failed", err);
      toast.error("Failed to enable notifications", { position: "top-right" });
    }

    localStorage.setItem("notificationPermissionAsked", "true");
  };

  const handleDeclineNotifications = () => {
    setShowNotificationPrompt(false);
    localStorage.setItem("notificationPermissionAsked", "true");
  };

  useEffect(() => {
    if (getUserVitals) {
      setVitals({
        bloodPressure: getUserVitals.bloodPressure || "",
        heightCm: getUserVitals.heightCm || "",
        weightKg: getUserVitals.weightKg || "",
      });
    }
  }, [getUserVitals]);

  const { data: userAppointments, isLoading } = useGetUserAppointments();
  const { data: userReport } = useGetUserReport();
  const { mutate: userVitals } = useUserVitals();

  if (!userAppointments || !userReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleSaveVitals = () => {
    userVitals(
      {
        bloodPressure: editedVitals.bloodPressure,
        heightCm: editedVitals.heightCm,
        weightKg: editedVitals.weightKg,
      },
      {
        onSuccess: () => {
          setVitals(editedVitals);
          setIsEditModalOpen(false);
          toast.success("Vitals updated successfully!", {
            position: "top-right",
          });
        },
        onError: (error) => {
          console.error("Failed to update vitals:", error);
          toast.error("Failed to update vitals. Please try again.", {
            position: "top-right",
          });
        },
      }
    );
  };

  const handleInputChange = (
    field: keyof typeof editedVitals,
    value: string
  ) => {
    setEditedVitals((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (showDoctors) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AvailableDoctors />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <motion.div
        className="flex flex-col space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium text-emerald-700">
              Welcome 👋, {`${user?.firstName} ${user?.lastName}`}.
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-emerald-700 text-emerald-700 text-xl font-bold"
              onClick={() => navigate("/doctor/select")}
            >
              <Calendar className="h-4 w-4" />
              Book Appointments
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 flex items-center gap-2 text-xl font-bold"
              onClick={() => navigate("/patient/booking/select-test")}
            >
              Book a Test
            </Button>
          </div>
        </motion.div>

        {/* cards for patient details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className={cn("pb-2 pt-4 bg-green-700")}>
                <h3 className="text-lg font-medium text-white">
                  Blood Pressure
                </h3>
                <p className="text-sm text-green-100">Last measured: Today</p>
              </CardHeader>

              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold">0/0</div>
                    <div
                      className={cn("mt-1 text-sm font-medium text-green-700")}
                    >
                      No data
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full bg-green-700"
                    )}
                  >
                    <Heart className="h-10 w-10 text-white" />
                  </motion.div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between bg-slate-50 p-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                ></Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className={cn("pb-2 pt-4 bg-teal-900")}>
                <h3 className="text-lg font-medium text-white">Pulse</h3>
                <p className="text-sm text-green-100">Last measured: Today</p>
              </CardHeader>

              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold">0</div>
                    <div
                      className={cn("mt-1 text-sm font-medium text-green-700")}
                    >
                      No data
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full bg-teal-900"
                    )}
                  >
                    <svg
                      className="h-10 w-10 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 12H5L9 4L15 20L19 12H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between bg-slate-50 p-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                ></Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className={cn("pb-2 pt-4 bg-green-700")}>
                <h3 className="text-lg font-medium text-white">
                  Daily Activity
                </h3>
                <p className="text-sm text-green-100">Today's progress</p>
              </CardHeader>

              <CardContent className="p-2">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Steps</span>
                      <span className="text-sm font-medium">0 / 0</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Water intake</span>
                      <span className="text-sm font-medium">0 / 0L</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between bg-slate-50 p-4">
                <span className="text-sm font-medium">Stable</span>
                <span className="text-sm font-medium">History</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                ></Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Appointments and Test Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Appointments */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-100 h-full flex flex-col py-5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-700" />
                  <h3 className="text-lg font-medium">Upcoming Appointments</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Your scheduled appointments
                </p>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                {userAppointments
                  ?.filter((appt) => appt.status !== "cancelled")
                  .sort(
                    (a, b) =>
                      new Date(a.slot.availableDate).getTime() -
                      new Date(b.slot.availableDate).getTime()
                  )
                  .slice(0, 2)
                  .map((appt) => {
                    const dateObj = new Date(appt?.slot?.availableDate);
                    const month = dateObj
                      .toLocaleString("default", { month: "short" })
                      .toUpperCase();
                    const day = dateObj.getDate();

                    return (
                      <div
                        key={appt?.id}
                        className="flex flex-col sm:flex-row items-start gap-4 bg-white p-4 rounded-md"
                      >
                        <div className="bg-emerald-100 p-2 rounded text-center min-w-[60px] mb-2 sm:mb-0">
                          <div className="text-xs text-emerald-700 font-medium">
                            {month}
                          </div>
                          <div className="text-lg font-bold text-emerald-800">
                            {day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{`Dr. ${appt?.doctor?.firstName} ${appt?.doctor.lastName}`}</h4>
                          <p className="text-sm text-gray-600">
                            {appt?.consultation?.name}
                          </p>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {appt.slot.availableTime}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-emerald-700"
                        ></Button>
                      </div>
                    );
                  })}
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => navigate("/user/appointments")}
                >
                  View all appointments
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Recent Test Results */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-100 h-full flex flex-col py-5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-700" />
                  <h3 className="text-lg font-medium">Recent Test Results</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Your latest test results
                </p>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                {userReport
                  ?.sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  ) // Sort by date descending
                  .slice(0, 2) // Take first two
                  .map((result, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start gap-4 bg-white p-4 rounded-md"
                    >
                      <div className="bg-emerald-100 p-2 rounded text-center min-w-[60px] mb-2 sm:mb-0 flex items-center justify-center h-[60px]">
                        <FileText className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{result.diagnosis}</h4>
                        <p className="text-sm text-gray-600">
                          {result.summary}
                        </p>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(result.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-emerald-700"
                      ></Button>
                    </div>
                  ))}
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => navigate("/user/results")}
                >
                  View all Test
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Speak with a Doctor */}
          <motion.div variants={itemVariants}>
            <Card className="bg-emerald-700 text-white overflow-hidden h-full flex flex-col py-5">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Speak with a Doctor</h3>
              </CardHeader>
              <CardContent className="pb-0 flex-grow">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="text-sm">
                      {" "}
                      Connect with expert doctors across all specialties and get
                      trusted medical advice tailored to your needs.
                    </div>
                  </div>
                  <div className="ml-auto">
                    <img src={Nurse} alt="nurse" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 mt-auto">
                <span className="text-white hover:text-teal-100 cursor-pointer">
                  Connect
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-emerald-600/50 hover:bg-emerald-600 text-white"
                  onClick={() => navigate("/doctor/select")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Speak with Pharmacist */}
          <motion.div variants={itemVariants}>
            <Card className="bg-emerald-700 text-white overflow-hidden h-full flex flex-col py-5">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">
                  Speak with a Lab Technician
                </h3>
              </CardHeader>
              <CardContent className="pb-0 flex-grow">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="text-sm">
                      Get information about your medications
                    </div>
                  </div>
                  <div className="ml-auto">
                    <img src={Drugs} alt="Drug" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 mt-auto">
                <span className="text-white hover:text-teal-100 cursor-pointer">
                  Book Now!
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-emerald-600/50 hover:bg-emerald-600 text-white"
                  onClick={() => navigate("/patient/booking/select-test")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Order Medication */}
          <motion.div variants={itemVariants}>
            <Card className="bg-teal-900 text-white overflow-hidden h-full flex flex-col py-5">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Order Medication</h3>
              </CardHeader>
              <CardContent className="pb-0 flex-grow">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="text-sm">
                      Refill your prescriptions online
                    </div>
                  </div>
                  <div className="ml-auto">
                    <img src={Drugs} alt="Drug" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 mt-auto">
                <span className="text-white hover:text-teal-100 cursor-pointer">
                  Order Now!
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-teal-800/50 hover:bg-teal-800 text-white"
                  onClick={() => navigate("/user/pharmacy")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Vitals Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-green-800">
              Edit Current Vitals
            </DialogTitle>
            <DialogDescription>
              Update your current health measurements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="bloodPressure"
                className="text-right font-medium text-green-800"
              >
                Blood Pressure
              </label>
              <Input
                id="bloodPressure"
                value={editedVitals.bloodPressure}
                onChange={(e) =>
                  handleInputChange("bloodPressure", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="heightCm"
                className="text-right font-medium text-green-800"
              >
                Height (cm)
              </label>
              <Input
                id="heightCm"
                value={editedVitals.heightCm}
                onChange={(e) => handleInputChange("heightCm", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="weightKg"
                className="text-right font-medium text-green-800"
              >
                Weight (kg)
              </label>
              <Input
                id="weightKg"
                value={editedVitals.weightKg}
                onChange={(e) => handleInputChange("weightKg", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleSaveVitals}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNotificationPrompt}
        onOpenChange={setShowNotificationPrompt}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg text-green-800">
              Enable Notifications?
            </DialogTitle>
            <DialogDescription>
              Please allow notifications to receive messages and video calls.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeclineNotifications}>
              Not Now
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleAllowNotifications}
            >
              Allow Notifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPendingDialog}
        onOpenChange={(open) => {
          if (!open) {
            localStorage.removeItem("PendingBookingConsultation");
            localStorage.removeItem("pendingBooking");
            localStorage.removeItem("pendingConsultation");
            setShowPendingDialog(false);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg text-green-800">
              Pending Consultation
            </DialogTitle>
            <DialogDescription>
              You have a pending consultation booking that hasn't been
              completed. Would you like to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("PendingBookingConsultation");
                localStorage.removeItem("pendingBooking");
                localStorage.removeItem("pendingConsultation");
                setShowPendingDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={() => {
                if (pendingType === "booking") {
                  navigate("/user/confirmation");
                } else if (pendingType === "consultation") {
                  navigate("/user/confirm-consult");
                }
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
