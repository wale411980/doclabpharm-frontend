import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ButtonLink, Container, JsonLd } from "@/site/components/ui";
import { SITE } from "@/site/config";
import { getHealthPackage, getHealthPackages, packagePath, type HealthPackage } from "@/site/api";

export const revalidate = 3600;

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const packages = await getHealthPackages();
  return packages.map((pkg) => ({ slug: packagePath(pkg).split("/").pop()! }));
}

function idFromSlug(slug: string): number | null {
  const id = Number.parseInt(slug, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

async function load(slug: string): Promise<HealthPackage | null> {
  const id = idFromSlug(slug);
  return id ? getHealthPackage(id) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const pkg = await load(params.slug);
  if (!pkg) return {};
  return {
    title: pkg.name,
    description: pkg.quick_detail.slice(0, 160),
    alternates: { canonical: packagePath(pkg) },
  };
}

const SECTIONS: [keyof HealthPackage, string][] = [
  ["description", "About"],
  ["symptoms", "Symptoms to look out for"],
  ["when_to_test", "When to get tested"],
  ["test_included", "What the check includes"],
  ["causes", "Causes"],
  ["prevention", "Prevention"],
  ["benefits", "Benefits of testing"],
];

export default async function HealthCheckPage({ params }: Params) {
  const pkg = await load(params.slug);
  if (!pkg) notFound();

  // Keep one URL per guide: fix old or mistyped slugs.
  const canonical = packagePath(pkg);
  if (canonical.split("/").pop() !== params.slug) permanentRedirect(canonical);

  return (
    <>
      <section className="bg-brand-50">
        <Container className="flex flex-col items-start gap-4 py-14 sm:py-16">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-700">{pkg.topic}</span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">{pkg.name}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700">{pkg.quick_detail}</p>
          <ButtonLink href="/lab/select" size="lg">
            Book a test
          </ButtonLink>
        </Container>
      </section>
      <Container className="py-12 sm:py-16">
        <article className="mx-auto flex max-w-3xl flex-col gap-8">
          {SECTIONS.map(([key, heading]) => {
            const value = pkg[key];
            if (typeof value !== "string" || !value.trim()) return null;
            return (
              <section key={key} className="flex flex-col gap-3">
                <h2 className="text-2xl font-extrabold text-ink-900">{heading}</h2>
                {value
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index} className="text-[17px] leading-relaxed text-ink-700">
                      {paragraph}
                    </p>
                  ))}
              </section>
            );
          })}
          <p className="rounded-2xl bg-sand p-5 text-sm leading-relaxed text-ink-500">
            This guide is general information, not medical advice. Talk to a doctor about your own health.
          </p>
        </article>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: pkg.name,
          about: { "@type": "MedicalTest", name: pkg.name },
          description: pkg.quick_detail,
          url: `${SITE.url}${canonical}`,
          publisher: { "@type": "MedicalOrganization", name: SITE.name },
        }}
      />
    </>
  );
}
