import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DocLabPharm",
    short_name: "DocLabPharm",
    description: "Medicine, doctors, lab tests and ambulances near you.",
    start_url: "/user/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#267a53",
    icons: [
      { src: "/favicon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
