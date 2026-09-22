// Sliding-window rate limiter port with an in-memory adapter.
//
// The interface is the production seam: server actions depend on
// `RateLimiter`, never on the implementation. The in-memory adapter is
// correct for a single instance only — serverless/multi-instance
// production deployments MUST provide shared storage (e.g. Redis via
// Better Auth secondaryStorage or equivalent) and this file documents
// that requirement at the decision point. See ADR 003.

interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

interface RateLimiter {
  /**
   * Record one attempt for `key` (e.g. `login:ip:1.2.3.4`) and report
   * whether it fits within `max` attempts per `windowMs`.
   */
  check(key: string, max: number, windowMs: number): Promise<RateLimitDecision>;
  /** Test/maintenance seam: drop tracked state for `key`. */
  reset(key: string): Promise<void>;
}

type Clock = () => number;

/** Create the single-instance in-memory limiter. Not for multi-instance prod. */
const createInMemoryRateLimiter = (clock: Clock = Date.now): RateLimiter => {
  const hits = new Map<string, number[]>();

  return {
    check: async (key, max, windowMs) => {
      const now = clock();
      const cutoff = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((at) => at > cutoff);

      if (recent.length >= max) {
        const oldest = recent[0] ?? now;
        hits.set(key, recent);
        return { allowed: false, remaining: 0, retryAfterMs: oldest + windowMs - now };
      }

      recent.push(now);
      hits.set(key, recent);
      return { allowed: true, remaining: max - recent.length, retryAfterMs: 0 };
    },
    reset: async (key) => {
      hits.delete(key);
    },
  };
};

/** Singleton for the running instance. Replace with shared storage in prod. */
let shared: RateLimiter | null = null;

const getRateLimiter = (): RateLimiter => {
  shared ??= createInMemoryRateLimiter();
  return shared;
};

export { createInMemoryRateLimiter, getRateLimiter };
export type { Clock, RateLimitDecision, RateLimiter };
