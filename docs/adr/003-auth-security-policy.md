# ADR 003: Authentication Security Policy

## Title

Minimum password rule, OTP lifecycle, session/cookie posture, and
rate-limit strategy for the auth foundation.

## Status

Accepted. Companion to ADR 002; resolves the password policy left
PENDING in ADR 001.

## Context

- ADR 001 deferred password complexity as a product/security decision;
  the register schema enforces required + non-empty only.
- Better Auth 1.7.5 already enforces `minPasswordLength: 8` by default
  (NIST SP 800-63B §5.1.1.2 memorized-secret minimum), but the client
  schema does not reflect it, so UX and server would disagree.
- A 6-digit OTP has a ~10⁶ search space and needs attempt limits,
  short expiry, single use, and resend discipline.
- No rate-limiting or session infrastructure exists yet.

## Decision

1. **Password policy (minimum, explicit):** at least 8 characters,
   enforced in exactly one place — `RegisterSchema` gains
   `.min(8, "Password must be at least 8 characters")` and the Better
   Auth config sets `minPasswordLength: 8` explicitly. No character-
   class rules (NIST advises against composition rules; length is the
   control). Client and server share the schema, so they cannot drift.
2. **OTP lifecycle (emailOTP plugin, verified against installed 1.7.5
   types):** exactly 6 numeric digits from the plugin's secure
   generator; 10-minute expiry (`expiresIn: 600`); max 5 verification
   attempts then the code is destroyed (`allowedAttempts: 5`);
   hashed at rest (`storeOTP: "hashed"`); resend rotates
   (`resendStrategy: "rotate"` — only the newest code verifies);
   plugin endpoints rate-limited (`{window: 60, max: 3}`).
   Verification is server-side only; OTPs never appear in logs,
   responses, or client state beyond the typed digits.
3. **Sessions:** 7-day expiry with daily refresh (explicit
   `expiresIn`/`updateAge`, the Better Auth defaults made visible);
   HttpOnly + `SameSite=Lax` + `Secure` in production via Better Auth
   cookie defaults (`useSecureCookies` auto); password reset revokes
   all sessions (`revokeSessionsOnPasswordReset: true`); logout
   invalidates server-side through Better Auth sign-out.
4. **Rate limiting:** Better Auth's limiter on its own routes
   (`{enabled, window: 60, max: 100}` plus stricter custom rules for
   sign-in/sign-up/OTP endpoints); a `RateLimiter` port guards custom
   server actions (login/register/OTP/resend/forgot/reset) with an
   in-memory sliding-window adapter that is documented single-instance
   only. Production must configure shared storage (Better Auth
   `secondaryStorage`, e.g. Redis/Upstash) — tracked as a deployment
   prerequisite, not silently assumed.
5. **Error posture:** generic authentication messages
   (`INVALID_CREDENTIALS`, `VERIFICATION_FAILED`, `RATE_LIMITED`,
   ...); no account-enumeration signals; Prisma/Resend/Better Auth
   internals mapped to stable codes via one normalizer; security
   events logged structurally without passwords, OTPs, tokens, or
   secrets.

## Consequences

- `register.schema.test.ts` gains min-length cases; policy tests
  assert the live Better Auth options match this ADR.
- Stricter policies (MFA, breach-corporate checks, shorter sessions)
  remain future work and must arrive as new ADRs.

## Alternatives

- 12+ character minimum or character classes: rejected — friction
  without proportionate gain at this phase; revisit with breach-data
  (e.g. haveibeenpwned plugin) later.
- Custom in-house OTP store: rejected per ADR 002 (duplicates the
  plugin's hashed, attempt-limited, rotating implementation).
