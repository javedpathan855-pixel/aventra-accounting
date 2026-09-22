"use client";

import cn from "@/shared/utils/cn";
import type { LayoutStyleValue } from "../business-profile-defaults";

interface LayoutStylePickerProps {
  value: LayoutStyleValue;
  onChange: (value: LayoutStyleValue) => void;
}

const OPTIONS: Array<{ value: LayoutStyleValue; label: string; hint: string }> = [
  { value: "modern", label: "Modern", hint: "Clean single-column documents" },
  { value: "classic", label: "Classic", hint: "Traditional bordered documents" },
];

/**
 * Document layout selector with native radio semantics: arrow keys move
 * between options, screen readers announce the group state, and the
 * checked card carries the primary ring plus a filled radio dot.
 */
const LayoutStylePicker = ({ value, onChange }: LayoutStylePickerProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <span id="layout-style-label" className="font-montserrat text-sm font-medium text-foreground">
        Layout Style
      </span>
      <div
        role="radiogroup"
        aria-labelledby="layout-style-label"
        className="grid grid-cols-2 gap-3"
      >
        {OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-md border p-4 text-center",
                "transition-colors duration-200",
                "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/30",
                checked
                  ? "border-primary bg-primary-muted/50"
                  : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <input
                type="radio"
                name="layout-style"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span aria-hidden="true" className="flex h-16 w-12 flex-col gap-1 rounded border border-border bg-background p-1.5">
                <span className={cn("h-1.5 w-3/4 rounded-sm", checked ? "bg-primary" : "bg-border-strong")} />
                <span className="h-1 w-full rounded-sm bg-border-subtle" />
                <span className="h-1 w-full rounded-sm bg-border-subtle" />
                <span className={cn("mt-auto h-3 w-full rounded-sm", checked ? "bg-primary-muted" : "bg-surface-muted")} />
              </span>
              <span className="font-montserrat text-sm font-medium text-foreground">
                {option.label}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border-2",
                  checked ? "border-primary" : "border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    checked ? "bg-primary" : "bg-transparent",
                  )}
                />
              </span>
              <span className="sr-only">{option.hint}</span>
            </label>
          );
        })}
      </div>
      <p className="font-lato text-xs text-muted">
        Choose the default layout for your invoices and documents.
      </p>
    </div>
  );
};

export default LayoutStylePicker;
