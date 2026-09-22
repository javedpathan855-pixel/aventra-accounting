"use client";

import { useRouter } from "next/navigation";

import Button from "@/shared/components/ui/button";
import StatusBadge from "@/shared/components/ui/status-badge";

import HeroVisual from "./hero-visual";
import Reveal from "@/shared/animation/reveal";

interface ComingSoonHeroProps {
  authenticated: boolean;
}

const ComingSoonHero = ({ authenticated }: ComingSoonHeroProps) => {
  const router = useRouter();

  const scrollToRoadmap = () => {
    document
      .getElementById("roadmap")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-labelledby="coming-soon-heading"
      className="mx-auto grid w-full items-center gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-24"
    >
      <div className="flex min-w-0 flex-col items-start">
        <Reveal immediate delay={0}>
          <StatusBadge tone="info">Currently in development</StatusBadge>
        </Reveal>
        <Reveal immediate delay={0.05}>
          <h1
            id="coming-soon-heading"
            className="mt-5 font-montserrat text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Your financial workspace is taking shape.
          </h1>
        </Reveal>
        <Reveal immediate delay={0.1}>
          <p className="mt-5 max-w-xl font-lato text-base leading-relaxed text-muted sm:text-lg">
            Aventra Accounting brings invoices, customers, payments, expenses,
            and reporting into one calm, organized workspace — built module by
            module on a foundation that is already in place.
          </p>
        </Reveal>
        <Reveal immediate delay={0.15}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={scrollToRoadmap}>
              Explore what&apos;s coming
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                router.push(authenticated ? "/dashboard" : "/auth")
              }
            >
              {authenticated ? "Open dashboard" : "Back to sign in"}
            </Button>
          </div>
        </Reveal>
      </div>
      <Reveal immediate delay={0.2} className="min-w-0">
        <HeroVisual />
      </Reveal>
    </section>
  );
};

export default ComingSoonHero;
