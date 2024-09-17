// src/utils/errorUtils.ts

import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Type guard to check if the error is FetchBaseQueryError
export function isFetchBaseQueryError(
  error: any
): error is FetchBaseQueryError {
  return (
    error && typeof error === "object" && "status" in error && "data" in error
  );
}

// Function to handle errors and return a readable message
export function handleError(error: FetchBaseQueryError | SerializedError) {
  if (isFetchBaseQueryError(error)) {
    if (error.status && error.data) {
      return `Error ${error.status}: ${JSON.stringify(error.data)}`;
    } else if (error.status) {
      return `Error ${error.status}: Unknown error`;
    }
  } else {
    return "An unexpected error occurred";
  }
}
