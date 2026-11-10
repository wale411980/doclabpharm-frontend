import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { HomeCollectionSettings, LabBooking, LabReport, PatientLabResult } from "@/types/marketplace";

/* ---------- Patient ---------- */

export const usePatientLabResults = () =>
  useQuery<{ data: PatientLabResult[] }>({
    queryKey: ["patient-lab-results"],
    queryFn: async () => (await api.get("/user/lab-results")).data,
  });

/**
 * Downloads a result file with the patient's token and saves it. Older
 * results not yet moved to private storage come back as a link instead.
 */
export async function downloadLabResult(path: string, fallbackName: string): Promise<void> {
  const response = await api.get(path, { responseType: "blob" });
  const blob = response.data as Blob;

  if (blob.type.includes("application/json")) {
    const body = JSON.parse(await blob.text()) as { url?: string; message?: string };
    if (body.url) {
      window.open(body.url, "_blank", "noopener");
      return;
    }
    throw new Error(body.message || "This result has no file.");
  }

  const disposition = String(response.headers["content-disposition"] ?? "");
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  // Content-Disposition is not readable cross-origin unless the API exposes
  // it, so the extension falls back to the file's type.
  const extension = { "application/pdf": ".pdf", "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[blob.type] ?? "";
  const name = match ? decodeURIComponent(match[1]) : `${fallbackName}${extension}`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/* ---------- Lab ---------- */

const bookingsKey = ["lab-bookings"] as const;
const reportsKey = ["lab-reports"] as const;

export const useLabBookings = () =>
  useQuery<LabBooking[]>({
    queryKey: bookingsKey,
    queryFn: async () => {
      const data = (await api.get("/lab-technician/diagnosis/bookings/list")).data;
      return data?.data ?? [];
    },
  });

export const useLabReports = () =>
  useQuery<LabReport[]>({
    queryKey: reportsKey,
    queryFn: async () => {
      const data = (await api.get("/lab-technician/reports")).data;
      const rows = data?.data;
      return Array.isArray(rows) ? rows : rows?.data ?? [];
    },
  });

const refreshLab = (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: bookingsKey }),
    queryClient.invalidateQueries({ queryKey: reportsKey }),
  ]);

export const useLabProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, { bookingId: number; progress: "sample_collected" | "processing" }>({
    mutationFn: async ({ bookingId, progress }) => (await api.post(`/lab-technician/bookings/${bookingId}/progress`, { progress })).data,
    onSettled: () => refreshLab(queryClient),
  });
};

export type NewLabResultInput = {
  bookingId: number;
  status: "normal" | "abnormal" | "critical";
  summary: string;
  file: File | null;
  draft: boolean;
};

/** POST /lab-technician/reports/add as multipart, with the result file. */
export const useAddLabResult = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; report: LabReport }, unknown, NewLabResultInput>({
    mutationFn: async ({ bookingId, status, summary, file, draft }) => {
      const body = new FormData();
      body.append("booking_id", String(bookingId));
      body.append("status", status);
      if (summary.trim()) body.append("summary", summary.trim());
      if (file) body.append("file", file);
      body.append("draft", draft ? "1" : "0");
      return (await api.post("/lab-technician/reports/add", body, { headers: { "Content-Type": "multipart/form-data" } })).data;
    },
    onSettled: () => refreshLab(queryClient),
  });
};

export const useUploadLabResultFile = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, { reportId: number; file: File }>({
    mutationFn: async ({ reportId, file }) => {
      const body = new FormData();
      body.append("file", file);
      return (await api.post(`/lab-technician/reports/${reportId}/file`, body, { headers: { "Content-Type": "multipart/form-data" } })).data;
    },
    onSettled: () => refreshLab(queryClient),
  });
};

export const useReleaseLabResult = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, number>({
    mutationFn: async (reportId) => (await api.post(`/lab-technician/reports/${reportId}/release`)).data,
    onSettled: () => refreshLab(queryClient),
  });
};

const collectionKey = ["lab-home-collection"] as const;

export const useHomeCollectionSettings = () =>
  useQuery<HomeCollectionSettings>({
    queryKey: collectionKey,
    queryFn: async () => {
      const data = (await api.get("/lab-technician")).data;
      const profile = data?.original ?? data;
      return {
        offersHomeCollection: Boolean(profile.offersHomeCollection),
        homeCollectionFee: Number(profile.homeCollectionFee ?? 2000),
        homeCollectionRadiusKm: Number(profile.homeCollectionRadiusKm ?? 10),
      };
    },
  });

export const useSaveHomeCollectionSettings = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; settings: HomeCollectionSettings }, unknown, Partial<HomeCollectionSettings>>({
    mutationFn: async (input) => (await api.put("/lab-technician/home-collection-settings", input)).data,
    onSuccess: (data) => queryClient.setQueryData(collectionKey, data.settings),
  });
};
