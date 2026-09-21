"use client";

import { useState } from "react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import ErrorState from "@/shared/components/ui/error-state";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const ERROR_MODES = ["Network", "Server", "Permission", "Inline"] as const;

type ErrorMode = (typeof ERROR_MODES)[number];

const ERROR_CONTENT: Record<
  ErrorMode,
  { title: string; description: string; action: string; compact: boolean }
> = {
  Network: {
    title: "We couldn't load this right now",
    description: "Check your connection and try again in a moment.",
    action: "Try again",
    compact: false,
  },
  Server: {
    title: "Something went wrong",
    description: "Our team has been notified. Please try again shortly.",
    action: "Try again",
    compact: false,
  },
  Permission: {
    title: "You don't have access to this page",
    description: "Ask your workspace owner to update your role.",
    action: "Go back",
    compact: false,
  },
  Inline: {
    title: "Failed to save changes",
    description: "Nothing was lost — review and retry.",
    action: "Retry",
    compact: true,
  },
};

const ErrorSection = () => {
  const [mode, setMode] = useState<ErrorMode>("Network");
  const content = ERROR_CONTENT[mode];

  return (
    <ShowcaseSection
      eyebrow="Feedback"
      title="Error States"
      description="Clear but calm. The semantic error family on muted surfaces — distinct from validation messages and destructive confirmations."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Live preview</Subsection>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Error state demo"
          >
            {ERROR_MODES.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={mode === item ? "secondary" : "ghost"}
                aria-pressed={mode === item}
                onClick={() => setMode(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <Preview title={`Preview · ${mode}`}>
            <ErrorState
              title={content.title}
              description={content.description}
              compact={content.compact}
              action={<Button size="sm">{content.action}</Button>}
            />
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Separation of concerns</Subsection>
          <Preview>
            <ul className="flex list-disc flex-col gap-1 pl-5 font-lato text-sm text-muted">
              <li>Validation errors belong to fields — see Field Error.</li>
              <li>System errors belong to regions — this component.</li>
              <li>Destructive confirmations are actions, not errors.</li>
            </ul>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default ErrorSection;
