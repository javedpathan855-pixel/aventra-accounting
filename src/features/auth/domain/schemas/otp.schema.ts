import { z } from "zod";

/**
 * Canonical input contract for OTP verification.
 *
 * Validates the joined OTP string produced by the six-input component.
 * Per-input numeric filtering, keyboard behavior, and mobile inputMode
 * remain native component responsibilities; this schema owns the
 * completeness contract on the client and at the server boundary.
 */
export const OtpSchema = z
  .string("Enter the verification code")
  .length(6, "Enter the 6-digit code")
  .regex(/^\d+$/, "The code must contain digits only");

export type OtpInput = z.infer<typeof OtpSchema>;
