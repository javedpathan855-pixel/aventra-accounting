import { ChartNoAxesCombined, Receipt, Users, Wallet } from "lucide-react";

import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import {
  PREVIEW_CUSTOMERS,
  PREVIEW_INVOICES,
  PREVIEW_REPORTS,
} from "../roadmap-content";
import Reveal from "@/shared/animation/reveal";

const PREVIEW_TABS = [
  {
    value: "overview",
    label: "Overview",
    icon: <Wallet aria-hidden="true" className="h-4 w-4" />,
  },
  {
    value: "invoices",
    label: "Invoices",
    icon: <Receipt aria-hidden="true" className="h-4 w-4" />,
  },
  {
    value: "customers",
    label: "Customers",
    icon: <Users aria-hidden="true" className="h-4 w-4" />,
  },
  {
    value: "reports",
    label: "Reports",
    icon: <ChartNoAxesCombined aria-hidden="true" className="h-4 w-4" />,
  },
] as const;

const OVERVIEW_STATS = [
  {
    label: "Revenue collected",
    value: "₹4,82,500",
    hint: "March · 28 invoices",
  },
  { label: "Outstanding", value: "₹82,400", hint: "Due within 14 days" },
  { label: "Expenses", value: "₹61,250", hint: "March · 11 entries" },
];

const PreviewSection = () => {
  return (
    <section
      aria-labelledby="preview-heading"
      className="mt-16 bg-surface-muted/60 py-16 sm:mt-20 sm:py-20"
    >
      <div className="mx-auto flex w-full flex-col px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-primary">
                Accounting at a glance
              </p>
              <h2
                id="preview-heading"
                className="font-montserrat text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                A workspace shaped like your books.
              </h2>
            </div>
            <StatusBadge tone="neutral">Preview · sample data</StatusBadge>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="mt-8 flex flex-col gap-6 p-6 sm:p-8">
            <Tabs defaultValue="overview">
              <TabsList variant="underline" aria-label="Workspace preview">
                {PREVIEW_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    icon={tab.icon}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="overview">
                <div className="grid gap-4 sm:grid-cols-3">
                  {OVERVIEW_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-1 rounded-md border border-border-subtle bg-surface px-5 py-4"
                    >
                      <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                        {stat.label}
                      </p>
                      <p className="font-montserrat text-2xl font-bold tabular-nums text-foreground">
                        {stat.value}
                      </p>
                      <p className="font-lato text-xs text-muted">
                        {stat.hint}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="invoices">
                <TableContainer>
                  <Table className="min-w-140">
                    <TableCaption>Recent invoices — sample data</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PREVIEW_INVOICES.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-montserrat font-semibold">
                            {invoice.id}
                          </TableCell>
                          <TableCell>{invoice.customer}</TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {invoice.amount}
                          </TableCell>
                          <TableCell className="text-right">
                            <StatusBadge tone={invoice.tone}>
                              {invoice.status}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabsContent>
              <TabsContent value="customers">
                <ul className="flex flex-col gap-3">
                  {PREVIEW_CUSTOMERS.map((customer) => (
                    <li
                      key={customer.name}
                      className="flex items-center gap-4 rounded-md border border-border-subtle bg-surface px-5 py-4"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-muted font-montserrat text-sm font-bold text-primary"
                      >
                        {customer.name.charAt(0)}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-montserrat text-sm font-semibold text-foreground">
                          {customer.name}
                        </p>
                        <p className="font-lato text-xs text-muted">
                          {customer.detail}
                        </p>
                      </div>
                      <p className="shrink-0 font-montserrat text-sm font-bold tabular-nums text-foreground">
                        {customer.balance}
                      </p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="reports">
                <div className="flex flex-col gap-4">
                  {PREVIEW_REPORTS.map((report, index) => (
                    <div key={report.label}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex min-w-0 flex-col">
                          <p className="font-montserrat text-sm font-semibold text-foreground">
                            {report.label}
                          </p>
                          <p className="font-lato text-xs text-muted">
                            {report.hint}
                          </p>
                        </div>
                        <p className="font-montserrat text-xl font-bold tabular-nums text-foreground">
                          {report.value}
                        </p>
                      </div>
                      {index < PREVIEW_REPORTS.length - 1 ? (
                        <Divider className="mt-4" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </Reveal>
      </div>
    </section>
  );
};

export default PreviewSection;
