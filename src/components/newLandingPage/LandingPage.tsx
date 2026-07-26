import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Smartphone, Play, Apple } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import type { PageType } from "./IndexPage";
import nearestDoctor from "@/assets/find-doctors.png";
import takeAppointment from "@/assets/take-appointment.png";
import getMembership from "@/assets/Get-Membership.png";
import firstTestimonial from "@/assets/first-testimonial1.jpeg";
import secondTestimonial from "@/assets/second-testimonial1.jpeg";
import thirdTestimonial from "@/assets/third-testimonial1.jpeg";
import downloadDoclabpharmApp from "@/assets/download-doclabpharm-app.png";
import { useAllDiagnosisList } from "@/queries";
import { useNavigate } from "react-router-dom";
import doctorImage from "@/assets/smiling-black-doctor-with-papers1.png";

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const navigate = useNavigate();
  const [tests, setTests] = useState<any[]>([]);

  const { mutate: diagnosisList } = useAllDiagnosisList();

  // Call the API once when the component mounts
  useEffect(() => {
    diagnosisList(undefined, {
      onSuccess: (data) => {
        setTests(data); // Set the state so the UI can render tests
      },
      onError: (err: any) => {
        console.error(
          "Failed to fetch diagnosis list:",
          err?.response?.data || err.message
        );
      },
    });
  }, [diagnosisList]);

  const faqs = [
    {
      question: "How do I book a test with Doclabpharm?",
      answer:
        "You can easily book a test by navigating to the 'Explore Health Tests' section, selecting your desired test, and proceeding to checkout. Our platform guides you through each step.",
    },
    {
      question: "What types of tests can I book through Doclabpharm?",
      answer:
        "Doclabpharm offers a wide range of tests including sexual health, women's health, COVID tests, general health, children's health, and men's health packages. You can explore all available options on our 'Explore Health Tests' page.",
    },
    {
      question: "Can I speak or schedule with any appointment?",
      answer:
        "Yes, you can schedule appointments with licensed doctors for both virtual and in-person consultations. Visit our 'Book Appointment' page to find a doctor and book your preferred slot.",
    },
  ];

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 min-h-screen flex items-center bg-cover bg-no-repeat"
        style={{
          background:
            `linear-gradient(76deg, rgba(58, 150, 108, 1) 0%, rgba(58, 150, 108, 1) 15%, rgba(12, 70, 84, 0.5) 55%, rgba(12, 70, 84, 0.5) 100%), url(${doctorImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Simplify Your Health & Wellbeing
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Access Over 500+ Laboratories, 50+ doctors, tests, drugs, and
                more—all in one app. Doctors can run and start operating today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-10 text-3xl font-bold rounded-full shadow-lg"
                  onClick={() => onNavigate("explore-health-tests")}
                >
                  Explore Health Tests
                </Button>
                <Button
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-emerald-700 bg-emerald-700 px-8 py-10 text-3xl font-bold rounded-full shadow-lg"
                  onClick={() => onNavigate("book-appointment")}
                >
                  Book Appointment
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Selling Packages */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Top Selling Packages
            </h2>
            <p className="text-gray-600 text-lg">
              We offer more than 500+ test for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tests?.slice(0, 4).map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Includes Tests</p>
                    <ul className="text-sm space-y-1 mb-6">
                      {pkg.category?.name && (
                        <li className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          {pkg.category?.name}
                        </li>
                      )}
                    </ul>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        ₦ {Number(pkg.price).toLocaleString()}
                      </span>

                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const payload = {
                            id: pkg.id,
                            labId: pkg.userId,
                            name: pkg.name,
                            price: pkg.price,
                            turnaround: pkg.turnaround,
                          };

                          localStorage.setItem(
                            "testBooking",
                            JSON.stringify(payload)
                          );

                          const params = new URLSearchParams({
                            id: String(pkg.id),
                            labId: String(pkg.userId),
                          });

                          navigate(
                            `/patient/bookings/select-date-time?${params.toString()}`
                          );
                        }}
                      >
                        Book Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
              onClick={() => onNavigate("explore-health-tests")}
            >
              View more
            </Button>
          </div>
        </div>
      </section>

      {/* Your Nearest Doctor */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src={nearestDoctor}
                  alt="Doctor with map"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Your Nearest Doctor
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Select preferred doctor and time slot to book virtual or home
                consultation. It's very easy and simple process to booking.
              </p>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onNavigate("book-appointment")}
              >
                Find Doctor Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urgent Online Care */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Urgent Online Care
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Talk to your health concern and we will assign you a doctor
                within 15 minutes.
              </p>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onNavigate("book-appointment")}
              >
                Book Appointment
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src={takeAppointment}
                  alt="Doctor with phone"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
                  <Badge className="bg-green-100 text-green-800">
                    Doctor Online
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src={getMembership}
                  alt="Doctor with map"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onNavigate("book-appointment")}
              >
                Doclabpharm Plus
              </Button>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 mt-6">
                Get paid for Virtual or Home consultations on your schedule
              </h2>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onNavigate("book-appointment")}
              >
                Get Membership
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Testimonials
            </h2>
            <p className="text-gray-600">
              Hear what some satisfied Patients have to say about Doclabpharm.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "I was amazed at the quality of service I received from
                    Doclabpharm. The doctors were professional and the platform
                    was easy to use."
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={secondTestimonial}
                      alt="Patient"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">John Emeka</p>
                      <p className="text-sm text-gray-500">Verified Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "I was genuinely amazed at the quality of service I received
                    from Doclabpharm. The doctors were not only professional but
                    also attentive and thorough. The platform itself was
                    seamless and user-friendly—making the entire experience
                    smooth and stress-free. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={firstTestimonial}
                      alt="Patient"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">Joy Adekunle</p>
                      <p className="text-sm text-gray-500">Verified Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Doclabpharm exceeded my expectations. The consultation
                    process was quick, the doctors were knowledgeable, and I
                    felt truly cared for. It's refreshing to find a healthcare
                    platform that puts patients first. I’ll definitely be using
                    their services again."
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={thirdTestimonial}
                      alt="Patient"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">Sarah Philip</p>
                      <p className="text-sm text-gray-500">Verified Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-20 px-4 bg-green-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Download Doclabpharm App
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Get 24/7 access to top licensed doctors for video and home
                consultations on the Doclabpharm App. Chat with doctors, order
                medications, and book lab tests — all from the comfort of your
                home.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <span>+234</span>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-xs"
                  />
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Send SMS
                </Button>
              </div>
              <div className="flex gap-4 mt-6">
                <motion.div
                  className="flex space-x-4"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.div variants={fadeInUp}>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 bg-transparent border-green-600 text-green-600 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300"
                      {...scaleOnHover}
                    >
                      <Apple className="h-5 w-5" />
                      <span>App Store</span>
                    </Button>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 bg-transparent border-green-600 text-green-600 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300"
                      {...scaleOnHover}
                    >
                      <Play className="h-5 w-5" />
                      <span>Google Play</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={downloadDoclabpharmApp}
                alt="Mobile App"
                className="mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
