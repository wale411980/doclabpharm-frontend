import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Community() {
  return (
    <section className="py-16 bg-white">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#3A966C]">
            Join our community
          </h2>
          <p className="text-[#3A966C] max-w-2xl mx-auto font-normal">
            Hear what some satisfied visitors have to say about MyDocLab.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-8 text-lg

"
          >
            Subscribe to our newsletter
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
