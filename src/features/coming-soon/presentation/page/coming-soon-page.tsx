"use client";

import AnimationProvider from "@/shared/animation/motion";

import ComingSoonClosing from "../components/coming-soon-closing";
import ComingSoonHeader from "../components/coming-soon-header";
import ComingSoonHero from "../components/coming-soon-hero";
import FoundationSection from "../components/foundation-section";
import PreviewSection from "../components/preview-section";
import RoadmapSection from "../components/roadmap-section";

interface ComingSoonPageProps {
  authenticated: boolean;
}

/**
 * First product-facing screen of Aventra Accounting: status, roadmap,
 * foundation, and an honest sample-data preview — composed entirely
 * from existing shared primitives and the centralized motion system.
 */
const ComingSoonPage = ({ authenticated }: ComingSoonPageProps) => {
  return (
    <AnimationProvider>
      <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
        <ComingSoonHeader authenticated={authenticated} />
        <main className="flex w-full flex-col">
          <ComingSoonHero authenticated={authenticated} />
          <FoundationSection />
          <PreviewSection />
          <RoadmapSection />
          <ComingSoonClosing authenticated={authenticated} />
        </main>
      </div>
    </AnimationProvider>
  );
};

export default ComingSoonPage;
