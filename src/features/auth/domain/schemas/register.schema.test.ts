import { describe, expect, it } from "vitest";

import { RegisterSchema } from "./register.schema";

const validRegistration = {
  name: "Rahul Kumar",
  organization: "Nextgen Services",
  email: "user@example.com",
  password: "password",
  confirmPassword: "password",
  terms: true,
};

describe("RegisterSchema", () => {
  it("accepts a complete valid registration", () => {
    expect(RegisterSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      name: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects an empty or whitespace-only name", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      name: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects a missing organization", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      organization: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.organization).toBeDefined();
    }
  });

  it("rejects an empty organization", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      organization: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.organization).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a missing password", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      password: undefined,
      confirmPassword: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects an empty password", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      password: "",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects a missing confirmPassword", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      confirmPassword: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("associates a password mismatch with confirmPassword", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      confirmPassword: "different-password",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.confirmPassword).toBeDefined();
      expect(fieldErrors.password).toBeUndefined();
    }
  });

  it("rejects terms that are not accepted", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      terms: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.terms).toBeDefined();
    }
  });

  it("rejects passwords shorter than 8 characters (ADR 003)", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      password: "short1",
      confirmPassword: "short1",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toEqual([
        "Password must be at least 8 characters",
      ]);
    }
  });

  it("accepts an 8-character password at the policy boundary", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      password: "abcd1234",
      confirmPassword: "abcd1234",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing terms acceptance", () => {
    const result = RegisterSchema.safeParse({
      ...validRegistration,
      terms: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.terms).toBeDefined();
    }
  });
});
