# Aventra Accounting

Professional accounting workspace (in progress). Current phases: design
system + Showcase, invoice A4 templates, and the production
authentication & database foundation.

## Getting Started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, BETTER_AUTH_*, RESEND_*
npx prisma generate
npx prisma migrate dev
npm run dev            # http://localhost:1988
```

Full setup, architecture, and security posture:
[`docs/auth-foundation.md`](docs/auth-foundation.md). Key decisions:
[`docs/adr/001-auth-form-validation.md`](docs/adr/001-auth-form-validation.md),
[`docs/adr/002-auth-backend-architecture.md`](docs/adr/002-auth-backend-architecture.md),
[`docs/adr/003-auth-security-policy.md`](docs/adr/003-auth-security-policy.md).

## Routes

- `/auth` — login, register, forgot password, OTP verification
- `/auth/reset-password?token=…` — set a new password
- `/coming-soon` — product roadmap and workspace preview (public)
- `/dashboard` — protected workspace shell (sidebar, header, workspace preview)
- `/showcase` — design system and component patterns

## Verified commands

```bash
npm test
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Production deploys use `prisma migrate deploy` (never `db push`).
