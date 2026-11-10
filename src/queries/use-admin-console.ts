import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PROVIDER_API_PREFIX, type ProviderRole } from "@/lib/providerTypes";
import type { Paginated } from "@/types/verification";
import type {
  AdminAmbulanceRow,
  AdminConsultRow,
  AdminDeliveryRow,
  AdminOverview,
  CommissionReport,
  Earnings,
  EnforcementHistory,
  MarketplaceSettings,
  ScorecardRow,
} from "@/types/marketplace";

export type Period = { from: string; to: string };

/* ---------- Provider earnings ---------- */

export const useProviderEarnings = (role: ProviderRole, period: Period) =>
  useQuery<Earnings>({
    queryKey: ["provider-earnings", role, period],
    queryFn: async () => (await api.get(`${PROVIDER_API_PREFIX[role]}/earnings`, { params: period })).data,
    placeholderData: keepPreviousData,
    retry: false,
  });

/* ---------- Overview and live operations ---------- */

export const useAdminOverview = (period: Period) =>
  useQuery<AdminOverview>({
    queryKey: ["admin-overview", period],
    queryFn: async () => (await api.get("/admin/overview", { params: period })).data,
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
    retry: false,
  });

export type LiveList = "deliveries" | "consults" | "ambulance";

type LiveRow = { deliveries: AdminDeliveryRow; consults: AdminConsultRow; ambulance: AdminAmbulanceRow };

export function useLiveOperations<K extends LiveList>(list: K, filters: { status?: string; unpaid?: boolean; page: number }) {
  const path = list === "ambulance" ? "/admin/ambulance/requests" : `/admin/${list}`;
  return useQuery<Paginated<LiveRow[K]>>({
    queryKey: ["admin-live", list, filters],
    queryFn: async () =>
      (
        await api.get(path, {
          params: {
            status: filters.status || undefined,
            paymentStatus: list === "ambulance" && filters.unpaid ? "unpaid" : undefined,
            page: filters.page,
          },
        })
      ).data,
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
  });
}

/* ---------- Support oversight and enforcement ---------- */

export const useSupportScorecard = (days: number) =>
  useQuery<{ data: ScorecardRow[] }>({
    queryKey: ["admin-scorecard", days],
    queryFn: async () => (await api.get("/admin/support/scorecard", { params: { days } })).data,
    placeholderData: keepPreviousData,
  });

const enforcementKey = (type: string, id: number) => ["admin-enforcement", type, id] as const;

export const useEnforcementHistory = (type: ProviderRole, id: number) =>
  useQuery<EnforcementHistory>({
    queryKey: enforcementKey(type, id),
    queryFn: async () => {
      const data = (await api.get(`/admin/providers/${type}/${id}/enforcement`)).data;
      // The client's camel-casing leaves "_30" alone: breaches_last_30_days → breachesLast_30Days.
      return { ...data, breachesLast30Days: Number(data.breachesLast30Days ?? data.breachesLast_30Days ?? 0) };
    },
  });

export const useBanProvider = (type: ProviderRole, id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; refundedItems?: number }, unknown, { action: "ban" | "unban"; reason: string }>({
    mutationFn: async ({ action, reason }) => (await api.post(`/admin/providers/${type}/${id}/${action}`, { reason })).data,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: enforcementKey(type, id) }),
        queryClient.invalidateQueries({ queryKey: ["admin-verification", type, id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-scorecard"] }),
      ]),
  });
};

/* ---------- Super admin: commission ---------- */

export const useCommissionReport = (period: Period) =>
  useQuery<CommissionReport>({
    queryKey: ["super-admin-commission", period],
    queryFn: async () => (await api.get("/super-admin/commission", { params: period })).data,
    placeholderData: keepPreviousData,
    retry: false,
  });

export const useSetProviderCommission = (type: ProviderRole, id: number) =>
  useMutation<{ message: string; commissionPercent: number | null }, unknown, number | null>({
    mutationFn: async (commissionPercent) =>
      (await api.put(`/super-admin/providers/${type}/${id}/commission`, { commissionPercent })).data,
  });

/* ---------- Super admin: settings ---------- */

const settingsKey = ["marketplace-settings"] as const;

const num = (value: unknown, fallback: number) => {
  const n = Number(value);
  return value === undefined || value === null || value === "" || Number.isNaN(n) ? fallback : n;
};

export const useMarketplaceSettings = () =>
  useQuery<MarketplaceSettings>({
    queryKey: settingsKey,
    queryFn: async () => {
      const s = ((await api.get("/super-admin/settings")).data?.settings ?? {}) as Record<string, unknown>;
      const bearer = String(s.paystackFeeBearer ?? "account");
      return {
        doctorCommission: num(s.doctorCommission, 15),
        pharmacyCommission: num(s.pharmacyCommission, 10),
        labTechnicianCommission: num(s.labTechnicianCommission, 10),
        ambulanceOperatorCommission: num(s.ambulanceOperatorCommission, 10),
        paystackFeeBearer: (["account", "subaccount", "all-proportional", "all"].includes(bearer) ? bearer : "account") as MarketplaceSettings["paystackFeeBearer"],
        pharmacyAcceptMinutes: num(s.pharmacyAcceptMinutes, 15),
        doctorAcceptMinutes: num(s.doctorAcceptMinutes, 3),
        supportResponseHours: num(s.supportResponseHours, 24),
        doctorAppointmentDuration: num(s.doctorAppointmentDuration, 30),
        doctorRegistrationEnabled: String(s.doctorRegistrationEnabled ?? "1") === "1",
        pharmacyRegistrationEnabled: String(s.pharmacyRegistrationEnabled ?? "1") === "1",
        labTechnicianRegistrationEnabled: String(s.labTechnicianRegistrationEnabled ?? "1") === "1",
        ambulanceOperatorRegistrationEnabled: String(s.ambulanceOperatorRegistrationEnabled ?? "1") === "1",
      };
    },
  });

export const useSaveMarketplaceSettings = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, unknown, MarketplaceSettings>({
    mutationFn: async (settings) =>
      (
        await api.post("/super-admin/settings/update", {
          ...settings,
          doctorRegistrationEnabled: settings.doctorRegistrationEnabled ? 1 : 0,
          pharmacyRegistrationEnabled: settings.pharmacyRegistrationEnabled ? 1 : 0,
          labTechnicianRegistrationEnabled: settings.labTechnicianRegistrationEnabled ? 1 : 0,
          ambulanceOperatorRegistrationEnabled: settings.ambulanceOperatorRegistrationEnabled ? 1 : 0,
        })
      ).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: settingsKey }),
  });
};
