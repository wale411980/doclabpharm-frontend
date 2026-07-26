import { useState } from "react";
import { Search, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useGetUserLabTechnicianById } from "@/queries";

export default function SelectTest() {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 15;

  const labId = 1; // ✅ Fixed lab ID
  const { data: testData, isLoading } = useGetUserLabTechnicianById(labId);

  const filteredTests = (testData ?? []).filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleContinue = () => {
    if (!selectedTest) return;

    const params = new URLSearchParams({
      labId: labId.toString(),
      testId: selectedTest.id,
      testName: selectedTest.name,
      testPrice: selectedTest.price.toString(),
    });

    navigate(`/patient/booking/select-date-time?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="">
        <Card className="bg-green-100/50 border-green-200">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Select a Test</h1>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Test"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when search changes
                }}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedTests?.map((test) => (
                <Card
                  key={test.id}
                  className={`cursor-pointer transition ${
                    selectedTest?.id === test.id
                      ? "bg-green-200 border-green-400 ring-2 ring-green-300"
                      : "bg-green-50 hover:bg-green-100"
                  }`}
                  onClick={() => setSelectedTest(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        <Microscope className="text-emerald-600 w-5 h-5" />{" "}
                        {test.name}
                      </h3>
                      <span className="font-bold">
                        ₦{test.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{test.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTest && (
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleContinue}
                  className="bg-green-600 text-white"
                >
                  Continue
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
