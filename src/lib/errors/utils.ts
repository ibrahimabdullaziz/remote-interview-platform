/**
 * Unified Error Management System - Utility Functions
 * Convenience functions for common error operations
 */

import { errorHandler } from "./handler";
import { ERROR_REGISTRY } from "./registry";
import type { AppError } from "./types";
import { ErrorSeverity, ErrorUIState } from "./types";

// ============================================================================
// ERROR CREATION & HANDLING
// ============================================================================

/**
 * Quick error creation
 */
export function createError(
  code: string,
  originalError?: Error,
  metadata?: Record<string, unknown>,
): AppError {
  return errorHandler.createError(code, originalError, metadata);
}

/**
 * Quick error handling
 */
export function handleError(error: AppError): void {
  errorHandler.handle(error);
}

/**
 * Wrap async operations with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorCode: string,
  metadata?: Record<string, unknown>,
): Promise<T> {
  return errorHandler.wrap(fn, errorCode, metadata);
}

/**
 * Categorize and handle unknown errors
 */
export function handleUnknownError(error: unknown): AppError {
  const appError = errorHandler.categorizeError(error);
  errorHandler.handle(appError);
  return appError;
}

// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * Get user-friendly message for UI display
 */
export function getErrorMessage(error: AppError | string): string {
  if (typeof error === "string") {
    return ERROR_REGISTRY[error]?.userMessage || "An error occurred";
  }
  return error.userMessage;
}

/**
 * Get severity class for styling (Tailwind CSS)
 */
export function getErrorSeverityClass(severity: ErrorSeverity): string {
  const classMap = {
    [ErrorSeverity.INFO]: "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800",
    [ErrorSeverity.WARNING]: "bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800",
    [ErrorSeverity.ERROR]: "bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800",
    [ErrorSeverity.CRITICAL]: "bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800",
  };
  return classMap[severity];
}

/**
 * Get UI state for an error
 */
export function getErrorUIState(error: AppError | string): ErrorUIState {
  if (typeof error === "string") {
    return ERROR_REGISTRY[error]?.uiState || ErrorUIState.FULL_PAGE;
  }
  return error.uiState || ErrorUIState.FULL_PAGE;
}

/**
 * Determine if retry should be shown based on error
 */
export function shouldShowRetry(error: AppError): boolean {
  return error.recoverable;
}

/**
 * Check if error is critical
 */
export function isCriticalError(error: AppError): boolean {
  return error.severity === ErrorSeverity.CRITICAL;
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: AppError): string {
  return `[${error.category}] ${error.code}: ${error.message}`;
}
