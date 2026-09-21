import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Calm, optimistic empty state: muted icon medallion, clear heading,
 * helpful description, optional action. Never styled as an error —
 * emptiness is information, not failure.
 */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center text-center",
        "rounded-md border border-border bg-surface px-6 py-10",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-muted"
      >
        {icon}
      </span>
      <h3 className="mt-4 font-montserrat text-lg font-semibold text-foreground">
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

export default EmptyState;
