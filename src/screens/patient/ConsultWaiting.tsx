import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, MessageCircle, RotateCcw, Stethoscope, UserRound } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, buttonStyles } from "@/components/dashboard/ui";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Countdown, EmergencyCallLink } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";
import { useCancelPatientConsult, usePatientConsult } from "@/queries/use-checkout";

/** Waiting room for "see a doctor now": polls until the doctor accepts, then opens the chat. */
export default function ConsultWaiting() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = usePatientConsult(id);
  const cancel = useCancelPatientConsult(id);
  const [confirming, setConfirming] = useState(false);
  const wasWaiting = useRef(false);

  useEffect(() => {
    document.title = "Waiting for your doctor | DocLabPharm";
  }, []);

  const chatPath = data?.conversationId ? `/user/messages?conversation=${data.conversationId}` : "/user/messages";

  // Hand over to the chat as soon as the doctor accepts.
  useEffect(() => {
    if (data?.status === "waiting") wasWaiting.current = true;
    if (data?.status === "in_progress" && wasWaiting.current && data.conversationId) {
      toast.success("Your doctor has accepted. Opening the chat…");
      const timer = window.setTimeout(() => navigate(chatPath), 1500);
      return () => window.clearTimeout(timer);
    }
  }, [data?.status, data?.conversationId, chatPath, navigate]);

  const handleCancel = async () => {
    try {
      const result = await cancel.mutateAsync();
      toast.success(result.message);
      setConfirming(false);
    } catch (e) {
      toast.error(apiErrorMessage(e, "We could not cancel this request."));
      setConfirming(false);
    }
  };

  const doctorName = data?.doctor?.name ? `Dr ${data.doctor.name.replace(/^Dr\.?\s+/i, "")}` : "your doctor";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-1 py-4 sm:py-8">
      {isLoading && <LoadingState label="Loading your request" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load this request.")} onRetry={() => refetch()} />}
      {data && (
        <Card className="flex flex-col items-center gap-5 text-center">
          {data.doctor?.profileImage ? (
            <img src={data.doctor.profileImage} alt="" className="h-20 w-20 rounded-3xl object-cover" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-brand-700">
              <UserRound className="h-10 w-10" aria-hidden="true" />
            </span>
          )}

          {data.status === "waiting" && (
            <>
              <div className="flex flex-col gap-2" role="status">
                <h1 className="text-2xl font-extrabold text-ink-900">Waiting for {doctorName}</h1>
                <p className="text-ink-700">
                  We have sent your request. Please keep this page open. The chat opens here as soon as the doctor accepts.
                </p>
              </div>
              <Countdown until={data.acceptBy} expiredLabel="Checking with the doctor…" className="px-5 py-2 text-lg" />
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <p className="text-sm text-ink-500">If the doctor does not accept in time, the full amount goes back to your wallet.</p>
              <Button variant="secondary" onClick={() => setConfirming(true)}>
                Cancel request
              </Button>
            </>
          )}

          {data.status === "in_progress" && (
            <>
              <CheckCircle2 className="h-10 w-10 text-brand-600" aria-hidden="true" />
              <div className="flex flex-col gap-2" role="status">
                <h1 className="text-2xl font-extrabold text-ink-900">{doctorName} is ready for you</h1>
                <p className="text-ink-700">Open the chat to talk. You can start a video call from there.</p>
              </div>
              <Link to={chatPath} className={buttonStyles("primary", "w-full sm:w-auto")}>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Open chat
              </Link>
            </>
          )}

          {data.status === "completed" && (
            <>
              <h1 className="text-2xl font-extrabold text-ink-900">Consultation finished</h1>
              <p className="text-ink-700">Your notes and any prescription are in your account.</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/user/prescriptions" className={buttonStyles("primary")}>
                  My prescriptions
                </Link>
                <Link to={chatPath} className={buttonStyles("secondary")}>
                  Open chat
                </Link>
              </div>
            </>
          )}

          {(data.status === "declined" || data.status === "expired" || data.status === "cancelled") && (
            <>
              <RotateCcw className="h-10 w-10 text-sky-700" aria-hidden="true" />
              <div className="flex flex-col gap-2" role="status">
                <h1 className="text-2xl font-extrabold text-ink-900">
                  {data.status === "cancelled"
                    ? "Request cancelled"
                    : data.status === "declined"
                      ? `${doctorName} could not take this request`
                      : `${doctorName} did not respond in time`}
                </h1>
                <p className="text-ink-700">We have refunded the full amount to your DocLabPharm wallet.</p>
              </div>
              <Link to="/user/see-doctor-now" className={buttonStyles("primary", "w-full sm:w-auto")}>
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
                See another doctor
              </Link>
            </>
          )}
        </Card>
      )}
      <EmergencyCallLink />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Cancel your request?"
        description="The doctor has not accepted yet, so you get the full amount back in your wallet."
        confirmLabel="Yes, cancel"
        variant="danger"
        loading={cancel.isPending}
        onConfirm={handleCancel}
      />
    </div>
  );
}
