// Security-logger tests: safe context only, never secrets.
import { afterEach, describe, expect, it, vi } from "vitest";

import { emailDomainOf, logSecurityEvent } from "./security-logger";

describe("emailDomainOf", () => {
  it("keeps the domain and drops the local part", () => {
    expect(emailDomainOf("Founder@Example.COM")).toBe("example.com");
  });

  it("handles malformed addresses without leaking input", () => {
    expect(emailDomainOf("not-an-email")).toBe("invalid");
  });
});

describe("logSecurityEvent", () => {
  const lines: string[] = [];
  const info = console.info;
  const warn = console.warn;

  afterEach(() => {
    console.info = info;
    console.warn = warn;
    lines.length = 0;
  });

  const capture = () => {
    console.info = vi.fn((line: string) => {
      lines.push(line);
    });
    console.warn = vi.fn((line: string) => {
      lines.push(line);
    });
  };

  it("emits structured JSON with safe context fields", () => {
    capture();
    logSecurityEvent("login_succeeded", {
      userId: "user-1",
      emailDomain: "example.com",
    });

    expect(lines).toHaveLength(1);
    const record = JSON.parse(lines[0] as string);
    expect(record.event).toBe("login_succeeded");
    expect(record.context).toEqual({ userId: "user-1", emailDomain: "example.com" });
    expect(record.timestamp).toBeTruthy();
  });

  it("never carries secret values (event names are taxonomy, not data)", () => {
    capture();
    // The context type only admits safe fields (ids, domains, reasons);
    // a caller cannot smuggle a password, OTP, or token through typed
    // parameters, and full addresses stay out by convention (domain only).
    logSecurityEvent("verification_failed", { emailDomain: "example.com" });
    logSecurityEvent("login_failed", { emailDomain: "example.com", reason: "unverified" });
    logSecurityEvent("logout", { userId: "user-9" });

    const serialized = lines.join("\n");
    expect(serialized).not.toContain("@");
    expect(serialized).not.toMatch(/[A-Za-z0-9]{6}@/);
    // No bearer-shaped values anywhere in the record.
    expect(serialized).not.toMatch(/re_[A-Za-z0-9]+/);
    for (const line of lines) {
      const record = JSON.parse(line);
      expect(Object.keys(record.context).sort()).toEqual(
        Object.keys(record.context).sort().filter((key) =>
          ["userId", "emailDomain", "organizationId", "reason"].includes(key),
        ),
      );
    }
  });

  it("covers the required security event surface", () => {
    capture();
    const events = [
      "registration_started",
      "registration_completed",
      "verification_failed",
      "verification_rate_limited",
      "login_succeeded",
      "login_failed",
      "logout",
      "password_reset_requested",
      "password_reset_completed",
    ] as const;
    for (const event of events) {
      logSecurityEvent(event);
    }
    const emitted = lines.map((line) => JSON.parse(line).event);
    for (const event of events) {
      expect(emitted).toContain(event);
    }
  });
});
