import { isAxiosError } from "axios";

// Laravel sends 422 with { message, errors: { field: [messages] } }.
export function getValidationErrors(
  error: unknown,
): Record<string, string[]> | null {
  if (isAxiosError(error) && error.response?.status === 422) {
    return error.response.data?.errors ?? null;
  }
  return null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (
    isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }
  return fallback;
}

// Laravel's "max" rule for files is in kilobytes.
export function isTooLarge(file: File | null, maxKb: number) {
  return file !== null && file.size > maxKb * 1024;
}

// The API answers 404 when a list is empty.
export function isNotFound(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404;
}
