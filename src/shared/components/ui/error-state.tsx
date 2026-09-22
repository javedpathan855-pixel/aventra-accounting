import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  compact?: boolean;
  className?: string;
}

/**
 * Clear but calm error state for system failures (network, server,
 * permission) and inline component errors. Uses the semantic error
 * family on a muted surface — never an alarming red panel, and never
 * confused with destructive confirmations or field validation.
 */
const ErrorState = ({
  title,
  description,
  action,
  icon,
  compact = false,
  className,
}: ErrorStateProps) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full flex-col items-center text-center",
        "rounded-md border border-border bg-surface",
        compact ? "px-4 py-5" : "px-6 py-10",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded-full bg-error-muted text-error",
          compact ? "h-9 w-9" : "h-12 w-12",
        )}
      >
        {icon ?? <TriangleAlert className="h-5 w-5" />}
      </span>
      <h3
        className={cn(
          "font-montserrat font-semibold text-foreground",
          compact ? "mt-3 text-base" : "mt-4 text-lg",
        )}
      >
        {title}
      </h3>
      {description ? (
        <p className="mt-1 max-w-sm font-lato text-sm text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};

export default ErrorState;
