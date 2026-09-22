# CLEAN_ARCHITECTURE_RULES.md

## CANONICAL FEATURE BOUNDARY

Every substantial feature should be organized as:

```text
features/<feature>/
├── data/
├── domain/
├── presentation/
├── infrastructure/
└── index.ts
```

Create only the layers and subdirectories the feature actually needs.

## DOMAIN

Contains framework-independent business concepts and contracts:

```text
domain/
├── entities/
├── repositories/
├── services/
├── use-cases/
└── types/
```

Domain must not import:
- React
- Next.js
- browser APIs
- ORM/database drivers
- Better Auth
- third-party provider SDKs

Domain defines business intent, not transport or persistence details.

## DATA

Contains persistence/data transformations:

```text
data/
├── datasources/
├── dto/
├── mappers/
└── repositories/
```

Data implements repository contracts and maps external/persistence representations to domain representations.

## PRESENTATION

Contains feature UI and interaction:

```text
presentation/
├── components/
├── forms/
├── hooks/
└── views/
```

Presentation owns rendering, client state, accessibility, and user interaction.
It must not directly contain database/ORM logic.

## INFRASTRUCTURE

Contains technology-specific adapters:

```text
infrastructure/
├── auth/
├── external/
└── providers/
```

Infrastructure connects external technologies to application/domain contracts.

## DEPENDENCY RULE

```text
presentation → domain/application contracts
data → domain/application contracts
infrastructure → domain/application contracts
```

Never:

```text
domain → presentation
domain → data
domain → infrastructure
presentation → database implementation
domain → provider SDK
```

## USE-CASE RULE

Important business actions should be explicit use cases rather than hidden inside controllers or UI handlers.

## REPOSITORY RULE

Domain depends on repository interfaces/contracts.
Concrete persistence implementations stay in data/infrastructure.

## FRAMEWORK ISOLATION

Next.js route files are framework boundaries. Keep framework-specific code out of the domain.

## SHARED CODE

Only domain-neutral code may move to shared locations.
Do not extract code into `lib`, `components`, or global types merely to shorten imports.

## PRACTICALITY

Clean Architecture is about dependency control and responsibility separation, not maximum folder count.
Never create fake classes, empty services, or placeholder files without a real use.
