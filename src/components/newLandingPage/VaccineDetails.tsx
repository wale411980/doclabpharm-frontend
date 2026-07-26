import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Syringe,
  Book,
  Upload,
  DollarSign,
  UserCheck,
} from "lucide-react";
import type { PageType } from "./IndexPage";

interface VaccineDetailsProps {
  onNavigate: (page: PageType) => void;
}

export default function VaccineDetails({ onNavigate }: VaccineDetailsProps) {
  const steps = [
    {
      icon: Book,
      title: "Book a Vaccine",
      description: "Simply visit our website to place a booking for a Vaccine.",
    },
    {
      icon: Upload,
      title: "Upload A Doc",
      description:
        "Confirm your health status & upload negative result of the previous health test.",
    },
    {
      icon: DollarSign,
      title: "Get Vaccination",
      description:
        "Receive your result in your secure and confidential account within 48hours.",
    },
    {
      icon: UserCheck,
      title: "Get free Doctor's consultation",
      description:
        "To understand your result better get a free Doctor's consultation",
    },
  ];

  return (
    <div className="min-h-screen mt-40 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate("vaccines")}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vaccines
          </Button>
        </motion.div>

        {/* Vaccine Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Vaccine Icon */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center">
              <Syringe className="w-24 h-24 text-green-600" />
            </div>
          </motion.div>

          {/* Right Side - Vaccine Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-green-600">
              Yellow Fever
            </h1>

            <p className="text-gray-700 leading-relaxed">
              Yellow Fever is a vaccine available in a 10-dose vial that
              provides immunity against Yellow Fever, a mosquito-borne viral
              infection, and is crucial for travellers visiting Yellow
              Fever-endemic areas.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  Who is this vaccine for?
                </h3>
                <p className="text-gray-700">
                  The vaccine is recommended for individuals aged 9 months and
                  above, including both residents and travelers to areas where
                  yellow fever is endemic or where an outbreak has occurred. It
                  is especially important for those traveling to sub-Saharan
                  Africa and tropical regions of South America.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Dosage</h3>
                <p className="text-gray-700">1 Dose</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Ask on Request</h3>
                <p className="text-green-600 font-medium">
                  Contact us +234 899770998009
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-green-600 text-center mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onNavigate("book-appointment")}
          >
            Book Vaccination Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
