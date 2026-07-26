import { motion } from "framer-motion";
import googleApple from "@/assets/google-apple-logo.png";
import phoneView from "@/assets/phoneView.png";

export function Mission() {
  return (
    <section className="py-16 bg-green-50">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <h4
            className="text-[#3A966C] font-semibold
"
          >
            Get the MyDocLab's app
          </h4>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#3A966C]">
            We are on a mission to better healthcare.
          </h2>
          <p className="text-[#3A966C] font-semibold">
            Be a part of us today and get quality healthcare services at the tip
            of your finger—Be healthy, stay healthy.
          </p>

          <div className="flex justify-center items-center mt-6 gap-4 flex-col">
            <img src={googleApple} alt="googleApple logo" />
            <img
              src={phoneView}
              alt="Doctor with patient"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
