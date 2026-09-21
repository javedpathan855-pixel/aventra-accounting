# AGENT_WORKFLOW.md

## REQUIRED FLOW
```text
Understand → Inspect → Rules → Plan → Implement → Validate → Review → Report
```

## INSPECT
Read relevant files, usages, and dependencies before editing.

## SEARCH
Search before creating components, hooks, services, repositories, types, utilities, or routes.

## PLAN
For non-trivial work, identify affected files, layers, data flow, validation, and tests.

## MINIMAL CHANGE
Do not refactor unrelated code. Do not rewrite large files when a focused change is sufficient.

## UI
Inspect design tokens and shared primitives before creating new UI.

## DATABASE
Inspect schema/migrations before changing data structures.

## SECURITY
Explicitly verify authentication, authorization, ownership, and tenant scope for protected features.

## VALIDATION
Run relevant project checks. Inspect the final diff.

## BLOCKED
Ask only after repository inspection when a material architectural, business, security, or schema ambiguity remains.
