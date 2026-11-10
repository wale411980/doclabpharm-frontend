import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PROVIDER_API_PREFIX, type ProviderRole } from "@/lib/providerTypes";
import type {
  Paginated,
  ProviderReport,
  ProviderVerification,
  QueueFilter,
  QueueItem,
  ReportStatus,
  VerificationDetail,
  VerificationStatus,
} from "@/types/verification";

/* ---------- Provider: own verification ---------- */

const verificationKey = (role: ProviderRole) => ["verification", role] as const;

export const useProviderVerification = (role: ProviderRole) =>
  useQuery<ProviderVerification>({
    queryKey: verificationKey(role),
    queryFn: async () => (await api.get(`${PROVIDER_API_PREFIX[role]}/verification`)).data,
  });

export type UploadDocumentInput = {
  type: string;
  file: File;
  documentNumber?: string;
};

export const useUploadVerificationDocument = (role: ProviderRole) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, file, documentNumber }: UploadDocumentInput) => {
      // Sent as multipart with the API's own (snake_case) field names: the
      // client leaves FormData bodies untouched. The explicit content type
      // stops axios from serialising the FormData as JSON.
      const body = new FormData();
      body.append("type", type);
      body.append("file", file);
      if (documentNumber) body.append("document_number", documentNumber);
      const response = await api.post(`${PROVIDER_API_PREFIX[role]}/verification/documents`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: verificationKey(role) }),
  });
};

export const useDeleteVerificationDocument = (role: ProviderRole) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: number) =>
      (await api.delete(`${PROVIDER_API_PREFIX[role]}/verification/documents/${documentId}`)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: verificationKey(role) }),
  });
};

export const useSubmitVerification = (role: ProviderRole) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; verificationStatus: VerificationStatus }>({
    mutationFn: async () => (await api.post(`${PROVIDER_API_PREFIX[role]}/verification/submit`)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: verificationKey(role) }),
  });
};

/**
 * Downloads a document with the signed-in user's token and opens it in a
 * new tab (a plain link would not send the Bearer token).
 */
export async function openAuthenticatedFile(path: string, fileName: string) {
  // Open the tab synchronously so pop-up blockers treat it as user initiated.
  const tab = window.open("", "_blank");
  let response;
  try {
    response = await api.get(path, { responseType: "blob" });
  } catch (error) {
    tab?.close();
    throw error;
  }
  const url = URL.createObjectURL(response.data as Blob);
  if (tab) {
    tab.location.href = url;
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export const providerDocumentPath = (role: ProviderRole, documentId: number) =>
  `${PROVIDER_API_PREFIX[role]}/verification/documents/${documentId}/download`;

export const adminDocumentPath = (documentId: number) =>
  `/admin/verifications/documents/${documentId}/download`;

/* ---------- Admin: verification queue ---------- */

export type QueueParams = {
  status: QueueFilter | VerificationStatus;
  type?: ProviderRole;
  page: number;
};

export const useVerificationQueue = ({ status, type, page }: QueueParams) =>
  useQuery<Paginated<QueueItem>>({
    queryKey: ["admin-verifications", status, type ?? "any", page],
    queryFn: async () =>
      (await api.get("/admin/verifications", { params: { status, type, page, perPage: 20 } })).data,
    placeholderData: keepPreviousData,
  });

const detailKey = (type: string, id: number) => ["admin-verification", type, id] as const;

export const useVerificationDetail = (type: ProviderRole, id: number) =>
  useQuery<VerificationDetail>({
    queryKey: detailKey(type, id),
    queryFn: async () => (await api.get(`/admin/verifications/${type}/${id}`)).data,
  });

type Decision =
  | { action: "approve"; licenceExpiresAt: string; note?: string }
  | { action: "reject"; reason: string }
  | { action: "suspend"; reason: string }
  | { action: "reject-document"; documentId: number; reason: string };

export const useVerificationDecision = (type: ProviderRole, id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, Decision>({
    mutationFn: async (decision) => {
      const base = `/admin/verifications/${type}/${id}`;
      switch (decision.action) {
        case "approve":
          return (await api.post(`${base}/approve`, {
            licenceExpiresAt: decision.licenceExpiresAt,
            note: decision.note || undefined,
          })).data;
        case "reject":
          return (await api.post(`${base}/reject`, { reason: decision.reason })).data;
        case "suspend":
          return (await api.post(`${base}/suspend`, { reason: decision.reason })).data;
        case "reject-document":
          return (await api.post(`/admin/verifications/documents/${decision.documentId}/reject`, {
            reason: decision.reason,
          })).data;
      }
    },
    // Returned so the caller's success message follows the refreshed file.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: detailKey(type, id) }),
        queryClient.invalidateQueries({ queryKey: ["admin-verifications"] }),
      ]),
  });
};

/* ---------- Admin: provider reports ---------- */

export const useProviderReports = (status: ReportStatus | "all", page: number) =>
  useQuery<Paginated<ProviderReport>>({
    queryKey: ["admin-provider-reports", status, page],
    queryFn: async () =>
      (await api.get("/admin/provider-reports", { params: { status, page, perPage: 20 } })).data,
    placeholderData: keepPreviousData,
  });

export const useResolveProviderReport = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, { id: number; status: "resolved" | "dismissed"; note?: string }>({
    mutationFn: async ({ id, status, note }) =>
      (await api.post(`/admin/provider-reports/${id}/resolve`, { status, note: note || undefined })).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin-provider-reports"] }),
  });
};
