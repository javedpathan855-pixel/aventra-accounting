# SECURITY_RULES.md

## TRUST MODEL
The browser and all client-supplied data are untrusted.

## AUTH
Use Better Auth. Validate sessions server-side for protected operations.

## AUTHORIZATION
Check identity, permission, organization/tenant scope, ownership, and action eligibility on the server.

## INPUTS
Validate and normalize external input. Reject unexpected values where contracts require strictness.

## INJECTION
Use parameterized database APIs/ORM methods. Never concatenate untrusted input into SQL, shell commands, HTML, or unsafe URLs.

## XSS
Prefer React/Next.js escaping. Avoid raw HTML; sanitize any unavoidable HTML at a documented boundary.

## CSRF/INTEGRITY
Use provider/framework protections and signature/origin checks where required for sensitive state-changing operations.

## SECRETS
Never hardcode, commit, log, or expose secrets. Never put secrets in `NEXT_PUBLIC_*`.

## FILES
Validate upload type, size, naming, authorization, and storage scope. Never trust MIME type alone.

## TENANCY
Every tenant-scoped operation must enforce scope server-side.

## ERRORS
Production errors are safe to clients and detailed only in secure internal diagnostics.

## SECURITY REVIEW
Required for auth, payments, files, APIs, database access, tenant boundaries, or sensitive data.
