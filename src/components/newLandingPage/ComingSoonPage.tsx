import { Facebook, Instagram } from "lucide-react"
import whiteLogo from "@/assets/whiteLogo.png";
import { Link } from "react-router-dom";
import xLogo from "@/assets/prime_twitter.png";
import doctorImage from "@/assets/smiling-black-doctor-with-papers1.png";


export default function ComingSoonPage() {

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat h-full w-full"
        style={{
          backgroundImage: `linear-gradient(76deg, rgba(58, 150, 108, 1) 0%, rgba(58, 150, 108, 1) 15%, rgba(12, 70, 84, 0.5) 55%, rgba(12, 70, 84, 0.5) 100%), url(${doctorImage})`,

        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo */}
        <div className="mb-8 md:mb-12 flex items-center gap-1 sm:gap-2 ">
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
            <img
              src={whiteLogo || "/placeholder.svg"}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Doclabpharm
          </span>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            <span className="text-green-400">DOCLABPHARM</span> IS LAUNCHING SOON
          </h1>
        </div>

        {/* Description */}
        <div className="text-center mb-8 md:mb-12 max-w-2xl">
          <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed mb-2">
            We are thrilled to announce the launch of DocLabPharm!
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 md:gap-6">
          <Link
            to="https://www.facebook.com/profile.php?id=61578936118099"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 flex items-center justify-center text-white hover:text-green-400 hover:border-green-400 transition-colors"
          >
            <Facebook className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <Link
            to="https://x.com/doclab_pharm"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 flex items-center justify-center text-white hover:text-green-400 hover:border-green-400 transition-colors"
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
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 flex items-center justify-center text-white hover:text-green-400 hover:border-green-400 transition-colors"
          >
            <Instagram className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  )
}
