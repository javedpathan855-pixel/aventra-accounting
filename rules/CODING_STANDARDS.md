# CODING_STANDARDS.md

## TYPESCRIPT
Use strict types. Avoid `any`, `@ts-ignore`, and unsafe assertions used only to silence errors.

## NAMING
Use precise, domain-meaningful names. Avoid vague names when a specific name is available.

## FUNCTIONS
Keep functions focused, predictable, and explicit about side effects.

## COMPONENTS
Components render and handle interaction. Do not combine rendering, persistence, authorization, and complex domain logic in one component.

## ASYNC
Handle promise failures intentionally. No unhandled rejections.

## IMPORTS
Keep imports minimal, use repository aliases, remove unused imports, avoid circular dependencies.

## COMMENTS
Explain why, invariants, workarounds, and external constraints. Do not restate obvious code.

## VALIDATION
Validate external input once at the appropriate boundary using a canonical schema/validator.

## LOGGING
Follow OBSERVABILITY_RULES.md. No random production debug logs.

## FORMATTING
Use repository formatter/linter. Do not disable rules casually.

## ABSTRACTION
Add abstractions when they protect a real boundary or remove meaningful duplication. Avoid generic wrappers for one-off logic.
