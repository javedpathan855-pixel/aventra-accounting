"use client";

import { useState } from "react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import Skeleton from "@/shared/components/ui/skeleton";
import Spinner from "@/shared/components/ui/spinner";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const LOADING_MODES = ["Page", "Card", "Table", "Button", "Inline"] as const;

type LoadingMode = (typeof LOADING_MODES)[number];

const LoadingDemo = ({ mode }: { mode: LoadingMode }) => {
  if (mode === "Page") {
    return (
      <div
        role="status"
        aria-label="Loading page"
        className="flex w-full flex-col items-center gap-3 py-10"
      >
        <Spinner size="lg" />
        <p className="font-lato text-sm text-muted">Loading workspace…</p>
      </div>
    );
  }

  if (mode === "Card") {
    return (
      <Card className="flex w-full max-w-sm flex-col gap-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <span className="sr-only" role="status">
          Loading summary…
        </span>
      </Card>
    );
  }

  if (mode === "Table") {
    return (
      <div
        role="status"
        aria-label="Loading invoices"
        className="flex w-full flex-col gap-2"
      >
        {["w-full", "w-11/12", "w-full", "w-10/12"].map((width, index) => (
          <Skeleton key={index} className={`h-10 ${width}`} />
        ))}
      </div>
    );
  }

  if (mode === "Button") {
    return (
      <Button disabled>
        <Spinner size="sm" label="Saving invoice" />
        Saving invoice…
      </Button>
    );
  }

  return (
    <p className="flex items-center gap-2 font-lato text-sm text-muted">
      <Spinner size="sm" label="Refreshing balances" />
      Refreshing balances…
    </p>
  );
};

const LoadingSection = () => {
  const [mode, setMode] = useState<LoadingMode>("Page");

  return (
    <ShowcaseSection
      eyebrow="Feedback"
      title="Loading"
      description="Calm loading language: skeletons where shape is known, spinners where it isn't. Never flashing, never decorative."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Live preview</Subsection>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Loading demo"
          >
            {LOADING_MODES.map((item) => (
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
            <div className="flex justify-center">
              <LoadingDemo mode={mode} />
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Primitives</Subsection>
          <Preview>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2 font-lato text-sm text-muted">
                <Spinner size="sm" /> sm
              </span>
              <span className="flex items-center gap-2 font-lato text-sm text-muted">
                <Spinner size="md" /> md
              </span>
              <span className="flex items-center gap-2 font-lato text-sm text-muted">
                <Spinner size="lg" /> lg
              </span>
              <Skeleton className="h-4 w-32" />
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default LoadingSection;
