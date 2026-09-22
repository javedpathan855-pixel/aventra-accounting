# ADR 001: Auth Form Validation with Zod

## Title

Use Zod domain schemas as the canonical Auth input contracts; defer React
Hook Form; password policy left as a pending product/security decision.

## Status

Accepted (UI + validation phase). Password policy: PENDING product/security
decision — the current schemas enforce required + non-empty only.

## Context

- Auth forms (login, register, forgot-password, OTP) are UI-only with native
  HTML validation attributes and no structured validation layer.
- CODING_STANDARDS.md requires validating external input once at the
  appropriate boundary using a canonical schema/validator.
- CORE_RULES.md and SECURITY_RULES.md: client validation is UX only; server
  validation remains authoritative; the browser is untrusted.
- API_RULES.md requires stable machine-readable error codes; frontend logic
  must not depend on human-readable messages.
- No test runner exists in package.json (TESTING_RULES.md: use only scripts
  actually present), so schema tests are deferred until a runner is added.
- React Hook Form is not installed; current forms are small and mostly
  uncontrolled (OTP has a custom six-input engine RHF would not help).

## Decision

1. **Zod** is the canonical validation library. React Hook Form is NOT
   adopted; native form state + `safeParse` covers current complexity.
2. Schemas live in `src/features/auth/domain/schemas/` (login, register,
   forgot-password, OTP, plus a shared email field). Domain placement keeps
   them framework-neutral so future server boundaries can import the same
   single source of truth (presentation → domain, use-case → domain).
3. Client validation improves UX only and must never gate authorization,
   tenancy, pricing, or security decisions. It must never log passwords,
   OTPs, tokens, or secrets.
4. **Password policy is UNDECIDED.** No minimum length or complexity rules
   (8/12 characters, character classes, etc.) are introduced. Schemas
   enforce required + non-empty until a product/security decision is
   recorded here.

## Consequences

- One rule definition serves both current client UX and future server
  parsing; no client/server schema duplication.
- Forms gain structured field errors wired to `aria-invalid`,
  `aria-describedby`, and the semantic `error` design tokens.
- A test runner (e.g. Vitest with a `test` script) is still required before
  schema unit tests and any future auth integration tests can run.
- When password policy is decided, only the domain schemas change; form UI
  and server boundaries pick it up automatically.

## Alternatives

- React Hook Form + Zod resolver: rejected for now — unjustified bundle/API
  cost for four small forms; revisit for multi-step or dynamic forms.
- Yup/Joi/Valibot: rejected — one canonical library only; Zod gives typed
  inference (`z.infer`) with no duplicate interfaces.
- Inline per-form validation functions: rejected — duplicates rules and
  cannot be shared with future server boundaries.
- `noValidate` + Zod-only messages: deferred — native attributes stay for
  semantics, autofill, and mobile keyboards; reconsider if dual messaging
  proves inconsistent.
