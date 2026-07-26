import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useSuperAdminCallRecordings } from "@/queries";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

export default function SuperAdminCallRecordings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: callRecording, isLoading: loadingcallRecordings } =
    useSuperAdminCallRecordings();

  if (loadingcallRecordings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const filteredcallRecordings = callRecording?.filter((callRecording) =>
    callRecording.fileName?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const itemsPerPage = 15;
  const totalPages = Math.ceil(
    (filteredcallRecordings?.length ?? 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentcallRecordings = filteredcallRecordings?.slice(
    startIndex,
    endIndex
  );

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const response = await api.get(
        `${URIS.superAdmin.superAdminCallRecordingById}/${id}/download`,
        {
          responseType: "blob", // THIS IS CRUCIAL
        }
      );

      // Create a blob URL with the correct MIME type
      const blob = new Blob([response.data], { type: "video/webm" }); // or "video/webm"
      const url = window.URL.createObjectURL(blob);

      // Ensure correct file name & extension
      const safeFileName = fileName.endsWith(".webm")
        ? fileName
        : `${fileName}.webm`;

      // Download trigger
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", safeFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Optional: clean up blob URL
      window.URL.revokeObjectURL(url);

      toast.success("Downloaded successfully");
    } catch (error) {
      toast.error("Download failed");
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Manage call recordings
          </h1>
          <div className="relative w-full sm:max-w-sm px-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="mx-1 sm:mx-0">
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="space-y-2 p-3">
                {currentcallRecordings?.map((callRecording) => (
                  <Card
                    key={callRecording.id}
                    className="border border-gray-200 shadow-sm"
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-medium text-gray-900 text-sm leading-tight break-words">
                              {callRecording.fileName}
                            </p>
                            <p className="text-xs text-gray-500 break-all leading-relaxed">
                              {callRecording.downloadUrl}
                            </p>
                            <p className="text-xs text-green-700 font-medium">
                              {callRecording.createdAt}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <Download
                              className="cursor-pointer text-green-600 hover:text-green-800 w-5 h-5"
                              onClick={() =>
                                handleDownload(
                                  callRecording.id,
                                  callRecording.fileName
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {currentcallRecordings?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recordings found
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-green-700 min-w-[200px]">
                      File Name
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[300px]">
                      Download URL
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[120px]">
                      Created At
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 min-w-[80px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentcallRecordings?.map((callRecording) => (
                    <TableRow
                      key={callRecording.id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-green-700 text-sm">
                        {callRecording.fileName}
                      </TableCell>
                      <TableCell className="font-medium text-green-700 text-sm max-w-[300px] truncate">
                        {callRecording.downloadUrl}
                      </TableCell>
                      <TableCell className="font-medium text-green-700 text-sm">
                        {callRecording.createdAt}
                      </TableCell>
                      <TableCell className="font-medium text-green-700 text-sm">
                        <Download
                          className="cursor-pointer text-green-600 hover:text-green-800 w-4 h-4"
                          onClick={() =>
                            handleDownload(
                              callRecording.id,
                              callRecording.fileName
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center px-1">
          <Pagination>
            <PaginationContent className="flex-wrap gap-1 justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={`text-xs sm:text-sm px-2 py-1 ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                      className={`text-xs sm:text-sm h-7 w-7 sm:h-10 sm:w-10 ${
                        currentPage === pageNumber
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={`text-xs sm:text-sm px-2 py-1 ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
