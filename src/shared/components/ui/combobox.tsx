"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";

import Button from "./button";
import Label from "./label";

import cn from "@/shared/utils/cn";

interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ComboboxProps {
  id?: string;
  options: ComboboxOption[];

  value?: string;
  defaultValue?: string;

  placeholder?: string;
  searchPlaceholder?: string;

  disabled?: boolean;
  loading?: boolean;

  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;

  clearable?: boolean;

  noResultsText?: string;

  onChange?: (value: string) => void;
}

const Combobox = ({
  id,
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  disabled = false,
  loading = false,
  label = "",
  helperText = "",
  error = "",
  required = false,
  clearable = true,
  noResultsText = "No options found",
  onChange,
}: ComboboxProps) => {
  const generatedId = useId();

  const comboboxId = id ?? `combobox-${generatedId}`;
  const listboxId = `${comboboxId}-listbox`;
  const helperTextId = `${comboboxId}-helper`;
  const errorId = `${comboboxId}-error`;
  const searchInputId = `${comboboxId}-search`;

  const [isOpen, setIsOpen] = useState(false);

  const [selectedValue, setSelectedValue] = useState(
    defaultValue ?? value ?? "",
  );

  const [searchValue, setSearchValue] = useState("");

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const comboboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const isDisabled = disabled || loading;

  /*
   * Sync controlled value from parent.
   */
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Close dropdown on Escape.
   */
  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /*
   * Filter options.
   */
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.trim().toLowerCase()),
  );

  /*
   * Reset option refs when filtered options change.
   */
  useEffect(() => {
    optionRefs.current = [];
  }, [filteredOptions.length, searchValue]);

  /*
   * Keep highlighted option visible.
   */
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) {
      return;
    }

    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex, isOpen]);

  /*
   * Selected option.
   */
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  /*
   * First enabled filtered option.
   */
  const getFirstEnabledIndex = () => {
    return filteredOptions.findIndex((option) => !option.disabled);
  };

  /*
   * Last enabled filtered option.
   */
  const getLastEnabledIndex = () => {
    for (let index = filteredOptions.length - 1; index >= 0; index--) {
      if (!filteredOptions[index].disabled) {
        return index;
      }
    }

    return -1;
  };

  /*
   * Select option.
   */
  const handleSelect = (optionValue: string) => {
    const option = options.find((item) => item.value === optionValue);

    if (!option || option.disabled || isDisabled) {
      return;
    }

    setSelectedValue(optionValue);
    setIsOpen(false);
    setSearchValue("");
    setHighlightedIndex(-1);

    onChange?.(optionValue);
  };

  /*
   * Clear selected value.
   */
  const handleClear = () => {
    if (isDisabled || !clearable) {
      return;
    }

    setSelectedValue("");
    setSearchValue("");
    setHighlightedIndex(-1);

    onChange?.("");
  };

  /*
   * Open combobox.
   */
  const openCombobox = () => {
    if (isDisabled) {
      return;
    }

    setIsOpen(true);

    const selectedIndex = filteredOptions.findIndex(
      (option) => option.value === selectedValue && !option.disabled,
    );

    if (selectedIndex !== -1) {
      setHighlightedIndex(selectedIndex);
    } else {
      setHighlightedIndex(getFirstEnabledIndex());
    }

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  /*
   * Close combobox.
   */
  const closeCombobox = () => {
    setIsOpen(false);
    setSearchValue("");
    setHighlightedIndex(-1);
  };

  /*
   * Keyboard navigation.
   */
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isDisabled) {
      return;
    }

    /*
     * Close.
     */
    if (event.key === "Escape") {
      event.preventDefault();
      closeCombobox();
      return;
    }

    /*
     * Select highlighted option.
     */
    if (event.key === "Enter") {
      event.preventDefault();

      if (highlightedIndex === -1) {
        return;
      }

      const option = filteredOptions[highlightedIndex];

      if (!option || option.disabled) {
        return;
      }

      handleSelect(option.value);
      return;
    }

    /*
     * Move down.
     */
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex((current) => {
        let nextIndex = current + 1;

        while (nextIndex < filteredOptions.length) {
          if (!filteredOptions[nextIndex].disabled) {
            return nextIndex;
          }

          nextIndex++;
        }

        return getFirstEnabledIndex();
      });

      return;
    }

    /*
     * Move up.
     */
    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((current) => {
        let nextIndex = current - 1;

        while (nextIndex >= 0) {
          if (!filteredOptions[nextIndex].disabled) {
            return nextIndex;
          }

          nextIndex--;
        }

        return getLastEnabledIndex();
      });

      return;
    }

    /*
     * First option.
     */
    if (event.key === "Home") {
      event.preventDefault();

      setHighlightedIndex(getFirstEnabledIndex());
      return;
    }

    /*
     * Last option.
     */
    if (event.key === "End") {
      event.preventDefault();

      setHighlightedIndex(getLastEnabledIndex());
    }
  };

  const describedBy = error ? errorId : helperText ? helperTextId : undefined;

  return (
    <div ref={comboboxRef} className="relative flex w-full flex-col gap-2">
      {label && (
        <Label htmlFor={comboboxId}>
          {label}

          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}

      <div className="relative">
        <Button
          id={comboboxId}
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
              closeCombobox();
            } else {
              openCombobox();
            }
          }}
          className={cn(
            "w-full flex items-center justify-between font-montserrat",
            error
              ? "border-error focus:border-error focus:ring-error/20"
              : "border-border hover:border-primary/50 focus:border-primary focus:ring-primary/20",
          )}
        >
          <span
            className={cn("truncate", !selectedOption && "text-foreground/60")}
          >
            {loading ? "Loading..." : selectedOption?.label || placeholder}
          </span>

          <span className="ml-2 flex shrink-0 items-center gap-2">
            {loading ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
                aria-hidden="true"
              />
            ) : clearable && selectedOption ? (
              <XIcon
                className="h-4 w-4 text-foreground/50 transition-colors hover:text-error"
                aria-hidden="true"
                onClick={(event) => {
                  event.stopPropagation();
                  handleClear();
                }}
              />
            ) : null}

            {!loading && (
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            )}
          </span>
        </Button>
      </div>

      {isOpen && !loading && (
        <div
          id={listboxId}
          className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md bg-background shadow-[0_0_16px_rgba(240,88,3,0.20)] dark:shadow-xl dark:shadow-black/70"
        >
          <div className="border-b border-border p-2">
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
                aria-hidden="true"
              />

              <input
                id={searchInputId}
                ref={searchInputRef}
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);

                  setHighlightedIndex(
                    event.target.value
                      ? getFirstEnabledIndex()
                      : getFirstEnabledIndex(),
                  );
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                autoComplete="off"
                className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 font-lato text-sm outline-none transition-colors placeholder:text-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div
            role="listbox"
            aria-label={label || "Select an option"}
            className="max-h-60 overflow-y-auto p-1"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center font-lato text-sm text-foreground/60">
                {noResultsText}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
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
                    <span className="truncate">{option.label}</span>

                    {isSelected && !option.disabled && (
                      <CheckIcon
                        className="ml-2 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
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

export default Combobox;
