import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import firstPerson from "@/assets/first-testimonial1.jpeg";
import secondPerson from "@/assets/second-testimonial1.jpeg";
import thirdPerson from "@/assets/third-testimonial1.jpeg";

interface Testimonial {
  id: number;
  name: string;
  image: string;
  quote: string;
  role?: string;
}

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Olumide Afowowe",
      image: firstPerson,
      quote:
        "I was amazed at how easy it was to book a lab test online with myDocLab. The process was seamless, and I received my results quickly. The home service option was a game-changer for me, as I have mobility issues. Thank you, MyDocLab.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      image: secondPerson,
      quote:
        "MyDocLab has revolutionized how I manage my health. The convenience of booking tests online and getting results directly on my phone has saved me countless hours. Their customer service is exceptional!",
    },
    {
      id: 3,
      name: "Michael Chen",
      image: thirdPerson,
      quote:
        "As someone who needs regular blood work, finding MyDocLab was a blessing. Their home service is punctual, professional, and makes the whole process stress-free. I highly recommend their services to everyone.",
    },
  ];

  useEffect(() => {
    let interval: number | undefined;

    if (autoplay) {
      interval = window.setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, testimonials.length]);

  const handlePrevious = () => {
    setAutoplay(false);
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
            Testimonials
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            How what some satisfied clients have to say about MyDocLab.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-md hover:bg-emerald-50"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5 text-emerald-600" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-md hover:bg-emerald-50"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5 text-emerald-600" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Mobile view - single testimonial */}
            <div className="md:hidden">
              <TestimonialCard testimonial={testimonials[currentTestimonial]} />
            </div>

            {/* Desktop view - three testimonials with focus on current */}
            <div className="hidden md:block md:col-span-3">
              <motion.div
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{
                  opacity: currentTestimonial === 0 ? 1 : 0.7,
                  scale: currentTestimonial === 0 ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
                className="h-full"
                onClick={() => {
                  setAutoplay(false);
                  setCurrentTestimonial(0);
                }}
              >
                <TestimonialPreview
                  testimonial={testimonials[0]}
                  isActive={currentTestimonial === 0}
                />
              </motion.div>
            </div>

            <div className="hidden md:block md:col-span-3">
              <motion.div
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{
                  opacity: currentTestimonial === 1 ? 1 : 0.7,
                  scale: currentTestimonial === 1 ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
                className="h-full"
                onClick={() => {
                  setAutoplay(false);
                  setCurrentTestimonial(1);
                }}
              >
                <TestimonialPreview
                  testimonial={testimonials[1]}
                  isActive={currentTestimonial === 1}
                />
              </motion.div>
            </div>

            <div className="hidden md:block md:col-span-6">
              <motion.div
                key={testimonials[currentTestimonial].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <TestimonialCard
                  testimonial={testimonials[currentTestimonial]}
                />
              </motion.div>
            </div>
          </div>

          {/* Mobile navigation dots */}
          <div className="flex justify-center mt-6 md:hidden">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`w-2 h-2 p-0 rounded-full mx-1 ${
                  currentTestimonial === index
                    ? "bg-emerald-600"
                    : "bg-gray-300"
                }`}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentTestimonial(index);
                }}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialPreview({
  testimonial,
  isActive,
}: {
  testimonial: Testimonial;
  isActive: boolean;
}) {
  return (
    <Card
      className={`h-full overflow-hidden transition-all duration-300 cursor-pointer ${
        isActive ? "border-emerald-500" : "border-transparent"
      }`}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
          <img
            src={testimonial.image || "/placeholder.svg"}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full overflow-hidden bg-emerald-100/50">
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 h-full">
        <div className="md:w-1/3 flex justify-center">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
            <AvatarFallback className="bg-emerald-200 text-emerald-800">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="md:w-2/3 flex flex-col justify-center">
          <Quote className="text-emerald-500 mb-2 h-6 w-6" />
          <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
          <div className="mt-auto">
            <h4 className="font-semibold text-emerald-700">
              {testimonial.name}
            </h4>
            {testimonial.role && (
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
