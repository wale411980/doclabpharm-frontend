import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen mt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-teal-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Company Profile
            </h1>

            <div className="space-y-6 text-lg leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold mb-4">About Doclabpharm</h2>
                <p className="opacity-90">
                  Doclabpharm is transforming how healthcare is accessed and
                  experienced. We believe quality healthcare should be simple,
                  accessible, and available to everyone — anytime, anywhere.
                  Through our platform, users can consult with top licensed
                  doctors via secure video calls or schedule home visits with
                  ease.
                </p>
              </div>

              <p className="opacity-90">
                Need prescriptions or lab work done? You can order medications
                and book lab tests from trusted, accredited laboratories — all
                from the comfort of your home. Our services are available 24/7,
                ensuring that you get the care you need, exactly when you need
                it. Whether it's a late-night health concern or a routine
                check-up, Doclabpharm is here to support your health journey
                every step of the way.
              </p>

              <p className="opacity-90 font-medium">
                Simple. Reliable. Convenient. That's healthcare reimagined —
                that's Doclabpharm.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-teal-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Careers at Doclabpharm
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Join Our Mission to Redefine Healthcare
                </h3>
                <p className="opacity-90">
                  At Doclabpharm, we're building the future of healthcare — one
                  where accessibility, quality, and innovation go hand in hand.
                  We're a team of dedicated professionals driven by a shared
                  passion for making healthcare better for everyone.
                </p>
              </div>

              <p className="opacity-90">
                Whether you're a medical professional, developer, operations
                expert, or customer care specialist, your work here makes a
                direct impact in people's lives.
              </p>

              <div>
                <h4 className="text-xl font-bold mb-4">Why Work With Us?</h4>
                <ul className="space-y-3 opacity-90">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <span>Be part of a mission-led, purpose-driven team.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <span>
                      Flexible work schedules and remote-friendly roles.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <span>Opportunities to grow, learn, and lead.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <span>
                      A culture that values innovation, compassion, and
                      collaboration.
                    </span>
                  </li>
                </ul>
              </div>

              <p className="opacity-90">
                We're always looking for talented individuals ready to make a
                difference. Explore open roles or send your resume to
                careers@doclabpharm.com.
              </p>

              <p className="opacity-90 font-medium">
                Let's build something meaningful — together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
