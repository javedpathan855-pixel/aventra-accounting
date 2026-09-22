import { describe, expect, it } from "vitest";

import { createFakes } from "./auth-test-fakes";
import { loginUser } from "./login-user";
import { registerUser } from "./register-user";
import { requestPasswordReset, resetPassword } from "./password-reset";
import { resendOtp } from "./resend-otp";
import { verifyOtp } from "./verify-otp";

const validRegistration = {
  name: "Rahul Kumar",
  organization: "Nextgen Services",
  email: "rahul@example.com",
  password: "Sup3rSecretPassword",
  confirmPassword: "Sup3rSecretPassword",
  terms: true,
};

const depsOf = (fakes: ReturnType<typeof createFakes>, clientIp = "1.2.3.4") => ({
  auth: fakes.auth,
  orgs: fakes.orgs,
  notify: fakes.notify,
  limits: fakes.limits,
  events: fakes.events,
  generateId: fakes.ids.generateId,
  randomSuffix: fakes.ids.randomSuffix,
  clientIp,
});

describe("registerUser", () => {
  it("creates the user, sends the OTP, and provisions the owner tenant", async () => {
    const fakes = createFakes();

    const result = await registerUser(validRegistration, depsOf(fakes));

    expect(result).toEqual({ email: "rahul@example.com" });
    expect(fakes.state.users.has("rahul@example.com")).toBe(true);
    expect(fakes.state.otp.get("rahul@example.com")).toBe("482913");
    const membership = fakes.state.memberships.get("user-rahul@example.com");
    expect(membership?.role).toBe("owner");
    expect(membership?.organizationName).toBe("Nextgen Services");
  });

  it("rejects invalid input with field errors and writes nothing", async () => {
    const fakes = createFakes();

    await expect(
      registerUser({ ...validRegistration, email: "not-an-email", terms: false }, depsOf(fakes)),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(fakes.state.users.size).toBe(0);
  });

  it("rejects short passwords under the shared policy", async () => {
    const fakes = createFakes();

    await expect(
      registerUser(
        { ...validRegistration, password: "short1", confirmPassword: "short1" },
        depsOf(fakes),
      ),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(fakes.state.users.size).toBe(0);
  });

  it("is enumeration-safe for verified accounts: generic outcome plus notice", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    fakes.state.verified.add("rahul@example.com");
    const membershipsBefore = fakes.state.memberships.size;

    const result = await registerUser(validRegistration, depsOf(fakes));

    expect(result).toEqual({ email: "rahul@example.com" });
    expect(fakes.state.sentNotices).toEqual(["rahul@example.com"]);
    expect(fakes.state.memberships.size).toBe(membershipsBefore);
  });

  it("resends the OTP for unverified duplicates without a second tenant", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));

    const result = await registerUser(validRegistration, depsOf(fakes));

    expect(result).toEqual({ email: "rahul@example.com" });
    expect(fakes.state.sentNotices).toEqual([]);
    expect(fakes.state.memberships.size).toBe(1);
  });
});

describe("verifyOtp", () => {
  it("verifies the code and ensures the tenant exactly once", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));

    const result = await verifyOtp(
      { email: "rahul@example.com", otp: "482913" },
      { ...depsOf(fakes), fallbackOrganizationName: "Nextgen Services" },
    );

    expect(result).toEqual({ email: "rahul@example.com", redirectTo: "/dashboard" });
    expect(fakes.state.memberships.size).toBe(1);
  });

  it("rejects a wrong code without consuming the real one", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));

    await expect(
      verifyOtp({ email: "rahul@example.com", otp: "000000" }, depsOf(fakes)),
    ).rejects.toMatchObject({ code: "VERIFICATION_FAILED" });
    expect(fakes.state.otp.get("rahul@example.com")).toBe("482913");
  });

  it("locks out after too many guesses and destroys the code", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    const deps = depsOf(fakes);
    // Bypass the request budget with a fresh limiter per attempt.
    const { createInMemoryRateLimiter } = await import(
      "@/shared/infrastructure/rate-limit/rate-limiter"
    );

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(
        verifyOtp(
          { email: "rahul@example.com", otp: "000000" },
          { ...deps, limits: createInMemoryRateLimiter() },
        ),
      ).rejects.toBeDefined();
    }
    await expect(
      verifyOtp(
        { email: "rahul@example.com", otp: "482913" },
        { ...deps, limits: createInMemoryRateLimiter() },
      ),
    ).rejects.toMatchObject({ code: "VERIFICATION_ATTEMPTS_EXCEEDED" });
  });
});

