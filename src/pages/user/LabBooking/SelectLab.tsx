"use client";

import { useState } from "react";
import { Search, MapPin, TestTube2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserLabTechnician } from "@/queries";
import { useNavigate } from "react-router-dom";

const distanceOptions = [
  "All Distance",
  "Within 1 km",
  "Within 5 km",
  "Within 10 km",
  "Within 25 km",
];

export default function SelectLab() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("All Distance");

  const { data: userLabTechnician, isLoading } = useGetUserLabTechnician();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleBookTest = (lab: any) => {
    const labData = {
      id: lab.id,
      name: lab.businessName,
      address: "123 Medical Avenue, Abuja",
      rating: 4.5,
      distance: "2.3 km away",
    };

    // Navigate to test selection with lab data
    const params = new URLSearchParams({
      labId: labData.id,
      labName: labData.name,
      labAddress: labData.address,
      labRating: labData.rating.toString(),
      labDistance: labData.distance,
    });

    navigate(`/patient/booking/select-test?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find and book laboratory tests
          </h1>
        </div>

        {/* Main Content Card */}
        <Card className="bg-green-100/50 border-green-200">
          <CardContent className="p-6 md:p-8">
            {/* Title and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Find a Laboratory
              </h2>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search Laboratories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64 bg-white border-gray-300"
                  />
                </div>

                {/* Distance Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white border-gray-300 justify-between min-w-32"
                    >
                      {selectedDistance}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {distanceOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setSelectedDistance(option)}
                        className={
                          selectedDistance === option ? "bg-green-50" : ""
                        }
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 mb-8">
              <Button
                variant={activeView === "list" ? "default" : "outline"}
                onClick={() => setActiveView("list")}
                className={`${
                  activeView === "list"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-white border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                List View
              </Button>
              <Button
                variant={activeView === "map" ? "default" : "outline"}
                onClick={() => setActiveView("map")}
                className={`${
                  activeView === "map"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-white border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                Map View
              </Button>
            </div>

            {/* Laboratory Cards Grid */}
            {activeView === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userLabTechnician?.map((lab) => (
                  <Card
                    key={lab.id}
                    className="bg-green-200/30 border-green-300 hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      {/* Laboratory Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-300/50 rounded-lg flex items-center justify-center">
                          <TestTube2 className="w-8 h-8 text-green-700" />
                        </div>
                      </div>

                      {/* Laboratory Name */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                        {lab.businessName}
                      </h3>

                      {/* Address */}
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          {lab.address}
                        </span>
                      </div>

                      {/* Distance and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleBookTest(lab)}
                          >
                            Book Test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Map View Placeholder */}
            {activeView === "map" && (
              <div className="bg-green-200/30 border-2 border-dashed border-green-300 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-green-300/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Map View
                </h3>
                <p className="text-gray-600">
                  Interactive map showing laboratory locations would be
                  displayed here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
