/**
 * Unified Error Management System
 * Single entry point for all error handling functionality
 */

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  AppError,
  ErrorHandlerConfig,
  ErrorRegistryEntry,
  ErrorBoundaryProps,
  ErrorDisplayProps,
} from "./types";

export {
  ErrorCategory,
  ErrorSeverity,
  ErrorUIState,
} from "./types";

// ============================================================================
// REGISTRY EXPORTS
// ============================================================================

export { ERROR_REGISTRY } from "./registry";

// ============================================================================
// HANDLER EXPORTS
// ============================================================================

export { errorHandler } from "./handler";

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export {
  createError,
  handleError,
  withErrorHandling,
  handleUnknownError,
  getErrorMessage,
  getErrorSeverityClass,
  getErrorUIState,
  shouldShowRetry,
  isCriticalError,
  formatErrorForLogging,
} from "./utils";

// ============================================================================
// HOOK EXPORTS
// ============================================================================

export {
  useErrorHandler,
  useErrorReset,
  useGlobalErrorListener,
} from "./hooks";

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

export { default as ErrorBoundary } from "./ErrorBoundary";
export { ErrorDisplay } from "./ErrorDisplay";
