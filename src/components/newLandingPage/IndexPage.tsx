import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import ExploreHealthTests from "./ExploreHealthTests";
import BookAppointment from "./BookAppointment";
import AboutUs from "./AboutUs";
import Vaccines from "./Vaccines";
import VaccineDetails from "./VaccineDetails";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton"; // Import the new component

export type PageType =
  | "home"
  | "explore-health-tests"
  | "book-appointment"
  | "about-us"
  | "vaccines"
  | "vaccine-details";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.5,
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "explore-health-tests":
        return <ExploreHealthTests />;
      case "book-appointment":
        return <BookAppointment />;
      case "about-us":
        return <AboutUs />;
      case "vaccines":
        return <Vaccines onNavigate={setCurrentPage} />;
      case "vaccine-details":
        return <VaccineDetails onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 overflow-hidden">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollToTopButton /> {/* Add the scroll-to-top button here */}
      </div>
    </>
  );
}
