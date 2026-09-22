import { describe, expect, it } from "vitest";

import { authEmailField } from "./auth-email";

describe("authEmailField", () => {
  it("accepts a valid email address", () => {
    expect(authEmailField.safeParse("user@example.com").success).toBe(true);
  });

  it("rejects an empty string", () => {
    const result = authEmailField.safeParse("");

    expect(result.success).toBe(false);
  });

  it("rejects a malformed email without @", () => {
    const result = authEmailField.safeParse("not-an-email");

    expect(result.success).toBe(false);
  });

  it("rejects an email with a missing domain", () => {
    const result = authEmailField.safeParse("user@");

    expect(result.success).toBe(false);
  });

  it("rejects an email with a missing local part", () => {
    const result = authEmailField.safeParse("@example.com");

    expect(result.success).toBe(false);
  });

  it("rejects a non-string value", () => {
    expect(authEmailField.safeParse(undefined).success).toBe(false);
    expect(authEmailField.safeParse(null).success).toBe(false);
  });
});
