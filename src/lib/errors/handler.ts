/**
 * Unified Error Management System - Core Handler Service
 * Centralized error handling with logging, reporting, and history
 */

import { ERROR_REGISTRY } from "./registry";
import type { AppError, ErrorHandlerConfig } from "./types";
import { ErrorSeverity } from "./types";

/**
 * Core Error Handler Service (Singleton)
 */
class ErrorHandlerService {
  public config: ErrorHandlerConfig;
  private errorHistory: AppError[] = [];
  private maxHistorySize: number;
  private globalListenersAttached = false;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      logErrors: true,
      maxHistorySize: 50,
      ...config,
    };
    this.maxHistorySize = this.config.maxHistorySize || 50;
  }

  /**
   * Create a standardized error object from an error code
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
      uiState: errorDef.uiState,
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
   * Categorize unknown errors into known error codes
   */
  categorizeError(error: unknown): AppError {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Network errors
      if (message.includes("fetch") || message.includes("network")) {
        return this.createError("NETWORK_SERVER_ERROR", error);
      }

      // Auth errors
      if (message.includes("unauthorized") || message.includes("401")) {
        return this.createError("AUTH_UNAUTHORIZED", error);
      }

      if (message.includes("forbidden") || message.includes("403")) {
        return this.createError("AUTH_FORBIDDEN", error);
      }

      // Stream errors
      if (message.includes("stream") || message.includes("video")) {
        return this.createError("STREAM_CONNECTION_FAILED", error);
      }

      // Convex errors
      if (message.includes("convex")) {
        return this.createError("CONVEX_MUTATION_FAILED", error);
      }
    }

    return this.createError("UNKNOWN_ERROR", error instanceof Error ? error : undefined);
  }

  /**
   * Attach global error listeners for unhandled errors
   */
  attachGlobalListeners(): void {
    if (this.globalListenersAttached || typeof window === "undefined") {
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);

    // Handle global runtime errors
    window.addEventListener("error", this.handleGlobalError);

    this.globalListenersAttached = true;
  }

  /**
   * Detach global error listeners
   */
  detachGlobalListeners(): void {
    if (!this.globalListenersAttached || typeof window === "undefined") {
      return;
    }

    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    window.removeEventListener("error", this.handleGlobalError);

    this.globalListenersAttached = false;
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
   * Private: Handle unhandled promise rejections
   */
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    event.preventDefault();
    const appError = this.categorizeError(event.reason);
    this.handle(appError);
  };

  /**
   * Private: Handle global runtime errors
   */
  private handleGlobalError = (event: ErrorEvent): void => {
    event.preventDefault();
    const appError = this.categorizeError(event.error || new Error(event.message));
    this.handle(appError);
  };

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
      uiState: error.uiState,
      metadata: error.metadata,
      originalError: error.originalError,
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const errorHandler = new ErrorHandlerService();
