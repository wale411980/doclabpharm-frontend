import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserById, useGetUserNotesById } from "@/queries";
import type { UserNotes } from "@/types";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "normal":
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" /> Normal
        </Badge>
      );
    case "abnormal":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-4 h-4 mr-1" /> Abnormal
        </Badge>
      );
    case "critical":
      return (
        <Badge className="bg-red-100 text-red-800">
          <ShieldAlert className="w-4 h-4 mr-1" /> Critical
        </Badge>
      );
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

export default function PatientDetail() {
  const [activeTab, setActiveTab] = useState<
    "medical-info" | "records" | "prescriptions"
  >("medical-info");
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState<
    number | null
  >(null);

  const toggleExpanded = (id: number) => {
    setExpandedPrescriptionId((prev) => (prev === id ? null : id));
  };

  const [expandedReportId, setExpandedReportId] = useState<number | null>(null);

  const [notesPage, setNotesPage] = useState(1);
  const [recordsPage, setRecordsPage] = useState(1);
  const [prescriptionsPage, setPrescriptionsPage] = useState(1);

  const toggleExpandedReport = (id: number) => {
    setExpandedReportId((prev) => (prev === id ? null : id));
  };

  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
  const { data: patient, isLoading } = useGetUserById(numericId as number);
  const { data: userNotes } = useGetUserNotesById(numericId as number);

  const navigate = useNavigate();
  const NOTES_PER_PAGE = 15;
  const RECORDS_PER_PAGE = 15;
  const PRESCRIPTIONS_PER_PAGE = 15;

  const paginatedNotes = userNotes?.slice(
    (notesPage - 1) * NOTES_PER_PAGE,
    notesPage * NOTES_PER_PAGE
  );

  const paginatedRecords = patient?.report?.slice(
    (recordsPage - 1) * RECORDS_PER_PAGE,
    recordsPage * RECORDS_PER_PAGE
  );

  const paginatedPrescriptions = patient?.prescription?.slice(
    (prescriptionsPage - 1) * PRESCRIPTIONS_PER_PAGE,
    prescriptionsPage * PRESCRIPTIONS_PER_PAGE
  );

  if (isLoading) {
    return <div>Loading patients details...</div>;
  }

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  const TabButton = ({
    id,
    label,
    isActive,
  }: {
    id: "medical-info" | "records" | "prescriptions";
    label: string;
    isActive: boolean;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      onClick={() => setActiveTab(id)}
      className={`px-6 py-2 rounded-full ${
        isActive
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "text-green-600 hover:text-green-700 hover:bg-green-50"
      }`}
    >
      {label}
    </Button>
  );

  const Pagination = ({
    page,
    setPage,
    totalItems,
    itemsPerPage,
  }: {
    page: number;
    setPage: (newPage: number) => void;
    totalItems: number;
    itemsPerPage: number;
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className="self-center text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <header className="border-b p-4">
        <Button
          variant="ghost"
          className="mb-2 pl-0 text-green-700"
          onClick={() => navigate("/lab_technician/patients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to patients
        </Button>
        <p className="text-green-700">
          Manage your patient records and information.
        </p>
      </header>

      <Card className="py-4">
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Note</TableHead>
                  <TableHead className="text-right">Doctor</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedNotes?.map((notes: UserNotes) => (
                  <TableRow key={notes.id}>
                    {/* Note - left aligned */}
                    <TableCell className="text-left">{notes.note}</TableCell>

                    {/* Doctor - right aligned */}
                    <TableCell className="text-right whitespace-nowrap font-medium">
                      {`${notes.author?.firstName} ${notes.author?.lastName}`}
                    </TableCell>

                    {/* Date - right aligned */}
                    <TableCell className="text-right whitespace-nowrap font-medium">
                      {format(new Date(notes.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {userNotes && (
              <Pagination
                page={notesPage}
                setPage={setNotesPage}
                totalItems={userNotes.length}
                itemsPerPage={NOTES_PER_PAGE}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    </div>
  );

  const renderRecords = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Medical Records</CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage medical records for this patient
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {paginatedRecords?.map((report) => (
          <div key={report.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">
                  Diagnosis: {report.diagnosis?.name || "Unknown"}
                </h4>
                <div className="flex items-center gap-2">
                  {getStatusBadge(report.status)}
                  <img
                    src={report.imageUrl}
                    alt="Report thumbnail"
                    className="w-10 h-10 rounded object-cover border"
                  />
                </div>
                <p className="text-sm text-muted-foreground truncate max-w-sm">
                  {report.summary}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleExpandedReport(report.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {expandedReportId === report.id ? "Hide" : "View"}
              </Button>
            </div>

            {expandedReportId === report.id && (
              <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded-md border">
                <img
                  src={report.imageUrl}
                  alt="Report full"
                  className="w-full max-w-md rounded-lg object-contain border"
                />
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Diagnosis:</strong> {report.diagnosis?.name}
                </p>
                <p>
                  <strong>Summary:</strong> {report.summary}
                </p>
                {report.doctor && (
                  <p>
                    <strong>Doctor:</strong> Dr. {report.doctor.firstName}{" "}
                    {report.doctor.lastName}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        <Separator />
      </CardContent>
      {patient.report && (
        <Pagination
          page={recordsPage}
          setPage={setRecordsPage}
          totalItems={patient.report.length}
          itemsPerPage={RECORDS_PER_PAGE}
        />
      )}
    </Card>
  );

  const renderPrescriptions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prescription History</CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage prescriptions for this patient
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {paginatedPrescriptions?.map((prescription) => {
          const firstDrug = prescription.drugs?.[0];

          return (
            <div key={prescription.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">
                    Prescription #{prescription.id}
                  </h4>
                  {firstDrug ? (
                    <p className="text-sm text-muted-foreground">
                      {firstDrug.medicine?.name ||
                        firstDrug.other ||
                        "Unnamed Drug"}{" "}
                      • {firstDrug.dosage} •{" "}
                      {firstDrug.frequency || "Unspecified"}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No drug data available.
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(prescription.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {expandedPrescriptionId === prescription.id ? "Hide" : "View"}
                </Button>
              </div>

              {expandedPrescriptionId === prescription.id && (
                <div className="mt-4 space-y-4">
                  {prescription.drugs.length > 0 ? (
                    prescription.drugs.map((drug) => (
                      <div
                        key={drug.id}
                        className="p-3 border rounded-md bg-gray-50"
                      >
                        <h5 className="font-semibold text-sm">
                          {drug.medicine?.name || drug.other || "Unnamed Drug"}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Dosage: {drug.dosage}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Frequency: {drug.frequency || "Unspecified"}
                        </p>
                        {drug.instructions && (
                          <p className="text-sm text-muted-foreground">
                            Instructions: {drug.instructions}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No drugs recorded under this prescription.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <Separator />
      </CardContent>
      {patient.prescription && (
        <Pagination
          page={prescriptionsPage}
          setPage={setPrescriptionsPage}
          totalItems={patient.prescription.length}
          itemsPerPage={PRESCRIPTIONS_PER_PAGE}
        />
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-green-700 mb-6">
            Manage your patient records and information.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                {/* Patient Avatar and Basic Info */}
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage
                      src={patient.profileImage || "/placeholder.svg"}
                      alt={`${patient.firstName}`}
                    />
                    <AvatarFallback className="bg-yellow-400 text-white text-xl">
                      {`${patient.firstName} ${patient.lastName}`
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{`${patient.firstName} ${patient.lastName}`}</h2>
                  <p className="text-muted-foreground">{patient.accountId}</p>

                  <div className="flex gap-2 mt-4 justify-center">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate("/doctor/messages")}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate("/doctor/appointments")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone:</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email:</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address:</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
              <TabButton
                id="medical-info"
                label="Medical Info"
                isActive={activeTab === "medical-info"}
              />
              <TabButton
                id="records"
                label="Records"
                isActive={activeTab === "records"}
              />
              <TabButton
                id="prescriptions"
                label="Prescriptions"
                isActive={activeTab === "prescriptions"}
              />
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "medical-info" && renderMedicalInfo()}
              {activeTab === "records" && renderRecords()}
              {activeTab === "prescriptions" && renderPrescriptions()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
