import type { Metadata } from "next";
import { Checkout } from "@/site/components/Checkout";
import { Container } from "@/site/components/ui";

export const metadata: Metadata = {
  title: "Book your test",
  description: "Choose a day, tell us where, and pay. No account needed.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <section className="bg-sand py-8 sm:py-12">
      <Container>
        <Checkout />
      </Container>
    </section>
  );
}
