/**
 * A readable message from an API error. Laravel validation errors (422) carry
 * `{message, errors: {field: [messages]}}`; the first field message is the
 * most specific one, so it is preferred over the summary.
 */
export function apiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const data = (error as { response?: { data?: unknown } })?.response?.data as
    | { message?: unknown; errors?: Record<string, unknown> }
    | undefined;

  const firstFieldError = data?.errors
    ? Object.values(data.errors).flat().find((m): m is string => typeof m === "string")
    : undefined;
  if (firstFieldError) return firstFieldError;
  if (typeof data?.message === "string" && data.message) return data.message;
  return fallback;
}
