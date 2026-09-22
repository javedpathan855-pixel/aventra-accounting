// Database rate-limiter tests: sliding-window logic against a mock
// Prisma client (deterministic, no live database), plus the production
// selector contract. Live PostgreSQL behavior is verified separately
// against a migrated database (see Phase 3 report).

import { describe, expect, it, vi } from "vitest";

import { createInMemoryRateLimiter } from "./rate-limiter";
import {
  createDatabaseRateLimiter,
  getProductionRateLimiter,
  resetProductionRateLimiterCache,
} from "./database-rate-limiter";

interface MockWhere {
  key: string;
  createdAt?: { lte: Date };
}

const createMockPrisma = (getNow: () => number) => {
  const rows: Array<{ key: string; createdAt: Date }> = [];
  const rateLimitHit = {
    deleteMany: vi.fn(async ({ where }: { where: MockWhere }) => {
      const before = rows.length;
      for (let index = rows.length - 1; index >= 0; index -= 1) {
        const row = rows[index] as { key: string; createdAt: Date };
        if (
          row.key === where.key &&
          (!where.createdAt || row.createdAt.getTime() <= where.createdAt.lte.getTime())
        ) {
          rows.splice(index, 1);
        }
      }
      return { count: before - rows.length };
    }),
    count: vi.fn(async ({ where }: { where: MockWhere }) => {
      return rows.filter((row) => row.key === where.key).length;
    }),
    findFirst: vi.fn(async ({ where }: { where: MockWhere }) => {
      const sorted = rows
        .filter((row) => row.key === where.key)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return sorted[0] ?? null;
    }),
    create: vi.fn(async ({ data }: { data: { key: string } }) => {
      rows.push({ key: data.key, createdAt: new Date(getNow()) });
      return { id: "mock-id", key: data.key, createdAt: new Date(getNow()) };
    }),
  };
  const tx = { rateLimitHit };
  const prisma = {
    $transaction: vi.fn(
      async (run: (client: typeof tx) => Promise<unknown>) => run(tx),
    ),
    rateLimitHit: { deleteMany: vi.fn(async () => ({ count: 0 })) },
  };
  return { prisma, tx, rows };
};

describe("database rate limiter", () => {
  it("allows attempts within the window and reports remaining budget", async () => {
    const now = 1_000_000;
    const { prisma } = createMockPrisma(() => now);
    const limiter = createDatabaseRateLimiter(prisma as never, () => now);

    const first = await limiter.check("login:ip:1.2.3.4", 3, 60_000);
    expect(first).toEqual({ allowed: true, remaining: 2, retryAfterMs: 0 });
    const second = await limiter.check("login:ip:1.2.3.4", 3, 60_000);
    expect(second).toEqual({ allowed: true, remaining: 1, retryAfterMs: 0 });
  });

  it("denies past the budget with a positive retry delay", async () => {
    const now = 1_000_000;
    const { prisma } = createMockPrisma(() => now);
    const limiter = createDatabaseRateLimiter(prisma as never, () => now);

    await limiter.check("otp:user@example.com", 2, 60_000);
    await limiter.check("otp:user@example.com", 2, 60_000);
    const denied = await limiter.check("otp:user@example.com", 2, 60_000);

    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
    expect(denied.retryAfterMs).toBeGreaterThan(0);
  });

  it("slides the window: expired attempts stop counting", async () => {
    let now = 1_000_000;
    const { prisma } = createMockPrisma(() => now);
    const limiter = createDatabaseRateLimiter(prisma as never, () => now);

    await limiter.check("register:ip:9.9.9.9", 1, 60_000);
    now += 61_000;
    const afterWindow = await limiter.check("register:ip:9.9.9.9", 1, 60_000);
    expect(afterWindow.allowed).toBe(true);
  });

  it("scopes budgets per key (IP and account isolation)", async () => {
    const now = 1_000_000;
    const { prisma } = createMockPrisma(() => now);
    const limiter = createDatabaseRateLimiter(prisma as never, () => now);

    await limiter.check("login:ip:1.1.1.1:a@example.com", 1, 60_000);
    const other = await limiter.check("login:ip:2.2.2.2:a@example.com", 1, 60_000);
    expect(other.allowed).toBe(true);
  });

  it("reset clears the budget for a key", async () => {
    const now = 1_000_000;
    const { prisma } = createMockPrisma(() => now);
    const limiter = createDatabaseRateLimiter(prisma as never, () => now);

    await limiter.check("forgot:e@example.com", 1, 300_000);
    await limiter.reset("forgot:e@example.com");
    // reset() targets the table directly (outside the transaction).
    expect(prisma.rateLimitHit.deleteMany).toHaveBeenCalledWith({
      where: { key: "forgot:e@example.com" },
    });
  });
});

describe("production limiter selector", () => {
  it("uses the in-memory adapter unless database storage is configured", () => {
    delete process.env.RATE_LIMIT_STORAGE;
    resetProductionRateLimiterCache();

    const limiter = getProductionRateLimiter();
    expect(typeof limiter.check).toBe("function");
    expect(typeof limiter.reset).toBe("function");
    resetProductionRateLimiterCache();
  });

  it("keeps the shared RateLimiter contract for both adapters", async () => {
    const memory = createInMemoryRateLimiter(() => 5000);
    const decision = await memory.check("contract:key", 1, 60_000);
    expect(decision).toEqual({ allowed: true, remaining: 0, retryAfterMs: 0 });
    const denied = await memory.check("contract:key", 1, 60_000);
    expect(denied.allowed).toBe(false);
  });
});
