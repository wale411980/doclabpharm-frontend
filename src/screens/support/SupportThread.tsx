import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Lock, Send, ShieldAlert } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, Pill, buttonStyles, formatDate } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Detail, InlineError, Toggle, textareaStyles } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { providerRoleLabel } from "@/lib/providerTypes";
import { cn } from "@/lib/utils";
import { useSupportThread, useTicketAction } from "@/queries/use-support";
import type { SupportAudience, SupportMessage, SupportThread as Thread } from "@/types/marketplace";
import { AUTHOR_LABEL, categoryLabel, ticketStatus } from "./supportCopy";
import { DeadlineNote } from "./SupportList";

/** One support ticket: the conversation, the deadline and the actions each side can take. */
export default function SupportThread({ audience, basePath }: { audience: SupportAudience; basePath: string }) {
  const id = Number(useParams().id);
  const { data, isLoading, isError, error, refetch } = useSupportThread(audience, id);

  useEffect(() => {
    document.title = data ? `${data.reference} | DocLabPharm` : "Support | DocLabPharm";
  }, [data]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-1 py-2 sm:py-4">
      <Link to={basePath} className="inline-flex min-h-11 items-center gap-2 self-start font-bold text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All tickets
      </Link>
      {isLoading && <LoadingState label="Loading the ticket" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load this ticket.")} onRetry={() => refetch()} />}
      {data && <ThreadView ticket={data} audience={audience} />}
    </div>
  );
}

function ThreadView({ ticket, audience }: { ticket: Thread; audience: SupportAudience }) {
  const status = ticketStatus(ticket.status, audience);
  const isAdmin = audience === "admin";
  const isPatient = audience === "patient";
  const adminBase = window.location.pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";

  return (
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={status.tone}>{status.label}</Pill>
          {ticket.urgent && <Pill tone="red">Urgent</Pill>}
          {ticket.slaBreached && <Pill tone="red">Missed deadline</Pill>}
          {ticket.escalated && <Pill tone="red">Escalated to DocLabPharm</Pill>}
        </div>
        <h1 className="break-words text-2xl font-extrabold text-ink-900">{ticket.subject}</h1>
        {ticket.status === "awaiting_provider" && <DeadlineNote due={ticket.responseDueAt} audience={audience} large />}
        <dl className="grid gap-3 sm:grid-cols-3">
          <Detail label="Reference">{ticket.reference}</Detail>
          <Detail label="Topic">{categoryLabel(ticket.category)}</Detail>
          <Detail label="Opened">{formatDate(ticket.createdAt, true)}</Detail>
          {!isPatient && <Detail label="Patient">{ticket.patient ?? "—"}</Detail>}
          {!(audience !== "patient" && audience !== "admin") && ticket.provider && (
            <Detail label="Provider">
              {ticket.provider.name} <span className="font-normal text-ink-500">({providerRoleLabel(ticket.provider.type)})</span>
            </Detail>
          )}
          {ticket.orderId && <Detail label="Order">#{ticket.orderId}</Detail>}
        </dl>
        {isAdmin && ticket.provider && (
          <div className="flex flex-wrap gap-2">
            <Link to={`${adminBase}/providers/${ticket.provider.type}/${ticket.provider.id}`} className={buttonStyles("secondary")}>
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Provider record and enforcement
            </Link>
            <Link
              to={`${adminBase}/support?providerType=${ticket.provider.type}&providerId=${ticket.provider.id}`}
              className={buttonStyles("ghost")}
            >
              Their other tickets
            </Link>
          </div>
        )}
        {!isAdmin && (
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
            DocLabPharm support is copied on this conversation.
          </p>
        )}
      </Card>

      <section aria-label="Messages" className="flex flex-col gap-3">
        {ticket.messages.map((message) => (
          <MessageBubble key={message.id} message={message} audience={audience} />
        ))}
      </section>

      <Actions ticket={ticket} audience={audience} />
    </>
  );
}

function MessageBubble({ message, audience }: { message: SupportMessage; audience: SupportAudience }) {
  const mine =
    (audience === "patient" && message.from === "patient") ||
    (audience === "admin" && message.from === "doclabpharm") ||
    (audience !== "patient" && audience !== "admin" && message.from === "provider");
  const label = mine ? "You" : audience !== "admin" && message.from === "provider" && audience === "patient" ? "Provider" : AUTHOR_LABEL[message.from];
  return (
    <article
      className={cn(
        "flex max-w-[92%] flex-col gap-1 rounded-3xl px-4 py-3 sm:max-w-[80%]",
        message.internal
          ? "self-stretch bg-warm-50 ring-1 ring-warm-300 sm:max-w-none"
          : mine
            ? "self-end bg-brand-600 text-white"
            : message.from === "doclabpharm"
              ? "self-start bg-sky-50 text-sky-950 ring-1 ring-sky-200"
              : "self-start bg-white ring-1 ring-brand-100"
      )}
    >
      <p className={cn("text-xs font-bold", mine && !message.internal ? "text-brand-100" : "text-ink-500")}>
        {message.internal ? `Internal note by ${label === "You" ? "you" : label} · not shown to patient or provider` : label} · {formatDate(message.createdAt, true)}
      </p>
      <p className="whitespace-pre-line break-words">{message.body}</p>
    </article>
  );
}

function Actions({ ticket, audience }: { ticket: Thread; audience: SupportAudience }) {
  const action = useTicketAction(audience, ticket.id);
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<null | "resolve" | "close">(null);

  const isPatient = audience === "patient";
  const isAdmin = audience === "admin";
  const closed = ticket.status === "closed";
  const resolved = ticket.status === "resolved";
  const canReply = !closed && !(isPatient && resolved);
  const canReopen = isPatient && resolved;

  const run = async (input: Parameters<typeof action.mutateAsync>[0], success: string) => {
    setError("");
    try {
      await action.mutateAsync(input);
      toast.success(success);
      setBody("");
      setConfirm(null);
    } catch (e) {
      setError(apiErrorMessage(e, "That did not work. Please try again."));
      setConfirm(null);
    }
  };

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return setError("Please write a message first.");
    if (canReopen) return run({ action: "reopen", message: body.trim() }, "Ticket reopened. The provider has been told.");
    return run({ action: "reply", body: body.trim(), internal: isAdmin && internal }, internal ? "Internal note saved." : "Reply sent.");
  };

  return (
    <Card className="flex flex-col gap-4">
      {canReply || canReopen ? (
        <form onSubmit={send} className="flex flex-col gap-4">
          <label htmlFor="reply" className="font-bold text-ink-900">
            {canReopen ? "Still not sorted? Reopen this ticket" : isAdmin && internal ? "Internal note" : "Your reply"}
          </label>
          <textarea
            id="reply"
            className={cn(textareaStyles, isAdmin && internal && "border-warm-300 bg-warm-50")}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={5000}
            placeholder={canReopen ? "Tell the provider what is still wrong" : "Write your message"}
          />
          {isAdmin && (
            <Toggle
              id="internal-note"
              checked={internal}
              onChange={setInternal}
              label="Internal note"
              description="Only DocLabPharm staff can see internal notes."
            />
          )}
          {canReopen && <p className="text-sm text-ink-500">You can reopen a ticket within 7 days of it being resolved.</p>}
          <InlineError>{error}</InlineError>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="submit" loading={action.isPending && !confirm}>
              <Send className="h-4 w-4" aria-hidden="true" />
              {canReopen ? "Reopen ticket" : isAdmin && internal ? "Save note" : isAdmin ? "Reply as DocLabPharm" : "Send reply"}
            </Button>
            {!isPatient && !resolved && !closed && (
              <Button variant="secondary" onClick={() => setConfirm("resolve")}>
                Mark as resolved
              </Button>
            )}
            {(isPatient || isAdmin) && !closed && (
              <Button variant="ghost" onClick={() => setConfirm("close")}>
                Close ticket
              </Button>
            )}
          </div>
        </form>
      ) : (
        <>
          <p className="text-ink-700">{closed ? "This ticket is closed." : "This ticket is resolved. The patient can reopen it within 7 days."}</p>
          {isAdmin && !closed && (
            <div>
              <Button variant="secondary" onClick={() => setConfirm("close")}>
                Close ticket
              </Button>
            </div>
          )}
          <InlineError>{error}</InlineError>
        </>
      )}
      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={confirm === "resolve" ? "Mark this ticket as resolved?" : "Close this ticket?"}
        description={
          confirm === "resolve"
            ? "The patient is told and can reopen it within 7 days if the problem is not fixed."
            : isPatient
              ? "Close it if your problem is sorted. You can still reopen it within 7 days."
              : "Closing ends the conversation for both sides."
        }
        confirmLabel={confirm === "resolve" ? "Mark resolved" : "Close ticket"}
        loading={action.isPending}
        onConfirm={() =>
          confirm === "resolve"
            ? run({ action: "resolve" }, "Ticket resolved. The patient has been told.")
            : run({ action: "close" }, "Ticket closed.")
        }
      />
    </Card>
  );
}
