import { describe, expect, it } from "vitest";

import { createInMemoryRateLimiter } from "./rate-limiter";

describe("in-memory rate limiter", () => {
  it("allows attempts within the budget and reports the remainder", async () => {
    const now = 0;
    const limiter = createInMemoryRateLimiter(() => now);

    const first = await limiter.check("login:1.2.3.4", 3, 60_000);
    expect(first).toEqual({ allowed: true, remaining: 2, retryAfterMs: 0 });

    const second = await limiter.check("login:1.2.3.4", 3, 60_000);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);
  });

  it("blocks past the budget and reports retry delay", async () => {
    const now = 0;
    const limiter = createInMemoryRateLimiter(() => now);

    await limiter.check("otp:a@b.c", 2, 60_000);
    await limiter.check("otp:a@b.c", 2, 60_000);
    const blocked = await limiter.check("otp:a@b.c", 2, 60_000);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBe(60_000);
  });

  it("slides the window so old attempts expire", async () => {
    let now = 0;
    const limiter = createInMemoryRateLimiter(() => now);

    await limiter.check("resend:x", 1, 60_000);
    expect((await limiter.check("resend:x", 1, 60_000)).allowed).toBe(false);

    now += 60_001;
    const after = await limiter.check("resend:x", 1, 60_000);
    expect(after.allowed).toBe(true);
  });

  it("isolates budgets per key", async () => {
    const now = 0;
    const limiter = createInMemoryRateLimiter(() => now);

    await limiter.check("login:a", 1, 60_000);
    expect((await limiter.check("login:a", 1, 60_000)).allowed).toBe(false);
    expect((await limiter.check("login:b", 1, 60_000)).allowed).toBe(true);
  });

  it("reset clears a key without touching others", async () => {
    const now = 0;
    const limiter = createInMemoryRateLimiter(() => now);

    await limiter.check("k1", 1, 60_000);
    await limiter.check("k2", 1, 60_000);
    await limiter.reset("k1");

    expect((await limiter.check("k1", 1, 60_000)).allowed).toBe(true);
    expect((await limiter.check("k2", 1, 60_000)).allowed).toBe(false);
  });
});
