import { Link } from "react-router-dom";
import applelogo from "@/assets/appleLogo.png";
import googleplaylogo from "@/assets/googlePlayLogo.png";
import star from "@/assets/star-four-fill.png";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      className="relative text-white overflow-hidden w-full h-screen bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url('./src/assets/smiling-black-doctor-with-papers1.png')",
      }}
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/doctor-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div
        className="relative z-10 py-12 md:py-20 w-full h-full flex justify-start items-center pl-6 lg:pl-20"
        style={{
          background:
            "linear-gradient(259.87deg, rgba(12, 70, 84, 0.6) 14.19%, rgba(58, 150, 108, 0.99) 84.69%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 max-w-lg w-full"
        >
          <div className="inline-flex items-center rounded-full bg-green-900 px-3 py-1 text-sm">
            <span className="mr-1">
              <img src={star} alt="star" />
            </span>{" "}
            Over 70 Licensed Doctors
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Order Reliable Medical Tests from Verified Labs Across Nigeria
          </h1>
          <p className="text-white/80 text-lg">
            Easily book and track medical tests from the comfort of your home.
            Accurate results and affordable care.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 w-full justify-center sm:justify-start">
            {/* Wrapper to ensure proper padding and spacing */}
            <div className="w-full sm:w-auto pr-6">
              <Link
                to="#"
                className="flex items-center justify-center rounded-full bg-black px-6 py-2 my-2 sm:my-4 w-full sm:w-auto transition-all hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <img
                    src={googleplaylogo}
                    alt="Google Play Logo"
                    className="w-8 h-8"
                  />
                  <div className="ml-3 text-left">
                    <p className="text-xs text-white">GET IT ON</p>
                    <p className="text-lg sm:text-2xl font-medium text-white">
                      Google Play
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="w-full sm:w-auto pr-6">
              <Link
                to="#"
                className="flex items-center justify-center rounded-full bg-black px-6 py-2 my-2 sm:my-4 w-full sm:w-auto transition-all hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <img src={applelogo} alt="Apple Logo" className="w-8 h-8" />
                  <div className="ml-3 text-left">
                    <p className="text-xs text-white">Download on the</p>
                    <p className="text-lg sm:text-2xl font-medium text-white">
                      App Store
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
