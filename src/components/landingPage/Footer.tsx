import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import apple from "@/assets/mdi_apple.png";
import google from "@/assets/Vector-google.png";
import facebook from "@/assets/gg_facebook.png";
import x from "@/assets/prime_twitter.png";
import instagram from "@/assets/mdi_instagram.png";
import upArrow from "@/assets/up-arrow.png";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-green-600 text-white">
      <div className="px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" />
              <span className="font-bold text-xl">DocLabPharm</span>
            </div>
            <div className="flex items-center">
              <img src={apple} alt="apple logo" />
              <p>Get on iPhone</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={google} alt="play store logo" />
              <p>Get on Android</p>
            </div>

            <div className="flex space-x-4">
              <Link to="#" className="hover:text-white/80">
                <img src={facebook} alt="" />
              </Link>
              <Link to="#" className="hover:text-white/80">
                <img src={x} alt="" />
              </Link>
              <Link to="#" className="hover:text-white/80">
                <img src={instagram} alt="" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Company Profile
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Kits
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Speak with a Doctor
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  All tests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">More</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white text-sm">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  info@mydiaglab.com
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  +234 (0) 700 - DIAG - LAB
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  123 Medical Plaza, Victoria Island, Lagos, Nigeria
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <a href="#header" className="hover:text-white scroll-smooth">
            <img src={upArrow} alt="" />
            <span className="sr-only">Back to top</span>
          </a>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          <p>Copyright © MyDiagLab {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
