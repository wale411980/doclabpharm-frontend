import { SiteFooter } from "@/site/components/SiteFooter";
import { SiteHeader } from "@/site/components/SiteHeader";
import { ButtonLink, Container } from "@/site/components/ui";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-brand-50">
        <Container className="flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Page not found</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            We could not find that page
          </h1>
          <p className="max-w-xl text-lg text-ink-700">It may have moved. Try the homepage or our help centre.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/">Go to the homepage</ButtonLink>
            <ButtonLink href="/help" variant="secondary">
              Get help
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
