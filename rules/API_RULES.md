# API_RULES.md

## FLOW
```text
HTTP request → parse/validate → authenticate → authorize → use case → map result → response
```

## ROUTES
Route handlers are thin transport boundaries. Business workflows live in application/domain layers.

## VALIDATION
Validate bodies, query params, route params, headers used as input, and webhook payloads. Never trust client totals or permissions.

## METHODS
GET read, POST create/command, PUT/PATCH controlled updates, DELETE only where the domain permits deletion.

## CANONICAL RESPONSE
Success:
```json
{"success":true,"data":{},"meta":{}}
```
Error:
```json
{"success":false,"error":{"code":"ERROR_CODE","message":"Safe message","details":{}}}
```
`meta` and `details` are optional. Never include secrets, stack traces, or internal database data.

## STATUS CODES
Use meaningful statuses, commonly:
200, 201, 204, 400, 401, 403, 404, 409, 422 when used consistently, 429, 500, 502/503/504 for appropriate upstream/service failures.

## ERROR CODES
Stable machine-readable codes. Do not make frontend logic depend on human-readable messages.

## PAGINATION
Use one documented strategy per API family. Cursor or offset semantics must be explicit.

## IDEMPOTENCY
Use idempotency for retryable commands with non-idempotent side effects, especially payments, finalization, imports, and webhooks.

## SECURITY
Authorize server-side and enforce resource/tenant scope. Do not log raw sensitive payloads.

## BREAKING CHANGES
Do not silently change public request/response contracts. Use a migration/versioning strategy when compatibility matters.
