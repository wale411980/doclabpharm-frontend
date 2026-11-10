import type { ProviderRole } from "@/lib/providerTypes";

/** Shapes of the Phase 2 verification API after the client's camelCase conversion. */

export type VerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended"
  | "expired";

export type DocumentStatus = "pending" | "accepted" | "rejected";

export type ProviderDocument = {
  id: number;
  type: string;
  documentNumber: string | null;
  expiresAt: string | null;
  originalName: string;
  mime: string;
  size: number;
  status: DocumentStatus;
  reviewNote: string | null;
  uploadedAt: string;
};

export type DocumentRequirement = {
  type: string;
  label: string;
  required: boolean;
  uploaded: boolean;
  canChange: boolean;
  document: ProviderDocument | null;
};

export type ProviderVerification = {
  providerType: ProviderRole;
  verificationStatus: VerificationStatus;
  verificationNote: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  licenceExpiresAt: string | null;
  outstandingDocuments: string[];
  documents: DocumentRequirement[];
  allowedFileTypes: string[];
  maxFileSizeKb: number;
};

export type QueueFilter = "pending" | "renewal" | "all";

export type QueueItem = {
  id: number;
  providerType: ProviderRole;
  name: string;
  firstName: string;
  lastName: string;
  businessName: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  verificationStatus: VerificationStatus;
  submittedAt: string | null;
  verifiedAt: string | null;
  licenceExpiresAt: string | null;
  createdAt: string;
  pendingDocuments: number;
};

export type Paginated<T> = {
  data: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type PersonRef = { id: number; firstName: string; lastName: string; email?: string };

export type AdminProviderDocument = ProviderDocument & {
  label: string;
  reviewedAt: string | null;
  reviewedBy: PersonRef | null;
};

export type VerificationEvent = {
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  actor: { type: string; id: number; name: string; email: string } | null;
  createdAt: string;
};

export type VerificationDetail = {
  providerType: ProviderRole;
  provider: {
    id: number;
    firstName: string;
    lastName: string;
    businessName?: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    cacNumber?: string | null;
    mdcnNumber?: string | null;
    pcnPremisesNumber?: string | null;
    mlscnNumber?: string | null;
    verificationStatus: VerificationStatus;
    verificationNote: string | null;
    submittedAt: string | null;
    verifiedAt: string | null;
    licenceExpiresAt: string | null;
    createdAt: string;
    verifiedBy: PersonRef | null;
  };
  /** Keyed by document type, camelCased by the API client (mdcn_certificate → mdcnCertificate). */
  requiredDocuments: Record<string, { label: string; required: boolean }>;
  outstandingDocuments: string[];
  documents: AdminProviderDocument[];
  events: VerificationEvent[];
  openReports: number;
};

export type ReportStatus = "open" | "resolved" | "dismissed";

export type ProviderReport = {
  id: number;
  status: ReportStatus;
  reason: string;
  resolutionNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  reporter: { id: number; firstName: string; lastName: string; email: string; phone: string | null } | null;
  provider: { type: ProviderRole; id: number; name: string; verificationStatus: VerificationStatus } | null;
};

export type AmbulanceOperatorProfile = {
  id: number;
  businessName: string | null;
  cacNumber: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
};
