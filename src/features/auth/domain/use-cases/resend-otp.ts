// OTP resend use case (domain layer).
//
// Authoritative cooldown lives here (3 per 5 minutes per email), not
// in the frontend countdown. Only the newest code stays valid — the
// provider rotates on send. Unknown or already-verified emails resolve
// to the same generic outcome so resend cannot enumerate accounts.

import { z } from "zod";

import type { RateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import { AppError } from "@/shared/errors/app-error";

import { authEmailField } from "../schemas/auth-email";
import { normalizeEmail } from "../services/auth-helpers";
import { AUTH_LIMITS } from "../services/auth-limits";
import { parseOrThrow } from "../services/validation";
import type { AuthProvider, SecurityEventSink } from "../repositories/auth-provider";

const ResendOtpSchema = z.object({ email: authEmailField });

interface ResendOtpDeps {
  auth: AuthProvider;
  limits: RateLimiter;
  events: SecurityEventSink;
  clientIp: string;
}

interface ResendOtpResult {
  email: string;
}

const resendOtp = async (input: unknown, deps: ResendOtpDeps): Promise<ResendOtpResult> => {
  const parsed = parseOrThrow(ResendOtpSchema, input);
  const email = normalizeEmail(parsed.email);

  const limit = await deps.limits.check(
    `resend-otp:${email}`,
    AUTH_LIMITS.resendOtp.max,
    AUTH_LIMITS.resendOtp.windowMs,
  );
  if (!limit.allowed) {
    deps.events.log("verification_rate_limited", { emailDomain: email.split("@")[1] });
    throw new AppError("RATE_LIMITED");
  }

  const user = await deps.auth.findUserByEmail(email);
  if (user && !user.emailVerified) {
    await deps.auth.sendVerificationOtp(email);
    deps.events.log("verification_requested", { userId: user.id });
  }

  return { email };
};

export { resendOtp };
export type { ResendOtpDeps, ResendOtpResult };
