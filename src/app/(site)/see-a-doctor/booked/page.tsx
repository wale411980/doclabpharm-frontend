import type { Metadata } from "next";
import { DoctorBooked } from "@/site/components/DoctorBooked";
import { Container } from "@/site/components/ui";

export const metadata: Metadata = { title: "Your doctor booking", robots: { index: false } };

export default function DoctorBookedPage() {
  return (
    <section className="min-h-[70vh] bg-sand">
      <Container>
        <DoctorBooked />
      </Container>
    </section>
  );
}
