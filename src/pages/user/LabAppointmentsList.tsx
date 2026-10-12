import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { TestTube2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetUserLabAppointments } from "@/queries";

// The patient's test appointments with laboratories (lab technicians)
export default function LabAppointmentsList() {
  const navigate = useNavigate();
  const { data: labAppointments, isLoading } = useGetUserLabAppointments();

  const labName = (appointment: NonNullable<typeof labAppointments>[number]) => {
    const lab = appointment.labTechnician;
    if (!lab) return "Laboratory";
    return (
      lab.businessName || `${lab.firstName ?? ""} ${lab.lastName ?? ""}`.trim()
    );
  };

  return (
    <div className="mt-2 mb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-green-800">
          Lab Appointments
        </h2>
        <Button
          className="bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto"
          onClick={() => navigate("/lab/select")}
        >
          Book a Lab Technician
        </Button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}

      {!isLoading && (labAppointments ?? []).length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              You have no lab appointments yet.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {(labAppointments ?? []).map((appointment) => (
          <Card key={appointment.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <TestTube2 className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {appointment.diagnosis?.name ?? "Laboratory test"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {labName(appointment)}
                      {appointment.labTechnician?.address
                        ? ` - ${[
                            appointment.labTechnician.address,
                            appointment.labTechnician.city,
                            appointment.labTechnician.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}`
                        : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.date
                        ? format(new Date(appointment.date), "MMM dd, yyyy")
                        : "Date not set"}
                      {appointment.time ? ` at ${appointment.time}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-800 capitalize"
                  >
                    {appointment.status}
                  </Badge>
                  {appointment.reportsCount > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/user/results")}
                    >
                      View result
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
