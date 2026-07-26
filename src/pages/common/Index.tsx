import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/landingPage/Navbar";
import { NavbarLoggedIn } from "@/components/landingPage/NavbarLoggedIn";
import { Hero } from "@/components/landingPage/Hero";
import { HealthcareProfessionals } from "@/components/landingPage/HealthCareProfessionals";
import { GetStarted } from "@/components/landingPage/GetStarted";
import { Features } from "@/components/landingPage/Features";
import { ExplorePackages } from "@/components/landingPage/ExplorePackages";
import { TopSellingPackages } from "@/components/landingPage/TopSellingPackages";
import Testimonials from "@/components/landingPage/Testimonials";
import { FAQ } from "@/components/landingPage/FAQ";
import { Mission } from "@/components/landingPage/Mission";
import { Community } from "@/components/landingPage/Community";
import { Footer } from "@/components/landingPage/Footer";
import { ThemeProvider } from "@/components/landingPage/ThemeProvider";

function MyDocLabLanding() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background">
        {user ? <NavbarLoggedIn /> : <Navbar />}
        <main>
          <Hero />
          <HealthcareProfessionals />
          <GetStarted />
          <Features />
          <ExplorePackages />
          <TopSellingPackages />
          <Testimonials />
          <FAQ />
          <Mission />
          <Community />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default MyDocLabLanding;
