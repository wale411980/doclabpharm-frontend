import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LifeBuoy, Send } from "lucide-react";
import { Button, Card, Field, LoadingState, PageHeader, buttonStyles, inputStyles } from "@/components/dashboard/ui";
import { EmptyState, InlineError, textareaStyles } from "@/components/dashboard/marketplace";
import api from "@/lib/axios";
import { apiErrorMessage } from "@/lib/apiError";
import { isProviderRole, providerRoleLabel, type ProviderRole } from "@/lib/providerTypes";
import { cn } from "@/lib/utils";
import { useOpenTicket } from "@/queries/use-support";
import type { SupportCategory } from "@/types/marketplace";
import { CATEGORIES } from "./supportCopy";

type ProviderOption = { key: string; type: ProviderRole; id: number; name: string; orders: { id: number; label: string }[] };

const TYPE_OF_SERVICE: Record<string, ProviderRole> = {
  med: "pharmacy",
  delivery: "pharmacy",
  consult: "doctor",
  lab: "lab_technician",
  home_collection: "lab_technician",
  ambulance: "ambulance_operator",
};

type OrderRow = {
  id: number;
  orderTrx: string;
  createdAt: string;
  items: { serviceType: string; giverId: number; serviceName: string | null }[];
};

/**
 * The providers a patient has ordered from (the only ones they can open a
 * ticket with), named from their deliveries, appointments and lab bookings.
 */
