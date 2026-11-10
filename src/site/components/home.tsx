import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock, FileCheck2, Home, MapPin, Pill, ShieldCheck, Siren, Smartphone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_LINKS } from "@/site/config";
import { packagePath, type CatalogueCategory, type HealthPackage } from "@/site/api";
import { BookingBar } from "./BookingBar";
import { TestCard } from "./TestCard";
import { ButtonLink, Container, Section, SectionHeading } from "./ui";

const display = "font-display font-extrabold tracking-[-0.03em]";

/* ------------------------------------------------------------------ */
/* Hero: say what we do, then let people book straight away.           */
/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      {/* Glow: two soft lights behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="dlp-breathe absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(46,144,99,0.75),transparent_65%)]" />
        <div className="dlp-breathe absolute -right-32 top-24 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(200,245,106,0.28),transparent_62%)] [animation-delay:-3s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      </div>

      <Container className="grid grid-cols-1 gap-8 pb-14 pt-8 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-6 lg:pb-20">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="dlp-ping absolute inline-flex h-full w-full rounded-full bg-lime" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
            </span>
            Live in Abuja
          </p>

          <h1 className={cn(display, "text-[2.9rem] leading-[0.98] sm:text-7xl")}>
            Get tested today. No queue, no stress.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Lab tests at home, doctors on video, medicine at your door and ambulances on request. All from
            licensed providers near you.
          </p>

          <div className="w-full min-w-0 max-w-2xl">
            <BookingBar />
          </div>

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
              Licence-checked providers
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-[340px] lg:max-w-[440px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[18%] h-[72%] w-[92%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,245,106,0.55),rgba(46,144,99,0.25)_55%,transparent_72%)] blur-2xl"
          />
          <Image
            src="/images/doctor-cutout.webp"
            alt="A smiling doctor in a white coat with a stethoscope"
            width={595}
            height={903}
            priority
            sizes="(min-width: 1024px) 440px, 340px"
            className="relative mx-auto h-auto w-[82%] drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
          />

          <div className="absolute left-0 top-[14%] flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-ink-900 shadow-2xl backdrop-blur">
            <span className="relative flex h-3 w-3">
              <span className="dlp-ping absolute inline-flex h-full w-full rounded-full bg-brand-500" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
            </span>
            <span className="text-sm font-bold leading-tight">
              Doctors online
              <span className="block font-medium text-ink-500">Talk in minutes</span>
            </span>
          </div>

          <div className="absolute bottom-[16%] right-0 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-ink-900 shadow-2xl backdrop-blur">
            <FileCheck2 className="h-6 w-6 text-brand-600" aria-hidden="true" />
            <span className="text-sm font-bold leading-tight">
              Result ready
              <span className="block font-medium text-ink-500">Sent to your phone</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tests: real prices from labs when listed, popular tests otherwise.  */
/* ------------------------------------------------------------------ */

const POPULAR_TESTS = [
  "Malaria test",
  "Typhoid test",
  "Full blood count",
  "Blood sugar test",
  "Pregnancy test",
  "Full body check-up",
  "STI screen",
  "Genotype test",
  "Prostate test (PSA)",
];

export function TestsSection({ categories }: { categories: CatalogueCategory[] }) {
  const all = categories.flatMap((group) => group.tests);
  const featured = all.filter((test) => test.featured);
  const shown = (featured.length >= 6 ? featured : all).slice(0, 9);

  return (
    <section id="tests" className="bg-sand py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className={cn(display, "text-4xl text-ink-900 sm:text-5xl")}>Pick a test. Book it now.</h2>
            <p className="text-lg leading-relaxed text-ink-500">
              See the price before you book. A collector comes to your house, or you visit the lab. No sign-in until
              you pay.
            </p>
          </div>
          <ButtonLink href="/tests" variant="secondary">
            {all.length > 0 ? `See all ${all.length} tests` : "See all tests"}
          </ButtonLink>
        </div>

        {shown.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((test) => (
              <li key={test.id}>
                <TestCard test={test} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {POPULAR_TESTS.map((name) => (
              <li key={name}>
                <Link
                  href={`/tests?q=${encodeURIComponent(name.split(" ")[0])}`}
                  className="inline-flex min-h-12 items-center rounded-full bg-white px-5 text-base font-bold text-ink-900 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {categories.length > 1 && (
          <ul className="flex flex-wrap gap-2">
            {categories.map((group) => (
              <li key={group.name}>
                <Link
                  href={`/tests?q=${encodeURIComponent(group.name)}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[15px] font-bold text-ink-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
                >
                  {group.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-semibold text-ink-700">
          <Video className="h-5 w-5 text-brand-600" aria-hidden="true" />
          Not sure which test you need?{" "}
          <Link href="/user/see-doctor-now" className="text-brand-700 underline underline-offset-4">
            Ask a doctor first
          </Link>
        </p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The four things people come for, with faces.                        */
/* ------------------------------------------------------------------ */

export function ServicesBento() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <h2 className={cn(display, "max-w-2xl text-4xl text-ink-900 sm:text-5xl")}>
          Everything you need when you are not feeling fine
        </h2>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Doctor */}
          <Link
            href="/user/see-doctor-now"
            className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[32px] bg-night p-7 text-white lg:col-span-7"
          >
            <Image
              src="/images/doctor-smiling.webp"
              alt="A doctor smiling in a clinic"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="-z-10 object-cover object-[70%_20%] transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 to-transparent" />
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="dlp-ping absolute inline-flex h-full w-full rounded-full bg-lime" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
              </span>
              Online now
            </span>
            <h3 className={cn(display, "text-3xl sm:text-4xl")}>See a doctor in minutes</h3>
            <p className="mt-2 max-w-md text-lg text-white/85">
              Chat or video call a licensed doctor from your bed. Your prescription goes straight to a pharmacy.
            </p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-lime px-6 py-3 text-base font-extrabold text-night">
              Talk to a doctor
            </span>
          </Link>

          {/* Lab at home */}
          <Link
            href="/tests"
            className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[32px] bg-brand-800 p-7 text-white lg:col-span-5"
          >
            <Image
              src="/images/lab-sample.webp"
              alt="A lab scientist taking a sample from a young man"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="-z-10 object-cover object-[35%_30%] transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/50 to-transparent" />
            <h3 className={cn(display, "text-3xl sm:text-4xl")}>Lab tests that come to you</h3>
            <p className="mt-2 text-lg text-white/85">A collector comes to your house. Results land on your phone.</p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-white px-6 py-3 text-base font-extrabold text-night">
              Book a test
            </span>
          </Link>

          {/* Medicine */}
          <Link
            href="/user/medicines/near-me"
            className="group flex min-h-[240px] flex-col justify-between gap-6 rounded-[32px] bg-lime p-7 text-night lg:col-span-6"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-night text-lime">
              <Pill className="h-7 w-7" aria-hidden="true" />
            </span>
            <span>
              <h3 className={cn(display, "text-3xl")}>Medicine at your door</h3>
              <p className="mt-2 max-w-md text-lg text-night/80">
                From the nearest pharmacy that has it in stock. Track the rider, pay in the app.
              </p>
              <span className="mt-4 inline-flex w-fit rounded-full bg-night px-6 py-3 text-base font-extrabold text-white">
                Order medicine
              </span>
            </span>
          </Link>

          {/* Ambulance */}
          <Link
            href="/user/ambulance"
            className="group flex min-h-[240px] flex-col justify-between gap-6 rounded-[32px] bg-siren p-7 text-white lg:col-span-6"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-siren">
              <Siren className="h-7 w-7" aria-hidden="true" />
            </span>
            <span>
              <h3 className={cn(display, "text-3xl")}>Ambulance on request</h3>
              <p className="mt-2 max-w-md text-lg text-white/90">
                The nearest free ambulance comes to you and you follow it on the map. Pay after the trip.
              </p>
              <span className="mt-4 inline-flex w-fit rounded-full bg-white px-6 py-3 text-base font-extrabold text-[#7a1d0a]">
                Request an ambulance
              </span>
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works: three real steps.                                     */
/* ------------------------------------------------------------------ */

const STEPS = [
  { icon: MapPin, title: "Tell us what you need", body: "Pick a test, a doctor or your medicine, and share where you are." },
  { icon: Clock, title: "We match you nearby", body: "Licensed labs, doctors, pharmacies and ambulances close to you respond in minutes." },
  { icon: Smartphone, title: "Pay and follow it live", body: "Pay with your card or wallet. Track your collector, rider or ambulance on your phone." },
];

export function HowItWorks() {
  return (
    <section className="bg-sand py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <Image
            src="/images/patient-phone.webp"
            alt="A man booking on his phone on the way to work"
            width={745}
            height={492}
            sizes="(min-width: 1024px) 42vw, 92vw"
            className="h-auto w-full rounded-[32px] object-cover"
          />
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-night px-5 py-4 text-white shadow-2xl">
            <span className={cn(display, "text-3xl text-lime")}>3 taps</span>
            <span className="text-sm font-semibold leading-tight text-white/85">
              from feeling sick
              <br />
              to help on the way
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className={cn(display, "text-4xl text-ink-900 sm:text-5xl")}>Sorted in three steps</h2>
          <ol className="flex flex-col gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className={cn(display, "flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-night text-xl text-lime")}>
                  {index + 1}
                </span>
                <span className="flex flex-col gap-1 pt-0.5">
                  <span className="text-xl font-extrabold text-ink-900">{step.title}</span>
                  <span className="text-lg leading-relaxed text-ink-500">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust                                                               */
/* ------------------------------------------------------------------ */

const LICENCES = [
  ["Doctors", "Medical and Dental Council of Nigeria registration and current practising licence"],
  ["Pharmacies", "Pharmacy Council of Nigeria premises licence and superintendent pharmacist"],
  ["Laboratories", "Medical Laboratory Science Council of Nigeria registration"],
  ["Ambulance operators", "Business registration, vehicle papers and crew licences"],
];

export function VerifiedSection() {
  return (
    <section className="relative isolate overflow-hidden bg-night py-16 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(46,144,99,0.6),transparent_65%)]"
      />
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-4">
          <h2 className={cn(display, "text-4xl sm:text-5xl")}>No fake doctors. No fake drugs.</h2>
          <p className="text-lg leading-relaxed text-white/80">
            Every provider is checked against their official Nigerian licence before they can serve you, and
            checked again when the licence expires.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {LICENCES.map(([who, what]) => (
            <li key={who} className="flex gap-3 rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10">
              <BadgeCheck className="mt-0.5 h-6 w-6 flex-none text-lime" aria-hidden="true" />
              <span className="flex flex-col gap-1">
                <span className="font-bold">{who}</span>
                <span className="text-sm leading-relaxed text-white/75">{what}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Guides, partners, app                                               */
/* ------------------------------------------------------------------ */

export function HealthChecksPreview({ packages }: { packages: HealthPackage[] }) {
  if (packages.length === 0) return null;
  return (
    <Section>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Health checks and guides"
            intro="What to look out for, when to get tested and what each check includes."
          />
          <ButtonLink href="/health-checks" variant="secondary">
            See all guides
          </ButtonLink>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.slice(0, 6).map((pkg) => (
            <li key={pkg.id}>
              <Link
                href={packagePath(pkg)}
                className="flex h-full flex-col gap-2 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 hover:ring-brand-300"
              >
                <span className="text-sm font-bold text-brand-700">{pkg.topic}</span>
                <span className="text-lg font-extrabold text-ink-900">{pkg.name}</span>
                <span className="line-clamp-3 text-[15px] leading-relaxed text-ink-500">{pkg.quick_detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

const PARTNER_TYPES = [
  { anchor: "pharmacies", label: "Pharmacies" },
  { anchor: "doctors", label: "Doctors" },
  { anchor: "labs", label: "Laboratories" },
  { anchor: "ambulance", label: "Ambulance operators" },
];

export function PartnerCta() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-8 overflow-hidden rounded-[36px] bg-brand-50 ring-1 ring-brand-100 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6 p-8 sm:p-12">
            <h2 className={cn(display, "text-4xl text-ink-900 sm:text-5xl")}>Run a pharmacy, lab, clinic or ambulance?</h2>
            <p className="max-w-xl text-lg leading-relaxed text-ink-500">
              Reach patients near you. Joining is free, and you only pay a commission on what you earn.
            </p>
            <ul className="flex flex-wrap gap-2">
              {PARTNER_TYPES.map((type) => (
                <li key={type.anchor}>
                  <Link
                    href={`/partners#${type.anchor}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[15px] font-bold text-ink-900 ring-1 ring-inset ring-brand-200 hover:bg-brand-100"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href={APP_LINKS.partnerRegister} size="lg" className="w-fit bg-night hover:bg-brand-900">
              Join as a partner
            </ButtonLink>
          </div>
          <Image
            src="/images/nurse-tablet.webp"
            alt="A nurse checking appointments on a tablet"
            width={379}
            height={497}
            sizes="(min-width: 1024px) 34vw, 0px"
            className="hidden h-full w-full object-cover object-top lg:block"
          />
        </div>
      </Container>
    </section>
  );
}

export function AppSection() {
  return (
    <section className="relative isolate overflow-hidden bg-night py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,245,106,0.25),transparent_65%)]"
      />
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className={cn(display, "max-w-3xl text-4xl sm:text-6xl")}>Feeling off? Do not wait it out.</h2>
        <p className="max-w-xl text-lg leading-relaxed text-white/80">
          Create a free account in a minute. It works on any phone, right here in your browser. The Android and
          iPhone apps are on the way.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={APP_LINKS.register}
            className="inline-flex min-h-14 items-center rounded-full bg-lime px-8 text-lg font-extrabold text-night hover:bg-[#d6fa85]"
          >
            Create free account
          </Link>
          <Link
            href="/tests"
            className="inline-flex min-h-14 items-center rounded-full bg-white/10 px-8 text-lg font-extrabold text-white ring-1 ring-white/25 hover:bg-white/20"
          >
            Book a test
          </Link>
        </div>
      </Container>
    </section>
  );
}
