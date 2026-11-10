import { Faq } from "@/site/components/Faq";
import {
  AppSection,
  HealthChecksPreview,
  Hero,
  HowItWorks,
  PartnerCta,
  ServicesBento,
  TestsSection,
  VerifiedSection,
} from "@/site/components/home";
import { Section, SectionHeading } from "@/site/components/ui";
import { getHealthPackages, getTestCatalogue } from "@/site/api";
import { HOME_FAQ } from "@/site/faq";

export const revalidate = 600;

export default async function HomePage() {
  const [packages, catalogue] = await Promise.all([getHealthPackages(), getTestCatalogue()]);

  return (
    <>
      <Hero />
      <TestsSection categories={catalogue} />
      <ServicesBento />
      <HowItWorks />
      <VerifiedSection />
      <HealthChecksPreview packages={packages} />
      <PartnerCta />
      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            title="Questions people ask"
            intro="Anything else? Our help centre and support team are here for you."
          />
          <Faq items={HOME_FAQ} />
        </div>
      </Section>
      <AppSection />
    </>
  );
}
