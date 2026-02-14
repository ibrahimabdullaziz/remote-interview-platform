/**
 * Centralized Error Handling Utility
 * Single Source of Truth for all application errors
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum ErrorCategory {
  NETWORK = "NETWORK",
  AUTH = "AUTH",
  VALIDATION = "VALIDATION",
  STREAM = "STREAM",
  CONVEX = "CONVEX",
  UNKNOWN = "UNKNOWN",
}

export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface AppError {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  originalError?: Error;
  metadata?: Record<string, unknown>;
  timestamp: number;
  recoverable: boolean;
}

export interface ErrorHandlerConfig {
  onError?: (error: AppError) => void;
  logErrors?: boolean;
  reportToService?: (error: AppError) => Promise<void>;
}

// ============================================================================
// ERROR CODE REGISTRY
// ============================================================================

const ERROR_REGISTRY: Record<
  string,
  {
    category: ErrorCategory;
    severity: ErrorSeverity;
    userMessage: string;
    recoverable: boolean;
  }
> = {
  // Network Errors
  NETWORK_TIMEOUT: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.WARNING,
    userMessage: "The request took too long. Please try again.",
    recoverable: true,
  },
  NETWORK_OFFLINE: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.ERROR,
    userMessage: "You appear to be offline. Please check your connection.",
    recoverable: true,
  },
  NETWORK_SERVER_ERROR: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.ERROR,
    userMessage: "Server error. Our team has been notified.",
    recoverable: true,
  },

  // Auth Errors
  AUTH_UNAUTHORIZED: {
    category: ErrorCategory.AUTH,
    severity: ErrorSeverity.ERROR,
    userMessage: "Please sign in to continue.",
    recoverable: true,
  },
  AUTH_FORBIDDEN: {
    category: ErrorCategory.AUTH,
    severity: ErrorSeverity.ERROR,
    userMessage: "You don't have permission to access this resource.",
    recoverable: false,
  },
  AUTH_SESSION_EXPIRED: {
    category: ErrorCategory.AUTH,
    severity: ErrorSeverity.WARNING,
    userMessage: "Your session has expired. Please sign in again.",
    recoverable: true,
  },

  // Validation Errors
  VALIDATION_REQUIRED_FIELD: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.INFO,
    userMessage: "Please fill in all required fields.",
    recoverable: true,
  },
  VALIDATION_INVALID_FORMAT: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.INFO,
    userMessage: "Please check the format of your input.",
    recoverable: true,
  },

  // Stream SDK Errors
  STREAM_CONNECTION_FAILED: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.ERROR,
    userMessage: "Failed to connect to video service. Please try again.",
    recoverable: true,
  },
  STREAM_PERMISSION_DENIED: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.ERROR,
    userMessage: "Camera/microphone access denied. Please enable permissions.",
    recoverable: true,
  },
  STREAM_TOKEN_INVALID: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.CRITICAL,
    userMessage: "Video authentication failed. Please refresh the page.",
    recoverable: true,
  },

  // Convex Errors
  CONVEX_MUTATION_FAILED: {
    category: ErrorCategory.CONVEX,
    severity: ErrorSeverity.ERROR,
    userMessage: "Failed to save changes. Please try again.",
    recoverable: true,
  },
  CONVEX_QUERY_FAILED: {
    category: ErrorCategory.CONVEX,
    severity: ErrorSeverity.ERROR,
    userMessage: "Failed to load data. Please refresh the page.",
    recoverable: true,
  },

  // Unknown
  UNKNOWN_ERROR: {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.ERROR,
    userMessage: "An unexpected error occurred. Please try again.",
    recoverable: true,
  },
};

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

class ErrorHandlerService {
  public config: ErrorHandlerConfig;
  private errorHistory: AppError[] = [];
  private maxHistorySize = 50;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      logErrors: true,
      ...config,
    };
  }

  /**
   * Create a standardized error object
   */
  createError(
    code: string,
    originalError?: Error,
    metadata?: Record<string, unknown>,
  ): AppError {
    const errorDef = ERROR_REGISTRY[code] || ERROR_REGISTRY.UNKNOWN_ERROR;

    const appError: AppError = {
      code,
      category: errorDef.category,
      severity: errorDef.severity,
      message: originalError?.message || code,
      userMessage: errorDef.userMessage,
      originalError,
      metadata,
      timestamp: Date.now(),
      recoverable: errorDef.recoverable,
    };

    this.recordError(appError);
    return appError;
  }

  /**
   * Handle an error (log, report, notify)
   */
  handle(error: AppError): void {
    if (this.config.logErrors) {
      this.logError(error);
    }

    if (this.config.onError) {
      this.config.onError(error);
    }

    if (this.config.reportToService && error.severity === ErrorSeverity.CRITICAL) {
      this.config.reportToService(error).catch((reportError) => {
        console.error("Failed to report error:", reportError);
      });
    }
  }

  /**
   * Wrap async functions with error handling
   */
  async wrap<T>(
    fn: () => Promise<T>,
    errorCode: string,
    metadata?: Record<string, unknown>,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const appError = this.createError(
        errorCode,
        error instanceof Error ? error : new Error(String(error)),
        metadata,
      );
      this.handle(appError);
      throw appError;
    }
  }

  /**
   * Categorize unknown errors
   */
  categorizeError(error: unknown): AppError {
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return this.createError("NETWORK_SERVER_ERROR", error);
      }

      // Auth errors
      if (error.message.includes("unauthorized") || error.message.includes("401")) {
        return this.createError("AUTH_UNAUTHORIZED", error);
      }

      if (error.message.includes("forbidden") || error.message.includes("403")) {
        return this.createError("AUTH_FORBIDDEN", error);
      }

      // Stream errors
      if (error.message.includes("stream") || error.message.includes("video")) {
        return this.createError("STREAM_CONNECTION_FAILED", error);
      }

      // Convex errors
      if (error.message.includes("convex")) {
        return this.createError("CONVEX_MUTATION_FAILED", error);
      }
    }

    return this.createError("UNKNOWN_ERROR", error instanceof Error ? error : undefined);
  }

  /**
   * Get error history
   */
  getHistory(): AppError[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Private: Record error in history
   */
  private recordError(error: AppError): void {
    this.errorHistory.push(error);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  /**
   * Private: Log error to console
   */
  private logError(error: AppError): void {
    const logMethod = error.severity === ErrorSeverity.CRITICAL ? "error" : "warn";
    console[logMethod](`[${error.category}] ${error.code}:`, {
      message: error.message,
      userMessage: error.userMessage,
      severity: error.severity,
      recoverable: error.recoverable,
      metadata: error.metadata,
      originalError: error.originalError,
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const errorHandler = new ErrorHandlerService();

// ============================================================================
// CONVENIENCE FUNCTIONS
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
 * Wrap async operations
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
// REACT INTEGRATION HELPERS
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
 * Get severity class for styling
 */
export function getErrorSeverityClass(severity: ErrorSeverity): string {
  const classMap = {
    [ErrorSeverity.INFO]: "bg-blue-50 text-blue-800 border-blue-200",
    [ErrorSeverity.WARNING]: "bg-yellow-50 text-yellow-800 border-yellow-200",
    [ErrorSeverity.ERROR]: "bg-red-50 text-red-800 border-red-200",
    [ErrorSeverity.CRITICAL]: "bg-purple-50 text-purple-800 border-purple-200",
  };
  return classMap[severity];
}
