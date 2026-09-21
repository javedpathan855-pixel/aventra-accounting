# ARCHITECTURE_RULES.md

## MODEL
Use Clean Architecture at feature boundaries.

```text
src/
├── app/
├── components/
│   ├── providers/
│   └── ui/
├── features/
│   └── <feature>/
│       ├── data/
│       ├── domain/
│       ├── presentation/
│       ├── infrastructure/
│       └── index.ts
├── config/
├── hooks/
├── lib/
└── types/
```

## LAYERS
### domain/
Business concepts and framework-independent contracts.
Allowed subdirectories:
```text
entities/
repositories/
services/
use-cases/
types/
```
Domain must not import React, Next.js, ORM/database drivers, Better Auth, or external providers.

### data/
Data retrieval/persistence and transformations.
Allowed subdirectories:
```text
datasources/
dto/
mappers/
repositories/
```

### presentation/
Feature UI and user interaction.
Allowed subdirectories:
```text
components/
forms/
hooks/
views/
```
Presentation must not directly access database/ORM implementations or infrastructure providers.

### infrastructure/
Technology-specific adapters and external integrations.
Common subdirectories:
```text
auth/
external/
providers/
```
Create only what is needed.

## DEPENDENCIES
```text
presentation → domain/application contracts
data → domain/application contracts
infrastructure → domain/application contracts
```
Forbidden:
```text
domain → presentation
domain → data
domain → infrastructure
presentation → database
```
Avoid circular dependencies.

## APP
`src/app` owns routing and thin transport/composition boundaries. Route files must not contain large business workflows.

## SHARED
`src/components/ui` contains domain-neutral reusable UI primitives only.
Feature-specific UI belongs in `feature/presentation`.

## PRACTICALITY
Do not create fake repositories, empty use-cases, or placeholder infrastructure merely to satisfy a folder diagram.
