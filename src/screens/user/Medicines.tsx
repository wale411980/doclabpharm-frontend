"use client";

// MEDICINES_API_V1: Replaced hardcoded static list with live data from /user/pharmacies/medicine/list

import { useState, useMemo } from "react";
import { Search, Pill, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGetMedicines } from "@/queries";
import type { Medicines } from "@/types";

const ALL_CATEGORIES = "All Categories";

export default function MedicationBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const { data: medicines, isLoading, error } = useGetMedicines();

  const categories = useMemo(() => {
    if (!medicines) return [ALL_CATEGORIES];
    const cats = new Set<string>();
    medicines.forEach((m) => {
      if (m.type) cats.add(m.type);
    });
    return [ALL_CATEGORIES, ...Array.from(cats).sort()];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];
    return medicines.filter((m: Medicines) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES || m.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
  const paginated = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatPrice = (price: number) => `₦${Number(price).toLocaleString("en-NG")}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading medicines...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load medicines. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-medium text-slate-800 mb-4">
        Browse medications and manage prescriptions
      </h1>

      <div className="bg-emerald-50 rounded-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="h-5 w-5 text-emerald-700" />
          <span className="font-medium text-emerald-700">Medications</span>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Medications</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search Medications"
                  className="pl-8 w-full sm:w-[250px] bg-white"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {categories.length > 2 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white flex gap-2">
                      <Filter className="h-4 w-4" />
                      {selectedCategory}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {paginated.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              {(medicines?.length ?? 0) === 0
                ? "No medicines are available right now. Check back later."
                : "No medicines match your search."}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((medication: Medicines) => {
              const inStock =
                medication.status === "active" &&
                Number(medication.quantity) > 0;
              return (
                <Card
                  key={medication.id}
                  className="bg-emerald-50 border-emerald-100 overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 rounded-full p-2 flex-shrink-0">
                        <Pill className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">
                          {medication.name}
                        </h3>
                        {medication.dosage && (
                          <p className="text-sm text-slate-600">
                            {medication.dosage}
                          </p>
                        )}
                        {medication.volume && (
                          <p className="text-xs text-slate-500">
                            {medication.volume}
                          </p>
                        )}
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {medication.description || medication.details}
                        </p>
                        {medication.pharmacy && (
                          <p className="text-xs text-emerald-700 mt-1">
                            {medication.pharmacy.firstName}{" "}
                            {medication.pharmacy.lastName}
                            {medication.pharmacy.city
                              ? ` — ${medication.pharmacy.city}`
                              : ""}
                          </p>
                        )}
                        <div className="mt-2">
                          {inStock ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              In Stock
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 border-orange-200"
                            >
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 pt-0">
                    <p className="font-bold text-slate-800">
                      {formatPrice(medication.price)}
                    </p>
                    <Button
                      size="sm"
                      className={
                        inStock
                          ? "bg-emerald-700 hover:bg-emerald-800"
                          : "bg-slate-300"
                      }
                      disabled={!inStock}
                    >
                      Order
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
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
