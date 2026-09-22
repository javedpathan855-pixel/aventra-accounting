"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

interface AnimationProviderProps {
  children: ReactNode;
}

/**
 * Central reduced-motion boundary for interactive animated areas.
 *
 * `reducedMotion="user"` is Framer Motion's supported mechanism: users
 * who prefer reduced motion automatically get transform/layout animation
 * disabled (opacity remains), with no custom media-query implementation.
 * Wrap the smallest interactive subtree that contains motion components;
 * Server Components stay untouched.
 */
const AnimationProvider = ({ children }: AnimationProviderProps) => {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
};

export default AnimationProvider;
