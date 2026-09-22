// Shared server-side validation helper.
//
// Every use-case re-validates untrusted input with its canonical Zod
// schema and converts failures into safe field-error maps for the
// existing FieldError UI. Throws VALIDATION_ERROR — never returns raw
// Zod internals to callers. Framework-independent: safe for any domain.

import type { z } from "zod";

import { AppError } from "./app-error";

type FieldErrors = Record<string, string>;

const toFieldErrors = (error: z.ZodError): FieldErrors => {
  const flat = error.flatten();
  const out: FieldErrors = {};
  for (const [field, messages] of Object.entries(flat.fieldErrors)) {
    if (Array.isArray(messages) && typeof messages[0] === "string") {
      out[field] = messages[0];
    }
  }
  return out;
};

/**
 * Parse untrusted input or throw VALIDATION_ERROR carrying a safe
 * field-error map in `details.fieldErrors`.
 */
const parseOrThrow = <T,>(schema: z.ZodType<T>, input: unknown): T => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError("VALIDATION_ERROR", {
      details: { fieldErrors: toFieldErrors(result.error) },
    });
  }
  return result.data;
};

export { parseOrThrow, toFieldErrors };
export type { FieldErrors };
