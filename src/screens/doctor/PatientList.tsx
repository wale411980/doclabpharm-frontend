"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetDoctorAllPatients } from "@/queries";

export default function PatientList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 15;

  const { data: patientsData, isLoading, isError } = useGetDoctorAllPatients();

  if (isLoading) return <div className="text-center">Loading patients...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load details.</div>
    );

  const filteredPatients =
    patientsData?.filter(
      (patient) =>
        patient?.user?.lastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        patient?.user?.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <p className="text-green-700 mb-4">
            Manage your patient records and information.
          </p>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10 bg-gray-100 border-gray-200"
              placeholder="Search for patient or appointments"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border bg-gray-50">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-white text-left">
                <th className="px-4 py-3 text-green-700">Patient</th>
                <th className="px-4 py-3 text-green-700">Age</th>
                <th className="px-4 py-3 text-green-700">Gender</th>
                <th className="px-4 py-3 text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(paginatedPatients ?? []).map((patient) => (
                <tr key={patient.id} className="border-b bg-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <img
                          src={patient.user.profileImage || "/placeholder.svg"}
                          alt={`${patient.user.firstName} ${patient.user.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                      <span className="font-medium text-green-700">{`${patient.user.firstName} ${patient.user.lastName}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {patient?.user.age}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {patient?.user.gender}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="link"
                      className="text-green-700 p-0 h-auto font-medium"
                      onClick={() =>
                        navigate(`/doctor/patients/${patient.user.id}`)
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
