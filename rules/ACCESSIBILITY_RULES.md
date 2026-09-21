# ACCESSIBILITY_RULES.md

## SEMANTICS
Prefer native semantic HTML and native controls.

## KEYBOARD
Every interactive control must work with keyboard input. Keep logical DOM order. Avoid positive tab indices.

## FOCUS
Focus must be visible. Manage focus for dialogs, menus, major transitions, and destructive confirmations.

## LABELS
Every form control needs an accessible name. Placeholder is not a label.

## ERRORS
Associate field errors with fields where appropriate using semantic/accessibility relationships. Do not rely on color alone.

## ARIA
Use ARIA only when native semantics cannot express the behavior. Avoid redundant roles.

## ICONS/IMAGES
Icon-only controls need accessible names. Decorative icons/images should not add noise.

## DIALOGS
Provide accessible title, focus management, keyboard escape where appropriate, and sensible focus restoration.

## TABLES
Use semantic table structure. Make sorting, selection, and responsive presentation understandable.

## MOTION
Respect reduced-motion preferences.

## ZOOM/RESPONSIVE
Critical content must remain usable at increased text size/browser zoom and on small screens.

## TESTING
Use keyboard testing and screen-reader testing for complex components when practical.