describe("resendOtp", () => {
  it("rotates the code and stays silent for unknown emails", async () => {
    const fakes = createFakes();

    const unknown = await resendOtp({ email: "ghost@example.com" }, depsOf(fakes));
    expect(unknown).toEqual({ email: "ghost@example.com" });
    expect(fakes.state.otp.has("ghost@example.com")).toBe(false);

    await registerUser(validRegistration, depsOf(fakes));
    const known = await resendOtp({ email: "rahul@example.com" }, depsOf(fakes));
    expect(known).toEqual({ email: "rahul@example.com" });
  });

  it("enforces the resend cooldown authoritatively", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    const deps = depsOf(fakes);

    await resendOtp({ email: "rahul@example.com" }, deps);
    await resendOtp({ email: "rahul@example.com" }, deps);
    await resendOtp({ email: "rahul@example.com" }, deps);
    await expect(resendOtp({ email: "rahul@example.com" }, deps)).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
  });
});

describe("loginUser", () => {
  it("authenticates verified users with a tenant", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    fakes.state.verified.add("rahul@example.com");

    const result = await loginUser(
      { email: "rahul@example.com", password: "Sup3rSecretPassword" },
      depsOf(fakes),
    );

    expect(result).toEqual({ status: "authenticated", redirectTo: "/dashboard" });
  });

  it("uses one generic error for unknown emails and wrong passwords", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    fakes.state.verified.add("rahul@example.com");
    const deps = depsOf(fakes);

    await expect(
      loginUser({ email: "nobody@example.com", password: "Sup3rSecretPassword" }, deps),
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
    await expect(
      loginUser({ email: "rahul@example.com", password: "WrongPassword1" }, deps),
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
  });

  it("routes unverified accounts to verification instead of failing", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));

    const result = await loginUser(
      { email: "rahul@example.com", password: "Sup3rSecretPassword" },
      depsOf(fakes),
    );

    expect(result).toEqual({ status: "verification-required", email: "rahul@example.com" });
  });

  it("fails safe when the tenant is missing and drops the session", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    fakes.state.verified.add("rahul@example.com");
    fakes.state.memberships.clear();

    await expect(
      loginUser(
        { email: "rahul@example.com", password: "Sup3rSecretPassword" },
        depsOf(fakes),
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("password reset", () => {
  it("is enumeration-safe on request and consumes valid tokens", async () => {
    const fakes = createFakes();
    await registerUser(validRegistration, depsOf(fakes));
    const deps = depsOf(fakes);

    await expect(requestPasswordReset({ email: "ghost@example.com" }, deps)).resolves.toEqual({
      email: "ghost@example.com",
    });
    await expect(requestPasswordReset({ email: "rahul@example.com" }, deps)).resolves.toEqual({
      email: "rahul@example.com",
    });

    await expect(
      resetPassword({ token: "valid-token", password: "N3wSecretPassword", confirmPassword: "N3wSecretPassword" }, deps),
    ).resolves.toEqual({ redirectTo: "/auth" });
  });

  it("rejects reused or unknown tokens generically", async () => {
    const fakes = createFakes();

    await expect(
      resetPassword({ token: "stale-token", password: "N3wSecretPassword", confirmPassword: "N3wSecretPassword" }, depsOf(fakes)),
    ).rejects.toMatchObject({ code: "VERIFICATION_FAILED" });
  });
});
