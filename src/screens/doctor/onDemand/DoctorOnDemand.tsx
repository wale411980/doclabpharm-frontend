import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, MessageCircle, Stethoscope, UserRound } from "lucide-react";
import { Button, Card, ErrorState, Field, LoadingState, PageHeader, buttonStyles, inputStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Countdown, EmptyState, InlineError, Toggle } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { useConsultAction, useConsultRequests, useDoctorBookings, useDoctorPresence, useSetDoctorPresence } from "@/queries/use-consults";
import type { BookingRow, ConsultRequest } from "@/types/marketplace";

function age(dob: string | null | undefined): string | null {
  if (!dob) return null;
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return null;
  const years = Math.floor((Date.now() - born.getTime()) / (365.25 * 86_400_000));
  return years > 0 && years < 130 ? `${years} years` : null;
}

/** "See a doctor now" for doctors: go online, accept waiting patients, finish consultations. */
export default function DoctorOnDemand() {
  const presence = useDoctorPresence();
  const setPresence = useSetDoctorPresence();
  const online = presence.data?.online ?? false;
  const requests = useConsultRequests(true);
  const bookings = useDoctorBookings();
  const [presenceError, setPresenceError] = useState("");

  useEffect(() => {
    document.title = "See patients now | DocLabPharm";
  }, []);

  const toggle = async (next: boolean) => {
    setPresenceError("");
    try {
      const result = await setPresence.mutateAsync(next);
      toast.success(result.message);
    } catch (e) {
      setPresenceError(apiErrorMessage(e, "We could not change your status."));
    }
  };

  const active = (bookings.data ?? []).filter((b) => b.mode === "instant" && b.status === "in_progress");
  const waiting = requests.data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="See patients now"
        intro="Go online to receive patients who want a doctor straight away. Accept within the time shown or the patient is refunded. If you miss two requests in a row we set you offline."
      />

      <Card className={cn("flex flex-col gap-3", online ? "bg-brand-50 ring-brand-300" : "")}>
        {presence.isLoading ? (
          <LoadingState label="Checking your status" />
        ) : (
          <Toggle
            id="doctor-online"
            checked={online}
            disabled={setPresence.isPending}
            onChange={toggle}
            label={online ? "You are online" : "You are offline"}
            description={
              online
                ? "Patients can choose you now. Keep this dashboard open so you stay visible."
                : "Turn on when you are ready to take patients."
            }
          />
        )}
        <InlineError>{presenceError}</InlineError>
      </Card>

      <section aria-labelledby="active-heading" className="flex flex-col gap-3">
        <h2 id="active-heading" className="text-lg font-extrabold text-ink-900">
          In consultation
        </h2>
        {bookings.isError && <ErrorState message={apiErrorMessage(bookings.error, "We could not load your consultations.")} onRetry={() => bookings.refetch()} />}
        {active.length === 0 ? (
          <p className="rounded-3xl bg-white p-4 text-ink-500 ring-1 ring-brand-100">No consultation in progress.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {active.map((booking) => (
              <ActiveConsult key={booking.id} booking={booking} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="waiting-heading" className="flex flex-col gap-3">
        <h2 id="waiting-heading" className="text-lg font-extrabold text-ink-900">
          Patients waiting {waiting.length > 0 && <span className="text-warm-700">({waiting.length})</span>}
        </h2>
        {requests.isLoading && <LoadingState label="Loading requests" />}
        {requests.isError && <ErrorState message={apiErrorMessage(requests.error, "We could not load requests.")} onRetry={() => requests.refetch()} />}
        {requests.data && waiting.length === 0 && (
          <EmptyState icon={Stethoscope} title="No one waiting">
            {online ? "New requests appear here by themselves. We also notify you on your phone." : "Go online to receive requests."}
          </EmptyState>
        )}
        {waiting.length > 0 && (
          <ul className="flex flex-col gap-3">
            {waiting.map((request) => (
              <WaitingRequest key={request.id} request={request} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function WaitingRequest({ request }: { request: ConsultRequest }) {
  const navigate = useNavigate();
  const act = useConsultAction();
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState("");
  const patient = request.patient;
  const name = patient ? `${patient.firstName} ${patient.lastName}` : "Patient";
  const details = [patient?.gender, age(patient?.dob)].filter(Boolean).join(" · ");

  const accept = async () => {
    try {
      const result = await act.mutateAsync({ id: request.id, action: "accept" });
      toast.success(result.message);
      navigate(result.consult.conversationId ? `/doctor/messages?conversation=${result.consult.conversationId}` : "/doctor/messages");
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not accept this request."));
    }
  };

  const decline = async () => {
    try {
      const result = await act.mutateAsync({ id: request.id, action: "decline", reason: reason.trim() });
      toast.success(result.message);
      setDeclining(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not decline this request."));
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-4 ring-2 ring-warm-300">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            {patient?.profileImage ? (
              <img src={patient.profileImage} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <UserRound className="h-6 w-6" aria-hidden="true" />
              </span>
            )}
            <div>
              <p className="font-extrabold text-ink-900">{name}</p>
              {details && <p className="text-sm capitalize text-ink-500">{details}</p>}
            </div>
          </div>
          <Countdown until={request.acceptBy} expiredLabel="Time is up" />
        </div>
        {request.complaint && (
          <blockquote className="rounded-2xl bg-sand p-4 text-ink-900">
            <span className="mb-1 block text-sm font-bold text-ink-500">What is wrong</span>
            {request.complaint}
          </blockquote>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={accept} loading={act.isPending && !declining}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Accept and open chat
          </Button>
          <Button variant="secondary" onClick={() => setDeclining(true)}>
            Decline
          </Button>
        </div>
      </Card>
      <ConfirmDialog
        open={declining}
        onOpenChange={setDeclining}
        title="Decline this patient?"
        description="The patient is refunded in full and can choose another doctor."
        confirmLabel="Decline"
        variant="danger"
        loading={act.isPending}
        onConfirm={decline}
      >
        <Field label="Reason (optional)" id={`decline-${request.id}`}>
          <input id={`decline-${request.id}`} className={inputStyles} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={255} />
        </Field>
      </ConfirmDialog>
    </li>
  );
}

function ActiveConsult({ booking }: { booking: BookingRow }) {
  const act = useConsultAction();
  const [confirming, setConfirming] = useState(false);
  const name = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "Patient";

  const complete = async () => {
    try {
      const result = await act.mutateAsync({ id: booking.id, action: "complete" });
      toast.success(result.message);
      setConfirming(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not complete this consultation."));
      setConfirming(false);
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-extrabold text-ink-900">{name}</p>
          {booking.message && <p className="truncate text-sm text-ink-500">{booking.message}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to={booking.conversationId ? `/doctor/messages?conversation=${booking.conversationId}` : "/doctor/messages"}
            className={buttonStyles("primary")}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Open chat
          </Link>
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Finish consultation
          </Button>
        </div>
      </Card>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Finish this consultation?"
        description="Write any prescription first. The patient is told the consultation has ended and you become available to other patients."
        confirmLabel="Finish"
        loading={act.isPending}
        onConfirm={complete}
      />
    </li>
  );
}
