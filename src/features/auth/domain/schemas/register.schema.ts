import { z } from "zod";

import { authEmailField } from "./auth-email";

/**
 * Canonical input contract for the registration form.
 *
 * Mirrors the actual form fields: name, organization, email, password,
 * confirmPassword, terms. Required + non-empty only.
 *
 * Password policy (minimum length, complexity) is a pending
 * product/security decision — see docs/adr/001-auth-form-validation.md.
 * Do not extend the password rules here without that decision.
 */
export const RegisterSchema = z
  .object({
    name: z
      .string("Full name is required")
      .trim()
      .min(1, "Full name is required"),
    organization: z
      .string("Organization is required")
      .trim()
      .min(1, "Organization is required"),
    email: authEmailField,
    password: z.string("Password is required").min(1, "Password is required"),
    confirmPassword: z
      .string("Please confirm your password")
      .min(1, "Please confirm your password"),
    terms: z.literal(true, "Please accept the Terms of Service and Privacy Policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