function useProviderOptions() {
  return useQuery<ProviderOption[]>({
    queryKey: ["support-provider-options"],
    queryFn: async () => {
      const [orders, deliveries, appointments, labs] = await Promise.all([
        api.get("/user/order_history").then((r) => (Array.isArray(r.data) ? (r.data as OrderRow[]) : [])),
        api.get("/user/deliveries").then((r) => r.data?.data ?? []).catch(() => []),
        api.get("/user/appointment").then((r) => (Array.isArray(r.data) ? r.data : [])).catch(() => []),
        api.get("/user/lab-appointments").then((r) => (Array.isArray(r.data) ? r.data : [])).catch(() => []),
      ]);

      const names = new Map<string, string>();
      deliveries.forEach((d: { pharmacy?: { id: number; name: string } }) => d.pharmacy && names.set(`pharmacy-${d.pharmacy.id}`, d.pharmacy.name));
      appointments.forEach((b: { doctor?: { id: number; firstName: string; lastName: string } }) =>
        b.doctor && names.set(`doctor-${b.doctor.id}`, `Dr ${b.doctor.firstName} ${b.doctor.lastName}`)
      );
      labs.forEach((b: { labTechnician?: { id: number; businessName?: string; firstName: string; lastName: string } }) =>
        b.labTechnician && names.set(`lab_technician-${b.labTechnician.id}`, b.labTechnician.businessName || `${b.labTechnician.firstName} ${b.labTechnician.lastName}`)
      );

      const options = new Map<string, ProviderOption>();
      orders.forEach((order) => {
        (order.items ?? []).forEach((item) => {
          const type = TYPE_OF_SERVICE[item.serviceType];
          if (!type || !item.giverId) return;
          const key = `${type}-${item.giverId}`;
          const option = options.get(key) ?? {
            key,
            type,
            id: Number(item.giverId),
            name: names.get(key) ?? `${providerRoleLabel(type)} #${item.giverId}`,
            orders: [],
          };
          if (!option.orders.some((o) => o.id === order.id)) {
            option.orders.push({
              id: order.id,
              label: `${order.orderTrx} · ${new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}${item.serviceName ? ` · ${item.serviceName}` : ""}`,
            });
          }
          options.set(key, option);
        });
      });
      return [...options.values()].sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

/** A patient opens a support ticket with a provider they ordered from. */
export default function NewTicket({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const open = useOpenTicket();
  const { data: providers, isLoading, isError, error: loadError } = useProviderOptions();

  const presetType = params.get("providerType");
  const presetKey = isProviderRole(presetType) && params.get("providerId") ? `${presetType}-${params.get("providerId")}` : "";
  const [providerKey, setProviderKey] = useState(presetKey);
  const [orderId, setOrderId] = useState(params.get("orderId") ?? "");
  const [category, setCategory] = useState<SupportCategory>("order");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "New support ticket | DocLabPharm";
  }, []);

  useEffect(() => {
    if (!providerKey && providers?.length === 1) setProviderKey(providers[0].key);
  }, [providers, providerKey]);

  const provider = useMemo(() => providers?.find((p) => p.key === providerKey), [providers, providerKey]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!provider) return setError("Please choose who the ticket is about.");
    if (!subject.trim() || !message.trim()) return setError("Please add a short title and tell us what happened.");
    try {
      const ticket = await open.mutateAsync({
        providerType: provider.type,
        providerId: provider.id,
        category,
        subject: subject.trim(),
        message: message.trim(),
        orderId: orderId ? Number(orderId) : undefined,
        urgent: urgent || undefined,
      });
      toast.success(`Ticket ${ticket.reference} opened. ${provider.name} has been told.`);
      navigate(`${basePath}/${ticket.id}`);
    } catch (e) {
      setError(apiErrorMessage(e, "We could not open your ticket."));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-1 py-2 sm:py-4">
      <Link to={basePath} className="inline-flex min-h-11 items-center gap-2 self-start font-bold text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Help and support
      </Link>
      <PageHeader
        title="Open a support ticket"
        intro="Tell the provider what went wrong. They must reply within a day (2 hours for urgent and safety issues). DocLabPharm is copied and steps in if they don't."
      />
      {isLoading && <LoadingState label="Loading your orders" />}
      {isError && <InlineError>{apiErrorMessage(loadError, "We could not load your orders.")}</InlineError>}
      {providers && providers.length === 0 && (
        <EmptyState icon={LifeBuoy} title="No orders yet">
          You can open a ticket about a pharmacy, doctor, lab or ambulance you have ordered from. For anything else, email{" "}
          <a className="font-bold text-brand-700 underline" href="mailto:support@doclabpharm.com">
            support@doclabpharm.com
          </a>
          .
        </EmptyState>
      )}
      {providers && providers.length > 0 && (
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <Field label="Who is it about?" id="ticket-provider">
              <select
                id="ticket-provider"
                className={inputStyles}
                value={providerKey}
                onChange={(e) => {
                  setProviderKey(e.target.value);
                  setOrderId("");
                }}
              >
                <option value="">Choose a provider</option>
                {providers.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.name} ({providerRoleLabel(p.type)})
                  </option>
                ))}
              </select>
            </Field>
            {provider && provider.orders.length > 0 && (
              <Field label="Which order? (optional)" id="ticket-order">
                <select id="ticket-order" className={inputStyles} value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                  <option value="">Not about one order</option>
                  {provider.orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-bold text-ink-700">What is it about?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {CATEGORIES.map((c) => (
                  <label
                    key={c.value}
                    className={cn(
                      "flex cursor-pointer flex-col rounded-2xl p-3 ring-1 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-700",
                      category === c.value ? "bg-brand-50 ring-2 ring-brand-600" : "bg-white ring-brand-100 hover:ring-brand-300",
                      c.value === "safety" && category === c.value && "bg-red-50 ring-red-600"
                    )}
                  >
                    <input type="radio" name="category" value={c.value} className="sr-only" checked={category === c.value} onChange={() => setCategory(c.value)} />
                    <span className="font-bold text-ink-900">{c.label}</span>
                    <span className="text-sm text-ink-500">{c.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="Short title" id="ticket-subject">
              <input id="ticket-subject" className={inputStyles} value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={150} placeholder="Wrong medicine delivered" />
            </Field>
            <Field label="What happened?" id="ticket-message">
              <textarea id="ticket-message" className={textareaStyles} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={5000} />
            </Field>
            {category !== "safety" && (
              <label className="flex min-h-11 items-center gap-3 font-bold text-ink-900">
                <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
                This is urgent (reply within 2 hours)
              </label>
            )}
            <p className="rounded-2xl bg-warm-50 p-3 text-sm text-warm-900">
              If someone is in danger or seriously ill, call <a href="tel:112" className="font-bold underline">112</a> first.
            </p>
            <InlineError>{error}</InlineError>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Link to={basePath} className={buttonStyles("secondary")}>
                Cancel
              </Link>
              <Button type="submit" loading={open.isPending}>
                <Send className="h-4 w-4" aria-hidden="true" />
                Send to provider
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
