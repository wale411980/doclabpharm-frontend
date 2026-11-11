/** Facts about DocLabPharm used across the public website. */
export const SITE = {
  name: "DocLabPharm",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://doclabpharm.com").replace(/\/$/, ""),
  description:
    "Your online hospital. Medicine delivered, a licensed doctor on your phone, lab tests taken at home and an ambulance when you need one. Now serving Abuja.",
  owner: "Walex Biz Group",
  email: "info@doclabpharm.com",
  phone: "+234 707 710 1826",
  phoneHref: "tel:+2347077101826",
  hours: "Monday to Saturday, 7am to 6pm",
  city: "Abuja",
  region: "Federal Capital Territory",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61578936118099",
    x: "https://x.com/doclab_pharm",
    instagram: "https://www.instagram.com/doclab_pharm/",
  },
} as const;

/** Where the sign-in and sign-up screens live (served by the dashboards app). */
export const APP_LINKS = {
  login: "/login",
  register: "/register",
  partnerLogin: "/partners/login",
  partnerRegister: "/partners/register",
  findDoctor: "/see-a-doctor",
} as const;

export const SERVICES = [
  {
    slug: "pharmacy",
    name: "Pharmacy delivery",
    short: "Genuine medicine delivered to your door.",
    cta: "Order medicine",
    href: "/services/pharmacy",
    tone: "brand",
  },
  {
    slug: "doctors",
    name: "See a doctor",
    short: "Chat or video call a licensed doctor now, or book a time that suits you.",
    cta: "Talk to a doctor",
    href: "/services/doctors",
    tone: "brand",
  },
  {
    slug: "lab-tests",
    name: "Lab tests at home",
    short: "Book a test, have your sample collected at home and get results on your phone.",
    cta: "Book a test",
    href: "/services/lab-tests",
    tone: "brand",
  },
  {
    slug: "ambulance",
    name: "Ambulance on request",
    short: "Request the nearest available ambulance and follow it on the map.",
    cta: "Request an ambulance",
    href: "/services/ambulance",
    tone: "warm",
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
