import type { Metadata } from "next";
import { getMedicineShelf } from "@/site/api";
import { MedicineShelf } from "@/site/components/MedicineShelf";
import { Container } from "@/site/components/ui";

export const metadata: Metadata = {
  title: "Order medicine online in Abuja, delivered",
  description: "Genuine medicine delivered to your door in Abuja. See the price, order and pay online. No account needed.",
  alternates: { canonical: "/medicines" },
};

export default async function MedicinesPage() {
  const shelf = await getMedicineShelf();

  return (
    <section className="min-h-[70vh] bg-sand py-10 sm:py-14">
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-6xl">Order medicine</h1>
          <p className="text-xl leading-relaxed text-ink-700">Genuine medicine, delivered to your door in Abuja. Add what you need and pay; no account needed.</p>
        </div>
        <MedicineShelf initial={shelf} />
      </Container>
    </section>
  );
}
