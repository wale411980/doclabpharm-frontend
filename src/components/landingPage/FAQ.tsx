import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FAQ() {
  const faqs = [
    {
      question: "How do I book a test with MyDocLab?",
      answer:
        "To book a test with MyDocLab, visit our website/mobile app, select preferred laboratory location, choose the desired test and make payments. You can also book a test by contacting our customer support team.",
    },
    {
      question: "What types of tests can I book through MyDocLab",
      answer:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, obcaecati ipsam quisquam corporis et amet nulla incidunt aliquam quis nemo eveniet magnam aut aperiam cupiditate expedita maiores inventore accusantium officia!",
    },
    {
      question: "Can I cancel or reschedule my test appointment?",
      answer:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, obcaecati ipsam quisquam corporis et amet nulla incidunt aliquam quis nemo eveniet magnam aut aperiam cupiditate expedita maiores inventore accusantium officia!",
    },
    {
      question: "Do you offer home sample collection services?",
      answer:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, obcaecati ipsam quisquam corporis et amet nulla incidunt aliquam quis nemo eveniet magnam aut aperiam cupiditate expedita maiores inventore accusantium officia!",
    },
    {
      question: "How do I pay for my test?",
      answer:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, obcaecati ipsam quisquam corporis et amet nulla incidunt aliquam quis nemo eveniet magnam aut aperiam cupiditate expedita maiores inventore accusantium officia!",
    },
    {
      question: "What if I have questions or concerns about my test results?",
      answer:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, obcaecati ipsam quisquam corporis et amet nulla incidunt aliquam quis nemo eveniet magnam aut aperiam cupiditate expedita maiores inventore accusantium officia!",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-lg shadow-sm"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 last:border-0"
              >
                <AccordionTrigger className="py-4 px-6 text-left font-medium text-gray-900 hover:text-green-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
