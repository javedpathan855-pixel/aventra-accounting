import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import AventraLogo from "@/shared/components/ui/aventra-logo";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const LogoSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Logo"
      description="The Aventra mark in both lockups. Short is the compact mark; Long carries the wordmark. Both adapt to the active theme automatically."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Variants</Subsection>
        <Preview>
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex flex-col items-start gap-2">
              <AventraLogo variant="Short" />
              <p className="font-montserrat text-xs font-semibold text-muted">
                Short
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <AventraLogo variant="Long" />
              <p className="font-montserrat text-xs font-semibold text-muted">
                Long
              </p>
            </div>
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

const ThemeSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Theme"
      description="One token system, three modes. Switch now — this entire Showcase, including every preview above, re-renders intentionally in the new theme."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Controls</Subsection>
        <Preview>
          <div className="flex flex-col items-start gap-3">
            <ThemeSwitcher />
            <p className="font-lato text-sm text-muted">
              Light, dark, and system modes resolve from the same semantic
              tokens — nothing is inverted, everything is designed.
            </p>
          </div>
        </Preview>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Token preview</Subsection>
          <Preview>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-12 rounded-md border border-border bg-background"
                />
                <p className="font-montserrat text-xs font-semibold text-foreground">
                  Background
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-12 rounded-md border border-border bg-surface-muted"
                />
                <p className="font-montserrat text-xs font-semibold text-foreground">
                  Surface muted
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-12 rounded-md bg-primary"
                />
                <p className="font-montserrat text-xs font-semibold text-foreground">
                  Primary
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-12 rounded-md border border-border bg-foreground"
                />
                <p className="font-montserrat text-xs font-semibold text-foreground">
                  Foreground
                </p>
              </div>
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export { LogoSection, ThemeSection };
