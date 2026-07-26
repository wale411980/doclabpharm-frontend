import type React from "react";
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUserProfile, useSendDeviceToken } from "@/queries";
import { requestDeviceToken } from "@/lib/getDeviceToken";
import { toast } from "react-toastify";

export default function PatientDetailsLandingPage() {
  //  const { doctorId } = useParams();
  const { data: userData, isLoading } = useGetUserProfile();

  const { mutate: sendDeviceToken } = useSendDeviceToken();

  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

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

  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    fullName: "",
    age: "",
    gender: "",
    complaint: "",
    urgency: "",
  });

  useEffect(() => {
    if (userData?.data) {
      const { firstName, lastName, gender, age } = userData.data;
      setPatientData((prev) => ({
        ...prev,
        fullName: `${firstName} ${lastName}`,
        age: age?.toString(),
        gender: gender,
      }));
    }
  }, [userData]);

  useEffect(() => {
    const pending = localStorage.getItem("pendingBooking");
    if (pending) {
      setPatientData((prev) => ({
        ...prev,
      }));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // updateBooking(patientData)
    navigate("/user/consultation");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="w-full py-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0A3A40]">
            Patient Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#0A3A40] font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={patientData.fullName}
                onChange={handleInputChange}
                className="bg-gray-100"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-[#0A3A40] font-medium">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                value={patientData.age}
                onChange={handleInputChange}
                className="bg-gray-100"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-[#0A3A40] font-medium">
                Gender
              </Label>
              <div className="pointer-events-none opacity-70">
                <Select value={patientData.gender}>
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {patientData.gender === "male"
                          ? "Male"
                          : patientData.gender === "female"
                          ? "Female"
                          : "Gender not specified"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint" className="text-[#0A3A40] font-medium">
                Write your complaint
              </Label>
              <Textarea
                id="complaint"
                name="complaint"
                value={patientData.complaint}
                onChange={handleInputChange}
                className="min-h-[150px] bg-gray-100"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"></div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              const pending = JSON.parse(
                localStorage.getItem("pendingBooking") || "{}"
              );

              const updatedBooking = {
                ...pending,
                complaint: patientData.complaint,
                consultation_type: "physical",
              };

              localStorage.setItem(
                "pendingBooking",
                JSON.stringify(updatedBooking)
              );
              navigate("/user/confirmation");
            }}
            className="w-full sm:w-auto bg-green-700 hover:bg-green-600 text-white"
          >
            Continue Booking
          </Button>
        </CardFooter>
      </Card>

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
