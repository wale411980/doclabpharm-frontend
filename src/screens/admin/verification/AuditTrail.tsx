import { Card, formatDate } from "@/components/dashboard/ui";
import type { VerificationEvent } from "@/types/verification";
import { ADMIN_STATUS, EVENT_ACTION } from "./adminCopy";

const statusLabel = (status: string | null) =>
  status ? ADMIN_STATUS[status as keyof typeof ADMIN_STATUS]?.label ?? status : "—";

function actorText(actor: VerificationEvent["actor"]): string {
  if (!actor) return "System";
  const role = actor.type === "SuperAdmin" ? "super admin" : actor.type === "Admin" ? "admin" : "provider";
  return `${actor.name} (${role})`;
}

/** Every verification decision about a provider, newest first. */
export function AuditTrail({ events }: { events: VerificationEvent[] }) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-ink-900">Audit trail</h2>
      {events.length === 0 ? (
        <p className="text-ink-500">No decisions recorded yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {events.map((event, index) => (
            <li key={`${event.createdAt}-${index}`} className="rounded-2xl bg-sand p-4">
              <p className="font-bold text-ink-900">{EVENT_ACTION[event.action] ?? event.action}</p>
              <p className="text-sm text-ink-500">
                {formatDate(event.createdAt, true)} · {actorText(event.actor)}
              </p>
              {event.fromStatus !== event.toStatus && (
                <p className="mt-1 text-sm text-ink-700">
                  {statusLabel(event.fromStatus)} → {statusLabel(event.toStatus)}
                </p>
              )}
              {event.note && <p className="mt-2 whitespace-pre-line text-ink-700">{event.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
