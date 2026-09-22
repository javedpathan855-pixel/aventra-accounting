# FINANCIAL_RULES.md

## PRINCIPLE
Financial data must be accurate, deterministic, traceable, auditable, and historically correct.

## MONEY
Never use binary floating point as the financial source of truth. Use PostgreSQL decimal/numeric or integer smallest-unit representation consistently.

## CURRENCY
Amounts must have an unambiguous currency when multiple currencies are supported. Formatting is separate from storage.

## ROUNDING
Define precision, rounding method, and rounding stage centrally. Do not repeatedly/inconsistently round intermediates.

## SERVER AUTHORITY
Client calculations are previews. Server calculations are authoritative.

## FINALIZED RECORDS
Preserve transaction-time values. Do not silently rewrite finalized financial documents.

## DOCUMENT NUMBERS
Official identifiers are generated server-side and protected by uniqueness/concurrency controls.

## PAYMENTS
Payments are separate records. Support partial payments when required. Use idempotency for retryable financial side effects.

## TRANSACTIONS
Critical multi-record financial operations use database transactions.

## AUDIT
Important financial actions need traceable actor/time/resource information where required.

## CORRECTIONS
Use explicit cancellation, credit note, debit note, reversal, or adjustment workflows instead of overwriting finalized history.

## SNAPSHOTS
Preserve relevant transaction-time customer/product/tax values.

## REPORTING
Official reports use authoritative persisted values with explicit status/date filters.

## TESTING
Financial calculation and state-transition tests are mandatory.
