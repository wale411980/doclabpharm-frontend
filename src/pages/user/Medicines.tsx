"use client";

import { useState } from "react";
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  description: string;
  inStock: boolean;
  price: number;
  category: string;
}

const medications: Medication[] = [
  {
    id: "1",
    name: "Paracetamol",
    dosage: "500mg",
    description: "Pain reliever and fever reducer",
    inStock: true,
    price: 850.0,
    category: "Pain Relief",
  },
  {
    id: "2",
    name: "Amoxicillin",
    dosage: "250mg",
    description: "Antibiotic used to treat bacterial infections",
    inStock: true,
    price: 1200.0,
    category: "Antibiotics",
  },
  {
    id: "3",
    name: "Vitamin C",
    dosage: "1000mg",
    description: "Supports immune system health",
    inStock: true,
    price: 1500.0,
    category: "Vitamins",
  },
  {
    id: "4",
    name: "Lisinopril",
    dosage: "10mg",
    description: "Used to treat high blood pressure",
    inStock: false,
    price: 850.0,
    category: "Blood Pressure",
  },
  {
    id: "5",
    name: "Cetirizine",
    dosage: "250mg",
    description: "Antibiotic used to treat bacterial infections",
    inStock: true,
    price: 1200.0,
    category: "Allergies",
  },
  {
    id: "6",
    name: "Vitamin C",
    dosage: "1000mg",
    description: "Supports immune system health",
    inStock: true,
    price: 1500.0,
    category: "Vitamins",
  },
  {
    id: "7",
    name: "Lisinopril",
    dosage: "10mg",
    description: "Used to treat high blood pressure",
    inStock: false,
    price: 850.0,
    category: "Blood Pressure",
  },
  {
    id: "8",
    name: "Amoxicillin",
    dosage: "250mg",
    description: "Antibiotic used to treat bacterial infections",
    inStock: true,
    price: 1200.0,
    category: "Antibiotics",
  },
  {
    id: "9",
    name: "Vitamin C",
    dosage: "1000mg",
    description: "Supports immune system health",
    inStock: true,
    price: 1500.0,
    category: "Vitamins",
  },
];

const categories = [
  "All Categories",
  "Pain Relief",
  "Antibiotics",
  "Vitamins",
  "Blood Pressure",
  "Allergies",
];

export default function MedicationBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [, setCart] = useState<{ id: string; quantity: number }[]>([]);

  const filteredMedications = medications.filter((medication) => {
    const matchesSearch = medication.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      medication.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicationId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicationId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === medicationId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { id: medicationId, quantity: 1 }];
      }
    });
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedications.map((medication) => (
              <Card
                key={medication.id}
                className="bg-emerald-50 border-emerald-100 overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-emerald-100 rounded-full p-2">
                      <Pill className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">
                        {medication.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {medication.dosage}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {medication.description}
                      </p>
                      <div className="mt-2">
                        {medication.inStock ? (
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
                      medication.inStock
                        ? "bg-emerald-700 hover:bg-emerald-800"
                        : "bg-slate-300"
                    }
                    disabled={!medication.inStock}
                    onClick={() => addToCart(medication.id)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
