import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function TopSellingPackages() {
  const packages = [
    {
      id: "basic",
      title: "Domestic Staff Test (Basic)",
      price: "N25,000",
      include: "Includes 5 tests",
      features: [
        "PCV",
        "Hepatitis B Surface Antigen (HBsAg) Rapid",
        "HIV I & II Rapid",
        "and more+",
      ],
      color: "bg-green-600",
    },
    {
      id: "prewedding",
      title: "Pre-Wedding Test (Ero)",
      price: "N45,000",
      include: "Includes 6 tests",
      features: [
        "Blood Grouping (ABO & Rh Typing)",
        "Hb Electrophoresis/Genotype (Qualitative)",
        "Full Blood Count",
        "and more+",
      ],
      color: "bg-green-600",
    },
    {
      id: "executive",
      title: "Lemonade",
      price: "N60,000",
      include: "Includes 7 tests",
      features: [
        "Hepatitis B Surface Antigen (HBsAg) Rapid",
        "HIV I & II Rapid",
        "Syphilis Screen",
        "and more+",
      ],
      color: "bg-green-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">
            Top Selling Packages
          </h2>
          <p className="text-[#3A966CB2] max-w-2xl mx-auto font-medium">
            We offewr more than 500+ test for you
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{pkg.title}</h3>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  {pkg.price}
                </p>
                <p className="text-2xl font-normal text-gray-700 mb-4">
                  {pkg.include}
                </p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${pkg.color} hover:bg-green-700 text-white`}
                >
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
