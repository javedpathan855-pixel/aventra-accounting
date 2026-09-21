# DESIGN_RULES.md

## DESIGN SYSTEM
Use a centralized design system across the application.

## COLORS
All UI colors come from global semantic tokens defined in the global CSS/design-token layer.
Preferred:
```text
bg-background
bg-surface
bg-card
bg-primary
text-foreground
text-muted-foreground
border-border
ring-ring
```
Never scatter arbitrary hex/rgb/hsl/oklch literals or inline color styles through components. Add a new semantic token globally when needed.

## TYPOGRAPHY
Load fonts through the app-level font configuration. Do not ad-hoc import fonts in individual components.

## UI LIBRARIES
Do not add third-party UI component libraries unless explicitly approved. Build with React/Next.js/CSS and project-owned primitives.

## COMPONENT STATES
Design explicit states:
default, hover, focus-visible, active, disabled, loading, empty, success, error.

## LAYOUT
Use consistent spacing, readable hierarchy, responsive grids/flex, restrained shadows/radii, and clear density. Avoid decorative clutter, excessive glassmorphism, novelty patterns, and inconsistent spacing.

## THEMES
Light/dark/system themes must use semantic tokens. Do not simply invert colors. Verify state contrast in both themes.

## FORMS
Every form communicates labels, required state when relevant, validation, submission state, and result feedback.

## ACCESSIBILITY
Follow ACCESSIBILITY_RULES.md.

## CONSISTENCY
Search for an existing approved token/component before creating a new visual pattern.
