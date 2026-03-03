import { ApiError } from "../types/api-error";

export function extractApiError(error: unknown): ApiError | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const err = error as any;
    return err.response?.data ?? null;
  }

  return null;
}