# DOCUMENTATION_RULES.md

## PRINCIPLE
Documentation must be accurate, useful, current, and economical to maintain.

## README
Document purpose, prerequisites, setup, environment, verified commands, development, testing/build, and deployment overview.

## UPDATE WHEN
Architecture, public APIs, environment variables, migrations, auth, deployment, business rules, or breaking behavior changes.

## COMMENTS
Explain why, constraints, invariants, and workarounds. Do not restate obvious code.

## API/ENV
Keep examples and configuration names accurate. Never include real secrets.

## ADR
For durable architectural decisions, record:
```text
Title
Status
Context
Decision
Consequences
Alternatives
```
Create a new ADR when a decision changes.

## DIAGRAMS
Use only when they clarify architecture/flow. Keep them current.

## SOURCE OF TRUTH
Implementation and verified repository behavior outrank stale documentation. Update stale docs.
