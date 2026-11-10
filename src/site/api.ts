import "server-only";

/** Server-side reads from the DocLabPharm API for the public website. */

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

/** Pages refresh their API data at most once an hour. */
const REVALIDATE_SECONDS = 3600;

async function getJson<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // The website must still render if the API is down; sections hide.
    return null;
  }
}

export type HealthPackage = {
  id: number;
  name: string;
  topic: string;
  quick_detail: string;
  description: string | null;
  image: string | null;
  symptoms: string | null;
  when_to_test: string | null;
  test_included: string | null;
  causes: string | null;
  prevention: string | null;
  benefits: string | null;
  updated_at?: string;
};

function unwrap<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: T[] }).data;
  }
  return [];
}

export async function getHealthPackages(): Promise<HealthPackage[]> {
  return unwrap<HealthPackage>(await getJson("/packages"));
}

export async function getHealthPackage(id: number): Promise<HealthPackage | null> {
  const body = await getJson<unknown>(`/packages/${id}`);
  if (!body || typeof body !== "object") return null;
  const record = "data" in body ? (body as { data: unknown }).data : body;
  return record && typeof record === "object" && "id" in record ? (record as HealthPackage) : null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function packagePath(pkg: Pick<HealthPackage, "id" | "name">): string {
  return `/health-checks/${pkg.id}-${slugify(pkg.name)}`;
}

export type LabTestGroup = {
  name: string;
  tests: { id: number; name: string; price: number | null; lab: string | null }[];
};

type RawCategory = {
  name?: string;
  diagnoses?: {
    id: number;
    name: string;
    price?: number | string | null;
    lab_technician?: { business_name?: string | null; first_name?: string | null; last_name?: string | null } | null;
  }[];
};

/** Tests listed by approved labs, grouped by category (empty until labs list tests). */
export async function getLabTestGroups(): Promise<LabTestGroup[]> {
  const categories = unwrap<RawCategory>(await getJson("/diagnosis/categories"));

  return categories
    .map((category) => ({
      name: (category.name ?? "").trim(),
      tests: (category.diagnoses ?? []).slice(0, 9).map((test) => ({
        id: test.id,
        name: test.name,
        price: test.price === null || test.price === undefined ? null : Number(test.price),
        lab:
          test.lab_technician?.business_name ||
          [test.lab_technician?.first_name, test.lab_technician?.last_name].filter(Boolean).join(" ") ||
          null,
      })),
    }))
    .filter((group) => group.name && group.tests.length > 0);
}
