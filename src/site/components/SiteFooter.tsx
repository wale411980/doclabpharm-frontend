import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { APP_LINKS, SERVICES, SITE } from "@/site/config";
import { Logo } from "./Logo";
import { Container } from "./ui";

const COLUMNS = [
  {
    title: "Services",
    links: SERVICES.map((s) => ({ href: s.href, label: s.name })),
  },
  {
    title: "Partners",
    links: [
      { href: "/partners#pharmacies", label: "Pharmacies" },
      { href: "/partners#doctors", label: "Doctors" },
      { href: "/partners#labs", label: "Laboratories" },
      { href: "/partners#ambulance", label: "Ambulance operators" },
      { href: APP_LINKS.partnerLogin, label: "Partner log in" },
    ],
  },
  {
    title: "DocLabPharm",
    links: [
      { href: "/about", label: "About us" },
      { href: "/health-checks", label: "Health guides" },
      { href: "/abuja", label: "Areas we serve" },
      { href: "/help", label: "Help and support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms and conditions" },
      { href: "/refund-policy", label: "Refund policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-900 text-white">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-5">
          <Logo inverted />
          <p className="max-w-sm leading-relaxed text-brand-100">
            Medicine, doctors, lab tests and ambulances from verified providers near you. Now serving{" "}
            {SITE.city}.
          </p>
          <ul className="flex flex-col gap-2 text-brand-100">
            <li>
              <a href={SITE.phoneHref} className="inline-flex min-h-11 items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {SITE.city}, {SITE.region}
            </li>
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-200">{col.title}</h2>
              <ul className="mt-3 flex flex-col">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-10 items-center text-[15px] text-white/90 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-sm text-brand-100 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} DocLabPharm, a {SITE.owner} platform.
          </p>
          <ul className="flex gap-1">
            {(
              [
                ["Facebook", SITE.social.facebook],
                ["X", SITE.social.x],
                ["Instagram", SITE.social.instagram],
              ] as const
            ).map(([name, href]) => (
              <li key={name}>
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center rounded-full px-3 hover:text-white"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
