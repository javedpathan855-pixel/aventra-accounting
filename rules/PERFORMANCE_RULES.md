# PERFORMANCE_RULES.md

## PRINCIPLE
Measure before optimizing unless the bottleneck is obvious.

## NEXT.JS
Prefer Server Components for non-interactive content/data. Keep client boundaries and bundles small.

## DATA
Fetch only needed data. Avoid duplicate requests and N+1 queries. Paginate large collections.

## DATABASE
Index known access patterns. Avoid unbounded reads and selecting unnecessary fields.

## CLIENT
Avoid unnecessary client-only dependencies, memoization, state, or effects.

## CACHING
Every cache needs a clear key, freshness policy, invalidation strategy, and failure behavior. Do not cache mutable correctness-critical data without a consistency plan.

## ASSETS
Optimize images and large assets with framework/platform capabilities when appropriate.

## ANIMATION
Avoid expensive continuous animation and layout thrashing. Follow ANIMATION_RULES.md.

## OBSERVABILITY
Do not add telemetry so verbose that it becomes the performance problem.

## REGRESSION
Re-measure performance-sensitive changes after implementation.
