"use client";

import { Component, type ReactNode } from "react";
import { errorHandler } from "./handler";
import { ErrorDisplay } from "./ErrorDisplay";
import type { AppError, ErrorBoundaryProps } from "./types";

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  retryCount: number;
}

/**
 * Enhanced Error Boundary with retry mechanism and reset capabilities
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Categorize the error using centralized handler
    const appError = errorHandler.categorizeError(error);
    
    // Add React error info to metadata
    const enrichedError: AppError = {
      ...appError,
      metadata: {
        ...appError.metadata,
        componentStack: errorInfo.componentStack,
      },
    };

    // Handle through centralized system
    errorHandler.handle(enrichedError);

    // Update state with the error
    this.setState({ error: enrichedError });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Auto-reset when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasChanged) {
        this.reset();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Reset error boundary state
   */
  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Handle retry with exponential backoff
   */
  handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    // Exponential backoff: 100ms, 200ms, 400ms, etc.
    const delay = Math.min(100 * Math.pow(2, retryCount), 1000);

    this.setState({ retryCount: retryCount + 1 });

    this.resetTimeoutId = setTimeout(() => {
      this.reset();
    }, delay);
  };

  render(): ReactNode {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use ErrorDisplay component with retry functionality
      return (
        <ErrorDisplay
          error={error}
          onRetry={error.recoverable ? this.handleRetry : undefined}
          retryCount={retryCount}
          maxRetries={maxRetries}
          showReport={true}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
