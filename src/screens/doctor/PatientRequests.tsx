import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CalendarClock } from "lucide-react";
import api from "@/lib/axios";
import { Button, Card, ErrorState, LoadingState, PageHeader, buttonStyles } from "@/components/dashboard/ui";
import { EmptyState, InlineError } from "@/components/dashboard/marketplace";
import { apiErrorMessage } from "@/lib/apiError";

type PatientRequest = {
  id: number;
  status: string;
  when: string;
  accept_by: string | null;
  specialty: string;
  complaint: string | null;
  fee: number;
  booking_id: number | null;
  patient: string | null;
};

type Response = { can_accept: boolean; open: PatientRequest[]; accepted: PatientRequest[] };

const key = ["doctor-patient-requests"] as const;

const dayTime = (value: string | null) => {
  if (!value) return "";
  const at = new Date(value);
  return `${at.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}, ${at.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })}`;
};

/**
 * Patients who booked a time by specialty and have already paid. The first
 * doctor to accept gets the appointment; it then appears under Appointments.
 */
export default function PatientRequests() {
  const queryClient = useQueryClient();
  const [failedId, setFailedId] = useState<number | null>(null);
  const [failure, setFailure] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery<Response>({
    queryKey: key,
    queryFn: async () => (await api.get("/doctor/patient-requests")).data,
    refetchInterval: 30_000,
  });

  const accept = useMutation<{ message: string }, unknown, number>({
    mutationFn: async (id) => (await api.post(`/doctor/patient-requests/${id}/accept`)).data,
    onSuccess: (result) => {
      setFailedId(null);
      toast.success(result.message);
    },
    onError: (e, id) => {
      setFailedId(id);
      setFailure(apiErrorMessage(e, "We could not accept this request. Please try again."));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  useEffect(() => {
    document.title = "Patient requests | DocLabPharm";
  }, []);

  const open = data?.open ?? [];
  const accepted = data?.accepted ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Patient requests"
        intro="Patients who have paid and asked for a doctor at a set time. The first doctor to accept gets the appointment. Only accept a time you can keep."
      />

      {isLoading && <LoadingState label="Loading patient requests" />}
      {isError && <ErrorState message={apiErrorMessage(error, "We could not load patient requests.")} onRetry={() => refetch()} />}

      {data && !data.can_accept && (
        <Card className="bg-brand-50">
          <p className="font-semibold text-ink-900">You can accept patients once your verification is approved.</p>
          <Link to="/doctor/verification" className={buttonStyles("primary", "mt-3")}>
            Go to verification
          </Link>
        </Card>
      )}

      {data && open.length === 0 && (
        <EmptyState icon={CalendarClock} title="No patient is waiting right now">
          New requests appear here and are sent to your email. This page checks again every 30 seconds.
        </EmptyState>
      )}

      {open.length > 0 && (
        <section aria-labelledby="open-heading" className="flex flex-col gap-3">
          <h2 id="open-heading" className="text-lg font-extrabold text-ink-900">
            Waiting for a doctor
          </h2>
          <ul className="flex flex-col gap-3">
            {open.map((request) => (
              <li key={request.id}>
                <Card className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-extrabold text-ink-900">{dayTime(request.when)}</p>
                      <p className="text-sm font-semibold text-ink-500">
                        {request.specialty} · Patient paid ₦{Math.round(request.fee).toLocaleString("en-NG")}
                      </p>
                    </div>
                    <Button
                      onClick={() => accept.mutate(request.id)}
                      loading={accept.isPending && accept.variables === request.id}
                      disabled={!data?.can_accept || accept.isPending}
                    >
                      Accept this patient
                    </Button>
                  </div>
                  {request.complaint && <p className="rounded-2xl bg-brand-50 px-4 py-3 text-[15px] text-ink-900">{request.complaint}</p>}
                  <p className="text-sm text-ink-500">Open until {dayTime(request.accept_by)}. After that the patient is refunded.</p>
                  {failedId === request.id && <InlineError>{failure}</InlineError>}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {accepted.length > 0 && (
        <section aria-labelledby="accepted-heading" className="flex flex-col gap-3">
          <h2 id="accepted-heading" className="text-lg font-extrabold text-ink-900">
            You accepted
          </h2>
          <ul className="flex flex-col gap-3">
            {accepted.map((request) => (
              <li key={request.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold text-ink-900">{dayTime(request.when)}</p>
                    <p className="text-sm font-semibold text-ink-500">{request.patient ?? "Patient"}</p>
                    {request.complaint && <p className="mt-1 text-[15px] text-ink-700">{request.complaint}</p>}
                  </div>
                  <Link to="/doctor/appointments" className={buttonStyles("secondary")}>
                    Open appointments
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
