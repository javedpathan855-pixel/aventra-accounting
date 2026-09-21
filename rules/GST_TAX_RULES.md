# GST_TAX_RULES.md

## SCOPE
These rules define software architecture for Indian GST workflows. They are not legal advice. Verify current law, rates, notifications, reporting, and filing requirements before claiming compliance.

## SERVER AUTHORITY
Tax determination and final calculation are server-authoritative. Client tax values are previews only.

## CENTRAL TAX ENGINE
Use one centralized tax determination/calculation layer. Do not duplicate formulas across UI, APIs, reports, or PDFs.

## TAX CONTEXT
Tax determination may depend on supplier registration/state, buyer type, place of supply, transaction type, supply type, product/service classification, tax configuration, and reverse-charge context.

## TAX MASTER
Rates/configuration are controlled master data. Support effective dates/versioning when rules change. Do not scatter hardcoded rates.

## HISTORICAL SNAPSHOT
Finalized documents preserve applicable tax rate, treatment, HSN/SAC, GSTINs, place of supply, and tax amounts required for historical reporting.

## COMPONENTS
Represent applicable components explicitly:
CGST, SGST, IGST, UTGST, CESS.

## PLACE OF SUPPLY
Model the determined place of supply where required. Preserve it historically.

## GSTIN
Use one canonical server-side GSTIN validator. GSTIN presence alone does not determine every tax treatment.

## TRANSACTION TYPES
Support explicit classifications where required: registered/unregistered, B2B/B2C, export, SEZ, reverse charge, exempt, zero-rated. Do not collapse semantic differences into a numeric 0%.

## HSN/SAC
Store applicable HSN/SAC explicitly and preserve the applied classification in historical documents.

## INCLUSIVE/EXCLUSIVE
Tax-inclusive and tax-exclusive modes are explicit and use centralized formulas.

## DISCOUNTS/CHARGES
Define how line/document discounts and charges affect taxable value. Use one deterministic allocation strategy when multiple tax rates exist.

## ROUNDING
Use the financial rounding policy. Component and total tax must reconcile within defined precision.

## OVERRIDES
Manual tax overrides require explicit permission and should capture reason/actor/time when applicable.

## FINALIZATION
```text
validate context → determine treatment → calculate → round → reconcile → snapshot → persist atomically
```

## REPORTING
Tax reports use authoritative persisted values. Never recalculate historical invoices using current tax configuration.

## COMPLIANCE
Having tax calculations does not by itself prove GST compliance or filing readiness.
