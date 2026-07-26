import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Calendar,
  Users,
  UserPlus,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetDoctorAnalytics } from "@/queries";

const ageDistributionData = [
  { age: "0-18", patients: 45 },
  { age: "19-35", patients: 62 },
  { age: "36-50", patients: 78 },
  { age: "51-65", patients: 89 },
  { age: "65+", patients: 74 },
];

const commonConditionsData = [
  { month: "Jan", hypertension: 85, diabetes: 72 },
  { month: "Feb", hypertension: 88, diabetes: 75 },
  { month: "Mar", hypertension: 82, diabetes: 78 },
  { month: "Apr", hypertension: 90, diabetes: 80 },
  { month: "May", hypertension: 87, diabetes: 77 },
  { month: "Jun", hypertension: 92, diabetes: 82 },
  { month: "Jul", hypertension: 89, diabetes: 79 },
  { month: "Aug", hypertension: 94, diabetes: 84 },
  { month: "Sep", hypertension: 91, diabetes: 81 },
  { month: "Oct", hypertension: 96, diabetes: 86 },
  { month: "Nov", hypertension: 93, diabetes: 83 },
  { month: "Dec", hypertension: 98, diabetes: 88 },
];

export default function MedicalDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: analyticsData, isLoading } = useGetDoctorAnalytics();
  // show loading when isLoading is true
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const patientVisitsData = analyticsData?.patientsVist;

  // Define colors for each status
  const statusColors = {
    Completed: "#059669",
    Cancelled: "#DC2626",
    NoShow: "#F59E0B", // Not present in your data but kept in case added later
    Rescheduled: "#3B82F6",
    Scheduled: "#8B5CF6", // Added for Scheduled
  };

  // Convert raw data into chart-friendly format
  const appointmentStatusData = Object.entries(
    analyticsData?.appointmentStatus ?? {}
  ).map(([name, value]) => ({
    name,
    value,
    color: statusColors[name as keyof typeof statusColors] || "#6B7280", // Default color if not matched
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Visits Chart */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  Patient Visits (12 Months)
                </CardTitle>
                <CardDescription>
                  Number of patient visits per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientVisitsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#059669"
                        strokeWidth={2}
                        dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#059669" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Status Chart */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="text-lg">Appointment Status</CardTitle>
                <CardDescription>
                  Distribution of appointment outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    {appointmentStatusData.map((entry, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">
                          {entry.name} {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Age Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Age Distribution</CardTitle>
                <CardDescription>Patient age demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="age"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Bar
                        dataKey="patients"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Common Conditions Chart */}
            <Card className="py-4">
              <CardHeader>
                <CardTitle className="text-lg">Common Conditions</CardTitle>
                <CardDescription>
                  Trends of common conditions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={commonConditionsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="hypertension"
                        stroke="#059669"
                        strokeWidth={2}
                        dot={{ fill: "#059669", strokeWidth: 2, r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="diabetes"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "patients":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Patient Demographics</CardTitle>
              <CardDescription>
                Detailed patient analytics will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-gray-500">
                Detailed patient analytics would be displayed here
              </p>
            </CardContent>
          </Card>
        );
      case "conditions":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Condition Analytics</CardTitle>
              <CardDescription>
                Detailed condition analytics will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-gray-500">
                Detailed condition analytics would be displayed here
              </p>
            </CardContent>
          </Card>
        );
      case "appointments":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Appointment Analytics</CardTitle>
              <CardDescription>
                Detailed appointment analytics will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-gray-500">
                Detailed appointment analytics would be displayed here
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              View insights and statistics about your patients and practice.
            </h1>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={`bg-emerald-600 text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Total Patients
                  </p>
                  <p className="text-3xl font-bold">
                    {analyticsData?.totalPatients}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">12% vs last year</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-emerald-600 text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Appointments (This Month)
                  </p>
                  <p className="text-3xl font-bold">
                    {analyticsData?.appointment}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">8% vs last month</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-emerald-600 text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    New Patients (This Month)
                  </p>
                  <p className="text-3xl font-bold">
                    {analyticsData?.patientsMonth}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">5% vs last month</span>
                  </div>
                </div>
                <UserPlus className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-emerald-600 text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Average Appointment Duration
                  </p>
                  <p className="text-3xl font-bold">
                    {analyticsData?.duration}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm">3% vs last month</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "patients", label: "Patients" },
              { id: "conditions", label: "Conditions" },
              { id: "appointments", label: "Appointments" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
