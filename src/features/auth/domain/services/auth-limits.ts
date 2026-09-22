// Server-side rate-limit budgets for auth use-cases (ADR 003).
//
// Budgets apply per key (caller IP and/or normalized email) at the
// use-case boundary, in front of Better Auth's own route limiter.
// The frontend countdown is UX only; these numbers are authoritative.

interface LimitBudget {
  max: number;
  windowMs: number;
}

const MINUTE_MS = 60_000;

const AUTH_LIMITS = {
  /** Registration attempts per IP: 10 per 5 minutes. */
  register: { max: 10, windowMs: 5 * MINUTE_MS } satisfies LimitBudget,
  /** OTP verifications per email: 10 per minute (plugin allows 5 guesses). */
  verifyOtp: { max: 10, windowMs: MINUTE_MS } satisfies LimitBudget,
  /** OTP resends per email: 3 per 5 minutes (cooldown is authoritative). */
  resendOtp: { max: 3, windowMs: 5 * MINUTE_MS } satisfies LimitBudget,
  /** Login attempts per IP+email: 10 per minute. */
  login: { max: 10, windowMs: MINUTE_MS } satisfies LimitBudget,
  /** Reset requests per email: 5 per 5 minutes. */
  forgotPassword: { max: 5, windowMs: 5 * MINUTE_MS } satisfies LimitBudget,
  /** Reset confirmations per IP: 10 per minute. */
  resetPassword: { max: 10, windowMs: MINUTE_MS } satisfies LimitBudget,
};

export { AUTH_LIMITS };
export type { LimitBudget };
