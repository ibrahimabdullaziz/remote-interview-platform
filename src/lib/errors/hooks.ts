/**
 * Unified Error Management System - React Hooks
 * Custom hooks for error management in React components
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { errorHandler } from "./handler";
import type { AppError } from "./types";

/**
 * Hook to access the error handler in components
 */
export function useErrorHandler() {
  const createError = useCallback(
    (code: string, originalError?: Error, metadata?: Record<string, unknown>) => {
      return errorHandler.createError(code, originalError, metadata);
    },
    []
  );

  const handleError = useCallback((error: AppError) => {
    errorHandler.handle(error);
  }, []);

  const categorizeError = useCallback((error: unknown) => {
    return errorHandler.categorizeError(error);
  }, []);

  return {
    createError,
    handleError,
    categorizeError,
    getHistory: () => errorHandler.getHistory(),
    clearHistory: () => errorHandler.clearHistory(),
  };
}

/**
 * Hook to manage error reset state and retry logic
 */
export function useErrorReset(maxRetries = 3) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const retry = useCallback(
    async (retryFn: () => Promise<void> | void) => {
      if (retryCount >= maxRetries) {
        return;
      }

      setIsRetrying(true);
      setRetryCount((prev) => prev + 1);

      try {
        await retryFn();
        reset();
      } catch (error) {
        setIsRetrying(false);
        throw error;
      }
    },
    [retryCount, maxRetries, reset]
  );

  const canRetry = retryCount < maxRetries;

  return {
    retryCount,
    isRetrying,
    canRetry,
    retry,
    reset,
  };
}

/**
 * Hook to attach/detach global error listeners
 */
export function useGlobalErrorListener() {
  useEffect(() => {
    errorHandler.attachGlobalListeners();

    return () => {
      errorHandler.detachGlobalListeners();
    };
  }, []);
}
