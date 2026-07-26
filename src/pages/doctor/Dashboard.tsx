import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  MessageSquare,
  CreditCard,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetDoctorStats,
  useGetDoctorRecentAppointments,
  useGetDoctorRecentMessages,
  useGetDoctorRecentUsers,
  useSendDeviceToken,
} from "@/queries";
import type {
  DoctorRecentAppointments,
  DoctorRecentMessages,
  DoctorRecentUser,
} from "@/types";
import { useNavigate } from "react-router-dom";
import { requestDeviceToken } from "@/lib/getDeviceToken";
import { toast } from "react-toastify";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const { data: stats } = useGetDoctorStats();

  const {
    data: doctorRecentAppointments,
    isLoading,
    error,
  } = useGetDoctorRecentAppointments();

  const {
    data: doctorRecentMessages,
    isLoading: isLoadingMessages,
    error: errorMessages,
  } = useGetDoctorRecentMessages();

  const {
    data: doctorRecentUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useGetDoctorRecentUsers();

  const { user } = useAuth();

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
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-green-800 text-base font-medium">
          Welcome back, Dr. {`${user?.lastName} ${user?.firstName}`}. Here's
          what's happening today.
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-emerald-700 text-white border-none overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="h-6 w-6" />
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-4xl font-bold">{stats?.totalPatients}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-emerald-800 text-white border-none overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Appointments Today
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-4xl font-bold">{stats?.appointmentToday}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-emerald-700 text-white border-none overflow-hidden flex-1">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-4xl font-bold">{stats?.unread}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 flex"
        >
          <Card className="bg-emerald-800 text-white border-none overflow-hidden flex-1">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-xs mb-1">Your earnings from consultations</p>
              <p className="text-4xl font-bold">₦ {stats?.balance}</p>
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-4 flex justify-between items-center text-sm">
              <p>Click here to view all transactions</p>
              <Button
                size="sm"
                variant="ghost"
                className="p-0 h-8 w-8 rounded-full hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Recent's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-base font-medium text-gray-800">
              Recent's Appointments
            </h2>
          </div>
          <div className="h-4"></div>

          <div className="space-y-3">
            {isLoading && (
              <p className="text-sm text-gray-500">Loading appointments...</p>
            )}
            {error && (
              <p className="text-sm text-red-500">
                Error loading appointments.
              </p>
            )}
            {doctorRecentAppointments?.length === 0 && (
              <p className="text-sm text-gray-500">No recent appointments.</p>
            )}

            {doctorRecentAppointments?.map(
              (appointments: DoctorRecentAppointments, index) => {
                const date = new Date(appointments.slot.availableDate);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");

                const statusStyles = {
                  scheduled: "bg-green-50 text-green-700 border-green-200",
                  cancelled: "bg-red-50 text-red-700 border-red-200",
                  completed: "bg-blue-50 text-blue-700 border-blue-200",
                };

                return (
                  <motion.div
                    key={appointments.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-md p-2 min-w-[40px]">
                      <span className="text-xs text-gray-500 uppercase">
                        {month}
                      </span>
                      <span className="text-lg font-bold text-gray-700">
                        {day}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm">
                        {appointments.user.firstName}{" "}
                        {appointments.user.lastName}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {appointments.message}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointments.slot.availableTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${
                          statusStyles[
                            appointments.status as keyof typeof statusStyles
                          ] || "bg-gray-50 text-gray-600 border-gray-200"
                        } text-[10px] px-2 py-0 h-5 rounded-full`}
                      >
                        {appointments.status.charAt(0).toUpperCase() +
                          appointments.status.slice(1)}
                      </Badge>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full mt-4 bg-green-100 text-black cursor-pointer hover:text-gray-800 hover:bg-green-700 text-sm"
            onClick={() => navigate("/doctor/appointments")}
          >
            View all appointments
          </Button>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-base font-medium text-gray-800">
              Recent Messages
            </h2>
          </div>
          <div className="h-4"></div>

          <div className="space-y-3">
            {isLoadingMessages && (
              <p className="text-sm text-gray-500">Loading messages...</p>
            )}
            {errorMessages && (
              <p className="text-sm text-red-500">Error loading messages.</p>
            )}
            {doctorRecentMessages?.length === 0 && (
              <p className="text-sm text-gray-500">No recent messages.</p>
            )}

            {doctorRecentMessages?.map(
              (recentMessages: DoctorRecentMessages) => (
                <motion.div
                  key={recentMessages.conversationId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                  className="flex gap-3 p-2 rounded-md hover:bg-gray-50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                      {recentMessages?.contactName
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800 text-sm">
                        {recentMessages?.contactName}
                      </h3>
                      <span className="text-[10px] text-gray-500">
                        {recentMessages?.lastMessageTime
                          ?.split(" ")[1]
                          ?.slice(0, 5)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {recentMessages?.lastMessage}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full mt-4 bg-green-100 cursor-pointer text-black hover:text-gray-800 hover:bg-green-700 text-sm"
            onClick={() => navigate("/doctor/messages")}
          >
            View all
          </Button>
        </motion.div>
      </div>

      {/* Recent Patients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-lg shadow-sm p-4 mt-4"
      >
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-base font-medium text-gray-800">
            Recent Patients
          </h2>
        </div>
        <div className="h-4"></div>

        <div className="space-y-3">
          {isLoadingUsers && (
            <p className="text-sm text-gray-500">Loading patients...</p>
          )}
          {errorUsers && (
            <p className="text-sm text-red-500">Error loading patients.</p>
          )}
          {doctorRecentUsers?.length === 0 && (
            <p className="text-sm text-gray-500">No recent patients.</p>
          )}

          {doctorRecentUsers?.map((recentUser: DoctorRecentUser) => (
            <motion.div
              key={recentUser.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                  {`${recentUser?.user?.firstName} ${recentUser?.user?.lastName}`
                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm">{`${recentUser?.user?.firstName} ${recentUser?.user?.lastName}`}</h3>
                <p className="text-xs text-gray-600">
                  {recentUser?.user?.age} years • {recentUser?.message}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0 h-5 rounded-full ${
                    status === "active"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  }`}
                >
                  {status === "active" ? "Active" : "Completed"}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-4 bg-green-100 cursor-pointer text-black hover:text-gray-800 hover:bg-green-700 text-sm"
          onClick={() => navigate("/doctor/patients")}
        >
          View all patients
        </Button>
      </motion.div>

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
    </div>
  );
}
