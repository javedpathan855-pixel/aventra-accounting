"use client";

import { useState } from "react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  ToastProvider,
  useToasts,
  type ToastPosition,
  type ToastTone,
} from "@/shared/components/ui/toast";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const TONES: ToastTone[] = ["success", "info", "warning", "error"];

const TONE_COPY: Record<
  ToastTone,
  { title: string; description: string }
> = {
  default: {
    title: "Workspace updated",
    description: "Your preferences were saved.",
  },
  success: {
    title: "Invoice created",
    description: "INV-1048 was saved successfully.",
  },
  info: {
    title: "Report ready",
    description: "September P&L finished generating.",
  },
  warning: {
    title: "Payment overdue",
    description: "INV-1046 is 2 days past due.",
  },
  error: {
    title: "Sync failed",
    description: "Bank feed disconnected. Reconnect to resume.",
  },
};

const DURATIONS = [
  { label: "Short", value: 2000 },
  { label: "Normal", value: 4000 },
  { label: "Long", value: 8000 },
] as const;

const POSITIONS: Array<{ label: string; value: ToastPosition }> = [
  { label: "Top right", value: "top-right" },
  { label: "Bottom right", value: "bottom-right" },
  { label: "Top center", value: "top-center" },
  { label: "Bottom center", value: "bottom-center" },
];

const ToastPlayground = () => {
  const { toast } = useToasts();
  const [duration, setDuration] = useState<number>(4000);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
          Severity
        </p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <Button
              key={tone}
              size="sm"
              variant="outline"
              onClick={() =>
                toast({
                  title: TONE_COPY[tone].title,
                  description: TONE_COPY[tone].description,
                  tone,
                  duration,
                  action:
                    tone === "success"
                      ? {
                          label: "View invoice",
                          onClick: () =>
                            toast({
                              title: "Opening INV-1048",
                              tone: "info",
                              duration,
                            }),
                        }
                      : undefined,
                })
              }
            >
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
          Duration
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Toast duration">
          {DURATIONS.map((item) => (
            <Button
              key={item.label}
              size="sm"
              variant={duration === item.value ? "secondary" : "ghost"}
              aria-pressed={duration === item.value}
              onClick={() => setDuration(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <p className="font-lato text-sm text-muted">
        Hover or focus a toast to hold it; it resumes when you leave. Errors
        announce assertively, everything else politely.
      </p>
    </div>
  );
};

const ToastSection = () => {
  const [position, setPosition] = useState<ToastPosition>("top-right");

  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Toast"
      description="Transient product feedback that floats above the workspace — capped, pausable, and announced to assistive technology with the right urgency."
    >
      <ToastProvider position={position}>
        <Card className="flex flex-col gap-8 p-6 sm:p-8">
          <div className="flex flex-col gap-3">
            <Subsection>Playground</Subsection>
            <Preview>
              <ToastPlayground />
            </Preview>
          </div>
          <Divider />
          <div className="flex flex-col gap-3">
            <Subsection>Position</Subsection>
            <Preview>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Toast position"
              >
                {POSITIONS.map((item) => (
                  <Button
                    key={item.value}
                    size="sm"
                    variant={position === item.value ? "secondary" : "ghost"}
                    aria-pressed={position === item.value}
                    onClick={() => setPosition(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </Preview>
          </div>
        </Card>
      </ToastProvider>
    </ShowcaseSection>
  );
};

export default ToastSection;
