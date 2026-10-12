import { useMemo, useState } from "react";
import { Search, Microscope, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetUserLabTechnicianById, useGetAllBookableTests } from "@/queries";
import type { BookableTest } from "@/queries";

const ALL_CATEGORIES = "All Categories";

const labDisplayName = (test: BookableTest) => {
  const lab = test.labTechnician;
  if (!lab) return "Unknown Lab";
  return (
    lab.businessName || `${lab.firstName ?? ""} ${lab.lastName ?? ""}`.trim() || "Unknown Lab"
  );
};

const labDisplayAddress = (test: BookableTest) => {
  const lab = test.labTechnician;
  if (!lab) return "";
  return [lab.address, lab.city, lab.state].filter(Boolean).join(", ");
};

export default function SelectTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTest, setSelectedTest] = useState<BookableTest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 15;

  // When the patient picked a laboratory first (/lab/select) only that
  // laboratory's tests are listed; otherwise every laboratory's tests are.
  const labIdParam = Number.parseInt(searchParams.get("labId") || "", 10) || 0;
  const labNameParam = searchParams.get("labName") || "";
  const labAddressParam = searchParams.get("labAddress") || "";

  const { data: labTests, isLoading: isLoadingLabTests } =
    useGetUserLabTechnicianById(labIdParam);
  const { data: allTests, isLoading: isLoadingAllTests } =
    useGetAllBookableTests(!labIdParam);

  const tests: BookableTest[] = useMemo(() => {
    const source = labIdParam ? labTests : allTests;
    return (Array.isArray(source) ? source : []).filter(
      (test) => !test.status || test.status === "active"
    );
  }, [labIdParam, labTests, allTests]);

  const categories = useMemo(() => {
    const names = new Set<string>();
    tests.forEach((test) => {
      if (test.categoryName) names.add(test.categoryName);
    });
    return [ALL_CATEGORIES, ...Array.from(names).sort()];
  }, [tests]);

  const filteredTests = tests.filter((test) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (test.name ?? "").toLowerCase().includes(query) ||
      labDisplayName(test).toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES ||
      test.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  if (isLoadingLabTests || isLoadingAllTests) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleContinue = () => {
    if (!selectedTest) return;

    // The laboratory that offers the test is the one the booking goes to.
    const providerId = selectedTest.userId || labIdParam;

    const params = new URLSearchParams({
      labId: String(providerId),
      labName: labDisplayName(selectedTest) || labNameParam,
      labAddress: labDisplayAddress(selectedTest) || labAddressParam,
      testId: String(selectedTest.id),
      testName: selectedTest.name,
      testPrice: String(selectedTest.price),
    });

    navigate(`/patient/booking/select-date-time?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="">
        <Card className="bg-green-100/50 border-green-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Select a Test</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {labIdParam
                    ? `Tests offered by ${labNameParam || "this laboratory"}`
                    : "Tests offered by all laboratories. Each test is carried out by the laboratory shown on it."}
                </p>
              </div>
              <Button
                variant="outline"
                className="bg-white border-green-300 text-green-700 hover:bg-green-50"
                onClick={() =>
                  navigate(
                    labIdParam ? "/patient/booking/select-test" : "/lab/select"
                  )
                }
              >
                {labIdParam ? "View all laboratories' tests" : "Choose a laboratory"}
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search test or laboratory"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when search changes
                }}
                className="pl-10"
              />
            </div>

            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className={
                      selectedCategory === category
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-white border-green-300 text-green-700 hover:bg-green-50"
                    }
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            {paginatedTests.length === 0 && (
              <div className="text-center text-gray-600 py-10">
                {tests.length === 0
                  ? "No tests are available for booking at the moment."
                  : "No tests match your search."}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedTests?.map((test) => {
                const labName = labDisplayName(test) || labNameParam;
                const labAddress = labDisplayAddress(test) || labAddressParam;
                return (
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
                      <div className="flex justify-between gap-3">
                        <h3 className="font-semibold">
                          <Microscope className="text-emerald-600 w-5 h-5" />{" "}
                          {test.name}
                        </h3>
                        <span className="font-bold">
                          ₦{Number(test.price ?? 0).toLocaleString()}
                        </span>
                      </div>
                      {test.categoryName && (
                        <p className="text-xs text-emerald-700 mt-1">
                          {test.categoryName}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        {test.details}
                      </p>
                      {labName && (
                        <p className="text-sm text-gray-700 mt-2 flex items-start gap-1">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                          <span>
                            <span className="font-medium">{labName}</span>
                            {labAddress ? ` - ${labAddress}` : ""}
                          </span>
                        </p>
                      )}
                      {test.turnaround && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Result in{" "}
                          {test.turnaround}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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
