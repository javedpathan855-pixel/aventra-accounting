// Registration use case (domain layer).
//
// Enumeration-safe by construction: new, unverified-existing, and
// verified-existing emails all resolve to the same public outcome —
// "check your inbox" — while server-side each state gets its correct
// handling (create + OTP + tenant, resend + tenant repair, reminder
// notice). Never reveals which branch ran.

import type { RateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import { AppError } from "@/shared/errors/app-error";

import { normalizeEmail } from "../services/auth-helpers";
import { AUTH_LIMITS } from "../services/auth-limits";
import { parseOrThrow } from "../services/validation";
import { RegisterSchema } from "../schemas/register.schema";
import { ensureOwnerOrganization } from "./ensure-owner-organization";
import type { AuthProvider, NotificationPort, SecurityEventSink } from "../repositories/auth-provider";
import type { OrganizationRepository } from "../repositories/organization-repository";

interface RegisterUserDeps {
  auth: AuthProvider;
  orgs: OrganizationRepository;
  notify: NotificationPort;
  limits: RateLimiter;
  events: SecurityEventSink;
  generateId: () => string;
  randomSuffix: () => string;
  clientIp: string;
}

interface RegisterUserResult {
  /** Normalized email the OTP was addressed to (or would be). */
  email: string;
}

const registerUser = async (input: unknown, deps: RegisterUserDeps): Promise<RegisterUserResult> => {
  const parsed = parseOrThrow(RegisterSchema, input);
  const email = normalizeEmail(parsed.email);

  const limit = await deps.limits.check(
    `register:ip:${deps.clientIp}`,
    AUTH_LIMITS.register.max,
    AUTH_LIMITS.register.windowMs,
  );
  if (!limit.allowed) {
    throw new AppError("RATE_LIMITED");
  }

  deps.events.log("registration_started", { emailDomain: email.split("@")[1] });

  const existing = await deps.auth.findUserByEmail(email);

  if (existing && existing.emailVerified) {
    // Verified account: generic outcome; the owner gets a notice.
    // Best-effort by design — delivery trouble must not turn the
    // generic response into a distinguishable failure.
    try {
      await deps.notify.sendExistingAccountNotice(email);
    } catch {
      // Logged at the transport boundary via the generic outcome.
    }
    return { email };
  }

  if (!existing) {
    await deps.auth.signUpWithPassword({ name: parsed.name.trim(), email, password: parsed.password });
  }

  const user = await deps.auth.findUserByEmail(email);
  if (!user) {
    throw new AppError("INTERNAL_ERROR");
  }

  await deps.auth.sendVerificationOtp(email);
  await ensureOwnerOrganization(
    deps.orgs,
    { userId: user.id, organizationName: parsed.organization },
    { generateId: deps.generateId, randomSuffix: deps.randomSuffix },
  );

  deps.events.log("registration_completed", { userId: user.id });
  return { email };
};

export { registerUser };
export type { RegisterUserDeps, RegisterUserResult };
