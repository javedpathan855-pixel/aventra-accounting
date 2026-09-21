"use client";

import { motion } from "framer-motion";
import {
  Accessibility,
  BellRing,
  LayoutGrid,
  Moon,
  Palette,
  Search,
  Smartphone,
  Zap,
} from "lucide-react";

import { entranceVariants } from "@/shared/animation/variants";
import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import { SHOWCASE_COUNTS } from "../showcase-registry";

const PRINCIPLES = [
  {
    icon: Palette,
    title: "Semantic",
    description: "Every color resolves through a named design token.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description: "Keyboard-first controls with visible focus and labels.",
  },
  {
    icon: Smartphone,
    title: "Responsive",
    description: "Usable at 320px, at desktop widths, and at 200% zoom.",
  },
  {
    icon: Moon,
    title: "Theme-aware",
    description: "Light, dark, and system themes from the same tokens.",
  },
  {
    icon: Zap,
    title: "Motion-conscious",
    description: "Tween-only micro-motion that respects reduced motion.",
  },
  {
    icon: LayoutGrid,
    title: "Reusable",
    description: "One primitive, many contexts — never duplicated markup.",
  },
];

interface OverviewSectionProps {
  onNavigate: (sectionId: string) => void;
}

const SUMMARY_CARDS = [
  {
    icon: LayoutGrid,
    title: "Components",
    description: "Buttons, inputs, selection, cards, and theme controls.",
    target: "components-buttons",
  },
  {
    icon: Palette,
    title: "Foundations",
    description: "Colors, typography, spacing, radius, shadows, and motion.",
    target: "foundations-colors",
  },
  {
    icon: BellRing,
    title: "Feedback",
    description: "Loading, empty, and error states for every workflow.",
    target: "feedback-loading",
  },
  {
    icon: Search,
    title: "Patterns",
    description: "Headers, summaries, search, and form compositions.",
    target: "patterns-page-header",
  },
] as const;

const OverviewSection = ({ onNavigate }: OverviewSectionProps) => {
  return (
    <div className="flex flex-col gap-10">
      <motion.div
        variants={entranceVariants}
        initial="initial"
        animate="animate"
        custom={0}
        className="flex flex-col gap-3"
      >
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-primary">
          Design System
        </p>
        <h1 className="font-montserrat text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Aventra <span className="text-primary">Design System</span>
        </h1>
        <p className="max-w-2xl font-lato text-base text-muted sm:text-lg">
          A carefully crafted visual language for building clear, consistent
          financial experiences. Everything below is the real running
          component — inspect it, interact with it, then use it.
        </p>
      </motion.div>

      <motion.div
        variants={entranceVariants}
        initial="initial"
        animate="animate"
        custom={0.08}
      >
        <Card className="flex flex-col gap-6 p-6 sm:p-8">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                Components
              </dt>
              <dd className="font-montserrat text-4xl font-bold text-foreground">
                {SHOWCASE_COUNTS.components}
                <span aria-hidden="true" className="text-primary">
                  .
                </span>
              </dd>
              <dd className="font-lato text-sm text-muted">
                Primitives, ready to compose.
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                Foundations
              </dt>
              <dd className="font-montserrat text-4xl font-bold text-foreground">
                {SHOWCASE_COUNTS.foundations}
                <span aria-hidden="true" className="text-primary">
                  .
                </span>
              </dd>
              <dd className="font-lato text-sm text-muted">
                Tokens behind every pixel.
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                Patterns
              </dt>
              <dd className="font-montserrat text-4xl font-bold text-foreground">
                {SHOWCASE_COUNTS.patterns}
                <span aria-hidden="true" className="text-primary">
                  .
                </span>
              </dd>
              <dd className="font-lato text-sm text-muted">
                Real compositions, real data.
              </dd>
            </div>
          </dl>
        </Card>
      </motion.div>

      <motion.div
        variants={entranceVariants}
        initial="initial"
        animate="animate"
        custom={0.16}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {SUMMARY_CARDS.map((card) => (
          <Card key={card.title} className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-muted text-primary"
            >
              <card.icon className="h-5 w-5" />
            </span>
            <h2 className="font-montserrat text-lg font-semibold text-foreground">
              {card.title}
            </h2>
            <p className="font-lato text-sm text-muted">{card.description}</p>
            <div className="mt-1">
              <Button
                variant="link"
                className="p-0"
                onClick={() => onNavigate(card.target)}
              >
                Explore {card.title.toLowerCase()} →
              </Button>
            </div>
          </Card>
        ))}
      </motion.div>

      <motion.div
        variants={entranceVariants}
        initial="initial"
        animate="animate"
        custom={0.24}
      >
        <Card className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
              System principles
            </p>
            <p className="font-lato text-sm text-muted">
              The six rules every Aventra interface follows.
            </p>
          </div>
          <Divider />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-muted text-primary"
                >
                  <principle.icon className="h-4 w-4" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-montserrat text-sm font-semibold text-foreground">
                    {principle.title}
                  </span>
                  <span className="font-lato text-sm text-muted">
                    {principle.description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OverviewSection;
