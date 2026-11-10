import type { MetadataRoute } from "next";
import { SITE } from "@/site/config";

/** Public pages are indexed; signed-in areas and sign-in screens are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/app-shell",
        "/user/",
        "/doctor/",
        "/pharmacy/",
        "/lab_technician/",
        "/admin/",
        "/super-admin/",
        "/patient/",
        "/caregiver/",
        "/login",
        "/register",
        "/partners/login",
        "/partners/register",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
