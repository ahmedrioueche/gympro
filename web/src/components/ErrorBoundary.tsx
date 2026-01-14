import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import ErrorSection from "../components/ui/ErrorSection";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // You could also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorSection
          message="Oops! Something went wrong"
          subtext={
            this.state.error?.message ||
            "An unexpected error occurred. Please try refreshing the page or go back."
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
