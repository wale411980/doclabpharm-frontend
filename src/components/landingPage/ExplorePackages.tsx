"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function ExplorePackages() {
  const packageCategories = [
    { id: "all", label: "Sexual Health" },
    { id: "popular", label: "Women's Health" },
    { id: "covid", label: "Men's health" },
    { id: "fertility", label: "General Health" },
    { id: "prenatal", label: "COVID Test" },
    { id: "children", label: "Children's Health" },
  ];

  const packages = [
    {
      id: "basic",
      title: "STI Tests",
      description:
        "Looking for peace of mind without the trip to the clinic? Book this at-home STI testing for fast and discreet results, with complimentary doctors' consultation and treatment options available.",
      color: "bg-yellow-100",
      categories: ["all", "popular"],
    },
    {
      id: "cardiac",
      title: "Urinary Tract Infection (UTI) Tests",
      description:
        "Book this at-home UTI testing for fast and discreet results, with complimentary doctors' consultation and treatment options available.",
      color: "bg-blue-100",
      categories: ["all", "popular"],
    },
    {
      id: "covid",
      title: "Erectile Dysfunction Tests",
      description:
        "Erectile Dysfunction can affect men of all ages, but needn't impact your quality of life. Let’s help you find the right erectile dysfunction treatment and strength to help support a fulfilling sex life and improve your erectile performance in a way that suits you.",
      color: "bg-green-100",
      categories: ["all", "covid"],
    },
    {
      id: "fertility",
      title: "Erectile Dysfunction Tests",
      description:
        "Erectile Dysfunction can affect men of all ages, but needn't impact your quality of life. Let’s help you find the right erectile dysfunction treatment and strength to help support a fulfilling sex life and improve your erectile performance in a way that suits you.",
      color: "bg-pink-100",
      categories: ["all", "fertility"],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">
            Explore Packages
          </h2>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-inherit border border-solid border-black rounded-full p-1 overflow-x-auto max-w-full flex-wrap justify-center">
              {packageCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-full"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {packageCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              >
                {packages
                  .filter((pkg) => pkg.categories.includes(category.id))
                  .map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className={`${pkg.color} rounded-lg p-6 h-full flex flex-col`}
                    >
                      <h3 className="font-semibold text-[#0C4654] mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-sm text-[#0C4654] font-normal flex-grow">
                        {pkg.description}
                      </p>
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
