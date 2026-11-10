import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Faq } from "@/site/components/Faq";
import { Container, Section, SectionHeading } from "@/site/components/ui";
import { SITE } from "@/site/config";
import { HOME_FAQ } from "@/site/faq";

export const metadata: Metadata = {
  title: "Help and support",
  description: "Answers to common questions about DocLabPharm, and how to reach our support team.",
  alternates: { canonical: "/help" },
};

const CONTACT = [
  { icon: Phone, label: "Call us", value: SITE.phone, href: SITE.phoneHref },
  { icon: Mail, label: "Email us", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MessageCircle, label: "In the app", value: "Raise a request from any order", href: "/login" },
];

export default function HelpPage() {
  return (
    <>
      <section className="bg-brand-50">
        <Container className="flex flex-col gap-4 py-14 sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">How can we help?</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700">
            For a problem with an order, consultation, test or trip, raise a request in the app so the provider can
            respond. For anything else, contact us. We are available {SITE.hours.toLowerCase()}.
          </p>
          <p className="max-w-2xl rounded-2xl bg-warm-100 px-5 py-4 font-semibold text-warm-900">
            In a medical emergency, call 112 now.
          </p>
        </Container>
      </section>

      <Section>
        <ul className="grid gap-4 md:grid-cols-3">
          {CONTACT.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                className="flex h-full flex-col gap-3 rounded-3xl bg-white p-6 ring-1 ring-brand-100 hover:ring-brand-300"
              >
                <Icon className="h-7 w-7 text-brand-600" aria-hidden="true" />
                <span className="text-lg font-bold text-ink-900">{label}</span>
                <span className="text-ink-500">{value}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading title="Common questions" />
          <Faq items={HOME_FAQ} />
        </div>
      </Section>
    </>
  );
}
