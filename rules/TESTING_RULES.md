# TESTING_RULES.md

## LEVELS
Use the lowest test level that proves behavior, plus integration/e2e coverage for critical workflows:
- unit: pure/domain logic
- integration: database/API/auth boundaries
- e2e: critical user journeys

## PRIORITY
Mandatory attention for financial calculations, GST/tax, auth, authorization, state transitions, database invariants, and public APIs.

## QUALITY
Test behavior, not implementation details. Prefer deterministic assertions.

## DETERMINISM
Do not depend on production services, live credentials, uncontrolled time, uncontrolled randomness, or developer-specific filesystem state.

## DATABASE
Use isolated test data/database state. Never production data.

## AUTH
Test authenticated success and unauthenticated/forbidden behavior. For multi-tenancy, test cross-tenant denial.

## FINANCIAL/GST
Cover precision, rounding, edge cases, duplicate requests, tax components, and important state transitions.

## ERRORS
Test expected failure paths as well as success paths.

## REGRESSION
Bug fixes should add a regression test when practical.

## COMMANDS
Use only test scripts actually present in package.json.
