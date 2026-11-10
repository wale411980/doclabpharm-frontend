import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { APP_LINKS, SITE } from "@/site/config";
import { Logo } from "./Logo";
import { ButtonLink, Container } from "./ui";

const NAV = [
  { href: "/services/pharmacy", label: "Medicine" },
  { href: "/services/doctors", label: "Doctors" },
  { href: "/services/lab-tests", label: "Lab tests" },
  { href: "/services/ambulance", label: "Ambulance" },
  { href: "/partners", label: "For partners" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={APP_LINKS.login} variant="secondary">
            Log in
          </ButtonLink>
          <ButtonLink href={APP_LINKS.register}>Sign up free</ButtonLink>
        </div>

        {/* Phone and tablet menu: a native disclosure, works without JavaScript. */}
        <details className="group relative lg:hidden">
          <summary
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full ring-1 ring-brand-200 [&::-webkit-details-marker]:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-ink-900" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-14 w-[min(88vw,340px)] rounded-3xl bg-white p-4 shadow-xl ring-1 ring-brand-100">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-12 items-center rounded-2xl px-4 text-base font-semibold text-ink-900 hover:bg-brand-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-brand-100 pt-4">
              <ButtonLink href={APP_LINKS.login} variant="secondary">
                Log in
              </ButtonLink>
              <ButtonLink href={APP_LINKS.register}>Sign up</ButtonLink>
            </div>
            <a
              href={SITE.phoneHref}
              className="mt-3 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-brand-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {SITE.phone}
            </a>
          </div>
        </details>
      </Container>
    </header>
  );
}
