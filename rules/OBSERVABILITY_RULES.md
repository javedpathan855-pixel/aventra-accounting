# OBSERVABILITY_RULES.md

## PURPOSE
Telemetry must help answer:
what happened, when, where, which version, and what was affected.

## SIGNALS
Use logs, metrics, traces, and audit events only where useful.

## LOGGING
Prefer structured events and safe context fields. Use consistent levels: DEBUG, INFO, WARN, ERROR.

## CONTEXT
Use request/correlation IDs for important server operations when practical. Include safe operation/resource identifiers.

## REDACTION
Never log passwords, tokens, secrets, private keys, auth cookies, complete payment credentials, or unnecessary sensitive personal data.

## BUSINESS/AUDIT
Operational logs and durable audit records are different. Important financial/security actions may require durable audit records.

## FINANCIAL
Track safe outcomes for invoice finalization, payments, tax failures, duplicate prevention, and webhook processing.

## METRICS/ALERTS
Prefer actionable latency/error/business metrics. Alert only when action is required.

## RETENTION
Retain telemetry only as long as operational, security, or legal needs justify.

## INCIDENTS
For material incidents, preserve a timeline, root cause, impact, and prevention actions.
