import type { Metadata } from "next";
import { CheckoutComplete } from "@/site/components/CheckoutComplete";
import { Container } from "@/site/components/ui";

export const metadata: Metadata = { title: "Your booking", robots: { index: false } };

export default function CheckoutCompletePage() {
  return (
    <section className="min-h-[70vh] bg-sand">
      <Container>
        <CheckoutComplete />
      </Container>
    </section>
  );
}
