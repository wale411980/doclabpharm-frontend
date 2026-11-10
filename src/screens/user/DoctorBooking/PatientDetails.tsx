import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetUserProfile } from "@/queries";

export default function PatientDetailsForm() {
  const { doctorId } = useParams();
  const { data: userData, isLoading } = useGetUserProfile();

  const [searchParams] = useSearchParams();
  const slotId = searchParams.get("slot_id") || "";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleNext = () => {
    navigate(
      `/doctor/${doctorId}/consultation-type?slot_id=${slotId}&complaint=${patientData.complaint}`
    );
  };

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
            type="submit"
            className="w-full sm:w-auto bg-green-700 hover:bg-green-700"
            onClick={handleNext}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
