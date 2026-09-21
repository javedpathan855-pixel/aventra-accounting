# DATABASE_AUTH_RULES.md

## DATABASE
Primary database: PostgreSQL. Use one approved ORM/data-access approach unless explicitly changed.

## LAYERING
```text
presentation → application/use-case → repository contract → repository implementation → PostgreSQL
```
Presentation never accesses the database directly.

## SCHEMA
Use explicit ownership, foreign keys, uniqueness constraints, non-null constraints, and indexes for known access patterns.

## MIGRATIONS
Never rewrite applied production migrations. Create a new migration for a new state. Review destructive changes.

## TRANSACTIONS
Use database transactions for multi-record operations requiring atomicity.

## CONCURRENCY
Protect invariants with database constraints, transactions, locking, or optimistic concurrency as appropriate.

## QUERY QUALITY
Avoid N+1 queries and unbounded reads. Select only needed fields. Paginate large collections.

## AUTHENTICATION
Authentication provider: Better Auth. Do not introduce a second auth system without authorization.

## SESSION
Protected server operations must verify the session on the server. Client session state is not authorization.

## AUTHORIZATION
Check identity, permission, tenant/organization scope, resource ownership, and action eligibility.

## TENANCY
For multi-tenant systems, enforce tenant scope server-side at the application/data boundary. Never trust a client tenant ID.

## SECRETS
Never log or expose passwords, password hashes, session tokens, auth secrets, database credentials, or provider secrets.

## PROVIDER BOUNDARY
Keep Better Auth and other infrastructure-specific details behind controlled server/infrastructure boundaries.
