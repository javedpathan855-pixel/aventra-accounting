// Server-side rate-limit budget for business-profile writes.
//
// Applies per user at the use-case boundary, in front of any provider
// limiter. The profile form autosaves nothing; this budget only bounds
// deliberate Save Changes submissions.

interface LimitBudget {
  max: number;
  windowMs: number;
}

const MINUTE_MS = 60_000;

const BUSINESS_PROFILE_LIMITS = {
  /** Profile updates per user: 30 per minute. */
  update: { max: 30, windowMs: MINUTE_MS } satisfies LimitBudget,
};

export { BUSINESS_PROFILE_LIMITS };
export type { LimitBudget };
