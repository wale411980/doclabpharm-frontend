import type { Metadata } from "next";
import SpaHost from "@/spa/SpaHost";

// Signed-in areas are private: keep them out of search results.
export const metadata: Metadata = {
  title: "DocLabPharm",
  robots: { index: false, follow: false },
};

export default function AppShellPage() {
  return <SpaHost />;
}
