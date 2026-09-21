import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";

type StatusTone = "neutral" | "info" | "success" | "warning" | "error";

const TONE_STYLES: Record<StatusTone, string> = {
  neutral: "bg-surface-muted text-muted",
  info: "bg-info-muted text-info",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  error: "bg-error-muted text-error",
};

interface StatusBadgeProps {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
}

/**
 * Minimal domain-neutral status pill. Always renders its text label, so
 * meaning never depends on color alone. For invoice-style domain
 * statuses, callers pass the already-decided tone — this component owns
 * no business rules.
 */
const StatusBadge = ({ tone = "neutral", children, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "font-montserrat text-xs font-semibold",
        TONE_STYLES[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
};

export default StatusBadge;
