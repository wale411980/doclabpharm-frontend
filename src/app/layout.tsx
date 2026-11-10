import type { Metadata, Viewport } from "next";
import "@/index.css";
import { SITE } from "@/site/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "DocLabPharm: medicine, doctors, lab tests and ambulances in Abuja",
    template: "%s | DocLabPharm",
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_NG",
    url: SITE.url,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#267a53",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="bg-white font-sans text-ink-900 antialiased">{children}</body>
    </html>
  );
}
