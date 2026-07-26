import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ConfirmTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartContext = useAuth().cartContext;
  const addItem = cartContext?.addItem;

  // Helpers
  const parseIntSafe = (value: string | null): number => {
    const parsed = Number.parseInt(value || "", 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Extract lab data
  const labId = parseIntSafe(searchParams.get("labId"));
  const labName = searchParams.get("labName") || "";
  const labAddress = searchParams.get("labAddress") || "";

  // Extract test data
  const testId = parseIntSafe(searchParams.get("testId"));
  const testName = searchParams.get("testName") || "";
  const testPrice = parseIntSafe(searchParams.get("testPrice"));

  // Extract booking data
  const selectedDate = searchParams.get("selectedDate") || "";
  const selectedTime = searchParams.get("selectedTime") || "";

  // Add to cart
  const handleAddToCart = () => {

    if (
      !testId ||
      !labId ||
      !selectedDate ||
      !selectedTime ||
      !testName ||
      !testPrice
    ) {
      alert("Some test/lab information is missing.");
      return;
    }

    if (!addItem) {
      alert("Cart functionality is not available.");
      return;
    }

    addItem({
      service_type: "lab",
      service_id: testId,
      lab_technician_id: labId,
      date: selectedDate,
      time: selectedTime,
      price: testPrice,
      name: testName,
      qty: 1,
    });

    navigate("/user/cart");
  };

  // Go back
  const handlePrevious = () => {
    const params = new URLSearchParams({
      labId: labId.toString(),
      testId: testId.toString(),
      testName,
      testPrice: testPrice.toString(),
    });
    navigate(`/patient/booking/select-date-time?${params.toString()}`);
  };

  const renderProgressSteps = () => {
    const steps = [
      {
        id: "test-selection",
        label: "Select Test",
        shortLabel: "Test",
        active: false,
      },
      {
        id: "date-time",
        label: "Select Date & Time",
        shortLabel: "Date & Time",
        active: false,
      },
      {
        id: "confirmation",
        label: "Confirm",
        shortLabel: "Confirm",
        active: true,
      },
    ];

    return (
      <div className="mb-6 md:mb-8">
        {/* Mobile: Vertical Progress */}
        <div className="flex flex-col space-y-3 md:hidden">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0 ${
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

        {/* Desktop: Horizontal Progress */}
        <div className="hidden md:flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
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
              {index < steps.length - 1 && (
                <div className="w-12 h-0.5 bg-green-200 mx-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 p-3 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-green-100/50 border-green-200">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Test Booking
            </h1>

            {renderProgressSteps()}

            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
              Confirm Your Booking
            </h2>

            {/* Booking Summary */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Booking Summary
              </h3>
              <Card className="bg-green-200/30 border-green-300">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Test
                      </p>
                      <p className="text-gray-900 text-sm md:text-base">
                        {testName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Date
                        </p>
                        <p className="text-gray-900 text-sm md:text-base">
                          {selectedDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Time
                        </p>
                        <p className="text-gray-900 text-sm md:text-base">
                          {selectedTime}
                        </p>
                      </div>
                    </div>

                    {labAddress && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Address
                        </p>
                        <p className="text-gray-900 text-sm md:text-base">
                          {labAddress}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Price
                      </p>
                      <p className="text-gray-900 font-semibold text-lg md:text-xl">
                        ₦{testPrice.toLocaleString()}
                      </p>
                    </div>

                    {labName && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Laboratory
                        </p>
                        <p className="text-gray-900 text-sm md:text-base">
                          {labName}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 w-full md:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
