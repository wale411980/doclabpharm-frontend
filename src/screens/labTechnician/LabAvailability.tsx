import ProviderAvailability from "@/components/ProviderAvailability";

export default function LabAvailability() {
  return (
    <ProviderAvailability
      kind="lab_technician"
      description="Set the dates and hours you can receive patients for tests. Patients can only book test appointments inside these hours."
    />
  );
}
