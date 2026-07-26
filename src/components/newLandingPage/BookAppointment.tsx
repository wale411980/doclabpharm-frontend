import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Users, Clock, Shield, Briefcase } from "lucide-react";
import second from "@/assets/second.png";
import consultation from "@/assets/consultation.png";
import { useGetSpecializationList, useGetConsultations } from "@/queries";
import type { Consultations } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookAppointment() {
  const benefits = [
    {
      icon: Users,
      title: "Convenience",
      description: "Easy access to healthcare",
    },
    {
      icon: Clock,
      title: "Reduced Wait Times",
      description: "Quick consultations",
    },
    {
      icon: Shield,
      title: "Continuity of Care",
      description: "Ongoing support",
    },
    { icon: Shield, title: "Privacy", description: "Secure consultations" },
  ];

  const [open, setOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultations | null>(null);

  const {
    data: specializations,
    isLoading,
    error,
  } = useGetSpecializationList();

  const {
    data: consult,
    isLoading: isLoadingConsult,
    error: errorConsult,
  } = useGetConsultations();

  if (isLoadingConsult)
    return (
      <p className="flex justify-center items-center">
        Loading consultations...
      </p>
    );
  if (errorConsult) return <p>Failed to load consultations.</p>;

  if (!consult || consult.length === 0) {
    return <p>No consultations found.</p>;
  }

  return (
    <div className="min-h-screen px-4 pb-12 mt-40">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Talk to a doctor anytime, anywhere
          </h1>
          <p className="text-gray-600 text-lg">
            healthcare at your fingertips.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-16"
        >
          <img
            src={second}
            alt="Doctor consultation"
            className="w-full rounded-lg shadow-xl"
          />
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Consultations</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
            <span className="text-sm font-medium">24/7 Service</span>
          </div>
        </motion.div>

        {/* In-Person Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-green-600 mb-6">
                Meet the Doctors in Person
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Get hands-on care from trusted experts.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={consultation}
                alt="Doctors with patient"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </section>

        {/* Virtual or Physical */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Virtual or Physical
            </h2>
            <p className="text-gray-600">
              Enjoy convenient medical consultations and doorstep medication
              delivery
            </p>
          </motion.div>

          {consult?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
              {consult?.map((consults: Consultations) => (
                <div key={consults.id}>
                  <Card className="bg-emerald-50 border-0 h-full flex flex-col py-4">
                    <CardHeader className="flex items-center justify-center pt-8">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-emerald-700" />
                      </div>
                    </CardHeader>
                    <CardContent className="text-center flex-1">
                      <h3 className="text-xl font-bold text-emerald-800 mb-2">
                        {consults.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{consults.details}</p>
                      <div className="mb-4">
                        <p className="text-xl font-bold text-emerald-800">
                          ₦ {Number(consults.price).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          per consultation
                        </p>
                      </div>
                      <div
                        className="text-sm text-left space-y-1 mb-6"
                        dangerouslySetInnerHTML={{
                          __html: consults.includeDetails.replace(
                            "<ul>",
                            '<ul class="list-disc list-inside text-emerald-700">'
                          ),
                        }}
                      ></div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-8"
                        onClick={() => {
                          setSelectedConsultation(consults); // ✅ save the selected consultation
                          setOpen(true); // ✅ open specialization modal
                        }}
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No consultations available
            </p>
          )}
        </section>

        {/* Why Book Consultation */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Why You Should Book A Consultation?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Specialization</DialogTitle>
            </DialogHeader>

            {isLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-sm text-red-500">
                Failed to load specializations
              </p>
            ) : (
              <Select
                onValueChange={(value) => setSelectedSpecialization(value)}
              >
                <SelectTrigger className="w-full mt-4">
                  <SelectValue placeholder="Choose a specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations?.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id.toString()}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              disabled={!selectedSpecialization || !selectedConsultation}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              onClick={() => {
                const query = new URLSearchParams({
                  specialization_id: selectedSpecialization!,
                  consult: "true",
                  price: selectedConsultation!.price.toString(),
                  name: selectedConsultation!.name,
                  service_id: selectedConsultation!.id.toString(),
                });

                navigate(`/doctors/available?${query.toString()}`);
                setOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
