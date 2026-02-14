import { AppError } from "@/lib/errors/types"
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { ErrorSeverity } from "@/lib/errors/types";
import { getErrorMessage, getErrorSeverityClass } from "@/lib/errors/utils";

interface ErrorDisplayProps {
  error: AppError | null;
  className?: string;
  showIcon?: boolean;
}

const severityIcons = {
  [ErrorSeverity.INFO]: Info,
  [ErrorSeverity.WARNING]: AlertTriangle,
  [ErrorSeverity.ERROR]: AlertCircle,
  [ErrorSeverity.CRITICAL]: XCircle,
};

export function ErrorDisplay({ error, className = "", showIcon = true }: ErrorDisplayProps) {
  if (!error) return null;

  const Icon = severityIcons[error.severity];
  const severityClass = getErrorSeverityClass(error.severity);

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${className}`}>
      <div className={`max-w-md w-full rounded-lg border p-6 ${severityClass}`}>
        <div className="flex items-start gap-3">
          {showIcon && <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-sm font-medium">{getErrorMessage(error)}</p>
            {error.recoverable && (
              <p className="text-xs mt-2 opacity-75">
                Please try again or refresh the page.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
