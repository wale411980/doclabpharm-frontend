import { useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useGetUserReport } from "@/queries";
import type { UserReport } from "@/types";
import jsPDF from "jspdf";

export default function TestResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTest, setSelectedTest] = useState<UserReport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 15;

  const { data: report } = useGetUserReport();

  if (!report)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  // Filter test results based on search query and category
  const filteredResults = report.filter((test) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" || test.diagnosis?.toLowerCase().includes(lowerQuery);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      (selectedCategory === "Normal" && test.status === "normal") ||
      (selectedCategory === "Abnormal" && test.status === "abnormal") ||
      (selectedCategory === "Critical" && test.status === "critical");

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Handle view test result
  const handleViewTest = (test: UserReport) => {
    setSelectedTest(test);
  };

  const handleDownloadTest = async (test: UserReport) => {
    const doc = new jsPDF();

    doc.text(`Diagnosis: ${test.diagnosis}`, 10, 10);
    doc.text(`Date: ${new Date(test.date).toLocaleDateString()}`, 10, 20);
    doc.text(`Doctor: Dr. ${test.doctor}`, 10, 30);
    doc.text(`Status: ${test.status}`, 10, 40);

    if (test.imageUrl) {
      try {
        // Fetch the image as blob
        const response = await fetch(test.imageUrl);
        const blob = await response.blob();

        // Create a FileReader to convert blob to base64
        const reader = new FileReader();

        reader.onloadend = function () {
          const base64data = reader.result as string;
          // Add image to PDF
          // Parameters: image data, format, x, y, width, height
          doc.addImage(base64data, "JPEG", 10, 50, 180, 100);

          // Save PDF after image is added
          doc.save(
            `${test.diagnosis.replace(/\s+/g, "_")}_${new Date(test.date)
              .toISOString()
              .slice(0, 10)}.pdf`
          );
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading image for PDF:", error);
        // Fallback to saving PDF without image
        doc.save(
          `${test.diagnosis.replace(/\s+/g, "_")}_${new Date(test.date)
            .toISOString()
            .slice(0, 10)}.pdf`
        );
      }
    } else {
      // No image, just save PDF with text
      doc.save(
        `${test.diagnosis.replace(/\s+/g, "_")}_${new Date(test.date)
          .toISOString()
          .slice(0, 10)}.pdf`
      );
    }
  };

  return (
    <div className="px-4 py-6">
      <Card className="mb-8 py-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-green-800">
            Test Results
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search diagnosis"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">Status</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Abnormal">Abnormal</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            {/* Table Header - visible on sm and up */}
            <div className="hidden sm:grid grid-cols-12 bg-green-100 p-4 font-medium text-green-800">
              <div className="col-span-5">Test Name</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {paginatedResults.length > 0 ? (
                paginatedResults.map((test) => (
                  <div
                    key={test.diagnosis}
                    className="border-b sm:grid sm:grid-cols-12 p-4 bg-white flex flex-col sm:flex-row gap-2"
                  >
                    {/* Mobile layout */}
                    <div className="sm:hidden">
                      <div className="font-semibold text-green-800">
                        {test.diagnosis}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(test.date).toLocaleDateString()}
                      </div>
                      <div className="my-1">
                        <StatusBadge status={test.status} />
                      </div>
                      <div className="flex justify-start gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-green-700"
                          onClick={() => handleViewTest(test)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:block col-span-5 font-medium">
                      {test.diagnosis}
                    </div>
                    <div className="hidden sm:block col-span-3">
                      {new Date(test.date).toLocaleDateString()}
                    </div>
                    <div className="hidden sm:block col-span-2 text-center">
                      <StatusBadge status={test.status} />
                    </div>
                    <div className="hidden sm:flex col-span-2 justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-green-700"
                        onClick={() => handleViewTest(test)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No test results found matching your search criteria.
                </div>
              )}
            </div>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 mb-16">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Result Dialog */}
      <Dialog
        open={!!selectedTest}
        onOpenChange={(open) => !open && setSelectedTest(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Test Results</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-green-800">
                  {selectedTest.diagnosis} -{" "}
                  {new Date(selectedTest.date).toLocaleDateString()}
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <div></div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedTest.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                      onClick={() => handleDownloadTest(selectedTest)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <img
                  src={selectedTest.imageUrl}
                  alt={`${selectedTest.diagnosis} image`}
                  className="max-w-full h-auto rounded"
                />
              </div>

              <div>
                <p className="text-sm">
                  <span className="font-medium">Summary:</span>
                  {selectedTest.summary}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Status Badge Component
function StatusBadge({
  status,
}: {
  status: "normal" | "abnormal" | "critical";
}) {
  if (status === "normal") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Normal
      </Badge>
    );
  } else if (status === "abnormal") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        abnormal
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        critical
      </Badge>
    );
  }
}
