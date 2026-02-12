"use client";

import { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // In production you could send this to an error reporting service
    console.error("ErrorBoundary caught error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[calc(100vh-4rem-1px)] items-center justify-center px-4">
            <div className="max-w-md text-center space-y-2">
              <h2 className="text-lg font-semibold">
                Something went wrong in this section.
              </h2>
              <p className="text-sm text-muted-foreground">
                Please refresh the page or try again in a few moments.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

