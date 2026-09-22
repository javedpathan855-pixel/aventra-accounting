// Login use case (domain layer).
//
// Generic credential failures by design: wrong email, wrong password,
// and missing credential account are indistinguishable to callers.
// Unverified accounts get a distinct, safe signal so the UI can route
// to verification (the address already proved ownership of the inbox
// at registration). Membership is checked, never created here —
// tenant bootstrap belongs to registration/verification.

import type { RateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import { AppError } from "@/shared/errors/app-error";

import { normalizeEmail } from "../services/auth-helpers";
import { AUTH_LIMITS } from "../services/auth-limits";
import { parseOrThrow } from "../services/validation";
import { LoginSchema } from "../schemas/login.schema";
import type { AuthProvider, SecurityEventSink } from "../repositories/auth-provider";
import type { OrganizationRepository } from "../repositories/organization-repository";

interface LoginUserDeps {
  auth: AuthProvider;
  orgs: OrganizationRepository;
  limits: RateLimiter;
  events: SecurityEventSink;
  clientIp: string;
}

type LoginUserResult =
  | { status: "authenticated"; redirectTo: string }
  | { status: "verification-required"; email: string };

const loginUser = async (input: unknown, deps: LoginUserDeps): Promise<LoginUserResult> => {
  const parsed = parseOrThrow(LoginSchema, input);
  const email = normalizeEmail(parsed.email);

  const limit = await deps.limits.check(
    `login:ip:${deps.clientIp}:${email}`,
    AUTH_LIMITS.login.max,
    AUTH_LIMITS.login.windowMs,
  );
  if (!limit.allowed) {
    throw new AppError("RATE_LIMITED");
  }

  let user;
  try {
    user = await deps.auth.signInWithPassword({ email, password: parsed.password });
  } catch (error) {
    if (error instanceof AppError && error.code === "EMAIL_NOT_VERIFIED") {
      deps.events.log("login_failed", { emailDomain: email.split("@")[1], reason: "unverified" });
      return { status: "verification-required", email };
    }
    deps.events.log("login_failed", { emailDomain: email.split("@")[1] });
    throw error;
  }

  const membership = await deps.orgs.findMembershipByUserId(user.id);
  if (!membership) {
    // Registration never completed tenant bootstrap — fail safe, never
    // invent tenant data at login.
    deps.events.log("login_failed", { userId: user.id, reason: "missing-membership" });
    await deps.auth.signOut();
    throw new AppError("FORBIDDEN", {
      message: "Your account setup is incomplete. Please try registering again.",
    });
  }

  deps.events.log("login_succeeded", { userId: user.id });
  return { status: "authenticated", redirectTo: "/dashboard" };
};

export { loginUser };
export type { LoginUserDeps, LoginUserResult };
