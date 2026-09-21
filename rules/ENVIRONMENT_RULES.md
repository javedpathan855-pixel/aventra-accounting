# ENVIRONMENT_RULES.md

## CONFIGURATION
Environment variables are configuration inputs. Do not use them as a substitute for domain data.

## CENTRALIZATION
Read and validate environment variables through a centralized configuration module where practical. Avoid scattered raw `process.env` access.

## PUBLIC
Only intentionally public values may use `NEXT_PUBLIC_*`. Never put secrets there.

## VALIDATION
Validate required variables. Parse booleans, numbers, URLs, and enums explicitly.

## DEFAULTS
Do not provide unsafe production defaults for critical secrets or infrastructure settings.

## FILES
Use `.env.example` with safe placeholders. Never commit real secret-bearing env files.

## ENVIRONMENTS
Test and development must not use production data or live financial credentials unless explicitly controlled.

## BOUNDARY
Server-only configuration must never enter client bundles or public API responses.

## DOCUMENTATION
Document variable names, purpose, required/optional status, and safe examples.
