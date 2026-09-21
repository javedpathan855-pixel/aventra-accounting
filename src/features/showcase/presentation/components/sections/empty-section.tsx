"use client";

import { useState } from "react";
import { BellRing, Inbox, ReceiptText, SearchX, Users } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import EmptyState from "@/shared/components/ui/empty-state";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const EMPTY_MODES = [
  "Invoices",
  "Customers",
  "Search",
  "Notifications",
] as const;

type EmptyMode = (typeof EMPTY_MODES)[number];

const EMPTY_CONTENT: Record<
  EmptyMode,
  { icon: typeof Inbox; title: string; description: string; action: string }
> = {
  Invoices: {
    icon: ReceiptText,
    title: "No invoices yet",
    description:
      "Create your first invoice to start tracking billing activity.",
    action: "New invoice",
  },
  Customers: {
    icon: Users,
    title: "No customers yet",
    description: "Add a customer to attach invoices, payments, and notes.",
    action: "Add customer",
  },
  Search: {
    icon: SearchX,
    title: "Nothing matched your search",
    description: "Try a different term, or clear the filters to start over.",
    action: "Clear search",
  },
  Notifications: {
    icon: BellRing,
    title: "You're all caught up",
    description: "New activity, reminders, and mentions will land here.",
    action: "View settings",
  },
};

const EmptySection = () => {
  const [mode, setMode] = useState<EmptyMode>("Invoices");
  const content = EMPTY_CONTENT[mode];
  const Icon = content.icon;

  return (
    <ShowcaseSection
      eyebrow="Feedback"
      title="Empty States"
      description="Calm, optimistic, and actionable. Emptiness is information — never styled as an error, always offering the next step."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Live preview</Subsection>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Empty state demo"
          >
            {EMPTY_MODES.map((item) => (
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
            <EmptyState
              icon={<Icon aria-hidden="true" className="h-5 w-5" />}
              title={content.title}
              description={content.description}
              action={<Button size="sm">{content.action}</Button>}
            />
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Anatomy</Subsection>
          <Preview>
            <ul className="flex list-disc flex-col gap-1 pl-5 font-lato text-sm text-muted">
              <li>Muted medallion icon — context without illustration.</li>
              <li>Clear heading stating the situation.</li>
              <li>One helpful sentence, then at most one action.</li>
            </ul>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default EmptySection;
