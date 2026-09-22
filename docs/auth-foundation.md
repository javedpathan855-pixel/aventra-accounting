# Aventra Accounting — Authentication & Database Foundation

Production auth foundation: Better Auth + PostgreSQL + Prisma 7 + Resend,
behind Clean Architecture boundaries. Decisions: `docs/adr/002-auth-backend-architecture.md`,
`docs/adr/003-auth-security-policy.md`.

## Prerequisites

- Node.js 22+, npm
- PostgreSQL 14+ (local EDB install, Docker, or managed)
- A Resend API key with a verified sender (`https://resend.com/api-keys`)

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values (never commit .env)
npx prisma generate
npx prisma migrate dev --name <change-name>
npm run dev            # http://localhost:1988
```

Required variables (see `.env.example`, validated once in `src/config/env.ts`):

```env
DATABASE_URL=            # postgresql://user:password@host:5432/aventra_accounting
BETTER_AUTH_URL=         # e.g. http://localhost:1988
BETTER_AUTH_SECRET=      # openssl rand -base64 32 (min 32 chars)
RESEND_API_KEY=          # server-only, never NEXT_PUBLIC_*
RESEND_FROM_EMAIL=       # verified sender, e.g. Aventra <no-reply@aventra.app>
```

## Flows

```text
Register (name, organization, email, password, terms)
  → server-validated, email normalized, rate-limited
  → user created unverified + 6-digit OTP emailed (hashed at rest)
  → Organization + owner Membership provisioned atomically (idempotent)
  → OTP screen → verify → session created → /dashboard
  Duplicate emails always get the same generic outcome (no enumeration);
  verified addresses receive a sign-in reminder instead of an OTP.

Login → session → /dashboard (unverified accounts route to OTP).
Logout → server-side invalidation → /auth.
Forgot password → generic response → single-use 1h reset link
  → reset revokes all sessions → sign in again.
```

## Architecture map

```text
src/features/auth/
  domain/schemas/        canonical Zod contracts (client + server share them)
  domain/services/       pure helpers: normalization, slugs, limits, validation
  domain/repositories/   ports: AuthProvider, OrganizationRepository, …
  domain/use-cases/      register / verify / resend / login / logout / reset
  data/repositories/     Prisma OrganizationRepository (transactions)
  infrastructure/auth/   Better Auth instance, client, provider adapter, session helpers
  infrastructure/email/  branded templates (pure, tested)
  presentation/forms/    existing UI, now calling server actions
  presentation/actions/  thin transport over use-cases (validation, limits, errors)

src/shared/
  errors/app-error.ts              stable codes, safe envelopes, normalizer
  infrastructure/db/prisma.ts      lazy Prisma singleton (server-only)
  infrastructure/email/            EmailService port + Resend adapter
  infrastructure/rate-limit/       RateLimiter port + in-memory adapter
  infrastructure/logging/          structured security events (no secrets)

src/app/
  api/auth/[...all]/route.ts       Better Auth handler (thin)
  (auth)/auth/page.tsx             login/register/forgot/OTP screens
  (auth)/auth/reset-password/      token-based reset form
  dashboard/page.tsx               minimal protected landing (server-guarded)
src/proxy.ts                       cookie-presence routing; enforcement is server-side
prisma/                            schema.prisma + versioned migrations
```

## Security posture (ADR 003)

- Passwords: min 8 chars (shared schema + server config), scrypt hashing
  by Better Auth; never logged, returned, or stored in plaintext.
- OTP: 6 digits, 10-minute expiry, 5 attempts then destroyed, hashed at
  rest, resend rotates, plugin endpoints rate-limited. Verified server-side.
- Sessions: 7-day expiry, daily refresh, HttpOnly + SameSite=Lax +
  Secure-in-production cookies; reset revokes all sessions.
- Errors: stable codes (`INVALID_CREDENTIALS`, `VERIFICATION_FAILED`,
  `RATE_LIMITED`, …), generic auth messages, no enumeration signals,
  no Prisma/Resend/Better Auth internals to clients.
- Tenant identity always derives from the verified session — never from
  client-supplied organization IDs.

## Production prerequisites

- `prisma migrate deploy` against the production database (never `db push`,
  never edit applied migrations).
- Shared rate-limit/session storage: the in-memory limiter is
  single-instance only; configure Better Auth `secondaryStorage`
  (e.g. Redis) and a shared `RateLimiter` before multi-instance deploy.
- HTTPS + `BETTER_AUTH_URL` set to the public origin; secure cookies
  engage automatically in production.
- Resend production key + verified sender domain.

## Verified commands

```bash
npm test            # deterministic unit tests (no live DB/Resend required)
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Database integration (register → OTP → dashboard, login, reset, logout)
requires a live PostgreSQL + Resend key; see MANUAL QA in the task spec.
