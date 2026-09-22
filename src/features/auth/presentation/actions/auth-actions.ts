"use server";

// Auth server actions: thin transport over the domain use-cases.
//
// Forms call these instead of Better Auth directly so every request
// gets server validation, rate limits, error normalization, and audit
// events in one place. Results use the API_RULES.md envelope plus an
// optional safe field-error map for the existing FieldError UI.

import { randomBytes, randomUUID } from "node:crypto";

import { getEmailService } from "@/shared/infrastructure/email/resend-email-service";
import { getProductionRateLimiter } from "@/shared/infrastructure/rate-limit/database-rate-limiter";
import { logSecurityEvent } from "@/shared/infrastructure/logging/security-logger";
import { normalizeError, type AuthErrorCode } from "@/shared/errors/app-error";import { prismaOrganizationRepository } from "@/features/auth/data/repositories/prisma-organization-repository";
import type {
  NotificationPort,
  SecurityEventSink,
} from "@/features/auth/domain/repositories/auth-provider";
import { loginUser } from "@/features/auth/domain/use-cases/login-user";
import { logoutUser } from "@/features/auth/domain/use-cases/logout-user";
import { requestPasswordReset, resetPassword } from "@/features/auth/domain/use-cases/password-reset";
import { registerUser } from "@/features/auth/domain/use-cases/register-user";
import { resendOtp } from "@/features/auth/domain/use-cases/resend-otp";
import { verifyOtp } from "@/features/auth/domain/use-cases/verify-otp";
import { betterAuthProvider } from "@/features/auth/infrastructure/auth/better-auth-provider";
import { getCurrentUser } from "@/features/auth/infrastructure/auth/session";
import { getClientIp } from "@/features/auth/infrastructure/auth/request-ip";
import type { FieldErrors } from "@/shared/errors/validation";

interface ActionError {
  code: AuthErrorCode;
  message: string;
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError; fieldErrors?: FieldErrors };

const events: SecurityEventSink = {
  log: (event, context) => logSecurityEvent(event, context),
};

const notify: NotificationPort = {
  sendExistingAccountNotice: async (email) => {
    await getEmailService().sendExistingAccountNotice({ to: email });
  },
};

const baseDeps = async () => ({
  auth: betterAuthProvider,
  orgs: prismaOrganizationRepository,
  notify,
  // Shared production limiter: in-memory for single-instance dev, the
  // PostgreSQL ledger when RATE_LIMIT_STORAGE=database (multi-instance).
  limits: getProductionRateLimiter(),
  events,
  generateId: () => randomUUID(),
  randomSuffix: () => randomBytes(4).toString("hex").slice(0, 6),
  clientIp: await getClientIp(),
});

const toFailure = (error: unknown): Extract<ActionResult<never>, { success: false }> => {
  const appError = normalizeError(error);
  const details = appError.details;
  const fieldErrors =
    details && typeof details.fieldErrors === "object" && details.fieldErrors !== null
      ? (details.fieldErrors as FieldErrors)
      : undefined;

  return {
    success: false,
    error: { code: appError.code, message: appError.message } satisfies ActionError,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
};

const registerAction = async (input: unknown): Promise<ActionResult<{ email: string }>> => {
  try {
    const data = await registerUser(input, await baseDeps());
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

const verifyOtpAction = async (input: unknown): Promise<ActionResult<{ redirectTo: string }>> => {
  try {
    const { redirectTo } = await verifyOtp(input, await baseDeps());
    return { success: true, data: { redirectTo } };
  } catch (error) {
    return toFailure(error);
  }
};

const resendOtpAction = async (input: unknown): Promise<ActionResult<{ email: string }>> => {
  try {
    const data = await resendOtp(input, await baseDeps());
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

const loginAction = async (
  input: unknown,
): Promise<ActionResult<{ status: string; redirectTo?: string; email?: string }>> => {
  try {
    const data = await loginUser(input, await baseDeps());
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

const logoutAction = async (): Promise<ActionResult<{ redirectTo: string }>> => {
  try {
    const user = await getCurrentUser();
    const data = await logoutUser({
      auth: betterAuthProvider,
      events,
      ...(user ? { userId: user.id } : {}),
    });
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

const forgotPasswordAction = async (input: unknown): Promise<ActionResult<{ email: string }>> => {
  try {
    const data = await requestPasswordReset(input, await baseDeps());
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

const resetPasswordAction = async (
  input: unknown,
): Promise<ActionResult<{ redirectTo: string }>> => {
  try {
    const data = await resetPassword(input, await baseDeps());
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

export {
  forgotPasswordAction,
  loginAction,
  logoutAction,
  registerAction,
  resendOtpAction,
  resetPasswordAction,
  verifyOtpAction,
};
export type { ActionError, ActionResult };
