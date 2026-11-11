import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, Section } from "@/site/components/ui";
import { getHealthPackages, packagePath } from "@/site/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Health checks and guides",
  description:
    "Plain-language guides to common health checks: symptoms to look out for, when to get tested, what each test includes and how to prevent illness.",
  alternates: { canonical: "/health-checks" },
};

export default async function HealthChecksPage() {
  const packages = await getHealthPackages();

  return (
    <>
      <section className="bg-brand-50">
        <Container className="flex flex-col gap-4 py-14 sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">Health checks and guides</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700">
            Symptoms to look out for, when to get tested and what each check includes. When you are ready, book a
            test and our nurse comes to you.
          </p>
        </Container>
      </section>

      <Section>
        {packages.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-lg text-ink-500">Guides are being added. In the meantime, you can book a test directly.</p>
            <ButtonLink href="/services/lab-tests">Book a lab test</ButtonLink>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <li key={pkg.id}>
                <Link
                  href={packagePath(pkg)}
                  className="flex h-full flex-col gap-2 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 hover:ring-brand-300"
                >
                  <span className="text-sm font-bold uppercase tracking-wide text-brand-700">{pkg.topic}</span>
                  <span className="text-lg font-extrabold text-ink-900">{pkg.name}</span>
                  <span className="line-clamp-3 text-[15px] leading-relaxed text-ink-500">{pkg.quick_detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
