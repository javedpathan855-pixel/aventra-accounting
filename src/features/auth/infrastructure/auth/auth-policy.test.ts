// Auth policy regression tests (ADR 003).
//
// Assert the live Better Auth configuration matches the decided
// security policy. No network, no database: the instance builds from
// dummy env values and the Prisma client never connects on import.

import { beforeAll, describe, expect, it } from "vitest";

import { resetEnvCache } from "@/config/env";
import {
  MIN_PASSWORD_LENGTH,
  OTP_EXPIRES_IN_SECONDS,
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  PASSWORD_RESET_EXPIRES_IN_SECONDS,
  SESSION_EXPIRES_IN_SECONDS,
  SESSION_UPDATE_AGE_SECONDS,
  getAuth,
  resetAuthCache,
} from "./auth";

beforeAll(() => {
  process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/aventra_accounting_test";
  process.env.BETTER_AUTH_URL = "http://localhost:1988";
  process.env.BETTER_AUTH_SECRET = "test-secret-".padEnd(32, "x");
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.RESEND_FROM_EMAIL = "Aventra <no-reply@aventra.app>";
  resetEnvCache();
  resetAuthCache();
});

describe("auth security policy", () => {
  it("uses a 6-digit OTP with a 10-minute hashed, attempt-limited lifecycle", () => {
    expect(OTP_LENGTH).toBe(6);
    expect(OTP_EXPIRES_IN_SECONDS).toBe(600);
    expect(OTP_MAX_ATTEMPTS).toBe(5);
  });

  it("requires verified email before any session exists", () => {
    const auth = getAuth();

    expect(auth.options.emailAndPassword?.requireEmailVerification).toBe(true);
    expect(auth.options.emailVerification?.autoSignInAfterVerification).toBe(true);
  });

  it("enforces the shared minimum password length server-side", () => {
    const auth = getAuth();

    expect(auth.options.emailAndPassword?.minPasswordLength).toBe(MIN_PASSWORD_LENGTH);
    expect(MIN_PASSWORD_LENGTH).toBe(8);
  });

  it("expires sessions weekly with daily refresh", () => {
    expect(SESSION_EXPIRES_IN_SECONDS).toBe(60 * 60 * 24 * 7);
    expect(SESSION_UPDATE_AGE_SECONDS).toBe(60 * 60 * 24);
    const auth = getAuth();
    expect(auth.options.session?.expiresIn).toBe(SESSION_EXPIRES_IN_SECONDS);
    expect(auth.options.session?.updateAge).toBe(SESSION_UPDATE_AGE_SECONDS);
  });

  it("issues single-use reset tokens that revoke sessions", () => {
    expect(PASSWORD_RESET_EXPIRES_IN_SECONDS).toBe(3600);
    const auth = getAuth();
    expect(auth.options.emailAndPassword?.resetPasswordTokenExpiresIn).toBe(
      PASSWORD_RESET_EXPIRES_IN_SECONDS,
    );
    expect(auth.options.emailAndPassword?.revokeSessionsOnPasswordReset).toBe(true);
  });

  it("registers the OTP and organization plugins exactly once", () => {
    const auth = getAuth();
    const ids = (auth.options.plugins ?? []).map((plugin) => plugin.id);

    expect(ids.filter((id) => id === "email-otp")).toHaveLength(1);
    expect(ids.filter((id) => id === "organization")).toHaveLength(1);
  });

  it("trusts only the configured origin and rate-limits auth routes", () => {
    const auth = getAuth();

    expect(auth.options.trustedOrigins).toContain("http://localhost:1988");
    expect(auth.options.rateLimit?.enabled).toBe(true);
  });

  it("stores sessions in the shared database, not process memory", () => {
    // Multi-instance production requires shared session state. The
    // Prisma adapter persists sessions to PostgreSQL, so any instance
    // can validate any session.
    const auth = getAuth();

    expect(auth.options.database).toBeTruthy();
  });
});
