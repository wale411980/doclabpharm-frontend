import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PROVIDER_API_PREFIX } from "@/lib/providerTypes";
import type { Paginated } from "@/types/verification";
import type { NewTicketInput, SupportAudience, SupportThread, SupportTicket } from "@/types/marketplace";

/** API prefix of each side's support routes. */
export function supportPrefix(audience: SupportAudience): string {
  if (audience === "patient") return "/user/support/tickets";
  if (audience === "admin") return "/admin/support/tickets";
  return `${PROVIDER_API_PREFIX[audience]}/support/tickets`;
}

export type TicketFilters = {
  status?: string;
  breached?: boolean;
  providerType?: string;
  providerId?: number;
  page: number;
};

const listKey = (audience: SupportAudience) => ["support-tickets", audience] as const;
const threadKey = (audience: SupportAudience, id: number) => ["support-ticket", audience, id] as const;

export const useSupportTickets = (audience: SupportAudience, filters: TicketFilters) =>
  useQuery<Paginated<SupportTicket>>({
    queryKey: [...listKey(audience), filters],
    queryFn: async () =>
      (
        await api.get(supportPrefix(audience), {
          params: {
            status: filters.status || undefined,
            breached: filters.breached ? 1 : undefined,
            providerType: filters.providerType || undefined,
            providerId: filters.providerId || undefined,
            page: filters.page,
          },
        })
      ).data,
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });

export const useSupportThread = (audience: SupportAudience, id: number) =>
  useQuery<SupportThread>({
    queryKey: threadKey(audience, id),
    queryFn: async () => (await api.get(`${supportPrefix(audience)}/${id}`)).data,
    refetchInterval: 30_000,
  });

export type TicketAction =
  | { action: "reply"; body: string; internal?: boolean }
  | { action: "resolve" }
  | { action: "close" }
  | { action: "reopen"; message: string };

export const useTicketAction = (audience: SupportAudience, id: number) => {
  const queryClient = useQueryClient();
  return useMutation<SupportTicket, unknown, TicketAction>({
    mutationFn: async (input) => {
      const base = `${supportPrefix(audience)}/${id}`;
      switch (input.action) {
        case "reply":
          return (await api.post(`${base}/reply`, { body: input.body, internal: input.internal || undefined })).data;
        case "reopen":
          return (await api.post(`${base}/reopen`, { message: input.message })).data;
        default:
          return (await api.post(`${base}/${input.action}`)).data;
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: threadKey(audience, id) }),
        queryClient.invalidateQueries({ queryKey: listKey(audience) }),
      ]),
  });
};

export const useOpenTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<SupportTicket, unknown, NewTicketInput>({
    mutationFn: async (input) => (await api.post("/user/support/tickets", input)).data,
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey("patient") }),
  });
};
