"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import {
  Activity,
  CreditCard,
  FileText,
  LayoutDashboard,
  StickyNote,
} from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsAlign,
  type TabsVariant,
} from "@/shared/components/ui/tabs";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

interface WorkspaceTab {
  value: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  heading: string;
  body: string;
  stats: Array<{ label: string; value: string }>;
  disabled?: boolean;
}

const WORKSPACE_TABS: WorkspaceTab[] = [
  {
    value: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    heading: "Account overview",
    body: "Balances, upcoming invoices, and recent activity for this workspace.",
    stats: [
      { label: "Balance", value: "₹2,48,500" },
      { label: "Invoices", value: "24" },
      { label: "Activity", value: "18 today" },
    ],
  },
  {
    value: "activity",
    label: "Activity",
    icon: Activity,
    badge: 12,
    heading: "Recent activity",
    body: "Invoice INV-1048 was paid · Receipt attached · Customer updated.",
    stats: [
      { label: "Today", value: "18 events" },
      { label: "This week", value: "96 events" },
      { label: "Mentions", value: "3" },
    ],
  },
  {
    value: "payments",
    label: "Payments",
    icon: CreditCard,
    badge: 4,
    heading: "Payments",
    body: "Collections and payouts across every workspace account.",
    stats: [
      { label: "Collected", value: "₹1,12,400" },
      { label: "Pending", value: "₹32,000" },
      { label: "Overdue", value: "2" },
    ],
  },
  {
    value: "notes",
    label: "Notes",
    icon: StickyNote,
    badge: 3,
    heading: "Notes",
    body: "Drafts, shared notes, and archived context for this workspace.",
    stats: [
      { label: "Total", value: "8" },
      { label: "Pinned", value: "2" },
      { label: "Archived", value: "6" },
    ],
  },
  {
    value: "reports",
    label: "Reports",
    icon: FileText,
    heading: "Reports",
    body: "Reports are unavailable in this demo.",
    stats: [],
    disabled: true,
  },
];

const LONG_TABS = [
  "Customer Statements",
  "Payment History",
  "Tax Reports",
  "Audit Logs",
  "Bank Feeds",
  "Reconciliation",
  "Settings",
];

const VARIANTS: Array<{ value: TabsVariant; label: string }> = [
  { value: "elevated", label: "Elevated" },
  { value: "underline", label: "Underline" },
  { value: "soft", label: "Soft" },
];

const ALIGNS: Array<{ value: TabsAlign; label: string }> = [
  { value: "start", label: "Left" },
  { value: "center", label: "Center" },
  { value: "stretch", label: "Full" },
];

const TabsPlayground = () => {
  const [variant, setVariant] = useState<TabsVariant>("elevated");
  const [align, setAlign] = useState<TabsAlign>("start");
  const [showIcons, setShowIcons] = useState(true);
  const [showCounts, setShowCounts] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
          Variant
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tab variant">
          {VARIANTS.map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant={variant === item.value ? "secondary" : "ghost"}
              aria-pressed={variant === item.value}
              onClick={() => setVariant(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
          Alignment
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Tab alignment"
        >
          {ALIGNS.map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant={align === item.value ? "secondary" : "ghost"}
              aria-pressed={align === item.value}
              onClick={() => setAlign(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Checkbox
          label="Icons"
          checked={showIcons}
          onChange={(event) => setShowIcons(event.target.checked)}
        />
        <Checkbox
          label="Counts"
          checked={showCounts}
          onChange={(event) => setShowCounts(event.target.checked)}
        />
        <Checkbox
          label="Reduced motion"
          description="Disables transform motion in this preview."
          checked={reduceMotion}
          onChange={(event) => setReduceMotion(event.target.checked)}
        />
      </div>
      <Divider />
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-montserrat text-sm font-semibold text-foreground">
              Workspace
            </p>
            <StatusBadge tone="success">Live</StatusBadge>
          </div>
          <p className="font-lato text-sm text-muted">
            Your workspace financial snapshot
          </p>
        </div>
        <Tabs defaultValue="overview">
          <TabsList
            variant={variant}
            align={align}
            aria-label="Workspace sections"
          >
            {WORKSPACE_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                icon={showIcons ? <tab.icon /> : undefined}
                badge={showCounts ? tab.badge : undefined}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {WORKSPACE_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="flex flex-col gap-1">
                <p className="font-montserrat text-base font-semibold text-foreground">
                  {tab.heading}
                </p>
                <p className="font-lato text-sm text-muted">{tab.body}</p>
              </div>
              {tab.stats.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {tab.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-1 rounded-md border border-border bg-surface-muted p-4"
                    >
                      <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                        {stat.label}
                      </p>
                      <p className="font-montserrat text-xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </MotionConfig>
      <p className="font-lato text-sm text-muted">
        Switch variants, alignment, icons, and counts above — the same tabs
        re-render in each visual language with state preserved.
      </p>
    </div>
  );
};

const TabsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Tabs"
      description="Aventra navigation between related content — automatic activation, arrow-key travel, and a gliding active indicator on the centralized tween."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Tabs playground</Subsection>
          <Preview>
            <TabsPlayground />
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Overflow · long labels scroll</Subsection>
          <Preview>
            <Tabs defaultValue="Customer Statements">
              <TabsList variant="underline" aria-label="Report sections">
                {LONG_TABS.map((label) => (
                  <TabsTrigger key={label} value={label}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {LONG_TABS.map((label) => (
                <TabsContent key={label} value={label}>
                  <p className="font-lato text-sm text-muted">
                    Showing {label.toLowerCase()} for this workspace.
                  </p>
                </TabsContent>
              ))}
            </Tabs>
            <p className="mt-4 font-lato text-sm text-muted">
              Narrow viewports scroll the list horizontally — labels never
              wrap, keyboard travel is unaffected, and selecting a tab keeps
              it visible.
            </p>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Keyboard contract</Subsection>
          <Preview>
            <ul className="flex list-disc flex-col gap-1 pl-5 font-lato text-sm text-muted">
              <li>Right / Left moves selection and focus together.</li>
              <li>Home jumps to the first tab, End to the last.</li>
              <li>Disabled triggers are skipped and cannot activate.</li>
              <li>Every tab names its panel; every panel names its tab.</li>
            </ul>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default TabsSection;
