import { describe, expect, it } from "vitest";

import {
  AppError,
  fromPrismaError,
  fromProviderError,
  normalizeError,
  toErrorEnvelope,
  toSuccessEnvelope,
} from "./app-error";

describe("AppError", () => {
  it("carries a stable code, status, and safe default message", () => {
    const error = new AppError("INVALID_CREDENTIALS");

    expect(error.code).toBe("INVALID_CREDENTIALS");
    expect(error.status).toBe(401);
    expect(error.message).toBe("The email or password you entered is incorrect.");
  });

  it("never leaks foreign messages by default", () => {
    const envelope = toErrorEnvelope(
      new AppError("INTERNAL_ERROR", { cause: new Error("SELECT * FROM user") }),
    );

    expect(envelope.status).toBe(500);
    expect(envelope.body.success).toBe(false);
    expect(envelope.body.error.code).toBe("INTERNAL_ERROR");
    expect(envelope.body.error.message).not.toContain("SELECT");
  });
});

describe("fromProviderError", () => {
  it("collapses credential failures into a generic error", () => {
    for (const code of ["INVALID_EMAIL_OR_PASSWORD", "CREDENTIAL_ACCOUNT_NOT_FOUND"]) {
      const mapped = fromProviderError({ body: { code } });
      expect(mapped?.code).toBe("INVALID_CREDENTIALS");
      expect(mapped?.status).toBe(401);
    }
  });

  it("maps OTP failures without revealing code state", () => {
    expect(fromProviderError({ body: { code: "INVALID_OTP" } })?.code).toBe(
      "VERIFICATION_FAILED",
    );
    expect(fromProviderError({ body: { code: "OTP_EXPIRED" } })?.code).toBe(
      "VERIFICATION_EXPIRED",
    );
    expect(fromProviderError({ body: { code: "TOO_MANY_ATTEMPTS" } })?.code).toBe(
      "VERIFICATION_ATTEMPTS_EXCEEDED",
    );
  });

  it("maps duplicate registration to conflict, not enumeration", () => {
    expect(
      fromProviderError({ body: { code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" } })?.code,
    ).toBe("CONFLICT");
  });

  it("returns null for unknown shapes", () => {
    expect(fromProviderError({ body: { code: "SOMETHING_NEW" } })).toBeNull();
    expect(fromProviderError(new Error("boom"))).toBeNull();
  });
});

describe("fromPrismaError", () => {
  it("maps unique violations to conflict", () => {
    expect(fromPrismaError({ code: "P2002" })?.code).toBe("CONFLICT");
  });

  it("maps connection failures to a retryable database error", () => {
    expect(fromPrismaError({ code: "P1001" })?.status).toBe(503);
  });

  it("hides raw database internals", () => {
    const envelope = toErrorEnvelope({
      code: "P2002",
      meta: { target: ["email"] },
      message: 'Unique constraint failed on the fields: ("email")',
    });

    expect(envelope.body.error.message).not.toContain("Unique constraint");
    expect(envelope.body.error.message).not.toContain("email");
  });
});

describe("normalizeError", () => {
  it("passes AppErrors through untouched", () => {
    const original = new AppError("RATE_LIMITED");
    expect(normalizeError(original)).toBe(original);
  });

  it("converts unknown failures to internal errors", () => {
    expect(normalizeError(new Error("sensitive stack")).code).toBe("INTERNAL_ERROR");
    expect(normalizeError("string failure").code).toBe("INTERNAL_ERROR");
    expect(normalizeError(null).code).toBe("INTERNAL_ERROR");
  });
});

describe("toSuccessEnvelope", () => {
  it("renders the canonical success shape", () => {
    expect(toSuccessEnvelope({ id: "1" })).toEqual({ success: true, data: { id: "1" } });
  });
});

describe("safe client errors", () => {
  it("never serializes stacks, connection strings, or provider internals", () => {
    const failure = new Error("connect postgresql://user:secret@db:5432/app");
    (failure as { code?: string }).code = "P1001";
    const envelope = toErrorEnvelope(failure);
    const serialized = JSON.stringify(envelope);

    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("secret@db");
    expect(serialized).not.toContain("at ");
    expect(envelope.body.error.code).toBe("DATABASE_ERROR");
    expect(envelope.body.error.message).toBe(
      "Something went wrong. Please try again in a moment.",
    );
  });

  it("keeps Better Auth internals out of the client envelope", () => {
    const envelope = toErrorEnvelope({
      body: { code: "FAILED_TO_CREATE_SESSION", message: "session adapter exploded" },
    });
    const serialized = JSON.stringify(envelope);

    expect(serialized).not.toContain("adapter");
    expect(envelope.body.error.code).toBe("INTERNAL_ERROR");
  });
});
