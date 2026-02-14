/**
 * Unified Error Management System - Error Code Registry
 * Single Source of Truth for all predefined error codes
 */

import { ErrorCategory, ErrorSeverity, ErrorUIState, type ErrorRegistryEntry } from "./types";

/**
 * Central registry mapping error codes to their definitions
 */
export const ERROR_REGISTRY: Record<string, ErrorRegistryEntry> = {
  // ============================================================================
  // NETWORK ERRORS
  // ============================================================================
  
  NETWORK_TIMEOUT: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.WARNING,
    userMessage: "The request took too long. Please try again.",
    recoverable: true,
    uiState: ErrorUIState.INLINE_WARNING,
  },
  
  NETWORK_OFFLINE: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.ERROR,
    userMessage: "You appear to be offline. Please check your connection.",
    recoverable: true,
    uiState: ErrorUIState.FULL_PAGE,
  },
  
  NETWORK_SERVER_ERROR: {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.ERROR,
    userMessage: "Server error. Our team has been notified.",
    recoverable: true,
    uiState: ErrorUIState.FULL_PAGE,
  },

  // ============================================================================
  // AUTHENTICATION ERRORS
  // ============================================================================
  
  AUTH_UNAUTHORIZED: {
    category: ErrorCategory.AUTH,
    severity: ErrorSeverity.ERROR,
    userMessage: "Please sign in to continue.",
    recoverable: false,
    uiState: ErrorUIState.FULL_PAGE,
  },
  
  AUTH_FORBIDDEN: {
    category: ErrorCategory.AUTH,
    severity: ErrorSeverity.ERROR,
    userMessage: "You don't have permission to access this resource.",
    recoverable: false,
    uiState: ErrorUIState.FULL_PAGE,
  },
  
  AUTH_SESSION_EXPIRED: {
    category: ErrorCategory.AUTH,
    severity: ErrorSeverity.WARNING,
    userMessage: "Your session has expired. Please sign in again.",
    recoverable: true,
    uiState: ErrorUIState.MODAL,
  },

  // ============================================================================
  // VALIDATION ERRORS
  // ============================================================================
  
  VALIDATION_REQUIRED_FIELD: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.INFO,
    userMessage: "Please fill in all required fields.",
    recoverable: true,
    uiState: ErrorUIState.INLINE_INFO,
  },
  
  VALIDATION_INVALID_FORMAT: {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.INFO,
    userMessage: "Please check the format of your input.",
    recoverable: true,
    uiState: ErrorUIState.INLINE_INFO,
  },

  // ============================================================================
  // STREAM SDK ERRORS
  // ============================================================================
  
  STREAM_CONNECTION_FAILED: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.ERROR,
    userMessage: "Failed to connect to video service. Please try again.",
    recoverable: true,
    uiState: ErrorUIState.FULL_PAGE,
  },
  
  STREAM_PERMISSION_DENIED: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.ERROR,
    userMessage: "Camera/microphone access denied. Please enable permissions.",
    recoverable: false,
    uiState: ErrorUIState.MODAL,
  },
  
  STREAM_TOKEN_INVALID: {
    category: ErrorCategory.STREAM,
    severity: ErrorSeverity.CRITICAL,
    userMessage: "Video authentication failed. Please refresh the page.",
    recoverable: true,
    uiState: ErrorUIState.FULL_PAGE,
  },

  // ============================================================================
  // CONVEX ERRORS
  // ============================================================================
  
  CONVEX_MUTATION_FAILED: {
    category: ErrorCategory.CONVEX,
    severity: ErrorSeverity.ERROR,
    userMessage: "Failed to save changes. Please try again.",
    recoverable: true,
    uiState: ErrorUIState.TOAST,
  },
  
  CONVEX_QUERY_FAILED: {
    category: ErrorCategory.CONVEX,
    severity: ErrorSeverity.ERROR,
    userMessage: "Failed to load data. Please refresh the page.",
    recoverable: true,
    uiState: ErrorUIState.INLINE_ERROR,
  },

  // ============================================================================
  // UNKNOWN ERRORS
  // ============================================================================
  
  UNKNOWN_ERROR: {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.ERROR,
    userMessage: "An unexpected error occurred. Please try again.",
    recoverable: true,
    uiState: ErrorUIState.FULL_PAGE,
  },
};
