import { useState } from "react";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
];

export default function SelectDateTime() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

  // Get data from URL params
  const labData = {
    id: searchParams.get("labId") || "",
    name: searchParams.get("labName") || "",
    address: searchParams.get("labAddress") || "",
    rating: Number.parseFloat(searchParams.get("labRating") || "0"),
    distance: searchParams.get("labDistance") || "",
  };

  const testData = {
    id: searchParams.get("testId") || "",
    name: searchParams.get("testName") || "",
    price: Number.parseInt(searchParams.get("testPrice") || "0"),
    duration: searchParams.get("testDuration") || "",
    description: searchParams.get("testDescription") || "",
    preparation: searchParams.get("testPreparation") || "",
  };

  const renderProgressSteps = () => {
    const steps = [
      { id: "test-selection", label: "Select Test", active: false },
      { id: "date-time", label: "Select Date & Time", active: true },
      { id: "confirmation", label: "Confirm", active: false },
    ];

    return (
      <div className="mb-6 sm:mb-8">
        {/* Mobile: Vertical layout */}
        <div className="flex flex-col sm:hidden space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  step.active
                    ? "bg-green-600 text-white"
                    : "bg-green-200 text-green-700"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  step.active ? "text-green-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden sm:flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.active
                    ? "bg-green-600 text-white"
                    : "bg-green-200 text-green-700"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step.active ? "text-green-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 lg:w-12 h-0.5 bg-green-200 mx-2 lg:mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleContinue = () => {
    if (!selectedDate) {
      setError("Please select an appointment date.");
      return;
    }
    if (!selectedTime) {
      setError("Please select an appointment time.");
      return;
    }
    setError(""); // Clear error if both fields are filled

    const params = new URLSearchParams({
      // Lab data
      labId: labData.id,
      // Test data
      testId: testData.id,
      testName: testData.name,
      testPrice: testData.price.toString(),
      // Date/Time data
      selectedDate: selectedDate,
      selectedTime: selectedTime,
    });

    navigate(`/patient/booking/confirm?${params.toString()}`);
  };

  const handlePrevious = () => {
    const params = new URLSearchParams({
      labId: labData.id,
      labName: labData.name,
      labAddress: labData.address,
      labRating: labData.rating.toString(),
      labDistance: labData.distance,
    });
    navigate(`/patient/booking/select-test?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-green-100/50 border-green-200">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Test Booking
            </h1>

            {renderProgressSteps()}

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Select Date & Time
            </h2>

            {/* Date and Time Selection */}
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              {/* Appointment Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <DatePicker
                    selected={selectedDate ? new Date(selectedDate) : null}
                    onChange={(date) =>
                      setSelectedDate(format(date as Date, "yyyy-MM-dd"))
                    }
                    minDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy"
                    className="pl-10 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Appointment Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Time
                </label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full bg-white border-gray-300 text-sm sm:text-base">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Test Information */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Test Information
              </h3>
              <Card className="bg-green-200/30 border-green-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Test Name
                      </p>
                      <p className="text-sm sm:text-base text-gray-900">
                        {testData.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Price
                      </p>
                      <p className="text-sm sm:text-base text-gray-900">
                        ₦{testData.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white order-1 sm:order-2"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
