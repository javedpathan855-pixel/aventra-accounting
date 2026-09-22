"use client";

import Link from "next/link";

import Reveal from "@/shared/animation/reveal";
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
import FeatureCard from "@/features/coming-soon/presentation/components/feature-card";
import {
  PREVIEW_INVOICES,
  PREVIEW_REPORTS,
  READY_ITEMS,
  ROADMAP_GROUPS,
} from "@/features/coming-soon/presentation/roadmap-content";

interface WorkspaceHomeProps {
  userName: string;
  organizationName: string;
}

/**
 * Current state of the dashboard workspace: greeting, sample-data
 * preview, upcoming modules, and foundation strip. Presentation only —
 * numbers and rows are labeled samples; tenant identity arrives via
 * props from the server guard.
 */
const WorkspaceHome = ({ userName, organizationName }: WorkspaceHomeProps) => {
  const firstName = userName.trim().split(/\s+/)[0] || userName;

  return (
    <div className="flex w-full flex-col gap-8 sm:gap-10">
      <Reveal immediate>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-primary">
              {organizationName}
            </p>
            <StatusBadge tone="info">Currently in development</StatusBadge>
          </div>
          <h1 className="font-montserrat text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {firstName}.
          </h1>
          <p className="max-w-2xl font-lato text-base leading-relaxed text-muted">
            Your financial workspace is taking shape. Here is a preview of
            what is coming, and everything already in place.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <section aria-labelledby="workspace-preview-heading" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="workspace-preview-heading"
              className="font-montserrat text-lg font-semibold text-foreground"
            >
              Workspace preview
            </h2>
            <StatusBadge tone="neutral">Sample data</StatusBadge>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PREVIEW_REPORTS.map((report) => (
              <Card key={report.label} className="flex flex-col gap-1 p-5">
                <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                  {report.label}
                </p>
                <p className="font-montserrat text-2xl font-bold tabular-nums text-foreground">
                  {report.value}
                </p>
                <p className="font-lato text-xs text-muted">{report.hint}</p>
              </Card>
            ))}
          </div>
          <Card className="flex flex-col gap-2 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-montserrat text-base font-semibold text-foreground">
                Recent invoices
              </h3>
              <Link
                href="/coming-soon"
                className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-transparent px-4 py-2 font-montserrat text-base font-medium text-primary underline underline-offset-2 transition-all duration-200 ease-out hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View the roadmap
              </Link>
            </div>
            <TableContainer className="border-0">
              <Table className="min-w-[520px]">
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
                        <StatusBadge tone={invoice.tone}>{invoice.status}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="workspace-modules-heading" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id="workspace-modules-heading"
              className="font-montserrat text-lg font-semibold text-foreground"
            >
              Upcoming modules
            </h2>
            <p className="font-lato text-sm text-muted">
              Each one becomes part of this workspace as it ships.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {ROADMAP_GROUPS.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <h3 className="font-montserrat text-sm font-semibold uppercase tracking-widest text-muted">
                  {group.title}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.modules.map((module, index) => (
                    <FeatureCard key={module.id} module={module} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section aria-labelledby="workspace-ready-heading">
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <h2
                id="workspace-ready-heading"
                className="font-montserrat text-lg font-semibold text-foreground"
              >
                Already in place
              </h2>
              <p className="font-lato text-sm text-muted">
                The groundwork your workspace stands on.
              </p>
            </div>
            <Divider />
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {READY_ITEMS.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-success-muted text-success"
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <p className="font-montserrat text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="font-lato text-sm text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </Reveal>
    </div>
  );
};

export default WorkspaceHome;
