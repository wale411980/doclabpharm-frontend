"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  AlertTriangle,
  MapPin,
  Star,
  ChevronRight,
  Calendar,
  Check,
  CreditCard,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Test {
  id: number;
  name: string;
  price: number;
  description: string;
  duration: string;
  preparation: string;
  category: string;
}

interface Laboratory {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
}

export default function TestBooking() {
  const [activeTab, setActiveTab] = useState("blood-test");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("05-03-2024");
  const [appointmentTime, setAppointmentTime] = useState("10:00 AM");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingReference] = useState("BOOK-12345");

  const tests: Test[] = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      price: 3500,
      description:
        "Measures various components of blood including red and white blood cells, platelets, and hemoglobin.",
      duration: "15 minutes",
      preparation: "No special preparation is usually needed.",
      category: "blood-test",
    },
    {
      id: 2,
      name: "Basic Metabolic Panel",
      price: 7500,
      description:
        "Measures glucose, calcium, and electrolyte levels, as well as kidney function.",
      duration: "15 Minutes",
      preparation: "No special preparation is usually needed.",
      category: "blood-test",
    },
    {
      id: 3,
      name: "Lipid Profile",
      price: 3500,
      description:
        "Measures the amount of specific fat molecules in the blood to assess risk of disease.",
      duration: "48 hours",
      preparation: "No special preparation is usually needed.",
      category: "blood-test",
    },
    {
      id: 4,
      name: "Complete Blood Count (CBC)",
      price: 3500,
      description:
        "Measures various components of blood including red and white blood cells, platelets, and hemoglobin.",
      duration: "15 Minutes",
      preparation: "No special preparation is usually needed.",
      category: "blood-test",
    },
    {
      id: 5,
      name: "X-Ray",
      price: 5000,
      description:
        "Uses radiation to produce images of structures inside the body.",
      duration: "30 Minutes",
      preparation: "No special preparation is usually needed.",
      category: "imaging",
    },
    {
      id: 6,
      name: "MRI Scan",
      price: 45000,
      description:
        "Uses magnetic fields and radio waves to create detailed images of organs and tissues.",
      duration: "60 Minutes",
      preparation: "Remove all metal objects. Inform staff of any implants.",
      category: "imaging",
    },
    {
      id: 7,
      name: "Biopsy",
      price: 15000,
      description:
        "Removal of a small sample of tissue for laboratory examination.",
      duration: "48 hours",
      preparation: "Fasting may be required. Follow doctor's instructions.",
      category: "pathology",
    },
    {
      id: 8,
      name: "Genetic Screening",
      price: 25000,
      description:
        "Tests for genetic disorders or risk factors for certain diseases.",
      duration: "7-14 days",
      preparation: "No special preparation is usually needed.",
      category: "genetic-testing",
    },
  ];

  const laboratories: Laboratory[] = [
    {
      id: 1,
      name: "HealthFirst Laboratory",
      address: "123 Medical Avenue, Abuja",
      distance: "2.3 km away",
      rating: 4.5,
    },
    {
      id: 2,
      name: "MediLab Diagnostics",
      address: "45 Hospital Road, Abuja",
      distance: "3.7 km away",
      rating: 4.2,
    },
  ];

  // Filter tests based on active tab and search query
  const filteredTests = tests.filter(
    (test) =>
      test.category === activeTab &&
      (searchQuery === "" ||
        test.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const testsPerPage = 4;
  const totalPages = Math.ceil(filteredTests.length / testsPerPage);
  const currentTests = filteredTests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  const handleContinue = () => {
    if (currentStep === 1) {
      // Set default selections if none are made
      if (!selectedTest) setSelectedTest(tests[0]);
      if (!selectedLab) setSelectedLab(laboratories[0]);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setShowSuccessModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
  };

  const handleLabSelect = (lab: Laboratory) => {
    setSelectedLab(lab);
  };

  return (
    <div className="bg-green-50 min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-900 mb-4">Test Booking</h1>
        <div className="border-b border-teal-200 mb-4"></div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`text-sm font-medium ${
                  currentStep >= 1 ? "text-teal-700" : "text-gray-500"
                }`}
              >
                Select Test{" "}
                {currentStep > 1 && (
                  <Check className="inline-block ml-1 w-4 h-4" />
                )}
              </div>
              <div
                className={`h-1 w-20 md:w-24 mt-1 rounded ${
                  currentStep >= 1 ? "bg-teal-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`text-sm font-medium ${
                  currentStep >= 2 ? "text-teal-700" : "text-gray-500"
                }`}
              >
                Select Date & Time{" "}
                {currentStep > 2 && (
                  <Check className="inline-block ml-1 w-4 h-4" />
                )}
              </div>
              <div
                className={`h-1 w-20 md:w-24 mt-1 rounded ${
                  currentStep >= 2 ? "bg-teal-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`text-sm font-medium ${
                  currentStep >= 3 ? "text-teal-700" : "text-gray-500"
                }`}
              >
                Confirm
              </div>
              <div
                className={`h-1 w-20 md:w-24 mt-1 rounded ${
                  currentStep >= 3 ? "bg-teal-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Step 1: Select Test */}
        {currentStep === 1 && (
          <>
            <h2 className="text-xl font-semibold text-teal-800 mb-4">
              Select a Test
            </h2>

            {/* Test Categories */}
            <Tabs
              defaultValue="blood-test"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <TabsTrigger
                  value="blood-test"
                  className={cn(
                    "rounded-full py-2 px-4 text-sm font-medium",
                    activeTab === "blood-test"
                      ? "bg-teal-700 text-white"
                      : "bg-teal-100 text-teal-800"
                  )}
                >
                  Blood Test
                </TabsTrigger>
                <TabsTrigger
                  value="imaging"
                  className={cn(
                    "rounded-full py-2 px-4 text-sm font-medium",
                    activeTab === "imaging"
                      ? "bg-teal-700 text-white"
                      : "bg-teal-100 text-teal-800"
                  )}
                >
                  Imaging
                </TabsTrigger>
                <TabsTrigger
                  value="pathology"
                  className={cn(
                    "rounded-full py-2 px-4 text-sm font-medium",
                    activeTab === "pathology"
                      ? "bg-teal-700 text-white"
                      : "bg-teal-100 text-teal-800"
                  )}
                >
                  Pathology
                </TabsTrigger>
                <TabsTrigger
                  value="genetic-testing"
                  className={cn(
                    "rounded-full py-2 px-4 text-sm font-medium",
                    activeTab === "genetic-testing"
                      ? "bg-teal-700 text-white"
                      : "bg-teal-100 text-teal-800"
                  )}
                >
                  Genetic Testing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="blood-test" className="mt-4">
                <p className="text-teal-800 mb-4">
                  Tests that analyze various components of blood.
                </p>
              </TabsContent>
              <TabsContent value="imaging" className="mt-4">
                <p className="text-teal-800 mb-4">
                  Tests that create images of the inside of your body.
                </p>
              </TabsContent>
              <TabsContent value="pathology" className="mt-4">
                <p className="text-teal-800 mb-4">
                  Tests that examine tissues, organs, and bodily fluids.
                </p>
              </TabsContent>
              <TabsContent value="genetic-testing" className="mt-4">
                <p className="text-teal-800 mb-4">
                  Tests that identify changes in chromosomes, genes, or
                  proteins.
                </p>
              </TabsContent>
            </Tabs>

            {/* Search Bar */}
            <div className="relative mb-6 max-w-md ml-auto">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search Test"
                className="pl-10 bg-white border-gray-200 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Test Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentTests.map((test) => (
                <Card
                  key={test.id}
                  className={cn(
                    "bg-green-100 border-green-200 overflow-hidden cursor-pointer transition-all",
                    selectedTest?.id === test.id ? "ring-2 ring-teal-600" : ""
                  )}
                  onClick={() => handleTestSelect(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-teal-800">
                        {test.name}
                      </h3>
                      <span className="font-semibold text-teal-800">
                        ₦{test.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-teal-700 mb-3">
                      {test.description}
                    </p>
                    <div className="flex items-center text-sm text-teal-700 mb-2">
                      <Clock size={16} className="mr-2" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="flex items-start text-sm text-teal-700">
                      <AlertTriangle
                        size={16}
                        className="mr-2 mt-1 flex-shrink-0"
                      />
                      <span>Preparation: {test.preparation}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mb-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "w-8 h-8 p-0 rounded-md",
                        page === currentPage
                          ? "bg-teal-700"
                          : "bg-white text-teal-800"
                      )}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                {currentPage < totalPages && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-md bg-white text-teal-800"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            )}

            {/* Laboratory Selection */}
            <h2 className="text-xl font-semibold text-teal-800 mb-4">
              Select a Laboratory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {laboratories.map((lab) => (
                <Card
                  key={lab.id}
                  className={cn(
                    "bg-green-100 border-green-200 cursor-pointer transition-all",
                    selectedLab?.id === lab.id ? "ring-2 ring-teal-600" : ""
                  )}
                  onClick={() => handleLabSelect(lab)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-teal-800">
                        {lab.name}
                      </h3>
                      <div className="flex items-center">
                        <Star
                          className="text-yellow-500 fill-yellow-500 mr-1"
                          size={16}
                        />
                        <span className="text-teal-800">{lab.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-teal-700 mb-2">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span>{lab.address}</span>
                    </div>
                    <p className="text-sm text-teal-700">{lab.distance}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Select Date & Time */}
        {currentStep === 2 && (
          <>
            <h2 className="text-xl font-semibold text-teal-800 mb-6">
              Select Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-teal-800 font-medium mb-2">
                  Appointment Date
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                  <Calendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                </div>
              </div>
              <div>
                <label className="block text-teal-800 font-medium mb-2">
                  Appointment Time
                </label>
                <Select
                  defaultValue={appointmentTime}
                  onValueChange={setAppointmentTime}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                    <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-green-100 border-green-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">
                  Test Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Test Name
                    </h4>
                    <p className="text-teal-800">
                      {selectedTest?.name || "Complete Blood Count (CBC)"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Duration
                    </h4>
                    <p className="text-teal-800">
                      {selectedTest?.duration || "15 minutes"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Price
                    </h4>
                    <p className="text-teal-800">
                      ₦{selectedTest?.price.toLocaleString() || "3,500.00"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Preparation
                    </h4>
                    <p className="text-teal-800">
                      {selectedTest?.preparation ||
                        "No special preparation is usually needed."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-100 border-green-200 mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">
                  Laboratory Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Name
                    </h4>
                    <p className="text-teal-800">
                      {selectedLab?.name || "HealthFirst Laboratory"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Rating
                    </h4>
                    <div className="flex items-center">
                      <Star
                        className="text-yellow-500 fill-yellow-500 mr-1"
                        size={16}
                      />
                      <span className="text-teal-800">
                        {selectedLab?.rating || "4.5"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Address
                    </h4>
                    <p className="text-teal-800">
                      {selectedLab?.address || "123 Medical Avenue, Abuja"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Distance
                    </h4>
                    <p className="text-teal-800">
                      {selectedLab?.distance || "2.3 km away"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 3 && (
          <>
            <h2 className="text-xl font-semibold text-teal-800 mb-6">
              Confirm Your Booking
            </h2>

            <Card className="bg-green-100 border-green-200 mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">
                  Booking Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Test
                    </h4>
                    <p className="text-teal-800">
                      {selectedTest?.name || "Complete Blood Count (CBC)"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Laboratory
                    </h4>
                    <p className="text-teal-800">
                      {selectedLab?.name || "HealthFirst Laboratory"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Date
                    </h4>
                    <p className="text-teal-800">2025-04-17</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Time
                    </h4>
                    <p className="text-teal-800">{appointmentTime}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Address
                    </h4>
                    <p className="text-teal-800">
                      {selectedLab?.address || "123 Medical Avenue, Abuja"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-teal-700 mb-1">
                      Price
                    </h4>
                    <p className="text-teal-800">
                      ₦{selectedTest?.price.toLocaleString() || "3,000.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-100 border-green-200 mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">
                  Payment Method
                </h3>
                <RadioGroup defaultValue="wallet">
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center">
                      <Wallet className="mr-2" size={18} />
                      <div>
                        <span className="font-medium">Wallet Balance</span>
                        <p className="text-sm text-gray-500">
                          Available balance: ₦50,000.00
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2" size={18} />
                      <span className="font-medium">Debit/Credit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex items-center">
                      <ArrowRight className="mr-2" size={18} />
                      <span className="font-medium">Bank Transfer</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              className="bg-white text-teal-800 border-teal-200"
              onClick={handlePrevious}
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            className="bg-teal-700 hover:bg-teal-800 text-white px-6"
            onClick={handleContinue}
          >
            {currentStep === 3 ? "Confirm" : "Continue"}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-white p-0 max-w-md">
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-500 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-teal-900 mb-2">
              Booking Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your test has been booked successfully. A confirmation has been
              sent to your email.
            </p>

            <div className="bg-green-50 rounded-lg p-4 text-left mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Booking Reference:{" "}
                <span className="font-medium text-teal-800">
                  {bookingReference}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Test:{" "}
                <span className="font-medium text-teal-800">
                  {selectedTest?.name || "Complete Blood Count (CBC)"}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Lab:{" "}
                <span className="font-medium text-teal-800">
                  {selectedLab?.name || "HealthFirst Laboratory"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Date & Time:{" "}
                <span className="font-medium text-teal-800">
                  2025-04-17 at {appointmentTime}
                </span>
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                className="bg-teal-50 text-teal-700 border-teal-200"
              >
                Add to Cart
              </Button>
              <Button className="bg-teal-700 text-white">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
