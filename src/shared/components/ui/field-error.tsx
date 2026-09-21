"use client";

import { AnimatePresence, motion } from "framer-motion";

import { errorMessageVariants } from "@/shared/animation/variants";
import cn from "@/shared/utils/cn";

interface FieldErrorProps {
  id: string;
  message?: string | null;
  className?: string;
}

/**
 * Domain-neutral field-level validation message.
 *
 * Presentation-only: renders nothing when there is no message. Follows the
 * existing error-message convention (font-lato, text-xs, text-error,
 * role="alert") used by the select/combobox error slots. Associate with
 * its control via aria-describedby pointing at {@link FieldErrorProps.id}.
 * Appear/disappear uses the centralized error-message variant (opacity +
 * small y translation, no shaking or flashing).
 */
const FieldError = ({ id, message, className }: FieldErrorProps) => {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="field-error"
          id={id}
          role="alert"
          variants={errorMessageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn("font-lato text-xs text-error", className)}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
};

export default FieldError;
