import { z } from "zod";

import { authEmailField } from "./auth-email";

/**
 * Canonical input contract for the login form.
 *
 * Framework-neutral: imports only Zod, so this schema may be reused by
 * future server boundaries (presentation → domain, use-case → domain).
 * Required + non-empty + format only. No authentication logic here.
 */
export const LoginSchema = z.object({
  email: authEmailField,
  password: z.string("Password is required").min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
