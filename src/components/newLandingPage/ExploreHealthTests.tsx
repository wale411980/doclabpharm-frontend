import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useDiagnosisListByGroupType,
  useGetDiagnosisCategories,
  useDiagnosisListByGroupAndCategory,
  useDiagnosisSearch,
} from "@/queries";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

export default function ExploreHealthTests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Health Packages");
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState<any[]>([]);
  const [currentGroupType, setCurrentGroupType] = useState<
    "group" | "individual"
  >("group");

  const { mutate } = useDiagnosisListByGroupType();

  const { data: categories } = useGetDiagnosisCategories();

  const { mutate: fetchByCategory } = useDiagnosisListByGroupAndCategory();

  const { mutate: searchTests } = useDiagnosisSearch();

  const fetchTests = (groupType: "group" | "individual") => {
    mutate(
      { group_type: groupType },
      {
        onSuccess: (data) => {
          setTests(data);
        },
        onError: (err) => {
          console.error("Failed to fetch diagnosis list:", err);
        },
      }
    );
  };

  // Fetch group on first load
  useEffect(() => {
    fetchTests("group");
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Health Packages") {
      setCurrentGroupType("group");
      fetchTests("group");
    } else {
      setCurrentGroupType("individual");
      fetchTests("individual");
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    fetchByCategory(
      {
        group_type: currentGroupType,
        diagnosis_category_id: categoryId,
      },
      {
        onSuccess: (data) => {
          setTests(data);
        },
        onError: (err) => {
          console.error("Failed to fetch tests by category:", err);
        },
      }
    );
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length === 0) {
        // If empty, fallback to current tab fetch
        fetchTests(currentGroupType);
        return;
      }

      searchTests(query, {
        onSuccess: (data) => {
          setTests(data);
        },
        onError: (err) => {
          console.error("Search failed:", err);
        },
      });
    }, 400),
    [currentGroupType]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <div className="min-h-screen mt-40 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Explore available health Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Exploring the available options, find a health package that aligns
            with your specific needs and preferences.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-100 rounded-full p-1 flex">
            {["Health Packages", "Single Tests"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === tab
                    ? "bg-emerald-700 text-white shadow-md"
                    : "text-gray-600 hover:text-emerald-700"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for tests..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-12 py-3 rounded-full border-gray-300"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories?.map((category) => (
            <Badge
              key={category.id}
              variant="outline"
              className="px-4 py-2 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={() => handleCategoryClick(category.id)} // <-- NEW
            >
              {category.name}
            </Badge>
          ))}
        </motion.div>

        {/* Test Cards */}
        <div className="space-y-4 mb-8">
          {tests.length === 0 ? (
            <div className="text-center text-gray-500">No tests found.</div>
          ) : (
            tests.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-center">
                      {/* Test Name */}
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {test.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <div className="text-left md:col-span-1 lg:col-span-1">
                        <p className="text-gray-600 text-sm">{test.details}</p>
                      </div>

                      {/* Price */}
                      <div className="text-left md:text-center lg:text-center">
                        <span className="text-xl font-bold text-emerald-700">
                          ₦ {Number(test.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Button */}
                      <div className="text-left md:text-right lg:text-right">
                        <Button
                          className="bg-emerald-700 hover:bg-green-700 w-full md:w-auto"
                          onClick={() => {
                            const payload = {
                              id: test.id,
                              labId: test.userId,
                              name: test.name,
                              price: test.price,
                              turnaround: test.turnaround,
                            };
                            localStorage.setItem(
                              "testBooking",
                              JSON.stringify(payload)
                            );
                            const params = new URLSearchParams({
                              id: String(test.id),
                              labId: String(test.userId),
                            });
                            navigate(
                              `/patient/bookings/select-date-time?${params.toString()}`
                            );
                          }}
                        >
                          Book Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center items-center gap-4"
        >
          <span className="text-sm text-gray-600">Showing 1 of 4</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
