import type { Variants } from "framer-motion";

import { fastTransition, normalTransition } from "./transitions";

/**
 * Centralized reusable motion states. Only variants that are actually
 * consumed exist here. Transitions are embedded so components never
 * hardcode duration/ease. Transform/opacity only — no layout animation.
 */
export const formTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: normalTransition },
  exit: { opacity: 0, y: -8, transition: fastTransition },
};

export const errorMessageVariants: Variants = {
  initial: { opacity: 0, y: -2 },
  animate: { opacity: 1, y: 0, transition: fastTransition },
  exit: { opacity: 0, transition: fastTransition },
};

/**
 * Enter-only micro transition for the password visibility icon. The icon
 * remounts on toggle (key change) and plays `initial` → `animate`; there
 * is intentionally no exit choreography so the toggle feels immediate.
 */
export const iconSwapVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: fastTransition },
};

/**
 * Staggered page/section entrance. The delay arrives through the motion
 * `custom` prop so every consumer shares one centralized definition —
 * no per-component duration or easing values.
 */
export const entranceVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...normalTransition, delay },
  }),
};

/**
 * Toast enter/exit. Small vertical rise with fade — calm stacking
 * without layout springs. Shared by every toast severity.
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: fastTransition },
  exit: { opacity: 0, y: 8, transition: fastTransition },
};

/**
 * Dialog scrim fade. Opacity only so context stays readable behind it.
 */
export const dialogOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: fastTransition },
  exit: { opacity: 0, transition: fastTransition },
};

/**
 * Dialog surface entrance. Settles from a small rise and near-full scale —
 * never from zero, never with spring physics.
 */
export const dialogContentVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: normalTransition },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: fastTransition },
};
