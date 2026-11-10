import {
  Users,
  Calendar,
  CreditCard,
  UserCheck,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useAdminStats,
  useAdminRecentTransactions,
  useAdminRecentAppointments,
  useAdminRecentUsers,
  useAdminRecentWithdraw,
} from "@/queries";
import type {
  Transaction,
  AdminRecentAppointments,
  AdminRecentUsers,
  AdminRecentWithdraw,
} from "@/types";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: adminStats, isLoading } = useAdminStats();
  const { data: recentTransactions } = useAdminRecentTransactions();
  const { data: recentAppointments } = useAdminRecentAppointments();
  const { data: recentUsers } = useAdminRecentUsers();
  const { data: recentWithdraw } = useAdminRecentWithdraw();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <div className="relative w-full max-w-md"></div>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Manage available</div>
                  <div className="text-lg font-semibold">Total Patients</div>
                  <div className="mt-2 text-3xl font-bold">
                    {adminStats?.totalPatients}
                  </div>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 bg-white/20 text-white hover:bg-white/30"
                onClick={() => navigate("/admin/patients")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Manage Available</div>
                  <div className="text-lg font-semibold">Total Care-Giver</div>
                  <div className="mt-2 text-3xl font-bold">
                    {adminStats?.totalCaregiver}
                  </div>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <UserCheck className="h-8 w-8" />
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 bg-white/20 text-white hover:bg-white/30"
                onClick={() => navigate("/admin/doctors")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">
                    Manage all Appointments
                  </div>
                  <div className="text-lg font-semibold">
                    Total Appointments
                  </div>
                  <div className="mt-2 text-3xl font-bold">
                    {adminStats?.totalAppointment}
                  </div>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 text-white hover:bg-white/30"
                  onClick={() => navigate("/admin/doctor-appointments")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => navigate("/admin/transactions")}
              >
                See All
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions
                ?.slice(0, 5)
                .map((transaction: Transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.reference}
                        </div>
                        <div className="text-sm text-gray-600">
                          {transaction.trxNo}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {format(
                            new Date(transaction.createdAt),
                            "dd/MM/yyyy"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {transaction.amount}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Appointments */}
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments
                  ?.slice(0, 5)
                  .map((appointment: AdminRecentAppointments) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-3 border-b pb-4 last:border-b-0"
                    >
                      <div className="flex flex-col items-center rounded-lg bg-green-100 px-3 py-2 text-center">
                        <div className="text-xs font-medium text-green-700">
                          {format(
                            new Date(appointment.createdAt),
                            "dd/MM/yyyy"
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{`${appointment.user.firstName} ${appointment.user.lastName}`}</div>
                        <div className="text-sm text-gray-600">
                          {appointment?.consultation?.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {format(new Date(appointment.createdAt), "HH:mm")}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  className="w-full text-green-600 hover:text-green-700"
                  onClick={() => navigate("/admin/doctor-appointments")}
                >
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Recent Patients</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers?.slice(0, 5).map((patient: AdminRecentUsers) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 border-b pb-4 last:border-b-0"
                  >
                    <Avatar>
                      <AvatarImage
                        src={patient.profile_image || "/placeholder.svg"}
                        alt={patient.firstName}
                      />
                      <AvatarFallback>
                        {`${patient.firstName} ${patient.lastName}`
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{`${patient.firstName} ${patient.lastName}`}</div>
                      <div className="text-sm text-gray-600">
                        {patient.accountId}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-green-600 hover:text-green-700"
                  onClick={() => navigate("/admin/patients")}
                >
                  View All Patients
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal */}
          <Card className="py-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Withdrawal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentWithdraw
                  ?.slice(0, 5)
                  .map((withdrawal: AdminRecentWithdraw, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {withdrawal.accountName}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {withdrawal.amount}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {format(new Date(withdrawal.createdAt), "dd/MM/yyyy")}
                      </div>
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  className="w-full text-green-600 hover:text-green-700"
                  onClick={() => navigate("/admin/transactions")}
                >
                  View All Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
