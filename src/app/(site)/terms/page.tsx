import type { Metadata } from "next";
import { LegalDocument, loadLegal } from "@/site/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "The terms that govern your use of DocLabPharm.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalDocument blocks={loadLegal("terms.md")} />;
}
