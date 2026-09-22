"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { iconSwapVariants } from "@/shared/animation/variants";
import cn from "@/shared/utils/cn";
import Input, { type InputProps } from "./input";

interface PasswordInputProps extends Omit<InputProps, "type" | "suffix"> {
  defaultVisible?: boolean;
}

/**
 * Generic password field: Input with a decorative lock prefix and an
 * independent visibility toggle suffix. Owns only its local visibility
 * state (password ↔ text); validation, naming, and autocomplete stay
 * with the caller. Each instance toggles independently.
 */
const PasswordInput = ({
  prefix,
  defaultVisible = false,
  disabled = false,
  ...props
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(defaultVisible);

  const VisibilityIcon = visible ? EyeOff : Eye;

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      disabled={disabled}
      prefix={
        prefix ?? <LockKeyhole aria-hidden="true" className="h-4 w-4" />
      }
      suffix={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={cn(
            "flex h-7 w-7 items-center justify-center",
            "rounded-md text-muted",
            "transition-colors duration-200",
            "hover:bg-primary-muted hover:text-primary",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-ring/30",
            "disabled:pointer-events-none",
            "disabled:opacity-50",
          )}
        >
          <motion.span
            key={visible ? "visible" : "hidden"}
            variants={iconSwapVariants}
            initial="initial"
            animate="animate"
            className="flex"
            aria-hidden="true"
          >
            <VisibilityIcon
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200"
            />
          </motion.span>
        </button>
      }
    />
  );
};

export default PasswordInput;
