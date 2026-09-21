import { describe, expect, it } from "vitest";

import { ForgotPasswordSchema } from "./forgot-password.schema";

describe("ForgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      ForgotPasswordSchema.safeParse({ email: "user@example.com" }).success,
    ).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = ForgotPasswordSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an empty email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "not-an-email" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });
});
