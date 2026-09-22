# BUSINESS_RULES.md

## PRINCIPLE
Business rules belong in domain/application layers, not React rendering code.

## ENTITIES
Model supported business concepts explicitly, such as organization, customer, supplier, product/service, quotation, invoice, purchase, payment, credit/debit note.

## MASTER VS TRANSACTIONAL
Master data (customers, suppliers, products, taxes, units) is distinct from transactions (invoices, purchases, payments, notes).

Master changes must not rewrite finalized transactions.

## OWNERSHIP
Organization-scoped records require explicit ownership and server-side authorization.

## LIFECYCLES
Business documents have explicit states and validated transitions.

## ACTIONS
Use explicit business actions for important transitions: finalize, cancel, record payment, convert, issue note.

## HISTORY
Preserve transaction-time snapshots when current master data can change.

## DUPLICATES
Use appropriate uniqueness/deduplication rules for critical identifiers and external references.

## REPORTING
Define how drafts, cancellations, returns, adjustments, and dates affect reports.

## IMPORT/EXPORT
Imported data is untrusted input. Validate it. Exports respect authorization and scope.

## UI
UI can guide and preview but cannot be the final authority for permissions, financial values, tax, or business state transitions.
