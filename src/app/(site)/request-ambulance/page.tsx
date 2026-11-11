import type { Metadata } from "next";
import { RequestAmbulance } from "@/site/components/RequestAmbulance";
import { Container } from "@/site/components/ui";

export const metadata: Metadata = {
  title: "Request an ambulance in Abuja",
  description: "Ask for the nearest free ambulance with your name, phone number and location. No account needed. In danger now? Call 112.",
  alternates: { canonical: "/request-ambulance" },
};

export default function RequestAmbulancePage() {
  return (
    <section className="min-h-[70vh] bg-sand py-10 sm:py-14">
      <Container className="flex max-w-3xl flex-col gap-7">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-6xl">Request an ambulance</h1>
          <p className="text-xl leading-relaxed text-ink-700">Three details and we ask the nearest free ambulance. If a life is in danger right now, call 112 as well.</p>
        </div>
        <RequestAmbulance />
      </Container>
    </section>
  );
}
