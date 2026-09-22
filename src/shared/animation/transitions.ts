import type { Transition } from "framer-motion";

/**
 * Centralized animation timing scale for the Aventra UI.
 *
 * Tween-based transitions only; elastic physics are prohibited anywhere
 * in the Auth animation system. Keep business workflows fast: prefer the
 * shortest duration that still reads as intentional.
 */
export const DURATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
} as const;

/**
 * Single centralized easing curve (easeInOut). Do not introduce
 * per-component easing curves; reuse this one.
 */
export const EASE_IN_OUT: [number, number, number, number] = [
  0.42, 0, 0.58, 1,
];

export const fastTransition: Transition = {
  duration: DURATION.fast,
  ease: EASE_IN_OUT,
};

export const normalTransition: Transition = {
  duration: DURATION.normal,
  ease: EASE_IN_OUT,
};
