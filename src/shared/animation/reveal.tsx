"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";

import { entranceVariants } from "./variants";

interface RevealProps {
  delay?: number;
  immediate?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Scroll-triggered entrance sharing the centralized variants.
 * Above-the-fold content uses `immediate` to play on mount instead.
 * Transform/opacity only; reduced motion is handled by the provider.
 */
const Reveal = ({ delay = 0, immediate = false, className, children }: RevealProps) => {
  return (
    <motion.div
      className={cn(className)}
      variants={entranceVariants}
      initial="initial"
      {...(immediate
        ? { animate: "animate" }
        : { whileInView: "animate", viewport: { once: true, margin: "-64px" } })}
      custom={delay}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
