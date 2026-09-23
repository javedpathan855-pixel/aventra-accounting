// OTP verification use case (domain layer).
//
// Single-use, server-verified codes only. The provider owns attempt
// counting, expiry, and invalidation; this layer validates shape,
// enforces the request budget, repairs tenant state idempotently, and
// emits the audit trail. Failures stay generic (no code/expiry
// distinction beyond what is safe for UX retries).

import type { RateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import { AppError } from "@/shared/errors/app-error";

import { authEmailField } from "../schemas/auth-email";
import { OtpSchema } from "../schemas/otp.schema";
import { normalizeEmail } from "../services/auth-helpers";
import { AUTH_LIMITS } from "../services/auth-limits";
import { parseOrThrow } from "@/shared/errors/validation";
import { ensureOwnerOrganization } from "./ensure-owner-organization";
import type { AuthProvider, SecurityEventSink } from "../repositories/auth-provider";
import type { OrganizationRepository } from "../repositories/organization-repository";
import { z } from "zod";

const VerifyOtpSchema = z.object({ email: authEmailField, otp: OtpSchema });

interface VerifyOtpDeps {
  auth: AuthProvider;
  orgs: OrganizationRepository;
  limits: RateLimiter;
  events: SecurityEventSink;
  generateId: () => string;
  randomSuffix: () => string;
  clientIp: string;
  /** Organization name for tenant repair when the register step never ran. */
  fallbackOrganizationName?: string;
}

interface VerifyOtpResult {
  email: string;
  redirectTo: string;
}

const verifyOtp = async (input: unknown, deps: VerifyOtpDeps): Promise<VerifyOtpResult> => {
  const parsed = parseOrThrow(VerifyOtpSchema, input);
  const email = normalizeEmail(parsed.email);

  const limit = await deps.limits.check(
    `verify-otp:${email}:${deps.clientIp}`,
    AUTH_LIMITS.verifyOtp.max,
    AUTH_LIMITS.verifyOtp.windowMs,
  );
  if (!limit.allowed) {
    deps.events.log("verification_rate_limited", { emailDomain: email.split("@")[1] });
    throw new AppError("RATE_LIMITED");
  }

  let user;
  try {
    user = await deps.auth.verifyOtp(email, parsed.otp);
  } catch (error) {
    deps.events.log("verification_failed", { emailDomain: email.split("@")[1] });
    throw error;
  }

  // Tenant repair: verification succeeds even if the registration
  // request was retried/duplicated mid-flight; membership is ensured
  // exactly once. Without a stored name we fall back to the account name.
  const organizationName = deps.fallbackOrganizationName ?? `${user.name}'s Organization`;
  await ensureOwnerOrganization(
    deps.orgs,
    { userId: user.id, organizationName },
    { generateId: deps.generateId, randomSuffix: deps.randomSuffix },
  );

  deps.events.log("verification_succeeded", { userId: user.id });
  return { email, redirectTo: "/dashboard" };
};

export { verifyOtp };
export type { VerifyOtpDeps, VerifyOtpResult };
