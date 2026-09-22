import { describe, expect, it } from "vitest";

import { OtpSchema } from "./otp.schema";

describe("OtpSchema", () => {
  it("accepts a valid six-digit code", () => {
    expect(OtpSchema.safeParse("123456").success).toBe(true);
  });

  it("accepts leading zeroes because the code is a string, not a number", () => {
    expect(OtpSchema.safeParse("000000").success).toBe(true);
  });

  it("rejects an incomplete five-digit code", () => {
    expect(OtpSchema.safeParse("12345").success).toBe(false);
  });

  it("rejects a seven-digit code", () => {
    expect(OtpSchema.safeParse("1234567").success).toBe(false);
  });

  it("rejects alphabetic characters", () => {
    expect(OtpSchema.safeParse("abcdef").success).toBe(false);
  });

  it("rejects mixed alphanumeric characters", () => {
    expect(OtpSchema.safeParse("12345a").success).toBe(false);
  });

  it("rejects an empty code", () => {
    expect(OtpSchema.safeParse("").success).toBe(false);
  });
});
