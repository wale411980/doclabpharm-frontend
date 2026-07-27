import { useState } from "react";
import { useGetUserPrescriptions } from "@/queries/use-user";
import { Badge } from "@/components/ui/badge";

export default function UserPrescriptions() {
  const { data: prescriptions, isLoading } = useGetUserPrescriptions();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return <div className="p-6">Loading your prescriptions...</div>;
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        You have no prescriptions yet.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold mb-4">My Prescriptions</h1>
      {prescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className="border rounded-lg p-4 bg-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Prescription #{prescription.id}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{prescription.status}</Badge>
              <button
                className="text-sm text-blue-600 underline"
                onClick={() => toggleExpanded(prescription.id)}
              >
                {expandedId === prescription.id ? "Hide" : "View"}
              </button>
            </div>
          </div>

          {expandedId === prescription.id && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {prescription.notes && (
                <p className="text-sm">
                  <span className="font-medium">Notes: </span>
                  {prescription.notes}
                </p>
              )}
              {prescription.drugs.length > 0 ? (
                prescription.drugs.map((drug) => (
                  <div
                    key={drug.id}
                    className="text-sm bg-gray-50 rounded p-3"
                  >
                    <p className="font-medium">{drug.medicine?.name}</p>
                    <p className="text-muted-foreground">
                      Dosage: {drug.dosage}
                    </p>
                    <p className="text-muted-foreground">
                      Instructions: {drug.instructions}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No drugs recorded under this prescription.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
