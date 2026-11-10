import type { Metadata } from "next";
import { DoctorsOnline } from "@/site/components/DoctorsOnline";
import { Container } from "@/site/components/ui";

export const metadata: Metadata = {
  title: "See a doctor now",
  description: "Talk to a verified doctor by chat or video. See who is online right now.",
  alternates: { canonical: "/see-a-doctor" },
};

export default function SeeADoctorPage() {
  return (
    <section className="min-h-[70vh] bg-sand py-10 sm:py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-6xl">See a doctor now</h1>
          <p className="text-xl leading-relaxed text-ink-700">
            Talk to a verified doctor by chat or video. If the doctor does not accept in time, you get your money back.
          </p>
        </div>
        <DoctorsOnline />
      </Container>
    </section>
  );
}
