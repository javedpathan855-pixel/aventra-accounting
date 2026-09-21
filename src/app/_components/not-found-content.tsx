"use client";

import { motion } from "framer-motion";
import { ArrowLeft, House } from "lucide-react";
import { useRouter } from "next/navigation";

import AnimationProvider from "@/shared/animation/motion";
import { entranceVariants } from "@/shared/animation/variants";
import AventraLogo from "@/shared/components/ui/aventra-logo";
import Button from "@/shared/components/ui/button";

/**
 * Decorative "missing page" visual: a document slipped out of alignment
 * over a filed sheet, with abstract ledger rows and one misplaced line.
 * Pure HTML/CSS, semantic tokens only. Hidden from assistive technology.
 */
function NotFoundVisual() {
  return (
    <div aria-hidden="true" className="relative w-52 sm:w-60">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-6 rounded-md border border-border bg-surface-muted" />
      <div className="relative -rotate-2 rounded-md border border-border bg-surface p-5 shadow-md">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-primary" />
          <div className="h-2 w-20 rounded-full bg-border-subtle" />
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <div className="h-1.5 w-11/12 rounded-full bg-border-subtle" />
          <div className="h-1.5 w-3/4 rounded-full bg-border-subtle" />
          <div className="h-1.5 w-2/3 rounded-full bg-border-subtle" />
          <div className="flex items-center gap-2">
            <div className="ml-8 h-1.5 w-1/3 rounded-full bg-border-subtle" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

const NotFoundContent = () => {
  const router = useRouter();

  return (
    <AnimationProvider>
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <AventraLogo variant="Long" />

        <motion.div
          variants={entranceVariants}
          initial="initial"
          animate="animate"
          custom={0}
          className="mt-10 flex w-full justify-center"
        >
          <NotFoundVisual />
        </motion.div>

        <motion.div
          variants={entranceVariants}
          initial="initial"
          animate="animate"
          custom={0.08}
          className="mt-8 flex flex-col items-center"
        >
          <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
            404 · Page not found
          </p>
          <h1 className="mt-3 font-montserrat text-3xl font-bold text-foreground sm:text-4xl">
            This page took a wrong turn.
          </h1>
        </motion.div>

        <motion.p
          variants={entranceVariants}
          initial="initial"
          animate="animate"
          custom={0.16}
          className="mt-4 font-lato text-base text-muted"
        >
          The page you&apos;re looking for may have moved, changed, or simply
          wandered off. Let&apos;s get you back on track.
        </motion.p>

        <motion.div
          variants={entranceVariants}
          initial="initial"
          animate="animate"
          custom={0.24}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
            <House aria-hidden="true" className="h-4 w-4" />
            Back to Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group w-full sm:w-auto"
          >
            <span
              aria-hidden="true"
              className="flex transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
            </span>
            Go back
          </Button>
        </motion.div>
      </div>
    </AnimationProvider>
  );
};

export default NotFoundContent;
