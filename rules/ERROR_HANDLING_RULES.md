# ERROR_HANDLING_RULES.md

## CLASSES
validation, authentication, authorization, not-found, conflict, business-rule, database, external-service, rate-limit, unexpected/internal.

## PRINCIPLE
Expected errors are explicit and predictable. Unexpected errors fail safely and are observable.

## APPLICATION ERRORS
Use stable error codes, safe user messages, and structured context. Preserve an original cause when wrapping.

## CATCH
Catch only when you can recover, translate, add meaningful context, log at the correct boundary, or intentionally rethrow. Empty catches are forbidden.

## DATABASE
Map raw database failures to safe application errors. Never expose SQL/database internals.

## EXTERNAL SERVICES
Use timeouts and bounded retries. Never blindly retry financial side effects.

## UI
Distinguish loading, empty, validation, recoverable error, and fatal error states.

## ERROR BOUNDARIES
Use framework error boundaries for route/component failures. Do not use them for ordinary validation.

## LOGGING
Follow OBSERVABILITY_RULES.md. Never log passwords, tokens, secrets, or unnecessary sensitive data.

## FINANCIAL
A network failure does not prove a financial side effect did not occur. Verify authoritative status before retrying or compensating.
