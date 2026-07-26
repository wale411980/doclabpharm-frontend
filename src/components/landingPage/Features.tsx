import { motion } from "framer-motion";
import { Download, Calendar, Zap } from "lucide-react";
import download from "@/assets/download-man.png";
import book from "@/assets/book-test.png";
import result from "@/assets/result.png";

export function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16"
        >
          <div className="md:order-1">
            <img
              src={download}
              alt="Download the app"
              className="rounded-lg w-full h-auto object-cover aspect-video"
            />
          </div>
          <div className="md:order-2">
            <div className="mb-4">
              <Download className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold pt-3 text-green-600">
                Download the app
              </h3>
            </div>
            <p className="text-[#3A966CB2] font-medium">
              Download the app version compactable for your device and sign-up.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16 md:flex-row-reverse"
        >
          <div className="md:order-2">
            <img
              src={book}
              alt="Book a test"
              className="rounded-lg w-full h-auto object-cover aspect-video"
            />
          </div>
          <div className="md:order-1">
            <div className="mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold pt-3 text-green-600">
                Book a test
              </h3>
            </div>
            <p className="text-[#3A966CB2] font-medium">
              Explore varieties of tests available, successfully book test and
              have it assigned to a phlebotomist and health care center for
              assessment.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16"
        >
          <div className="md:order-1">
            <img
              src={result}
              alt="Get result quickly"
              className="rounded-lg w-full h-auto object-cover aspect-video"
            />
          </div>
          <div className="md:order-2">
            <div className="mb-4">
              <Zap className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold pt-3 text-green-600">
                Get result quickly
              </h3>
            </div>
            <p className="text-[#3A966CB2] font-medium">
              Results get back in about 24-72 hours time frame upon test sample
              receival, with feedbacks on what to do next to making you feel
              better 🙂
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
