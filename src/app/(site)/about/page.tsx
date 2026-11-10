import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, Section, SectionHeading } from "@/site/components/ui";
import { APP_LINKS, SITE } from "@/site/config";

export const metadata: Metadata = {
  title: "About DocLabPharm",
  description:
    "DocLabPharm connects patients in Nigeria with verified pharmacies, doctors, laboratories and ambulance operators. A Walex Biz Group platform, starting in Abuja.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  ["Simple", "Medicine, doctors, tests and ambulances in one app, on any phone."],
  ["Trusted", "Every provider's licence is checked before they can serve you."],
  ["Close to you", "We match you to the nearest provider who can help, so help arrives sooner."],
  ["Accountable", "Providers answer their patients within set times, and we watch every request."],
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-50">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              Good healthcare should be simple to reach
            </h1>
            <p className="text-lg leading-relaxed text-ink-700">
              DocLabPharm makes it easy to get medicine, see a doctor, book a lab test or call an ambulance, from
              the comfort of your home. We believe quality healthcare should be simple, accessible and available to
              everyone, whenever they need it.
            </p>
          </div>
          <Image
            src="/images/family.webp"
            alt="A family playing together in a park"
            width={1400}
            height={613}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full rounded-[32px] object-cover"
          />
        </Container>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            title="How DocLabPharm works"
            intro={`DocLabPharm is a platform run by ${SITE.owner}. We do not treat patients or sell medicine ourselves. Independent, licensed pharmacies, doctors, laboratories and ambulance operators provide the care, and we check each of them before they can join.`}
          />
          <p className="text-lg leading-relaxed text-ink-500 lg:pt-14">
            We are starting in {SITE.city} and growing across Nigeria. Each new city opens when enough verified
            providers have joined there, so that the nearest help is genuinely near.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([title, body]) => (
            <li key={title} className="flex flex-col gap-2 rounded-3xl bg-brand-50 p-6">
              <h2 className="text-xl font-extrabold text-brand-700">{title}</h2>
              <p className="leading-relaxed text-ink-500">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <div className="flex flex-col items-start gap-5 rounded-[32px] bg-white p-8 ring-1 ring-brand-100 sm:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Work with us</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-500">
            Healthcare professionals, developers, operations and customer care specialists: if you want to make
            healthcare better for everyone, send your CV to{" "}
            <a href="mailto:careers@doclabpharm.com" className="font-bold text-brand-700 underline">
              careers@doclabpharm.com
            </a>
            .
          </p>
          <ButtonLink href={APP_LINKS.partnerRegister} variant="secondary">
            Are you a provider? Join as a partner
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
