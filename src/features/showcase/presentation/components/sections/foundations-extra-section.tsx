import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const SPACING_STEPS = [
  { label: "4px", width: "w-1", note: "Tight gaps, icon padding" },
  { label: "8px", width: "w-2", note: "Field gaps, inline rhythm" },
  { label: "12px", width: "w-3", note: "Compact stacks" },
  { label: "16px", width: "w-4", note: "Card padding, section rhythm" },
  { label: "24px", width: "w-6", note: "Panel padding, generous stacks" },
  { label: "32px", width: "w-8", note: "Page sections, breathing room" },
];

const RADII = [
  { token: "rounded-sm", description: "Controls, checkboxes, ticks" },
  { token: "rounded-md", description: "Inputs, buttons, cards" },
  { token: "rounded-lg", description: "Panels, dialogs" },
  { token: "rounded-xl", description: "Large surfaces" },
  { token: "rounded-2xl", description: "Hero and feature surfaces" },
  { token: "rounded-full", description: "Pills, avatars, medallions" },
];

const SHADOWS = [
  { token: "shadow-xs", description: "Hairline lift" },
  { token: "shadow-sm", description: "Buttons, active controls" },
  { token: "shadow-md", description: "Cards, dropdowns" },
  { token: "shadow-lg", description: "Elevated panels" },
  { token: "shadow-primary-md", description: "Primary glow accents" },
];

const SpacingSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Foundations"
      title="Spacing"
      description="A 4-point rhythm underlies every layout: tight gaps for inline rhythm, generous stacks for page breathing room."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Rhythm ruler</Subsection>
        <Preview title="Scale">
          <div className="flex flex-col gap-4">
            {SPACING_STEPS.map((step) => (
              <div key={step.label} className="flex items-center gap-4">
                <span className="w-12 shrink-0 font-montserrat text-sm font-semibold text-foreground">
                  {step.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-6 rounded-sm bg-primary/70 ${step.width}`}
                />
                <span className="font-lato text-sm text-muted">
                  {step.note}
                </span>
              </div>
            ))}
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

const RadiusShadowsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Foundations"
      title="Radius & Shadows"
      description="The actual radius and shadow tokens. Restrained elevation: most surfaces rest on small shadows; primary glow is an accent, not a default."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Radius</Subsection>
          <Preview>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {RADII.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    aria-hidden="true"
                    className={`h-16 w-full border border-border bg-surface-muted ${item.token}`}
                  />
                  <p className="font-montserrat text-xs font-semibold text-foreground">
                    {item.token}
                  </p>
                  <p className="-mt-1 font-lato text-xs text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Shadows</Subsection>
          <Preview>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {SHADOWS.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    aria-hidden="true"
                    className={`h-16 w-full rounded-md bg-surface ${item.token}`}
                  />
                  <p className="font-montserrat text-xs font-semibold text-foreground">
                    {item.token}
                  </p>
                  <p className="-mt-1 text-center font-lato text-xs text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export { RadiusShadowsSection, SpacingSection };
