import { z } from "zod";

import { authEmailField } from "./auth-email";

/**
 * Canonical input contract for the forgot-password form.
 * Single email field; same canonical email rule as login/register.
 */
export const ForgotPasswordSchema = z.object({
  email: authEmailField,
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
