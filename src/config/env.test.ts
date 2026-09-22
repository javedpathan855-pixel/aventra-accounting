import { describe, expect, it } from "vitest";

import { getEnv, resetEnvCache } from "./env";

const validSource = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:password@localhost:5432/aventra_accounting",
  BETTER_AUTH_URL: "http://localhost:1988",
  BETTER_AUTH_SECRET: "a".repeat(32),
  RESEND_API_KEY: "re_test_key",
  RESEND_FROM_EMAIL: "Aventra <no-reply@aventra.app>",
};

const sourceWith = (overrides: Record<string, string | undefined>) =>
  ({ ...validSource, ...overrides }) as unknown as NodeJS.ProcessEnv;

describe("getEnv", () => {
  it("returns validated configuration when every variable is present", () => {
    resetEnvCache();
    const env = getEnv(sourceWith({}));

    expect(env.DATABASE_URL).toContain("postgresql://");
    expect(env.BETTER_AUTH_URL).toBe("http://localhost:1988");
    expect(env.RESEND_FROM_EMAIL).toBe("Aventra <no-reply@aventra.app>");
  });

  it("rejects a missing secret without echoing any secret value", () => {
    resetEnvCache();

    expect(() =>
      getEnv(sourceWith({ BETTER_AUTH_SECRET: undefined })),
    ).toThrow(/BETTER_AUTH_SECRET/);
  });

  it("rejects a short secret", () => {
    resetEnvCache();

    expect(() =>
      getEnv(sourceWith({ BETTER_AUTH_SECRET: "too-short" })),
    ).toThrow(/BETTER_AUTH_SECRET/);
  });

  it("rejects a non-URL auth origin", () => {
    resetEnvCache();

    expect(() =>
      getEnv(sourceWith({ BETTER_AUTH_URL: "not-a-url" })),
    ).toThrow(/BETTER_AUTH_URL/);
  });

  it("names the missing variable without leaking values", () => {
    resetEnvCache();

    try {
      getEnv(sourceWith({ RESEND_API_KEY: "" }));
      expect.unreachable("expected getEnv to throw");
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toMatch(/RESEND_API_KEY/);
      expect(message).not.toContain("re_test_key");
    }
  });
});
