/**
 * Provider account types of the marketplace. The value is the account role
 * the API uses (`role` on /caregiver/* and the admin `{type}` URL segment);
 * it is also the first segment of the provider's dashboard URLs.
 */
export const PROVIDER_ROLES = [
  { value: "doctor", label: "Doctor" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "lab_technician", label: "Lab Technician" },
  { value: "ambulance_operator", label: "Ambulance operator" },
] as const;

export type ProviderRole = (typeof PROVIDER_ROLES)[number]["value"];

export function isProviderRole(value: unknown): value is ProviderRole {
  return PROVIDER_ROLES.some((role) => role.value === value);
}

export function providerRoleLabel(role: string): string {
  return PROVIDER_ROLES.find((r) => r.value === role)?.label ?? role;
}

/** URL prefix of each provider's own API routes. */
export const PROVIDER_API_PREFIX: Record<ProviderRole, string> = {
  doctor: "/doctor",
  pharmacy: "/pharmacy",
  lab_technician: "/lab-technician",
  ambulance_operator: "/ambulance-operator",
};

/** Roles whose registration asks for the business (trading) name. */
export const ROLES_WITH_BUSINESS_NAME: ProviderRole[] = [
  "pharmacy",
  "lab_technician",
  "ambulance_operator",
];
