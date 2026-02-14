/**
 * Unified Error Management System - Type Definitions
 * Single Source of Truth for all error-related types
 */

/**
 * Error Categories - Logical grouping of errors
 */
export enum ErrorCategory {
  NETWORK = "NETWORK",
  AUTH = "AUTH",
  VALIDATION = "VALIDATION",
  STREAM = "STREAM",
  CONVEX = "CONVEX",
  UNKNOWN = "UNKNOWN",
}

/**
 * Error Severity Levels - Determines UI presentation and handling priority
 */
export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

/**
 * UI State Types - How errors are displayed to users
 */
export enum ErrorUIState {
  INLINE_INFO = "inline_info",
  INLINE_WARNING = "inline_warning",
  INLINE_ERROR = "inline_error",
  TOAST = "toast",
  MODAL = "modal",
  FULL_PAGE = "full_page",
}

/**
 * Standardized Application Error Interface
 */
export interface AppError {
  /** Unique error code from registry */
  code: string;
  /** Error category for logical grouping */
  category: ErrorCategory;
  /** Severity level affecting UI and handling */
  severity: ErrorSeverity;
  /** Technical error message for logging */
  message: string;
  /** User-friendly message for display */
  userMessage: string;
  /** Original error object if available */
  originalError?: Error;
  /** Additional context metadata */
  metadata?: Record<string, unknown>;
  /** Timestamp when error occurred */
  timestamp: number;
  /** Whether user can retry the operation */
  recoverable: boolean;
  /** Recommended UI state for display */
  uiState?: ErrorUIState;
}

/**
 * Error Handler Configuration
 */
export interface ErrorHandlerConfig {
  /** Callback invoked when error is handled */
  onError?: (error: AppError) => void;
  /** Enable console logging of errors */
  logErrors?: boolean;
  /** External error reporting service */
  reportToService?: (error: AppError) => Promise<void>;
  /** Maximum number of errors to keep in history */
  maxHistorySize?: number;
}

/**
 * Error Registry Entry Definition
 */
export interface ErrorRegistryEntry {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  recoverable: boolean;
  uiState: ErrorUIState;
}

/**
 * Error Boundary Props
 */
export interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode;
  /** Custom fallback UI */
  fallback?: React.ReactNode;
  /** Callback when error boundary resets */
  onReset?: () => void;
  /** Keys that trigger automatic reset when changed */
  resetKeys?: Array<string | number>;
  /** Maximum retry attempts before giving up */
  maxRetries?: number;
  /** Custom error handler */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error Display Props
 */
export interface ErrorDisplayProps {
  /** Error to display */
  error: AppError | null;
  /** Additional CSS classes */
  className?: string;
  /** Show severity icon */
  showIcon?: boolean;
  /** Retry callback */
  onRetry?: () => void;
  /** Current retry count */
  retryCount?: number;
  /** Maximum retries allowed */
  maxRetries?: number;
  /** Show report button for critical errors */
  showReport?: boolean;
}
