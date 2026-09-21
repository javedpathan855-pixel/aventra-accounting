# DEPLOYMENT_RULES.md

## FLOW
```text
Prepare → Validate → Authorize → Deploy → Verify → Monitor → Recover
```

## AUTHORIZATION
Agents must not deploy, restart production, or run production migrations without explicit authorization unless an approved automation owns the action.

## ENVIRONMENTS
Separate development, staging, and production configuration/data appropriately.

## PRE-DEPLOY
Verify actual typecheck, lint, tests, production build, environment configuration, migration compatibility, and rollback/recovery plan.

## DATABASE
Never casually perform destructive production operations. Do not edit applied migrations.

## RELEASE TRACEABILITY
Record deployed commit/version/build identifier where practical.

## POST-DEPLOY
Verify startup, health/readiness, auth, critical APIs, critical business flows, and error rates.

## FAILED DEPLOY
Inspect actual system state before retrying or rolling back. A failed deployment can partially change state.
