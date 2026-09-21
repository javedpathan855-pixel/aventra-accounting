# DIRECTORY_RULES.md

## PRINCIPLE
Directory placement is architectural metadata. Place files by responsibility, not convenience.

## ROOT
```text
src/app/           Next.js routes/composition
src/components/    global providers + shared UI
src/features/      feature boundaries
src/config/        application configuration
src/hooks/         truly cross-feature hooks
src/lib/           domain-neutral technical utilities
src/types/         truly shared domain-neutral types
```

## FEATURE CANONICAL SHAPE
```text
src/features/<feature>/
├── data/
│   ├── datasources/
│   ├── dto/
│   ├── mappers/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   ├── use-cases/
│   └── types/
├── presentation/
│   ├── components/
│   ├── forms/
│   ├── hooks/
│   └── views/
├── infrastructure/
│   ├── auth/
│   ├── external/
│   └── providers/
└── index.ts
```

Only create subdirectories that the feature actually needs.

## PLACEMENT
- Feature UI → presentation/components
- Feature forms → presentation/forms
- Feature UI state/browser hooks → presentation/hooks
- Feature views/page compositions → presentation/views
- Domain entities → domain/entities
- Domain contracts → domain/repositories
- Domain use cases → domain/use-cases
- Domain services → domain/services
- Data DTOs → data/dto
- Data sources → data/datasources
- Data mappers → data/mappers
- Repository implementations → data/repositories
- Technology adapters → infrastructure/*

## ROUTES
`src/app/**` contains Next.js routing files. Keep them thin. Do not put large feature implementations there.

## SHARED UI
`src/components/ui` is for reusable, business-neutral primitives. Never move feature-specific components there just to avoid imports.

## FORBIDDEN DUPLICATION
Do not create both `features/<feature>/components` and another competing feature folder for the same feature. There must be one canonical feature boundary.

## FILE PLACEMENT TEST
Ask:
1. What responsibility does this file have?
2. Which layer owns it?
3. Which subdirectory represents that responsibility?

If unclear, inspect existing patterns before creating it.
