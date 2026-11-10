import type { Metadata } from "next";
import { Home, ShieldCheck, Smartphone } from "lucide-react";
import { Container } from "@/site/components/ui";
import { TestsBrowser } from "@/site/components/TestsBrowser";
import { getTestCatalogue } from "@/site/api";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Book a lab test in Abuja: prices and home sample collection",
  description:
    "See every lab test and health check with its price. Book in a minute, have your sample collected at home in Abuja and get results on your phone.",
  alternates: { canonical: "/tests" },
};

export default async function TestsPage({ searchParams }: { searchParams: { q?: string } }) {
  const categories = await getTestCatalogue();
  const total = categories.reduce((sum, group) => sum + group.tests.length, 0);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div
          aria-hidden="true"
          className="dlp-breathe pointer-events-none absolute -right-40 -top-48 -z-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(200,245,106,0.28),transparent_62%)]"
        />
        <Container className="flex flex-col gap-5 py-12 sm:py-16">
          <h1 className="max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1] tracking-[-0.03em] sm:text-6xl">
            Book a test. See the price first.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/80">
            {total > 0 ? `${total} tests and health checks from licensed labs in Abuja. ` : ""}
            No sign-in to look around. Pick one, choose a time, and pay when you are ready.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-white/85">
            <li className="flex items-center gap-2">
              <Home className="h-4 w-4 text-lime" aria-hidden="true" />
              Sample collected at home
            </li>
            <li className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-lime" aria-hidden="true" />
              Results on your phone
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-lime" aria-hidden="true" />
              Private, for your eyes only
            </li>
          </ul>
        </Container>
      </section>

      <section className="bg-sand py-10 sm:py-14">
        <Container>
          {total === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-brand-100">
              <p className="text-xl font-extrabold text-ink-900">Tests are being added</p>
              <p className="mt-2 text-ink-500">Labs in Abuja are listing their tests and prices. Please check back shortly.</p>
            </div>
          ) : (
            <TestsBrowser categories={categories} initialQuery={searchParams.q ?? ""} />
          )}
        </Container>
      </section>
    </>
  );
}
