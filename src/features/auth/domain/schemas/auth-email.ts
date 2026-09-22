import { z } from "zod";

/**
 * Canonical email input rule for Auth forms.
 *
 * Shared by the login, register, and forgot-password schemas so the rule
 * is defined once (CODING_STANDARDS.md: canonical schema/validator).
 * Safe, generic messages only. Client validation is UX only; server
 * validation remains authoritative (CORE_RULES.md).
 */
export const authEmailField = z
  .string("Email is required")
  .min(1, "Email is required")
  .email("Enter a valid email address");
