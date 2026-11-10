import type { ServiceSlug } from "./config";

type ServicePage = {
  slug: ServiceSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  image: { src: string; width: number; height: number; alt: string };
  cta: { label: string; href: string };
  steps: [string, string][];
  points: [string, string][];
  faq: { q: string; a: string }[];
  note?: string;
};

export const SERVICE_PAGES: Record<ServiceSlug, ServicePage> = {
  pharmacy: {
    slug: "pharmacy",
    title: "Medicine from the nearest pharmacy, delivered",
    metaTitle: "Order medicine online in Abuja",
    metaDescription:
      "Order medicine online in Abuja from verified pharmacies near you. We find the closest pharmacy with your medicine in stock and deliver it to your door.",
    intro:
      "Search for your medicine and we send your order to the nearest verified pharmacy that has everything in stock. If it cannot take the order, the next nearest pharmacy gets it.",
    image: { src: "/images/doctor-map.webp", width: 687, height: 608, alt: "A pharmacist next to a map of Abuja" },
    cta: { label: "Order medicine", href: "/user/pharmacy" },
    steps: [
      ["Search your medicine", "Find it by name and see prices from pharmacies near you."],
      ["We pick the closest pharmacy", "Only pharmacies with every item in stock are matched."],
      ["Pay and track delivery", "Pay securely and follow your rider on the map."],
    ],
    points: [
      ["Licensed pharmacies only", "Every pharmacy holds a current Pharmacy Council of Nigeria premises licence."],
      ["Prescriptions handled properly", "Prescription-only medicine needs a valid prescription, checked by the pharmacist."],
      ["Fair prices you can compare", "Pharmacies set their own prices and you see them before you pay."],
      ["Pickup or delivery", "Collect from the pharmacy yourself, or have it brought to you."],
    ],
    faq: [
      {
        q: "Do I need a prescription?",
        a: "Only for prescription-only medicine. Use a prescription from a DocLabPharm doctor, or upload a photo of yours for the pharmacist to check.",
      },
      {
        q: "What if the pharmacy does not have my medicine?",
        a: "We only match pharmacies that have every item in stock. If a pharmacy cannot fill your order, it moves to the next nearest one.",
      },
    ],
  },
  doctors: {
    slug: "doctors",
    title: "Talk to a licensed doctor, today",
    metaTitle: "See a doctor online in Nigeria",
    metaDescription:
      "Chat or video call a licensed Nigerian doctor from your phone. Every doctor's MDCN registration and practising licence is checked before they can see patients.",
    intro:
      "Talk to a doctor by chat, voice or video, or book a time that suits you. Every doctor's Medical and Dental Council of Nigeria registration is checked first.",
    image: { src: "/images/doctor-smiling.webp", width: 1000, height: 666, alt: "A smiling doctor holding patient notes" },
    cta: { label: "Find a doctor", href: "/doctors/available" },
    steps: [
      ["Choose a doctor or specialty", "See each doctor's specialty, experience and fee."],
      ["Book or start now", "Pick a time, or start a consultation with an available doctor."],
      ["Get your prescription", "Prescriptions and test requests go straight into the app."],
    ],
    points: [
      ["Verified doctors only", "MDCN registration and current practising licence checked, and rechecked each year."],
      ["Chat, voice or video", "Use whichever suits you, from any phone."],
      ["Prescriptions to your pharmacy", "Send a prescription to the nearest pharmacy in one tap."],
      ["Your notes stay private", "Consultation records are only shared with you and your doctor."],
    ],
    faq: [
      {
        q: "Can a doctor prescribe medicine online?",
        a: "Yes. After your consultation the doctor can issue a prescription in the app, which you can send to a nearby pharmacy.",
      },
      {
        q: "Is an online consultation right for an emergency?",
        a: "No. For an emergency, request an ambulance or call 112 straight away.",
      },
    ],
  },
  "lab-tests": {
    slug: "lab-tests",
    title: "Lab tests at home, results on your phone",
    metaTitle: "Book lab tests in Abuja with home sample collection",
    metaDescription:
      "Book blood tests and other lab tests with registered labs in Abuja. Have your sample collected at home and get your results on your phone.",
    intro:
      "Book a test with a registered lab, choose home collection or a lab visit, and get your results in the app.",
    image: { src: "/images/lab-sample.webp", width: 742, height: 492, alt: "A lab scientist taking a swab sample" },
    cta: { label: "Book a test", href: "/lab/select" },
    steps: [
      ["Choose your test", "Search tests and health packages and compare labs near you."],
      ["Pick a time and place", "A collector comes to you, or you visit the lab."],
      ["Get your result", "Results arrive in the app, and can be shared with your doctor."],
    ],
    points: [
      ["Registered labs only", "Every lab is registered with the Medical Laboratory Science Council of Nigeria."],
      ["Home sample collection", "Save the trip and the queue."],
      ["Results in the app", "Keep your results in one place."],
      ["Share with your doctor", "Only when you choose to."],
    ],
    faq: [
      {
        q: "Do I need a doctor's request for a test?",
        a: "Not for most routine tests. If your doctor requests a test in the app, it is ready to book.",
      },
      {
        q: "How long do results take?",
        a: "It depends on the test and the lab. Each test shows the lab's expected turnaround time before you book.",
      },
    ],
  },
  ambulance: {
    slug: "ambulance",
    title: "Request an ambulance and follow it live",
    metaTitle: "Request an ambulance in Abuja",
    metaDescription:
      "Request the nearest available ambulance in Abuja from your phone and follow it on the map. For scheduled hospital transfers too.",
    intro:
      "Request an ambulance and the nearest available verified operator is alerted. Follow it on the map and share the link with family. Scheduled transfers between home and hospital are available too.",
    image: { src: "/images/patient-phone.webp", width: 745, height: 492, alt: "A man using his phone" },
    cta: { label: "Create your account", href: "/register" },
    steps: [
      ["Request", "Choose emergency or scheduled transfer and confirm your location."],
      ["The nearest ambulance accepts", "If it does not accept quickly, the next nearest is alerted."],
      ["Follow it live", "See the ambulance on the map and call the crew in one tap."],
    ],
    points: [
      ["Verified operators", "Business registration, vehicle papers and crew licences are checked."],
      ["Basic, advanced and critical care", "Choose the level of care you need."],
      ["Price shown before you confirm", "For emergencies, dispatch comes first and payment after."],
      ["Hospital of your choice", "Pick the destination hospital, or let the crew advise."],
    ],
    faq: [
      {
        q: "Should I still call 112?",
        a: "Yes, if you are in danger or nobody accepts your request quickly. 112 is Nigeria's free national emergency number.",
      },
      {
        q: "Can I book a transfer in advance?",
        a: "Yes. Schedule a transfer from home to hospital, between hospitals or for discharge.",
      },
    ],
    note: "In a life-threatening emergency, call 112 now.",
  },
};
