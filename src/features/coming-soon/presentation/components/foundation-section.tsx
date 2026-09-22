import Card from "@/shared/components/ui/card";

import { READY_ITEMS } from "../roadmap-content";
import Reveal from "@/shared/animation/reveal";

const FoundationSection = () => {
  return (
    <section
      aria-labelledby="foundation-heading"
      className="mx-auto w-full px-4 py-4 sm:px-6"
    >
      <Reveal>
        <Card className="flex flex-col gap-8 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-primary">
              Already in place
            </p>
            <h2
              id="foundation-heading"
              className="font-montserrat text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              The foundation is ready.
            </h2>
            <p className="max-w-2xl font-lato text-base leading-relaxed text-muted">
              Before the first invoice is ever created, the groundwork is done —
              identity, workspace, and design language.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {READY_ITEMS.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success-muted text-success"
                >
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="font-montserrat text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="font-lato text-sm leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>
    </section>
  );
};

export default FoundationSection;
