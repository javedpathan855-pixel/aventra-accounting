import { describe, expect, it } from "vitest";

import {
  buildExistingAccountNotice,
  buildPasswordResetEmail,
  buildVerificationEmail,
} from "./auth-email-templates";

describe("verification email template", () => {
  it("includes branding, the OTP, and the expiry notice", () => {
    const email = buildVerificationEmail({ to: "user@example.com", otp: "482913", expiresInMinutes: 10 });

    expect(email.subject).toMatch(/verify/i);
    expect(email.html).toContain("Aventra");
    expect(email.html).toContain("482913");
    expect(email.html).toContain("10 minutes");
    expect(email.html).toContain("only once");
    expect(email.text).toContain("482913");
  });

  it("carries a security notice and no internal details", () => {
    const email = buildVerificationEmail({ to: "user@example.com", otp: "482913", expiresInMinutes: 10 });

    expect(email.html.toLowerCase()).toContain("never share");
    expect(email.html).not.toMatch(/postgres|prisma|userId|session/i);
  });
});

describe("password reset email template", () => {
  it("includes the reset link and a single-use expiry notice", () => {
    const email = buildPasswordResetEmail({
      to: "user@example.com",
      userName: "Rahul",
      resetUrl: "https://app.example/reset?token=abc",
      expiresInMinutes: 60,
    });

    expect(email.html).toContain("https://app.example/reset?token=abc");
    expect(email.html).toContain("60 minutes");
    expect(email.text).toContain("https://app.example/reset?token=abc");
  });
});

describe("existing account notice", () => {
  it("is generic and points at sign-in", () => {
    const email = buildExistingAccountNotice();

    expect(email.html).toMatch(/already exists/);
    expect(email.html).toMatch(/sign in/);
  });
});
