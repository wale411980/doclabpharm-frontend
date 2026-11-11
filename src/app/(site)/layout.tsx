import { SiteFooter } from "@/site/components/SiteFooter";
import { SiteHeader } from "@/site/components/SiteHeader";
import { SupportChat } from "@/site/components/SupportChat";
import { JsonLd } from "@/site/components/ui";
import { SITE } from "@/site/config";

const organization = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/images/logo-mark.png`,
  email: SITE.email,
  telephone: SITE.phone,
  areaServed: { "@type": "City", name: SITE.city },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: "NG",
  },
  parentOrganization: { "@type": "Organization", name: SITE.owner },
  sameAs: Object.values(SITE.social),
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <JsonLd data={organization} />
      <SupportChat />
    </>
  );
}
