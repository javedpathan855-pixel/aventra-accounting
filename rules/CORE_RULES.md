# CORE_RULES.md

## BASELINE
- Read applicable rules before implementation.
- Inspect existing code before changing it.
- Prefer simple, explicit, maintainable solutions.
- Preserve working behavior unless the task requires change.
- Keep security and correctness above convenience.

## SOURCE OF TRUTH
- Architecture: ARCHITECTURE_RULES.md
- File placement: DIRECTORY_RULES.md
- API contract: API_RULES.md
- Financial behavior: FINANCIAL_RULES.md
- Tax behavior: GST_TAX_RULES.md
- UI tokens: global design-token/CSS system
- Persisted state: approved PostgreSQL data layer

## TRUST
Browser input is untrusted. Client validation is UX only; server validation is authoritative.

## NO GUESSING
Do not invent business rules, permissions, schema semantics, tax treatment, or public API behavior. Inspect first; ask when a material ambiguity remains.

## CHANGE CONTROL
Prefer the smallest correct change. Avoid unrelated refactors and dependency churn.

## QUALITY
Code should be readable, typed, testable, observable where needed, secure by default, and consistent with existing patterns.
