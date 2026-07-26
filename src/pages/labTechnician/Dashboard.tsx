import {
  Calendar,
  MonitorSmartphone,
  ShoppingCart,
  CalendarIcon,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useLabTechnicianStats,
  useLabTechnicianMostRecentAppointments,
} from "@/queries";
import { useAuth } from "@/hooks/useAuth";
import type { MostRecentAppointments } from "@/types";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats } = useLabTechnicianStats();
  const { data: mostRecentAppointments } =
    useLabTechnicianMostRecentAppointments();

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        User not found
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        No stats available
      </div>
    );
  }

  if (!mostRecentAppointments) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div>
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">
            Welcome back{" "}
            <span className="text-green-600 font-bold">
              👋, Dr {`${user?.lastName} ${user?.firstName}`}
            </span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Stats cards */}
          <div className="space-y-6">
            {/* Appointments Card */}
            <Card className="bg-green-600 py-4 text-white border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">
                  Appointments
                </CardTitle>
                <p className="text-green-100 text-sm">Last added: Today</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-5xl font-bold">
                    {stats.appointment}
                  </span>
                  <div className="bg-green-500/30 p-4 rounded-lg">
                    <CalendarIcon className="h-12 w-12 text-white" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-green-500 flex justify-between items-center">
                <Button
                  variant="link"
                  className="text-white p-0 h-auto"
                  onClick={() => navigate("/lab_technician/appointments")}
                >
                  View all
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-green-500 h-8 w-8"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Middle column */}
          <div className="space-y-6">
            {/* Consultancy Card */}
            <Card className="bg-teal-800 py-4 text-white border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">
                  Consultancy
                </CardTitle>
                <p className="text-teal-100 text-sm">Last contacted: Today</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-5xl font-bold">{stats.patients}</span>
                  <div className="bg-teal-700/50 p-4 rounded-lg">
                    <MonitorSmartphone className="h-12 w-12 text-white" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-teal-700 flex justify-between items-center">
                <Button
                  variant="link"
                  className="text-white p-0 h-auto"
                  onClick={() => navigate("/lab_technician/patients")}
                >
                  View all
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-teal-700 h-8 w-8"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Card */}
          <Card className="bg-green-600 py-4 text-white border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Order</CardTitle>
              <p className="text-green-100 text-sm">Last contacted: Today</p>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between items-center">
                <span className="text-5xl font-bold">
                  {stats.totalDiagnosis}
                </span>
                <div className="bg-green-500/30 p-4 rounded-lg">
                  <ShoppingCart className="h-12 w-12 text-white" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t border-green-500 flex justify-between items-center">
              <Button
                variant="link"
                className="text-white p-0 h-auto"
                onClick={() => navigate("/lab_technician/wallet")}
              >
                View All
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-green-500 h-8 w-8"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Appointment Requests */}
          <Card className="bg-gray-50 border-gray-100 py-4">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg font-medium text-green-800">
                  Appointment request
                </CardTitle>
              </div>
              <p className="text-sm text-gray-500">
                Your latest appointment requests
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-gray-500">
                      Patient name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Time
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostRecentAppointments
                    ?.slice(0, 5)
                    .map((request: MostRecentAppointments, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <TableCell className="py-2 text-sm">
                          {`${request.user.firstName} ${request.user.lastName}`}
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {request.time}
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {request.status}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => navigate("/lab_technician/appointments")}
              >
                View all requests
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
