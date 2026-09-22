"use client";

import type { ReactNode } from "react";

import FieldError from "@/shared/components/ui/field-error";
import Label from "@/shared/components/ui/label";
import cn from "@/shared/utils/cn";
import { getFieldErrorId } from "@/shared/utils/form-ids";

interface FieldRenderProps {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

interface ProfileFieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  children: (props: FieldRenderProps) => ReactNode;
  className?: string;
}

/**
 * Labeled profile field: label with required/optional markers, control
 * via render prop (receives the wired id, aria-describedby, and invalid
 * flag), helper text, and FieldError. Centralizes the label → control →
 * error contract so call sites cannot drift.
 */
const ProfileField = ({
  id,
  label,
  required = false,
  optional = false,
  helper,
  error,
  children,
  className,
}: ProfileFieldProps) => {
  const errorId = getFieldErrorId(id);
  const helperId = `${id}-helper`;
  const describedBy = [error ? errorId : null, helper ? helperId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? (
          <span className="ml-1 font-lato text-xs font-normal text-muted">
            (Optional)
          </span>
        ) : null}
      </Label>
      {children({ id, describedBy: describedBy || undefined, invalid: Boolean(error) })}
      {helper ? (
        <p id={helperId} className="font-lato text-xs text-muted">
          {helper}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
};

const TEXTAREA_CLASS =
  "min-h-24 w-full rounded-md border border-border bg-background px-4 py-2 font-montserrat text-base text-foreground outline-none transition-all duration-200 placeholder:text-input-placeholder focus:border-primary focus:shadow-primary-md focus:ring-2 focus:ring-ring/30";

interface ProfileTextareaProps {
  id: string;
  value: string;
  maxLength: number;
  placeholder?: string;
  describedBy?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}

/**
 * Profile textarea styled to the Input token set (no shared textarea
 * primitive exists). Character counting stays with the caller so the
 * counter always derives from the actual value.
 */
const ProfileTextarea = ({
  id,
  value,
  maxLength,
  placeholder,
  describedBy,
  invalid = false,
  onChange,
}: ProfileTextareaProps) => {
  return (
    <textarea
      id={id}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      aria-describedby={describedBy}
      aria-invalid={invalid}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        TEXTAREA_CLASS,
        invalid && "border-error focus:border-error focus:ring-error/30",
      )}
    />
  );
};

export { ProfileField, ProfileTextarea };
export type { FieldRenderProps };
