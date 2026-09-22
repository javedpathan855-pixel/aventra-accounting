import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";
import cn from "@/shared/utils/cn";

import { MODULE_STATUS_LABEL, MODULE_STATUS_TONE, type RoadmapModule } from "../roadmap-content";
import Reveal from "@/shared/animation/reveal";

/**
 * Shared module card: icon medallion, status badge, name, description,
 * and metadata footer. Used by the public roadmap and the dashboard
 * workspace alike — one implementation, two contexts.
 */
const FeatureCard = ({ module, index = 0 }: { module: RoadmapModule; index?: number }) => {
  const Icon = module.icon;

  return (
    <Reveal delay={Math.min(index * 0.04, 0.2)} className="h-full">
      <Card
        className={cn(
          "group flex h-full flex-col gap-4",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-md",
              "bg-primary-muted text-primary",
              "transition-colors duration-200",
              "group-hover:bg-primary group-hover:text-primary-foreground",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <StatusBadge tone={MODULE_STATUS_TONE[module.status]}>
            {MODULE_STATUS_LABEL[module.status]}
          </StatusBadge>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-montserrat text-lg font-semibold text-foreground">
            {module.name}
          </h3>
          <p className="font-lato text-sm leading-relaxed text-muted">
            {module.description}
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-3 pt-1">
          <Divider />
          <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
            {module.meta}
          </p>
        </div>
      </Card>
    </Reveal>
  );
};

export default FeatureCard;
