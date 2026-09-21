import { describe, expect, it } from "vitest";

import { LoginSchema } from "./login.schema";

const validLogin = {
  email: "user@example.com",
  password: "password",
};

describe("LoginSchema", () => {
  it("accepts a valid email and password", () => {
    expect(LoginSchema.safeParse(validLogin).success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = LoginSchema.safeParse({ password: "password" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an empty email", () => {
    const result = LoginSchema.safeParse({ ...validLogin, email: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = LoginSchema.safeParse({
      ...validLogin,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a missing password", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects an empty password", () => {
    const result = LoginSchema.safeParse({ ...validLogin, password: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });
});
