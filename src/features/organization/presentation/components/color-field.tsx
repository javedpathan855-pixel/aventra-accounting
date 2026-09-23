"use client";

import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import cn from "@/shared/utils/cn";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import { HEX_COLOR_PATTERN } from "@/features/organization/domain/schemas/business-profile.schema";

interface ColorFieldProps {
  id: string;
  label: string;
  helper: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

/**
 * Brand color control: native color swatch plus a hex text input.
 * Organization branding data only — values never touch application
 * styling. Invalid text shows an inline error and falls back to a
 * neutral swatch until the hex parses.
 */
const ColorField = ({ id, label, helper, value, error, onChange }: ColorFieldProps) => {
  const normalized = value.trim().toLowerCase();
  const valid = HEX_COLOR_PATTERN.test(value.trim());
  const errorId = getFieldErrorId(id);
  const helperId = `${id}-helper`;
  const message = error ?? (valid ? undefined : "Enter a valid hex color, e.g. #f05803");

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <span
        aria-hidden="true"
        className="h-12 w-12 rounded-full border border-border"
        style={{ backgroundColor: valid ? normalized : "var(--surface-muted)" }}
      />
      <Label htmlFor={id}>{label}</Label>
      <div className="flex min-w-0 items-center gap-2">
        <label
          htmlFor={`${id}-picker`}
          className={cn(
            "relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/30",
          )}
        >
          <span className="sr-only">Pick {label.toLowerCase()}</span>
          <input
            id={`${id}-picker`}
            type="color"
            value={valid ? normalized : "#000000"}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0"
            aria-hidden={!valid}
            tabIndex={valid ? 0 : -1}
          />
        </label>
        <Input
          id={id}
          value={value}
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          placeholder="#f05803"
          aria-describedby={`${helperId}${message ? ` ${errorId}` : ""}`}
          aria-invalid={Boolean(message)}
          variant={message ? "error" : "default"}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 font-mono uppercase"
        />
      </div>
      <p id={helperId} className="font-lato text-xs text-muted">
        {helper}
      </p>
      <FieldError id={errorId} message={message} />
    </div>
  );
};

export default ColorField;
