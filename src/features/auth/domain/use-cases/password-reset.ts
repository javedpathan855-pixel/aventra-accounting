// Password-reset use cases (domain layer).
//
// Request: always resolves to the same generic outcome. The provider
// stays silent for unknown emails, and this layer additionally skips
// the send when no account exists — identical response either way, so
// reset requests cannot enumerate accounts.
//
// Confirm: consumes the single-use token with the new password under
// the shared password policy. Provider revokes sessions on success
// (ADR 003), so the caller routes back to sign-in.

import { z } from "zod";

import type { RateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import { AppError } from "@/shared/errors/app-error";

import { authEmailField } from "../schemas/auth-email";
import { passwordField } from "../schemas/password.schema";
import { normalizeEmail } from "../services/auth-helpers";
import { AUTH_LIMITS } from "../services/auth-limits";
import { parseOrThrow } from "../services/validation";
import type { AuthProvider, SecurityEventSink } from "../repositories/auth-provider";

const RequestResetSchema = z.object({ email: authEmailField });
const ConfirmResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordField("New password"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface ResetDeps {
  auth: AuthProvider;
  limits: RateLimiter;
  events: SecurityEventSink;
  clientIp: string;
}

const requestPasswordReset = async (input: unknown, deps: ResetDeps): Promise<{ email: string }> => {
  const parsed = parseOrThrow(RequestResetSchema, input);
  const email = normalizeEmail(parsed.email);

  const limit = await deps.limits.check(
    `forgot-password:${email}`,
    AUTH_LIMITS.forgotPassword.max,
    AUTH_LIMITS.forgotPassword.windowMs,
  );
  if (!limit.allowed) {
    throw new AppError("RATE_LIMITED");
  }

  const user = await deps.auth.findUserByEmail(email);
  if (user) {
    await deps.auth.requestPasswordReset(email);
    deps.events.log("password_reset_requested", { userId: user.id });
  }

  return { email };
};

const resetPassword = async (
  input: unknown,
  deps: ResetDeps,
): Promise<{ redirectTo: string }> => {
  const parsed = parseOrThrow(ConfirmResetSchema, input);

  const limit = await deps.limits.check(
    `reset-password:ip:${deps.clientIp}`,
    AUTH_LIMITS.resetPassword.max,
    AUTH_LIMITS.resetPassword.windowMs,
  );
  if (!limit.allowed) {
    throw new AppError("RATE_LIMITED");
  }

  await deps.auth.resetPasswordWithToken({ token: parsed.token, newPassword: parsed.password });
  deps.events.log("password_reset_completed", {});
  return { redirectTo: "/auth" };
};

export { requestPasswordReset, resetPassword };
export type { ResetDeps };
