import { useState } from "react";
import { Search, Pill, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGetMedicines } from "@/queries";
import type { Medicines } from "@/types";
import { useAuth } from "@/hooks/useAuth"; // ✅ use cart context
import { useNavigate } from "react-router-dom";

export default function Medications() {
  const [searchQuery, setSearchQuery] = useState("");
  const cartContext = useAuth().cartContext;
  const addItem = cartContext?.addItem;
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: medicines, isLoading } = useGetMedicines();

  // if it is loading show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const filteredMedications = (medicines ?? []).filter((medication) => {
    const matchesSearch = medication.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);

  const paginatedMedications = filteredMedications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-medium text-gray-800 mb-4">
        Browse medications and manage prescriptions
      </h1>

      {/* Navigation Tab */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="w-full bg-green-100 hover:bg-green-200 text-green-800 rounded-md py-2 flex items-center justify-center gap-2"
        >
          <Pill className="h-5 w-5" />
          <span className="font-medium">Medications</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-green-50 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Medications
          </h2>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Medications"
                className="pl-10 w-full sm:w-64 bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Medications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedMedications.map((medication: Medicines) => (
            <Card
              key={medication.id}
              className="bg-green-100 border-0 overflow-hidden"
            >
              <CardContent className="p-4 pt-4">
                <div className="flex items-start mb-3">
                  <div className="bg-green-200 p-2 rounded-full">
                    <Pill className="h-5 w-5 text-green-700" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {medication.name}
                </h3>
                <p className="text-gray-600 text-sm">{medication.volume}</p>
                <p className="text-gray-700 text-sm mt-1">
                  {medication.details}
                </p>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={`${
                      medication.status === "active"
                        ? "bg-green-200 text-green-800 border-green-300"
                        : "bg-amber-200 text-amber-800 border-amber-300"
                    } font-normal text-xs`}
                  >
                    {medication.status}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button
                  size="sm"
                  onClick={() => {
                    if (addItem) {
                      addItem({
                        service_type: "med",
                        product_id: medication.id,
                        qty: 1,
                        price: medication.price,
                        name: medication.name,
                      });
                      navigate("/user/cart");
                    }
                  }}
                  className={`${
                    medication.status === "active"
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-md flex items-center gap-1`}
                  disabled={medication.status !== "active" || !addItem}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
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
  );
}
