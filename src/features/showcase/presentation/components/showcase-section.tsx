import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";
import Card from "@/shared/components/ui/card";

interface ShowcaseSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  headerClassName?: string;
}

/**
 * Consistent section frame: eyebrow + h2 identity + lede + content.
 * Sections are switched by the shell, so exactly one section (and its
 * h2) is visible at a time; the Overview section owns the page h1.
 */
const ShowcaseSection = ({
  eyebrow,
  title,
  description,
  children,
  headerClassName,
}: ShowcaseSectionProps) => {
  return (
    <section aria-label={title} className="flex flex-col gap-8">
      <div className={cn("flex flex-col gap-2", headerClassName)}>
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h2 className="font-montserrat text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="max-w-2xl font-lato text-base text-muted">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
};

interface PreviewProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Inner preview surface. Lives inside Card, which owns depth — so this
 * stays a quiet inset (subtle border, surface fill, no shadow) that sets
 * live components apart from surrounding documentation.
 */
const Preview = ({ title, children, className }: PreviewProps) => {
  return (
    <Card className={cn(className)}>
      {title ? (
        <p className="mb-4 font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
          {title}
        </p>
      ) : null}
      {children}
    </Card>
  );
};

const Subsection = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "font-montserrat text-sm font-semibold uppercase tracking-widest text-muted",
        className,
      )}
    >
      {children}
    </h3>
  );
};

export { Preview, ShowcaseSection, Subsection };
