"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import Button from "./button";
import Label from "./label";

import cn from "@/shared/utils/cn";

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  options: SelectOption[];

  value?: string;
  defaultValue?: string;

  placeholder?: string;

  disabled?: boolean;
  loading?: boolean;

  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;

  onChange?: (value: string) => void;
}

const Select = ({
  id,
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  disabled = false,
  loading = false,
  label = "",
  helperText = "",
  error = "",
  required = false,
  onChange,
}: SelectProps) => {
  const generatedId = useId();

  const selectId = id ?? `select-${generatedId}`;
  const listboxId = `${selectId}-listbox`;
  const helperTextId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const [isOpen, setIsOpen] = useState(false);

  const [selectedValue, setSelectedValue] = useState(
    defaultValue ?? value ?? "",
  );

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const selectRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const isDisabled = disabled || loading;

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) {
      return;
    }

    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    optionRefs.current = [];
  }, [options]);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const getFirstEnabledIndex = () => {
    return options.findIndex((option) => !option.disabled);
  };

  const getLastEnabledIndex = () => {
    for (let index = options.length - 1; index >= 0; index--) {
      if (!options[index].disabled) {
        return index;
      }
    }

    return -1;
  };

  const handleSelect = (optionValue: string) => {
    const option = options.find((item) => item.value === optionValue);

    if (!option || option.disabled || isDisabled) {
      return;
    }

    setSelectedValue(optionValue);
    setIsOpen(false);

    setHighlightedIndex(
      options.findIndex((item) => item.value === optionValue),
    );

    onChange?.(optionValue);
  };

  const openDropdown = () => {
    if (isDisabled) {
      return;
    }

    setIsOpen(true);

    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue && !option.disabled,
    );

    if (selectedIndex !== -1) {
      setHighlightedIndex(selectedIndex);
      return;
    }

    setHighlightedIndex(getFirstEnabledIndex());
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleButtonKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (isDisabled) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      if (!isOpen) {
        openDropdown();
        return;
      }
    }

    if (!isOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex((current) => {
        let nextIndex = current + 1;

        while (nextIndex < options.length) {
          if (!options[nextIndex].disabled) {
            return nextIndex;
          }

          nextIndex++;
        }

        return getFirstEnabledIndex();
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((current) => {
        let nextIndex = current - 1;

        while (nextIndex >= 0) {
          if (!options[nextIndex].disabled) {
            return nextIndex;
          }

          nextIndex--;
        }

        return getLastEnabledIndex();
      });

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();

      setHighlightedIndex(getFirstEnabledIndex());

      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      setHighlightedIndex(getLastEnabledIndex());

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (highlightedIndex === -1) {
        return;
      }

      const option = options[highlightedIndex];

      if (!option || option.disabled) {
        return;
      }

      handleSelect(option.value);

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      closeDropdown();
    }
  };

  const describedBy = error ? errorId : helperText ? helperTextId : undefined;

  return (
    <div ref={selectRef} className="relative flex w-full flex-col gap-2">
      {label && (
        <Label htmlFor={selectId}>
          {label}

          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}

      <Button
        id={selectId}
        variant="outline"
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onClick={() => {
          if (isDisabled) {
            return;
          }

          if (isOpen) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
        onKeyDown={handleButtonKeyDown}
        className={cn(
          "flex items-center justify-between font-montserrat",
          error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-border hover:border-primary/50 focus:border-primary focus:ring-primary/20",
        )}
      >
        <span className={cn(!selectedOption && "text-foreground/60")}>
          {loading ? "Loading..." : selectedOption?.label || placeholder}
        </span>

        {loading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
            aria-hidden="true"
          />
        ) : (
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        )}
      </Button>

      {isOpen && !loading && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label || "Select an option"}
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-background p-1 shadow-[0_0_16px_rgba(240,88,3,0.20)] dark:shadow-xl dark:shadow-black/70"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-foreground/60">
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const isSelected = selectedValue === option.value;

              const isHighlighted = index === highlightedIndex;

              return (
                <div
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  tabIndex={-1}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded px-3 py-2 font-montserrat text-sm transition-colors",
                    "hover:bg-primary/10",
                    option.disabled &&
                      "cursor-not-allowed text-foreground/50 hover:bg-transparent",
                    isHighlighted &&
                      !option.disabled &&
                      "bg-primary/10 font-semibold text-primary",
                    isSelected && !option.disabled && "font-semibold",
                  )}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>

                  {isSelected && !option.disabled && (
                    <CheckIcon
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {error ? (
        <p id={errorId} className="font-lato text-xs text-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperTextId} className="font-lato text-xs text-foreground/60">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Select;
