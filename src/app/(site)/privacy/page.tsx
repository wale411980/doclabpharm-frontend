import type { Metadata } from "next";
import { LegalDocument, loadLegal } from "@/site/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How DocLabPharm collects, uses and protects your personal and health information.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalDocument blocks={loadLegal("privacy.md")} />;
}
