import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/site/config";
import { getHealthPackages, packagePath } from "@/site/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const packages = await getHealthPackages();

  return [
    page("", 1, "weekly"),
    ...SERVICES.map((s) => page(s.href, 0.9)),
    page("/partners", 0.8),
    page("/abuja", 0.8),
    page("/health-checks", 0.7, "weekly"),
    ...packages.map((pkg) => ({
      ...page(packagePath(pkg), 0.6),
      lastModified: pkg.updated_at ? new Date(pkg.updated_at) : now,
    })),
    page("/about", 0.5),
    page("/help", 0.5),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
    page("/refund-policy", 0.2, "yearly"),
  ];
}
