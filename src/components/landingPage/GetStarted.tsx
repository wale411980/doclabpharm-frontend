import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function GetStarted() {
  return (
    <section className="py-12 bg-white">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-sm text-[#3A966CB2] mb-2 font-medium">
            We have a catalogue of different test types ranging from single
            tests, test packages to pathology, genetics & imaging test
            categories.
          </p>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white mt-10 rounded-full"
            size="lg"
          >
            Book a Test
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#3A966C]">
            Get Started
          </h2>
          <p className="text-[#3A966CB2] mb-8 max-w-2xl mx-auto font-medium">
            Start your journey to better health with these simple steps. It only
            takes a few minutes to book a test.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
