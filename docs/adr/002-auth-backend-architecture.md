# ADR 002: Production Authentication & Database Foundation

## Title

Better Auth + PostgreSQL + Prisma 7 + Resend as the production auth and
database foundation, behind Clean Architecture boundaries.

## Status

Accepted. Implements the auth/database foundation phase. Supersedes
nothing; builds on ADR 001 (Zod schemas remain the canonical input
contracts, reused server-side).

## Context

- Auth UI is presentation-only: four forms validate with canonical Zod
  schemas client-side and transition screens in memory. No server code,
  no database, no email, no sessions exist (`src/` has zero references
  to better-auth/prisma/resend).
- `rules/DATABASE_AUTH_RULES.md` mandates Better Auth and PostgreSQL;
  `rules/ARCHITECTURE_RULES.md` mandates feature layering
  (`domain` / `data` / `presentation` / `infrastructure`) with
  `domain` free of React/Next/ORM/provider imports.
- `rules/API_RULES.md` requires the canonical
  `{success,data,meta}` / `{success:false,error:{code,message}}`
  envelope, thin route handlers, and server-side authorization.
- Registration collects `organization`; it must seed multi-tenancy
  (`User → Membership → Organization`) without building full RBAC now.
- No PostgreSQL credentials are available in this environment yet, so
  migrations must be reviewable as SQL and applicable later with
  `prisma migrate deploy`; automated tests must stay deterministic and
  database-free (TESTING_RULES.md).

## Decision

1. **Versions (pinned, verified against the registry):**
   `better-auth@1.7.5`, `@prisma/client@7.10.0`, `prisma@7.10.0` (dev),
   `resend@6.28.1`. Prisma 8 is rejected (release-candidate line only).
   One canonical Better Auth instance in
   `src/features/auth/infrastructure/auth/auth.ts`; the Prisma adapter
   comes from `better-auth/adapters/prisma`
   (`@better-auth/prisma-adapter`), never hand-rolled persistence for
   Better Auth tables.
2. **Prisma schema** (`prisma/schema.prisma`, `prisma.config.ts` at root)
   mirrors the installed Better Auth core models exactly
   (`User`, `Account`, `Session`, `Verification` per
   `@better-auth/core/dist/db/schema/*`) plus the organization plugin
   models (`Organization`, `Member`, `Invitation`), with explicit
   uniqueness (`User.email`, `Organization.slug`), foreign keys with
   `onDelete: Cascade`, and indexes for session/account/verification
   lookups. Migrations use `prisma migrate dev` locally and
   `prisma migrate deploy` in production — never `db push`.
3. **Email/OTP over Better Auth primitives, not custom crypto:**
   the `emailOTP` plugin owns the 6-digit code lifecycle
   (`otpLength: 6`, `expiresIn: 600`, `allowedAttempts: 5`,
   `storeOTP: "hashed"`, `resendStrategy: "rotate"`,
   `sendVerificationOnSignUp: true`, plugin `rateLimit {window: 60,
   max: 3}`); core `emailAndPassword` owns credentials
   (`requireEmailVerification: true`, `minPasswordLength: 8`,
   `sendResetPassword`, `resetPasswordTokenExpiresIn: 3600`,
   `revokeSessionsOnPasswordReset: true`); the `organization` plugin
   owns future OAuth-ready membership shape (`creatorRole: "owner"`).
   Password hashing stays Better Auth's default (scrypt).
4. **Registration creates the tenant immediately** (documented
   intentional state): the `register` server action signs the user up
   via `auth.api`, sends the OTP, and provisions
   `Organization + owner Member` idempotently through a real
   `OrganizationRepository` contract (`domain/repositories`) with a
   Prisma implementation (`data/repositories`) inside a transaction.
   No session can exist before verification
   (`requireEmailVerification`), so pending tenants have no access
   path. Duplicate registration returns a generic success while
   re-sending OTP only for unverified accounts (verified accounts get
   a sign-in reminder via `onExistingUserSignUp`) — no enumeration.
5. **Transport:** Better Auth owns `POST/GET /api/auth/[...all]`
   (`src/app/api/auth/[...all]/route.ts`, thin handler). App-specific
   orchestration lives in server actions
   (`src/features/auth/presentation/actions/`) that validate with the
   ADR-001 schemas, enforce rate limits, normalize errors, and forward
   session cookies via `nextCookies`. No duplicate `/api/auth/*`
   endpoints, no client-side Prisma/Resend/secrets.
6. **Resend sits behind `EmailService`** (`src/shared/infrastructure/
   email/`): the interface plus branded template are testable without
   the vendor SDK; only the adapter imports `resend`.
7. **Route protection** in `src/proxy.ts` (Next 16 convention):
   `/dashboard/**` requires a verified session; `/auth` redirects
   authenticated users away. A minimal `/dashboard` page is the
   post-auth landing (not an accounting feature).
8. **Rate limiting is two-layer:** Better Auth's built-in limiter
   guards its own routes; custom server actions use a
   `RateLimiter` port with an in-memory implementation that is
   explicitly documented as single-instance only — production must
   back it (and Better Auth `secondaryStorage`) with shared storage.
9. **Config centralization:** `src/config/env.ts` validates
   `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `RESEND_API_KEY`, `RESEND_FROM_EMAIL` once; `.env.example` carries
   placeholders only.

## Consequences

- Auth framework details stay in `infrastructure/`; domain keeps
  contracts and use-cases; presentation keeps forms and actions.
- Tests stay deterministic: unit tests cover env, errors, rate
  limiter, normalization, templates, and auth policy constants — no
  live PostgreSQL or Resend required.
- Production requires: real `DATABASE_URL`, `migrate deploy`,
  shared rate-limit/session storage, and a verified Resend sender.

## Alternatives

- Custom OTP/password/token code: rejected — duplicates audited
  Better Auth behavior and invites crypto mistakes.
- Organization creation after verification with a pending table:
  rejected — extra state machine with a stranded-user failure mode
  (verified but tenantless with no recoverable org name).
- Route Handlers per form instead of server actions: rejected —
  actions preserve the existing `FormData` + `safeParse` form pattern
  with less transport code; Better Auth still owns its routes.
