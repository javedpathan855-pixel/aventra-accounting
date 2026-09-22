// PostgreSQL-backed sliding-window rate limiter.
//
// Production implementation of the `RateLimiter` domain contract, safe
// for multi-instance deployments: every instance counts from the same
// `rate_limit_hit` ledger instead of process memory. Same semantics as
// the in-memory adapter (max attempts per rolling window); rows outside
// the longest active window are pruned lazily on each check, so no
// background job is required.
//
// Selection lives in `getProductionRateLimiter` below: development and
// unit tests keep the dependency-free in-memory adapter, while
// production sets RATE_LIMIT_STORAGE=database.

import { getPrisma } from "@/shared/infrastructure/db/prisma";

import { createInMemoryRateLimiter, type RateLimiter } from "./rate-limiter";

type PrismaClient = ReturnType<typeof getPrisma>;
type Clock = () => number;

/**
 * Sliding-window limiter over the shared ledger. Prune + count + insert
 * run in one transaction so concurrent instances observe a consistent
 * window.
 */
const createDatabaseRateLimiter = (
  prisma: PrismaClient,
  clock: Clock = Date.now,
): RateLimiter => {
  return {
    check: async (key, max, windowMs) => {
      const cutoff = new Date(clock() - windowMs);

      const decision = await prisma.$transaction(async (tx) => {
        await tx.rateLimitHit.deleteMany({
          where: { key, createdAt: { lte: cutoff } },
        });
        const recent = await tx.rateLimitHit.count({ where: { key } });
        if (recent >= max) {
          const oldest = await tx.rateLimitHit.findFirst({
            where: { key },
            orderBy: { createdAt: "asc" },
            select: { createdAt: true },
          });
          const retryAfterMs = oldest
            ? Math.max(0, oldest.createdAt.getTime() + windowMs - clock())
            : windowMs;
          return { allowed: false, remaining: 0, retryAfterMs };
        }
        await tx.rateLimitHit.create({ data: { key } });
        return { allowed: true, remaining: max - recent - 1, retryAfterMs: 0 };
      });

      return decision;
    },
    reset: async (key) => {
      await prisma.rateLimitHit.deleteMany({ where: { key } });
    },
  };
};

let shared: RateLimiter | null = null;

/**
 * Production selector behind the RateLimiter port. `database` uses the
 * shared PostgreSQL ledger (multi-instance safe); anything else keeps
 * the single-instance in-memory adapter for development and tests.
 */
const getProductionRateLimiter = (): RateLimiter => {
  if (shared) {
    return shared;
  }
  if (process.env.RATE_LIMIT_STORAGE === "database") {
    shared = createDatabaseRateLimiter(getPrisma());
    return shared;
  }
  shared = createInMemoryRateLimiter();
  return shared;
};

/** Test seam: drop the cached production limiter between tests. */
const resetProductionRateLimiterCache = (): void => {
  shared = null;
};

export {
  createDatabaseRateLimiter,
  getProductionRateLimiter,
  resetProductionRateLimiterCache,
};
