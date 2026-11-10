import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ButtonLink, Container, Section, SectionHeading } from "@/site/components/ui";
import { APP_LINKS, SERVICES } from "@/site/config";

export const metadata: Metadata = {
  title: "Pharmacies, doctors, labs and ambulances in Abuja",
  description:
    "DocLabPharm serves Abuja and the FCT: order medicine, see a doctor, book lab tests and request an ambulance in Wuse, Garki, Maitama, Gwarinpa, Kubwa, Lugbe and more.",
  alternates: { canonical: "/abuja" },
};

// Districts in the service area seeded on the API (ServiceAreaSeeder).
const DISTRICTS = [
  "Central Business District", "Garki", "Wuse", "Wuse 2", "Maitama", "Asokoro", "Utako", "Jabi",
  "Gwarinpa", "Kubwa", "Lugbe", "Lokogoma", "Kado", "Life Camp", "Katampe", "Karu", "Nyanya",
  "Apo", "Gudu", "Durumi", "Dutse", "Bwari", "Kuje", "Gwagwalada",
];

export default function AbujaPage() {
  return (
    <>
      <section className="bg-brand-50">
        <Container className="flex flex-col items-start gap-5 py-14 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            Healthcare near you in Abuja
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700">
            DocLabPharm connects you with verified pharmacies, doctors, laboratories and ambulance operators across
            the Federal Capital Territory.
          </p>
          <ButtonLink href={APP_LINKS.register} size="lg">
            Get started free
          </ButtonLink>
        </Container>
      </section>

      <Section>
        <SectionHeading title="Areas we serve" intro="Including these districts, with more joining as providers sign up." />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DISTRICTS.map((district) => (
            <li key={district} className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 font-semibold text-ink-700">
              <MapPin className="h-4 w-4 flex-none text-brand-600" aria-hidden="true" />
              {district}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <SectionHeading title="What you can do" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <li key={service.slug}>
              <Link
                href={service.href}
                className="flex h-full flex-col gap-2 rounded-3xl bg-white p-6 ring-1 ring-brand-100 hover:ring-brand-300"
              >
                <span className="text-xl font-extrabold text-ink-900">{service.name} in Abuja</span>
                <span className="leading-relaxed text-ink-500">{service.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
