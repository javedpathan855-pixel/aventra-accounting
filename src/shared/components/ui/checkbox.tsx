"use client";

import cn from "@/shared/utils/cn";
import { InputHTMLAttributes, ReactNode, useId, useState } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
  description?: ReactNode;
  containerClassName?: string;
  checkboxClassName?: string;
}

const Checkbox = ({
  label,
  description,
  className,
  containerClassName,
  checkboxClassName,
  id,
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(event.target.checked);
    }

    onChange?.(event);
  };

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "group inline-flex w-fit items-start gap-3",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        containerClassName,
      )}
    >
      <input
        {...props}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        className={cn("peer sr-only", className)}
      />

      <span
        aria-hidden="true"
        className={cn("relative shrink-0", "h-5 w-5", checkboxClassName)}
      >
        <span
          className={cn(
            "absolute inset-0",
            "rounded-[4px]",
            "border-[3px] border-border-strong",
            "bg-background",

            // Original hover transition
            "transition-all duration-1000 ease-out",

            // Hover
            "group-hover:border-primary",
            "group-hover:border-4",

            // Focus
            "peer-focus-visible:ring-2",
            "peer-focus-visible:ring-primary/30",
            "peer-focus-visible:ring-offset-2",
            "peer-focus-visible:ring-offset-background",

            // Disabled
            "peer-disabled:pointer-events-none",
            "peer-disabled:group-hover:border-border-strong",
            "peer-disabled:group-hover:border-[3px]",
          )}
        />

        <span
          className={cn(
            "pointer-events-none absolute inset-0",
            "overflow-hidden",
            "rounded-[4px]",
          )}
        >
          <span
            className={cn(
              "absolute left-0 top-1/2",
              "z-1",
              "h-0 w-0",
              "bg-primary",

              // Original Uiverse animation
              "transition-all duration-500 ease-out",

              isChecked && [
                "top-0",
                "h-full",
                "w-1/2",
                "rounded-l-[4px]",
                "rounded-r-none",
              ],
            )}
          />

          <span
            className={cn(
              "absolute right-0 top-1/2",
              "z-1",
              "h-0 w-0",
              "bg-primary",

              // Original Uiverse animation
              "transition-all duration-500 ease-out",

              isChecked && [
                "top-0",
                "h-full",
                "w-1/2",
                "rounded-r-[4px]",
                "rounded-l-none",
              ],
            )}
          />
        </span>

        <span className={cn("pointer-events-none absolute inset-0", "z-2")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d="M14 27l8 8 16-16"
              fill="none"
              className={cn(
                "stroke-primary-foreground",
                "stroke-5",
                "[stroke-linecap:round]",
                "[stroke-linejoin:round]",
              )}
              style={{
                strokeDasharray: 36,
                strokeDashoffset: isChecked ? 0 : 36,
                transition: "stroke-dashoffset 0.6s ease-out",
                transitionDelay: isChecked ? "0.6s" : "0s",
              }}
            />
          </svg>
        </span>
      </span>

      {(label || description) && (
        <span className="flex min-w-0 flex-col gap-0.5">
          {label && (
            <span
              className={cn(
                "font-montserrat",
                "text-sm font-medium leading-5",
                "text-foreground",
              )}
            >
              {label}
            </span>
          )}

          {description && (
            <span
              className={cn("font-lato", "text-sm leading-5", "text-muted")}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
