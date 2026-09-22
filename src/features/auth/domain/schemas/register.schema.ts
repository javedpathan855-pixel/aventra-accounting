import { z } from "zod";

import { authEmailField } from "./auth-email";
import { passwordField } from "./password.schema";

/**
 * Canonical input contract for the registration form.
 *
 * Mirrors the actual form fields: name, organization, email, password,
 * confirmPassword, terms. Password policy (ADR 003): minimum 8
 * characters, decided explicitly — see
 * docs/adr/003-auth-security-policy.md.
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
    password: passwordField(),
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
