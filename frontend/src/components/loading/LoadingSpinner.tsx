import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  "aria-label": ariaLabel,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], className)}
      aria-label={ariaLabel || "Loading"}
      role="status"
    />
  );
}

export function LoadingCard() {
  return (
    <div
      className="flex items-center justify-center p-8 bg-white rounded-lg border"
      role="status"
      aria-label="Loading content"
    >
      <div className="flex items-center space-x-2">
        <LoadingSpinner aria-label="Loading" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

export function LoadingIssueItem() {
  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 animate-pulse"
      role="status"
      aria-label="Loading issue"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

// Enhanced loading for issue detail page
export function LoadingIssueDetail() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading issue details">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-96 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-32 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
