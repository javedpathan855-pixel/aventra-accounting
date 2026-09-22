"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DURATION, EASE_IN_OUT } from "@/shared/animation/transitions";
import {
  formTransitionVariants,
  iconSwapVariants,
} from "@/shared/animation/variants";
import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import FieldError from "@/shared/components/ui/field-error";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const MotionSection = () => {
  const [showPanel, setShowPanel] = useState(true);
  const [showError, setShowError] = useState(true);
  const [swapped, setSwapped] = useState(false);

  return (
    <ShowcaseSection
      eyebrow="Foundations"
      title="Motion"
      description="One centralized tween system: three durations, one easing curve, reduced-motion respected automatically. Toggle each demo to feel it."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Timing scale</Subsection>
          <Preview title="Scale">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(
                [
                  {
                    name: "fast",
                    value: DURATION.fast,
                    use: "Exits, micro swaps",
                  },
                  {
                    name: "normal",
                    value: DURATION.normal,
                    use: "Entrances, transitions",
                  },
                  {
                    name: "slow",
                    value: DURATION.slow,
                    use: "Reserved, rare",
                  },
                ] as const
              ).map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                    {item.name} · {item.value}s
                  </dt>
                  <dd className="font-lato text-sm text-muted">{item.use}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 font-lato text-sm text-muted">
              Easing: cubic-bezier({EASE_IN_OUT.join(", ")}) — a single smooth
              easeInOut shared by every variant. Only tweened opacity and
              transform are used anywhere in this system.
            </p>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Form transition · fade + rise</Subsection>
          <Preview>
            <div className="flex flex-col items-start gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPanel((current) => !current)}
              >
                {showPanel ? "Hide panel" : "Show panel"}
              </Button>
              <div className="flex min-h-24 w-full items-center justify-center rounded-md border border-subtle bg-surface-muted p-4">
                <AnimatePresence mode="wait" initial={false}>
                  {showPanel ? (
                    <motion.div
                      key="panel"
                      variants={formTransitionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="rounded-md border border-border bg-surface px-6 py-4 font-montserrat text-sm font-medium text-foreground shadow-sm"
                    >
                      Invoice panel
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Error message · calm appear</Subsection>
          <Preview>
            <div className="flex max-w-sm flex-col items-start gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowError((current) => !current)}
              >
                {showError ? "Resolve error" : "Trigger error"}
              </Button>
              <FieldError
                id="showcase-motion-error"
                message={
                  showError ? "Enter a valid email address." : undefined
                }
              />
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Icon swap · immediate polish</Subsection>
          <Preview>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSwapped((current) => !current)}
                aria-pressed={swapped}
              >
                {swapped ? "Swap back" : "Swap icon"}
              </Button>
              <motion.span
                key={swapped ? "on" : "off"}
                variants={iconSwapVariants}
                initial="initial"
                animate="animate"
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-muted font-montserrat text-sm font-bold text-primary"
              >
                {swapped ? "$" : "₹"}
              </motion.span>
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default MotionSection;
