import { ROADMAP_GROUPS } from "../roadmap-content";
import FeatureCard from "./feature-card";
import Reveal from "@/shared/animation/reveal";

const RoadmapSection = () => {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="mx-auto w-full scroll-mt-6 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-primary">
          Product roadmap
        </p>
        <h2
          id="roadmap-heading"
          className="mt-2 font-montserrat text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Built module by module.
        </h2>
        <p className="mt-3 max-w-2xl font-lato text-base leading-relaxed text-muted">
          Each capability below becomes part of the same workspace — no plugins
          to stitch together, no data to re-enter.
        </p>
      </Reveal>
      <div className="mt-10 flex flex-col gap-12">
        {ROADMAP_GROUPS.map((group) => (
          <div key={group.id}>
            <Reveal>
              <div className="flex flex-col gap-1">
                <h3 className="font-montserrat text-xl font-semibold text-foreground">
                  {group.title}
                </h3>
                <p className="font-lato text-sm text-muted">
                  {group.description}
                </p>
              </div>
            </Reveal>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.modules.map((module, index) => (
                <FeatureCard key={module.id} module={module} index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoadmapSection;
