import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

interface ColorToken {
  token: string;
  swatch: string;
  purpose: string;
}

const SURFACE_TOKENS: ColorToken[] = [
  {
    token: "bg-background",
    swatch: "bg-background border border-border",
    purpose: "Page canvas.",
  },
  {
    token: "bg-surface",
    swatch: "bg-surface border border-border",
    purpose: "Cards, panels, raised regions.",
  },
  {
    token: "bg-surface-muted",
    swatch: "bg-surface-muted",
    purpose: "Subtle fills, skeleton fills, icon medallions.",
  },
  {
    token: "bg-surface-subtle",
    swatch: "bg-surface-subtle border border-border",
    purpose: "Sunken or inset regions.",
  },
];

const TEXT_TOKENS: ColorToken[] = [
  {
    token: "text-foreground",
    swatch: "bg-foreground",
    purpose: "Headings and primary text.",
  },
  {
    token: "text-muted",
    swatch: "bg-muted",
    purpose: "Descriptions, captions, secondary text.",
  },
];

const BORDER_TOKENS: ColorToken[] = [
  {
    token: "border-border",
    swatch: "bg-background border-2 border-border",
    purpose: "Default container and input borders.",
  },
  {
    token: "border-subtle",
    swatch: "bg-background border-2 border-subtle",
    purpose: "Hairline dividers and skeleton lines.",
  },
  {
    token: "border-strong",
    swatch: "bg-background border-2 border-strong",
    purpose: "Emphasized control borders.",
  },
];

const ACCENT_TOKENS: ColorToken[] = [
  {
    token: "bg-primary",
    swatch: "bg-primary",
    purpose: "Primary actions and brand accents.",
  },
  {
    token: "text-primary-foreground",
    swatch: "bg-primary-foreground border border-border",
    purpose: "Text on primary fills.",
  },
  {
    token: "text-error",
    swatch: "bg-error",
    purpose: "Validation messages and invalid states.",
  },
  {
    token: "bg-error-muted",
    swatch: "bg-error-muted border border-border",
    purpose: "Calm error-state surfaces.",
  },
  {
    token: "text-success",
    swatch: "bg-success",
    purpose: "Success states and confirmations.",
  },
  {
    token: "text-warning",
    swatch: "bg-warning",
    purpose: "Caution states that need attention.",
  },
  {
    token: "text-info",
    swatch: "bg-info",
    purpose: "Neutral informational states.",
  },
];

const TokenGrid = ({ tokens }: { tokens: ColorToken[] }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tokens.map((item) => (
        <div
          key={item.token}
          className="flex items-center gap-3 rounded-md border border-subtle bg-background p-3"
        >
          <span
            aria-hidden="true"
            className={`h-10 w-10 shrink-0 rounded-md ${item.swatch}`}
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-montserrat text-sm font-semibold text-foreground">
              {item.token}
            </span>
            <span className="font-lato text-sm text-muted">
              {item.purpose}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

const ColorsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Foundations"
      title="Colors"
      description="Every swatch below resolves through a live semantic token — what you see is the system itself, in the current theme. No invented values."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Surfaces</Subsection>
          <TokenGrid tokens={SURFACE_TOKENS} />
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Text</Subsection>
          <TokenGrid tokens={TEXT_TOKENS} />
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Borders</Subsection>
          <TokenGrid tokens={BORDER_TOKENS} />
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Accents & states</Subsection>
          <TokenGrid tokens={ACCENT_TOKENS} />
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default ColorsSection;
