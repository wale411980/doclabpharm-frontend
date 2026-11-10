import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Faq } from "@/site/components/Faq";
import { SERVICE_ICON, SERVICE_TONE } from "@/site/components/icons";
import { ButtonLink, Container, JsonLd, Section, SectionHeading } from "@/site/components/ui";
import { SERVICES, SITE, type ServiceSlug } from "@/site/config";
import { SERVICE_PAGES } from "@/site/services";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

function getPage(slug: string) {
  return slug in SERVICE_PAGES ? SERVICE_PAGES[slug as ServiceSlug] : null;
}

export function generateMetadata({ params }: Params): Metadata {
  const page = getPage(params.slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: `/services/${page.slug}` },
  };
}

export default function ServicePage({ params }: Params) {
  const page = getPage(params.slug);
  if (!page) notFound();

  const Icon = SERVICE_ICON[page.slug];
  const tone = SERVICE_TONE[page.slug];
  const isAmbulance = page.slug === "ambulance";

  return (
    <>
      <section className={cn(isAmbulance ? "bg-warm-50" : "bg-brand-50")}>
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", tone.badge)}>
              <Icon className={cn("h-7 w-7", tone.icon)} aria-hidden="true" />
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl">{page.title}</h1>
            <p className="text-lg leading-relaxed text-ink-700">{page.intro}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={page.cta.href} size="lg" variant={isAmbulance ? "warm" : "primary"}>
                {page.cta.label}
              </ButtonLink>
              {isAmbulance && (
                <a
                  href="tel:112"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 font-bold text-white hover:bg-black"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Emergency? Call 112
                </a>
              )}
            </div>
          </div>
          <Image
            src={page.image.src}
            alt={page.image.alt}
            width={page.image.width}
            height={page.image.height}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full rounded-[32px] object-cover"
          />
        </Container>
      </section>

      <Section>
        <SectionHeading title="How it works" />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {page.steps.map(([title, body], index) => (
            <li key={title} className="flex flex-col gap-3 rounded-3xl bg-brand-50 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="text-xl font-bold text-ink-900">{title}</h3>
              <p className="leading-relaxed text-ink-500">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand">
        <SectionHeading title={`Why ${SITE.name}`} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {page.points.map(([title, body]) => (
            <li key={title} className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-brand-100">
              <BadgeCheck className="mt-0.5 h-6 w-6 flex-none text-brand-600" aria-hidden="true" />
              <span className="flex flex-col gap-1">
                <span className="text-lg font-bold text-ink-900">{title}</span>
                <span className="leading-relaxed text-ink-500">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading title="Questions" />
          <Faq items={page.faq} />
        </div>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.metaTitle,
          description: page.metaDescription,
          provider: { "@type": "MedicalOrganization", name: SITE.name, url: SITE.url },
          areaServed: { "@type": "City", name: SITE.city },
          url: `${SITE.url}/services/${page.slug}`,
        }}
      />
    </>
  );
}
