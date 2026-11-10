import type { Metadata } from "next";
import { LegalDocument, loadLegal } from "@/site/components/LegalDocument";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "When and how refunds are made for orders, consultations, tests and trips on DocLabPharm.",
  alternates: { canonical: "/refund-policy" },
};

export default function Page() {
  return <LegalDocument blocks={loadLegal("refund.md")} />;
}
