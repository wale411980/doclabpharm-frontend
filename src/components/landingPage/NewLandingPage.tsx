import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Phone,
  Clock,
  Star,
  Download,
  ChevronDown,
  Menu,
  X,
  Stethoscope,
  Calendar,
  Shield,
  Heart,
  Smartphone,
  ArrowRight,
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  Award,
  Globe,
  Zap,
  HeartHandshake,
  Activity,
  UserCheck,
  Clock3,
  PhoneCall,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { LoginModal } from "../authUser/Login";
import { RegisterModal } from "../authUser/Register";
import Register from "../authDoctor/Register";
import { Login } from "../authDoctor/Login";
import { RoleSelectionModal } from "../authUser/RoleSelection";
import { DoctorRoleSelectionModal } from "../authDoctor/DoctorRoleSelection";
import logo from "@/assets/tab-logo.png";
import secondImg from "@/assets/second.png";
import findDoctors from "@/assets/find-doctors.png";
import takeAppointment from "@/assets/take-appointment.png";
import downloadApp from "@/assets/download-doclabpharm-app.png";

export default function NewLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] =
    useState(false);
  const [isRoleSelectionModalOpenLogin, setIsRoleSelectionModalOpenLogin] =
    useState(false);
  const [isCaregiverRegisterOpen, setIsCaregiverRegisterOpen] = useState(false);
  const [isCaregiverLoginOpen, setIsCaregiverLoginOpen] = useState(false);

  const openRegisterModal = () => {
    setIsRoleSelectionModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const openLoginModal = () => {
    setIsRoleSelectionModalOpenLogin(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleRoleSelection = (role: "patient" | "caregiver") => {
    setIsRoleSelectionModalOpen(false);
    if (role === "patient") {
      setIsRegisterModalOpen(true);
    } else {
      setIsCaregiverRegisterOpen(true);
    }
  };

  const handleRoleSelectionLogin = (role: "patient" | "caregiver") => {
    setIsRoleSelectionModalOpenLogin(false);
    if (role === "patient") {
      setIsLoginModalOpen(true);
    } else {
      setIsCaregiverLoginOpen(true);
    }
  };

  // const { scrollYProgress } = useScroll()
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      const showButton = window.scrollY > 500;
      setIsScrolled(scrolled);
      setShowBackToTop(showButton);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a visit with MyDocLab?",
      answer:
        "You can book a visit through our website or mobile app. Simply select your preferred doctor, choose an available time slot, and confirm your appointment.",
    },
    {
      question: "What types of visits can I book through MyDocLab?",
      answer:
        "You can book virtual consultations, in-person visits, urgent care appointments, and follow-up consultations with our network of healthcare providers.",
    },
    {
      question: "Can I cancel or reschedule my next appointment?",
      answer:
        "Yes, you can cancel or reschedule your appointment up to 24 hours before your scheduled time through your patient portal or by calling our support team.",
    },
    {
      question: "Do you offer prescription refill services?",
      answer:
        "Yes, our doctors can provide prescription refills during your consultation. Prescriptions are sent directly to your preferred pharmacy.",
    },
    {
      question: "How do I pay for my visit?",
      answer:
        "We accept various payment methods including insurance, credit cards, and HSA/FSA accounts. Payment is processed securely through our platform.",
    },
    {
      question: "What if I have questions or concerns about my visit results?",
      answer:
        "You can message your doctor through our secure patient portal or schedule a follow-up consultation to discuss any concerns about your visit results.",
    },
  ];

  const stats = [
    { number: "50+", label: "Licensed Doctors", icon: UserCheck },
    { number: "90+", label: "Partner Laboratories", icon: Award },
    { number: "10k+", label: "Happy Patients", icon: Heart },
    { number: "24/7", label: "Available Support", icon: Clock3 },
  ];

  const services = [
    {
      icon: PhoneCall,
      title: "Virtual Consultations",
      description:
        "Connect with healthcare professionals from anywhere, anytime through secure video calls.",
      color: "green",
    },
    {
      icon: Activity,
      title: "Lab Tests",
      description:
        "Comprehensive lab testing services with quick results and detailed reports.",
      color: "blue",
    },
    {
      icon: HeartHandshake,
      title: "Health Monitoring",
      description:
        "Continuous health tracking and personalized recommendations for better wellness.",
      color: "purple",
    },
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description:
        "Round-the-clock medical support and emergency consultation services.",
      color: "orange",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "HIPAA-compliant platform ensuring your medical data is always protected.",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description:
        "Get connected with healthcare professionals in under 60 seconds.",
    },
    {
      icon: Globe,
      title: "Available Everywhere",
      description:
        "Access healthcare services from anywhere with internet connection.",
    },
    {
      icon: CheckCircle,
      title: "Verified Doctors",
      description:
        "All our healthcare providers are licensed and thoroughly vetted.",
    },
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  return (
    <>
      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Header */}
        <motion.header
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100"
              : "bg-white shadow-sm"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => scrollToSection("hero")}
              >
                <div className="relative">
                  <img src={logo} alt="logo" className="h-8 w-8" />
                  <motion.div
                    className="absolute inset-0 bg-green-400 rounded-full opacity-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">
                  DocLabPharm
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-8">
                {[
                  { name: "Home", id: "hero" },
                  { name: "Services", id: "services" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "About Us", id: "about" },
                  { name: "FAQs", id: "faqs" },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </motion.div>
                ))}
              </nav>

              {/* Tablet Navigation */}
              <nav className="hidden md:flex lg:hidden space-x-6">
                {[
                  { name: "Home", id: "hero" },
                  { name: "Services", id: "services" },
                  { name: "About", id: "about" },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group text-sm"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </motion.div>
                ))}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent transition-all duration-300 hover:shadow-md"
                    {...scaleOnHover}
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLoginModal();
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button
                    className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    {...scaleOnHover}
                    onClick={() => {
                      setIsMenuOpen(false);
                      openRegisterModal();
                    }}
                  >
                    Register
                  </Button>
                </motion.div>
              </div>

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  className="md:hidden border-t border-gray-100"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.nav
                    className="flex flex-col space-y-4 py-4"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {[
                      { name: "Home", id: "hero" },
                      { name: "Services", id: "services" },
                      { name: "Testimonials", id: "testimonials" },
                      { name: "About Us", id: "about" },
                      { name: "FAQs", id: "faqs" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.name}
                        variants={fadeInUp}
                        transition={{ delay: index * 0.1 }}
                      >
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 block py-2 text-left w-full"
                        >
                          {item.name}
                        </button>
                      </motion.div>
                    ))}
                    <motion.div
                      className="flex flex-col space-y-3 pt-4"
                      variants={fadeInUp}
                    >
                      <Button
                        variant="outline"
                        className="border-green-600 text-green-600 bg-transparent"
                        onClick={openLoginModal}
                      >
                        Login
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={openRegisterModal}
                      >
                        Register
                      </Button>
                    </motion.div>
                  </motion.nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section
          id="hero"
          className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-16 lg:py-24 relative overflow-hidden"
          style={{ backgroundImage: "url('./src/assets/first.png')" }}
        >
          {/* Background Animation */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(76deg, rgba(58, 150, 108, 1) 0%, rgba(58, 150, 108, 1) 15%, rgba(12, 70, 84, 0.5) 55%, rgba(12, 70, 84, 0.5) 100%)",
            }}
          >
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 30, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                className="space-y-8"
                ref={heroRef}
                initial="initial"
                animate={heroInView ? "animate" : "initial"}
                variants={staggerContainer}
              >
                <motion.div className="space-y-6" variants={fadeInUp}>
                  <motion.h1
                    className="text-4xl lg:text-6xl font-bold text-white leading-tight"
                    variants={fadeInUp}
                  >
                    <motion.span
                      className="block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      Simplify Your
                    </motion.span>
                    <motion.span
                      className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white bg-clip-text"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      Health & Wellbeing
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    className="text-xl text-white leading-relaxed max-w-2xl mx-auto"
                    variants={fadeInUp}
                  >
                    Get instant, 24/7 lab tests & book tests. Chat with licensed
                    & certified doctors from the comfort of your home.
                  </motion.p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  variants={staggerContainer}
                >
                  <motion.div
                    className="flex items-center space-x-3 text-white"
                    variants={fadeInUp}
                  >
                    <div className="relative">
                      <Clock className="h-5 w-5" />
                      <motion.div
                        className="absolute inset-0 bg-green-400 rounded-full opacity-30"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    </div>
                    <span className="font-medium">
                      Over 50+ Licensed Doctors
                    </span>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-3 text-white"
                    variants={fadeInUp}
                  >
                    <div className="relative">
                      <Shield className="h-5 w-5" />
                      <motion.div
                        className="absolute inset-0 bg-green-400 rounded-full opacity-30"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 1,
                        }}
                      />
                    </div>
                    <span className="font-medium">
                      Over 90+ Licensed Laboratories
                    </span>
                  </motion.div>
                </motion.div>

                <motion.p className="text-white text-sm" variants={fadeInUp}>
                  Providing quality lab & healthcare services to millions of
                  people
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp}>
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                      {...scaleOnHover}
                    >
                      <Calendar className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      Book Appointment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Virtual Consultation Demo Section */}
        <section className="py-16 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 relative backdrop-blur-sm max-w-lg w-full"
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="text-center relative z-10">
                    <img src={secondImg} alt="doctor image" />
                  </div>
                </div>

                {/* Floating consultation cards */}
                <motion.div
                  className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-green-100"
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <MessageSquare className="h-5 w-5 text-black" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Consultation</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-green-100"
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <PhoneCall className="h-5 w-5 text-black" />
                    </motion.div>
                    <span className="text-sm font-medium">24/7 Service</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <stat.icon className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <motion.h3
                    className="text-3xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      duration: 0.6,
                      type: "spring",
                    }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive healthcare services designed to meet all your
                medical needs with convenience and quality.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-${service.color}-200 hover:border-${service.color}-300`}
                    {...scaleOnHover}
                  >
                    <CardContent className="p-8 text-center">
                      <motion.div
                        className={`w-16 h-16 bg-${service.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <service.icon
                          className={`h-8 w-8 text-${service.color}-600`}
                        />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-4 group-hover:text-green-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose MyDocLab?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience healthcare like never before with our innovative
                platform and dedicated medical professionals.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <feature.icon className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Find Your Nearest Doctor */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="bg-green-50 rounded-2xl p-12 h-96 flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-emerald-200/30"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 30,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="text-center relative z-10">
                    <img src={findDoctors} alt="find doctors" />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Your Nearest Doctor
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Select preferred doctor and time slot to book virtual or
                    home consultation. So very easy and simple to book your
                    appointment.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    {...scaleOnHover}
                  >
                    Find Doctor Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Urgent Online Care */}
        <section className="py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Urgent Online Care
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Talk to your health specialist and we will assign you a
                    doctor in seconds.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    {...scaleOnHover}
                  >
                    <Calendar className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    New Appointment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="text-center relative z-10">
                    <img src={takeAppointment} alt="find doctors" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Virtual/Home Consultations */}
        <section className="py-20 bg-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className="flex justify-center space-x-6 mb-8"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {[
                        { icon: Stethoscope, color: "green" },
                        { icon: Heart, color: "blue" },
                        { icon: Shield, color: "purple" },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className={`w-16 h-16 bg-${item.color}-100 rounded-full flex items-center justify-center relative`}
                          variants={fadeInUp}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <item.icon
                            className={`h-8 w-8 text-${item.color}-600`}
                          />
                          <motion.div
                            className={`absolute inset-0 bg-${item.color}-400 rounded-full opacity-20`}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: index * 0.5,
                            }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-3">
                        Expert Medical Team
                      </h3>
                      <p className="text-gray-600">
                        Certified healthcare professionals
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <motion.div
                    className="inline-block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Consultations Available
                    </div>
                  </motion.div>
                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Get paid for Virtual or Home consultations on your schedule
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    {...scaleOnHover}
                  >
                    Get Membership
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Testimonials
              </h2>
              <p className="text-lg text-gray-600">
                Hear what some satisfied Patients have to say about DocLabpharm.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                {
                  name: "Sarah Johnson",
                  text: "The virtual consultation was incredibly convenient. The doctor was professional and thorough in their examination.",
                  bg: "green",
                  delay: 0,
                },
                {
                  name: "Michael Davis",
                  text: "Quick and easy appointment booking. The lab results were delivered promptly and the follow-up care was excellent.",
                  bg: "blue",
                  delay: 0.2,
                },
                {
                  name: "Dr. Emily Chen",
                  text: "As a healthcare provider, I appreciate the platform's efficiency and the quality of patient interactions it enables.",
                  bg: "purple",
                  delay: 0.4,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ delay: testimonial.delay }}
                  className={index === 2 ? "md:col-span-2 lg:col-span-1" : ""}
                >
                  <Card
                    className={`bg-${testimonial.bg}-50 border-${testimonial.bg}-200 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                    {...scaleOnHover}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <motion.div
                          className={`w-14 h-14 bg-${testimonial.bg}-200 rounded-full mr-4 relative overflow-hidden`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <motion.div
                            className={`absolute inset-0 bg-${testimonial.bg}-300`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {testimonial.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: 0.8 + i * 0.1,
                                  duration: 0.3,
                                }}
                              >
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                        "{testimonial.text}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mobile App Download */}
        <section className="py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Download Doclabpharm App
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Get the Doclabpharm App today and take control of your
                    health with Doclabpharm App. Chat with doctors, order
                    medications, and book lab tests — all from the comfort of
                    your home.
                  </motion.p>
                </div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <p className="text-gray-700 font-medium">
                    Get the app download for free
                  </p>
                  <div className="flex items-center space-x-4"></div>
                </motion.div>

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
                      <Smartphone className="h-5 w-5" />
                      <span>App Store</span>
                    </Button>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 bg-transparent border-green-600 text-green-600 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-300"
                      {...scaleOnHover}
                    >
                      <Download className="h-5 w-5" />
                      <span>Google Play</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="bg-green-200 rounded-full w-80 h-80 mx-auto flex items-center justify-center relative overflow-hidden"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-300/50 to-emerald-300/50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="bg-white rounded-3xl p-6 shadow-2xl relative z-10"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-48 h-96 bg-gradient-to-b from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-green-300/30 to-transparent"
                        animate={{ y: [0, -20, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="text-center relative z-10">
                        <img src={downloadApp} alt="app download" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section
          id="about"
          className="py-20 bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white relative overflow-hidden"
          style={{
            backgroundImage: "url('./src/assets/about-us.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              className="max-w-4xl mx-auto space-y-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                className="text-3xl lg:text-4xl font-bold"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                About Us
              </motion.h2>
              <motion.p
                className="text-lg leading-relaxed opacity-90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.9, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Doclabpharm provides comprehensive healthcare services,
                connecting patients with qualified healthcare professionals
                through our innovative platform. We are committed to making
                healthcare accessible, convenient, and affordable for everyone.
                Our team of experienced doctors and healthcare specialists are
                dedicated to providing quality care and ensuring the best health
                outcomes for our patients. With cutting-edge technology and a
                patient-first approach, we're revolutionizing the way healthcare
                is delivered.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faqs" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.button
                      className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-green-50 focus:outline-none focus:bg-green-50 transition-all duration-300"
                      onClick={() => toggleFaq(index)}
                      whileHover={{
                        backgroundColor: "rgba(34, 197, 94, 0.05)",
                      }}
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ChevronDown className="h-5 w-5 text-green-600 flex-shrink-0" />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-6 bg-green-50/50">
                            <motion.p
                              className="text-gray-600 leading-relaxed"
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.3 }}
                            >
                              {faq.answer}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-5 gap-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="lg:col-span-2" variants={fadeInUp}>
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img src={logo} alt="logo" className="h-8 w-8" />
                  </motion.div>
                  <span className="ml-3 text-xl font-bold">DocLabPharm</span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Providing quality healthcare services and connecting patients
                  with qualified healthcare professionals.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-6"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-green-400 hover:text-green-400 transition-all duration-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Get on Android
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-green-400 hover:text-green-400 transition-all duration-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Get on App Store
                  </Button>
                </motion.div>
              </motion.div>

              {[
                {
                  title: "About Us",
                  links: [
                    "Company Profile",
                    "Careers",
                    "Leadership Team",
                    "Doclabpharm Blog",
                  ],
                },
                {
                  title: "For Patients",
                  links: [
                    "Search for Doctor",
                    "Book Lab Test",
                    "Book Diagnostic Tests",
                    "Health Checkup Plans",
                  ],
                },
                {
                  title: "More",
                  links: [
                    "Privacy Policy",
                    "Refund Policy",
                    "Terms & Conditions",
                    "Contact Us",
                  ],
                },
              ].map((section, sectionIndex) => (
                <motion.div key={section.title} variants={fadeInUp}>
                  <h3 className="font-semibold mb-6 text-lg">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={link}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: sectionIndex * 0.1 + linkIndex * 0.05,
                          duration: 0.5,
                        }}
                      >
                        <Link
                          to="#"
                          className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                        >
                          {link}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="border-t border-gray-800 mt-12 pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-400 text-sm">
                  Copyright © Doclabpharm 2025
                </div>
                <div className="flex items-center space-x-8 text-gray-400">
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05, color: "#22c55e" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+234 903 8888</span>
                  </motion.div>
                  <motion.div
                    className="text-sm"
                    whileHover={{ scale: 1.05, color: "#22c55e" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Email: hello@doclabpharm.com
                  </motion.div>
                  <div className="flex items-center space-x-4">
                    {[Facebook, Twitter, Instagram, Linkedin].map(
                      (Icon, index) => (
                        <motion.a
                          key={index}
                          href="#"
                          className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onOpenRegister={() => {
          closeLoginModal();
          openRegisterModal();
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onOpenLogin={() => {
          closeRegisterModal();
          openLoginModal();
        }}
      />

      {isCaregiverRegisterOpen && (
        <Register
          isOpen={isCaregiverRegisterOpen}
          onClose={() => setIsCaregiverRegisterOpen(false)}
          onOpenLogin={() => {
            setIsCaregiverRegisterOpen(false);
            openLoginModal();
          }}
        />
      )}

      {isCaregiverLoginOpen && (
        <Login
          isOpen={isCaregiverLoginOpen}
          onClose={() => setIsCaregiverLoginOpen(false)}
          onOpenRegister={() => {
            setIsCaregiverLoginOpen(false);
            openRegisterModal();
          }}
        />
      )}

      <RoleSelectionModal
        isOpen={isRoleSelectionModalOpen}
        onClose={() => setIsRoleSelectionModalOpen(false)}
        onContinue={handleRoleSelection}
      />

      <DoctorRoleSelectionModal
        isOpen={isRoleSelectionModalOpenLogin}
        onClose={() => setIsRoleSelectionModalOpenLogin(false)}
        onContinue={handleRoleSelectionLogin}
      />
    </>
  );
}
