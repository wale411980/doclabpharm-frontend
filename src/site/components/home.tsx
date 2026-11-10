import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_LINKS, SERVICES } from "@/site/config";
import { SERVICE_ICON, SERVICE_TONE } from "./icons";
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from "./ui";
import { packagePath, type HealthPackage } from "@/site/api";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-50">
      <Container className="grid items-center gap-10 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-16">
        <div className="flex flex-col items-start gap-6">
          <Eyebrow>
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Now serving Abuja
          </Eyebrow>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl">
            Feeling unwell? We will take it from here.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink-700 sm:text-xl">
            Medicine, doctors, lab tests and ambulances from verified providers near you, in one app.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={APP_LINKS.register} size="lg">
              Get started free
            </ButtonLink>
            <ButtonLink href="/services/ambulance" size="lg" variant="warm">
              Need an ambulance?
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
          <Image
            src="/images/doctor-cutout.webp"
            alt=""
            width={595}
            height={903}
            priority
            sizes="(min-width: 1024px) 420px, 0px"
            className="relative mx-auto h-auto w-[78%]"
          />
          <div className="absolute bottom-10 left-0 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <BadgeCheck className="h-6 w-6 text-brand-600" />
            <span className="text-sm font-bold text-ink-900">Licence verified</span>
          </div>
        </div>
      </Container>

      <Container className="pb-16">
        <h2 className="sr-only">What do you need today?</h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICON[service.slug];
            const tone = SERVICE_TONE[service.slug];
            return (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  className={cn(
                    "group flex h-full min-h-[190px] flex-col justify-between gap-6 rounded-3xl p-5 shadow-[0_10px_30px_rgba(16,36,30,0.07)] ring-1 ring-brand-100 transition-transform hover:-translate-y-0.5 sm:p-6",
                    tone.tile
                  )}
                >
                  <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", tone.badge)}>
                    <Icon className={cn("h-7 w-7", tone.icon)} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-lg font-extrabold leading-snug text-ink-900 sm:text-xl">
                      {service.cta}
                      <ArrowRight
                        className="ml-1 inline h-4 w-4 align-[-0.1em] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm leading-snug text-ink-500 sm:text-[15px]">{service.short}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

const PINS = [
  { label: "Pharmacy", left: "18%", top: "20%", tone: "bg-white text-ink-900" },
  { label: "Lab", left: "60%", top: "24%", tone: "bg-white text-ink-900" },
  { label: "Ambulance", left: "24%", top: "74%", tone: "bg-warm-400 text-warm-900" },
];

/** A drawn map (not real data) showing how nearest-provider matching works. */
export function NearestSection() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div
          role="img"
          aria-label="Illustration: your location with the nearest pharmacy, lab and ambulance marked around it"
          className="relative h-[340px] overflow-hidden rounded-[32px] bg-brand-100 sm:h-[400px]"
        >
          <span className="absolute -left-[10%] top-[38%] h-3.5 w-[120%] -rotate-[8deg] bg-white" />
          <span className="absolute -top-[10%] left-[46%] h-[120%] w-3.5 rotate-[12deg] bg-white" />
          <span className="absolute -left-[10%] top-[72%] h-2.5 w-[120%] rotate-[5deg] bg-white" />
          <span className="absolute left-[47%] top-[47%] h-6 w-6 rounded-full border-[5px] border-white bg-brand-600 shadow-[0_0_0_14px_rgba(38,122,83,0.2)]" />
          {PINS.map((pin) => (
            <span
              key={pin.label}
              className={cn("absolute rounded-full px-4 py-2 text-sm font-bold shadow-md", pin.tone)}
              style={{ left: pin.left, top: pin.top }}
            >
              {pin.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeading
            title="Always the closest help to you"
            intro="DocLabPharm uses your location to find the nearest verified pharmacy with your medicine in stock, the nearest lab and the nearest available ambulance, so help reaches you sooner."
          />
          <ol className="flex flex-col gap-5">
            {[
              ["Tell us what you need", "Medicine, a doctor, a lab test or an ambulance."],
              ["We match you nearby", "The closest verified provider who can help gets your request."],
              ["Pay safely and follow it live", "Pay in the app, then track your order, collector or ambulance."],
            ].map(([title, body], index) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-600 text-lg font-extrabold text-white">
                  {index + 1}
                </span>
                <span className="flex flex-col gap-1 pt-1.5">
                  <span className="text-lg font-bold text-ink-900">{title}</span>
                  <span className="text-ink-500">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

const SPOTLIGHTS = [
  {
    title: "Talk to a doctor today",
    body: "Chat, voice or video with a licensed doctor, or book a time that suits you. Prescriptions go straight to a pharmacy near you.",
    image: "/images/doctor-smiling.webp",
    width: 1000,
    height: 666,
    href: "/services/doctors",
    cta: "See a doctor",
  },
  {
    title: "Lab tests without the queue",
    body: "Book a test with a registered lab, have your sample collected at home, and get your result on your phone.",
    image: "/images/lab-sample.webp",
    width: 742,
    height: 492,
    href: "/services/lab-tests",
    cta: "Book a test",
  },
];

export function Spotlights() {
  return (
    <Section tone="sand">
      <div className="grid gap-6 md:grid-cols-2">
        {SPOTLIGHTS.map((item) => (
          <article key={item.title} className="flex flex-col overflow-hidden rounded-[32px] bg-white ring-1 ring-brand-100">
            <Image
              src={item.image}
              alt=""
              width={item.width}
              height={item.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="flex flex-1 flex-col items-start gap-3 p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">{item.title}</h2>
              <p className="leading-relaxed text-ink-500">{item.body}</p>
              <Link
                href={item.href}
                className="mt-auto inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-700 hover:text-brand-800"
              >
                {item.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

const LICENCES = [
  ["Doctors", "Medical and Dental Council of Nigeria registration and current practising licence"],
  ["Pharmacies", "Pharmacy Council of Nigeria premises licence and superintendent pharmacist"],
  ["Laboratories", "Medical Laboratory Science Council of Nigeria registration"],
  ["Ambulance operators", "Business registration, vehicle papers and crew licences"],
];

export function VerifiedSection() {
  return (
    <Section tone="deep">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">You are in safe hands</h2>
          <p className="text-lg leading-relaxed text-brand-100">
            Every provider is checked against their official Nigerian licence before they can serve you, and
            licences are rechecked when they expire.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {LICENCES.map(([who, what]) => (
            <li key={who} className="flex gap-3 rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10">
              <BadgeCheck className="mt-0.5 h-6 w-6 flex-none text-brand-300" aria-hidden="true" />
              <span className="flex flex-col gap-1">
                <span className="font-bold">{who}</span>
                <span className="text-sm leading-relaxed text-brand-100">{what}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

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
                <span className="text-sm font-bold uppercase tracking-wide text-brand-700">{pkg.topic}</span>
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
    <section className="bg-white pb-16 sm:pb-24">
      <Container>
        <div className="flex flex-col gap-8 rounded-[36px] bg-brand-600 p-8 text-white sm:p-12">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Grow your practice with DocLabPharm</h2>
            <p className="text-lg leading-relaxed text-brand-50">
              Reach patients near you. Registration is free, and you pay a commission only on what you earn.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_TYPES.map((type) => (
              <li key={type.anchor}>
                <Link
                  href={`/partners#${type.anchor}`}
                  className={cn(
                    "flex min-h-16 items-center justify-between gap-2 rounded-2xl px-5 py-4 text-lg font-extrabold",
                    type.anchor === "ambulance" ? "bg-warm-400 text-warm-900" : "bg-white text-ink-900"
                  )}
                >
                  {type.label}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function AppSection() {
  return (
    <Section tone="tint">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Image
          src="/images/patient-phone.webp"
          alt="A man checking his phone on the way to work"
          width={745}
          height={492}
          sizes="(min-width: 768px) 45vw, 90vw"
          className="h-auto w-full rounded-[32px] object-cover"
        />
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Android and iPhone
          </Eyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Your health, in your pocket</h2>
          <p className="text-lg leading-relaxed text-ink-500">
            The DocLabPharm app is coming to Google Play and the App Store. Until then, everything works here on
            the website, on any phone.
          </p>
          <ButtonLink href={APP_LINKS.register} size="lg">
            Create your free account
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
