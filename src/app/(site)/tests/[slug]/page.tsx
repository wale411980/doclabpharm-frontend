import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft, Clock, Droplet, Home, MapPin, Utensils } from "lucide-react";
import { BookTest } from "@/site/components/BookTest";
import { TestCard, naira } from "@/site/components/TestCard";
import { Container, JsonLd } from "@/site/components/ui";
import { SITE } from "@/site/config";
import { getCatalogueTest, testPath } from "@/site/api";

export const revalidate = 600;

type Props = { params: { slug: string } };

const idFrom = (slug: string) => Number.parseInt(slug, 10);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const test = await getCatalogueTest(idFrom(params.slug));
  if (!test) return { title: "Test not found" };

  return {
    title: `${test.name}: ${naira(test.price)} in Abuja`,
    description: `${test.summary ?? test.name}. Book online, home sample collection available, results on your phone.`,
    alternates: { canonical: testPath(test) },
  };
}

export default async function TestPage({ params }: Props) {
  const id = idFrom(params.slug);
  const test = Number.isFinite(id) ? await getCatalogueTest(id) : null;
  if (!test) notFound();

  const facts = [
    { icon: Droplet, label: "What we collect", value: test.sample },
    { icon: Utensils, label: "Before your test", value: test.preparation },
    { icon: Clock, label: "Results in", value: test.turnaround },
    {
      icon: Home,
      label: "Where",
      value: "At your home. Our nurse comes to you.",
    },
  ].filter((fact) => fact.value);

  return (
    <>
      <section className="bg-sand pb-16 pt-8 sm:pb-24 sm:pt-10">
        <Container className="flex flex-col gap-8">
          <Link href="/tests" className="inline-flex w-fit items-center gap-1 text-[15px] font-bold text-brand-700 hover:underline">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            All tests
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="flex min-w-0 flex-col gap-8">
              <div className="flex flex-col gap-4">
                {test.category && <p className="text-[15px] font-bold text-brand-700">{test.category}</p>}
                <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-6xl">
                  {test.name}
                </h1>
                {test.summary && <p className="max-w-2xl text-xl leading-relaxed text-ink-700">{test.summary}</p>}
                {/* On phones the booking box is further down: show the price and a way there. */}
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-night px-5 py-4 text-white lg:hidden">
                  <span className="font-display text-3xl font-extrabold tracking-tight">{naira(test.price)}</span>
                  <a href="#book" className="rounded-full bg-lime px-6 py-3 text-base font-extrabold text-night">
                    Book now
                  </a>
                </div>
              </div>

              {(test.about || (test.who_for ?? []).length > 0) && (
                <div className="flex flex-col gap-6 rounded-[28px] bg-white p-6 ring-1 ring-brand-100 sm:p-8">
                  {test.about && (
                    <div>
                      <h2 className="text-xl font-extrabold text-ink-900">What this test is</h2>
                      <p className="mt-3 max-w-2xl whitespace-pre-line text-[17px] leading-relaxed text-ink-700">{test.about}</p>
                    </div>
                  )}
                  {(test.who_for ?? []).length > 0 && (
                    <div>
                      <h2 className="text-xl font-extrabold text-ink-900">Who should take it</h2>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {(test.who_for ?? []).map((line) => (
                          <li key={line} className="flex items-start gap-3 text-[17px] text-ink-900">
                            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-50">
                              <Check className="h-4 w-4 text-brand-700" aria-hidden="true" />
                            </span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-[28px] bg-white p-6 ring-1 ring-brand-100 sm:p-8">
                <h2 className="text-xl font-extrabold text-ink-900">
                  {test.includes.length > 1 ? `${test.includes.length} tests in this check, and what each one looks at` : "What we check"}
                </h2>
                <ul className="mt-5 flex flex-col divide-y divide-brand-100">
                  {(test.includes_explained ?? test.includes.map((name) => ({ name, what: null }))).map((item) => (
                    <li key={item.name} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-lime">
                        <Check className="h-4 w-4 text-night" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[17px] font-bold text-ink-900">{item.name}</p>
                        {item.what && <p className="mt-0.5 text-[16px] leading-relaxed text-ink-700">{item.what}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-brand-50">
                      <fact.icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-sm font-bold text-ink-500">{fact.label}</dt>
                      <dd className="mt-0.5 text-[17px] font-semibold leading-snug text-ink-900">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

            </div>

            <div id="book" className="min-w-0 scroll-mt-24 lg:sticky lg:top-24">
              <BookTest test={test} />
            </div>
          </div>
        </Container>
      </section>

      {test.related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">People also book</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {test.related.map((item) => (
                <li key={item.id}>
                  <TestCard test={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalTest",
          name: test.name,
          description: test.about ?? test.summary ?? undefined,
          url: `${SITE.url}${testPath(test)}`,
          offers: { "@type": "Offer", price: test.price, priceCurrency: "NGN", availability: "https://schema.org/InStock" },
        }}
      />
    </>
  );
}
