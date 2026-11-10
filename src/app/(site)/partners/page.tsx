import type { Metadata } from "next";
import { Ambulance, FileCheck2, FlaskConical, Pill, Stethoscope, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Faq } from "@/site/components/Faq";
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from "@/site/components/ui";
import { APP_LINKS } from "@/site/config";

export const metadata: Metadata = {
  title: "Partner with DocLabPharm: pharmacies, doctors, labs and ambulances",
  description:
    "Register your pharmacy, practice, laboratory or ambulance service on DocLabPharm and receive patients near you in Abuja. Free to join; commission only on what you earn.",
  alternates: { canonical: "/partners" },
};

type PartnerType = {
  id: string;
  name: string;
  singular: string;
  icon: LucideIcon;
  warm?: boolean;
  pitch: string;
  documents: string[];
};

const TYPES: PartnerType[] = [
  {
    id: "pharmacies",
    name: "Pharmacies",
    singular: "a pharmacy",
    icon: Pill,
    pitch: "Receive medicine orders from patients near your premises, manage stock and prices, and deliver with your own riders.",
    documents: [
      "CAC certificate",
      "Pharmacy Council of Nigeria premises licence for this year",
      "Superintendent pharmacist's annual licence",
      "Photo of your premises",
    ],
  },
  {
    id: "doctors",
    name: "Doctors",
    singular: "a doctor",
    icon: Stethoscope,
    pitch: "Consult patients by chat, voice or video, set your own fee and hours, and issue prescriptions and test requests in the app.",
    documents: [
      "MDCN full registration certificate",
      "Current annual practising licence",
      "Government photo ID and a selfie",
      "Specialist certificate, if you list a specialty",
    ],
  },
  {
    id: "labs",
    name: "Laboratories",
    singular: "a laboratory",
    icon: FlaskConical,
    pitch: "List your tests and prices, accept home collection and in-lab bookings, and send results to patients securely.",
    documents: [
      "CAC certificate",
      "Medical Laboratory Science Council of Nigeria registration",
      "Licence of the scientist in charge",
    ],
  },
  {
    id: "ambulance",
    name: "Ambulance operators",
    singular: "an ambulance operator",
    icon: Ambulance,
    warm: true,
    pitch: "Receive emergency and scheduled transfer requests near your vehicles, dispatch your crews and track every trip.",
    documents: [
      "CAC certificate",
      "Registration with the health authority",
      "Papers and photos for each vehicle",
      "Licences of the nurses and paramedics on your crews",
    ],
  },
];

const STEPS = [
  ["Register", "Create your account and add your business details and location."],
  ["Upload your licences", "We check them against the official registers. This usually takes a few working days."],
  ["Go live", "Once approved, patients near you can find you and send requests."],
  ["Get paid automatically", "Payment goes straight to your bank account, less DocLabPharm's commission."],
];

const PARTNER_FAQ = [
  {
    q: "How much does it cost to join?",
    a: "Registration is free. DocLabPharm takes a commission on each paid order, consultation, test or trip. You see the rate before you go live.",
  },
  {
    q: "How and when do I get paid?",
    a: "Each payment is split automatically: your share goes to your verified bank account and the commission to DocLabPharm. You can see every payment in your dashboard.",
  },
  {
    q: "Who handles customer support?",
    a: "You do, for your own patients. Requests reach you in the app with a time limit to reply. DocLabPharm watches response times and steps in on disputes.",
  },
  {
    q: "What happens when my licence expires?",
    a: "We remind you 30 days and 7 days before. Upload your renewed licence and you stay live; if it lapses, your listing is paused until it is renewed.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="bg-brand-50">
        <Container className="flex flex-col items-start gap-6 py-14 sm:py-20">
          <Eyebrow>For healthcare providers in Abuja</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-6xl">
            Reach more patients near you
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700 sm:text-xl">
            Join DocLabPharm as a pharmacy, doctor, laboratory or ambulance operator. Free to join, with commission
            only on what you earn.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={APP_LINKS.partnerRegister} size="lg">
              Register your practice
            </ButtonLink>
            <ButtonLink href={APP_LINKS.partnerLogin} size="lg" variant="secondary">
              Partner log in
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Section>
        <SectionHeading title="How joining works" />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, body], index) => (
            <li key={title} className="flex flex-col gap-3 rounded-3xl bg-brand-50 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="text-lg font-bold text-ink-900">{title}</h3>
              <p className="leading-relaxed text-ink-500">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand">
        <SectionHeading
          title="What you need to join"
          intro="We only list providers whose licences we have checked. Have these ready as photos or PDFs."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <article
                key={type.id}
                id={type.id}
                className="flex scroll-mt-24 flex-col gap-5 rounded-[32px] bg-white p-6 ring-1 ring-brand-100 sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl",
                      type.warm ? "bg-warm-400" : "bg-brand-100"
                    )}
                  >
                    <Icon className={cn("h-7 w-7", type.warm ? "text-warm-900" : "text-brand-700")} aria-hidden="true" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-ink-900">{type.name}</h2>
                </div>
                <p className="leading-relaxed text-ink-500">{type.pitch}</p>
                <ul className="flex flex-col gap-2">
                  {type.documents.map((doc) => (
                    <li key={doc} className="flex gap-3 text-ink-700">
                      <FileCheck2 className="mt-0.5 h-5 w-5 flex-none text-brand-600" aria-hidden="true" />
                      {doc}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={APP_LINKS.partnerRegister}
                  variant={type.warm ? "warm" : "primary"}
                  className="mt-auto self-start"
                >
                  Register as {type.singular}
                </ButtonLink>
              </article>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading title="Partner questions" />
          <Faq items={PARTNER_FAQ} />
        </div>
      </Section>
    </>
  );
}
