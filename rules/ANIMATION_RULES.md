# ANIMATION_RULES.md

## PURPOSE
Animation must communicate state, hierarchy, continuity, or affordance. Decorative motion is optional.

## APPROVED METHODS
- CSS transitions/keyframes for simple effects
- Framer Motion
- GSAP
No other animation library without explicit approval.

## DEFAULT
Prefer no animation over unnecessary animation. Keep business workflows fast.

## PERFORMANCE
Prefer transform/opacity. Avoid avoidable layout thrashing and long-running continuous effects.

## CLIENT BOUNDARY
Do not make an entire page client-rendered for one animated element. Isolate client animation components when practical.

## ACCESSIBILITY
Respect `prefers-reduced-motion`. Important information and actions must remain clear without motion.

## LAYOUT
Avoid animation that causes cumulative layout shifts or blocks input/navigation.

## VALIDATION
Verify desktop/mobile, keyboard behavior, and reduced-motion behavior for interactive animations.
