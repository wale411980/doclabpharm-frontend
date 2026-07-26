import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Microscope, Link, Clock } from "lucide-react";
import nurse from "@/assets/nurse-professional.png";

export function HealthcareProfessionals() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Increased Patient Reach and Volume",
      description:
        "Doctors can reach a broader patient base, including those with limited mobility or who live in remote areas, helping them deliver care where it’s most needed.",
    },
    {
      icon: <Microscope className="h-8 w-8 text-green-600" />,
      title: "Enhanced Patient Experience",
      description:
        "Patients appreciate the convenience of healthcare from home. A positive, comfortable experience can lead to higher patient satisfaction and better adherence to medical advice.",
    },
    {
      icon: <Link className="h-8 w-8 text-green-600" />,
      title: "Seamless Lab Integration",
      description:
        "Our phlebotomy feature ensures patients can get lab work done without visiting a clinic, allowing doctors to maintain high standards of care remotely and avoid delays in diagnosis.",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Get Incentives",
      description:
        "For every successful checkout for a patient, you get a decent percentage sent to you MyDocLab wallet.",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col h-full justify-center"
            >
              <img
                src={nurse}
                alt="Healthcare Professional"
                className="rounded-full max-w-[280px] mx-auto"
              />
            </motion.div>
          </div>
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-4">
                What's in for healthcare professionals?
              </h2>
              <p className="text-green-600">
                Simplify healthcare services for your patients. Access a network
                of trusted labs, book tests with ease, and receive results
                swiftly, all with the support of our healthcare team.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full bg-green-50 border-green-100 hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold mb-2 text-[#0c4654]">
                        {feature.title}
                      </h3>
                      <p className="text-[#0c4654] text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
