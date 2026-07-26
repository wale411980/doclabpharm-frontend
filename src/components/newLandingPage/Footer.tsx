import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import whiteLogo from "@/assets/whiteLogo.png";
import { Link } from "react-router-dom";
import GoogleLogo from "@/assets/Vector-google.png";
import AppleLogo from "@/assets/appleLogo.png";
import xLogo from "@/assets/prime_twitter.png";

export default function Footer() {
  return (
    <footer className="bg-emerald-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and App Downloads */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={whiteLogo} alt="logo" />
                </div>
                <span className="text-xl font-bold">Doclabpharm</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-emerald-700 border-green-600 text-green-600 hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <img src={AppleLogo} alt="Apple Logo" className="h-5 w-5" />
                    <span className="text-white">App Store</span>
                  </Button>
                </div>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-emerald-700 border-green-600 text-green-600 hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={GoogleLogo}
                      alt="Google Logo"
                      className="h-5 w-5"
                    />
                    <span className="text-white">Google Play</span>
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm opacity-80">
                  Copyright © Doclabpharm {new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-bold text-lg mb-4">Contact us</h3>
            <div className="space-y-2 text-sm">
              <p>+ 234 9078 8468</p>
              <p>Mon - Sat (7am - 6pm)</p>
              <p>info@doclabpharm.com</p>
              <p>www.doclabpharm.com</p>
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                to="https://www.facebook.com/profile.php?id=61578936118099"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <Link
                to="https://x.com/doclab_pharm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={xLogo}
                  alt="X Logo"
                  className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link
                to="https://www.instagram.com/doclab_pharm/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
