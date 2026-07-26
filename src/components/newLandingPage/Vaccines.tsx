import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Syringe } from "lucide-react";
import type { PageType } from "./IndexPage";

interface VaccinesProps {
  onNavigate: (page: PageType) => void;
}

export default function Vaccines({ onNavigate }: VaccinesProps) {
  const vaccines = [
    {
      name: "Chicken Pox Vaccine",
      availability: "Ask on Request",
      contact: "Contact us +234789696968",
      description:
        "The Varicella Vaccine, administered as a single-dose vial, offers protection against chickenpox, a common and highly contagious childhood illness.",
    },
    {
      name: "Anti Rabies vaccine",
      availability: "Ask on Request",
      contact: "Contact us +234789696968",
      description:
        "The Anti Rabies vaccine is a preventive vaccine given to individuals who have been exposed to or are at risk of being exposed to the rabies virus.",
    },
  ];

  return (
    <div className="min-h-screen mt-40 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            Vaccination at your Doorstep
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Vaccination is one of the most effective ways to protect yourself
            and your loved ones from a range of preventable disease
          </p>
        </motion.div>

        {/* All Vaccinations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-8 border-b-2 border-green-600 pb-2 inline-block">
            All Vaccinations
          </h2>
        </motion.div>

        {/* Vaccine Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }, (_, index) => {
            const vaccine = vaccines[index % 2];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Syringe className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {vaccine.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {vaccine.availability}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          {vaccine.contact}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                      {vaccine.description}
                    </p>

                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                      onClick={() => onNavigate("vaccine-details")}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
