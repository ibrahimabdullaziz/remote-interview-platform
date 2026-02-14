/**
 * Unified Error Management System - Error Display Component
 * Dynamic error UI with retry functionality and severity-based rendering
 */

"use client";

import { AlertCircle, AlertTriangle, Info, XCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { getErrorMessage, getErrorSeverityClass } from "./utils";
import type { ErrorDisplayProps } from "./types";
import { ErrorSeverity } from "./types";

const severityIcons = {
  [ErrorSeverity.INFO]: Info,
  [ErrorSeverity.WARNING]: AlertTriangle,
  [ErrorSeverity.ERROR]: AlertCircle,
  [ErrorSeverity.CRITICAL]: XCircle,
};

/**
 * Enhanced Error Display with retry and report functionality
 */
export function ErrorDisplay({
  error,
  className = "",
  showIcon = true,
  onRetry,
  retryCount = 0,
  maxRetries = 3,
  showReport = false,
}: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!error) return null;

  const Icon = severityIcons[error.severity];
  const severityClass = getErrorSeverityClass(error.severity);
  const canRetry = onRetry && retryCount < maxRetries;

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleReport = () => {
    // TODO: Implement error reporting to external service
    console.log("Reporting error:", error);
    alert("Error reported. Our team will investigate this issue.");
  };

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${className}`}>
      <div className={`max-w-md w-full rounded-lg border p-6 shadow-lg ${severityClass}`}>
        <div className="flex items-start gap-3">
          {showIcon && <Icon className="h-6 w-6 flex-shrink-0 mt-0.5" aria-hidden="true" />}
          
          <div className="flex-1 space-y-3">
            {/* Error Message */}
            <div>
              <p className="text-sm font-semibold" role="alert">
                {getErrorMessage(error)}
              </p>
              
              {error.recoverable && (
                <p className="text-xs mt-1.5 opacity-75">
                  {canRetry 
                    ? "Please try again or refresh the page." 
                    : "Maximum retry attempts reached. Please refresh the page."}
                </p>
              )}
            </div>

            {/* Retry Count Indicator */}
            {retryCount > 0 && (
              <p className="text-xs opacity-60">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              {canRetry && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 border border-current hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Retry operation"
                >
                  <RefreshCw 
                    className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} 
                    aria-hidden="true"
                  />
                  {isRetrying ? "Retrying..." : "Try Again"}
                </button>
              )}

              {showReport && error.severity === ErrorSeverity.CRITICAL && (
                <button
                  onClick={handleReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 border border-current hover:bg-opacity-90 transition-all"
                  aria-label="Report this error"
                >
                  Report Issue
                </button>
              )}
            </div>

            {/* Technical Details (Development Only) */}
            {process.env.NODE_ENV === "development" && error.code && (
              <details className="text-xs opacity-60 mt-3">
                <summary className="cursor-pointer hover:opacity-80">
                  Technical Details
                </summary>
                <div className="mt-2 space-y-1 font-mono">
                  <p>Code: {error.code}</p>
                  <p>Category: {error.category}</p>
                  <p>Severity: {error.severity}</p>
                  {error.metadata && (
                    <p>Metadata: {JSON.stringify(error.metadata, null, 2)}</p>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
