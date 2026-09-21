"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox, RotateCcw, Search } from "lucide-react";

import { formTransitionVariants } from "@/shared/animation/variants";
import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import EmptyState from "@/shared/components/ui/empty-state";
import ErrorState from "@/shared/components/ui/error-state";
import Input from "@/shared/components/ui/input";
import Skeleton from "@/shared/components/ui/skeleton";
import StatusBadge from "@/shared/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  type TableDensity,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft" | "Cancelled";

interface DemoInvoice {
  id: string;
  customer: string;
  date: string;
  status: InvoiceStatus;
  amount: string;
}

const INVOICES: DemoInvoice[] = [
  {
    id: "INV-1048",
    customer: "Acme Industries",
    date: "22 Sep 2026",
    status: "Paid",
    amount: "₹48,500.00",
  },
  {
    id: "INV-1047",
    customer: "Bright Labs",
    date: "21 Sep 2026",
    status: "Pending",
    amount: "₹32,000.00",
  },
  {
    id: "INV-1046",
    customer: "Nova Systems",
    date: "20 Sep 2026",
    status: "Overdue",
    amount: "₹18,750.00",
  },
  {
    id: "INV-1045",
    customer: "Zenith Traders",
    date: "18 Sep 2026",
    status: "Draft",
    amount: "₹12,400.00",
  },
  {
    id: "INV-1044",
    customer: "Park Avenue Co",
    date: "15 Sep 2026",
    status: "Paid",
    amount: "₹96,200.00",
  },
  {
    id: "INV-1043",
    customer: "Lakeside Retail",
    date: "12 Sep 2026",
    status: "Cancelled",
    amount: "₹7,900.00",
  },
];

/**
 * Invoice statuses are demo-domain vocabulary mapped onto the shared
 * StatusBadge tones. The badge always renders its text label, so meaning
 * never depends on color.
 */
const STATUS_TONE = {
  Paid: "success",
  Pending: "warning",
  Overdue: "error",
  Draft: "neutral",
  Cancelled: "neutral",
} as const;

interface InvoiceTableProps {
  invoices: DemoInvoice[];
  selectedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

const InvoiceTable = ({
  invoices,
  selectedIds,
  onToggle,
  onToggleAll,
}: InvoiceTableProps) => {
  const allSelected =
    invoices.length > 0 && invoices.every((invoice) => selectedIds.has(invoice.id));

  return (
    <TableContainer>
      <Table className="min-w-[640px]">
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all invoices"
                checked={allSelected}
                onChange={onToggleAll}
              />
            </TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} selected={selectedIds.has(invoice.id)}>
              <TableCell className="w-10">
                <Checkbox
                  aria-label={`Select invoice ${invoice.id}`}
                  checked={selectedIds.has(invoice.id)}
                  onChange={() => onToggle(invoice.id)}
                />
              </TableCell>
              <TableCell className="font-montserrat font-medium">
                {invoice.id}
              </TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell className="whitespace-nowrap text-muted">
                {invoice.date}
              </TableCell>
              <TableCell>
                <StatusBadge tone={STATUS_TONE[invoice.status]}>
                  {invoice.status}
                </StatusBadge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-right font-montserrat font-semibold tabular-nums">
                {invoice.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DensityDemo = ({
  density,
  title,
}: {
  density: TableDensity;
  title: string;
}) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <p className="font-montserrat text-sm font-semibold text-foreground">
        {title}
      </p>
      <TableContainer>
        <Table density={density} className="min-w-[420px]">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.slice(0, 3).map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-montserrat font-medium">
                  {invoice.id}
                </TableCell>
                <TableCell>
                  <StatusBadge tone={STATUS_TONE[invoice.status]}>
                    {invoice.status}
                  </StatusBadge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right font-montserrat font-semibold tabular-nums">
                  {invoice.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

type TableDemoState = "Default" | "Loading" | "Empty" | "Error";

const DEMO_STATES: TableDemoState[] = ["Default", "Loading", "Empty", "Error"];

const TableSection = () => {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [demoState, setDemoState] = useState<TableDemoState>("Default");

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return INVOICES;
    return INVOICES.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(term) ||
        invoice.customer.toLowerCase().includes(term),
    );
  }, [query]);

  const toggleOne = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((previous) =>
      previous.size === matches.length ? new Set() : new Set(matches.map((invoice) => invoice.id)),
    );
  };

  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Table"
      description="Elegant, readable data presentation for financial workflows. Semantic table markup, quiet row rhythm, right-aligned numerals — composable from cards to full pages."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <Subsection>Live invoices</Subsection>
            <p className="font-lato text-sm text-muted">
              Track your latest billing activity — {INVOICES.length} open
              invoices.
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Table state"
          >
            {DEMO_STATES.map((state) => (
              <Button
                key={state}
                size="sm"
                variant={demoState === state ? "secondary" : "ghost"}
                aria-pressed={demoState === state}
                onClick={() => setDemoState(state)}
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={demoState}
            variants={formTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4"
          >
            {demoState === "Loading" ? (
              <TableContainer>
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox aria-label="Select all invoices" disabled />
                      </TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6}>
                        <span className="sr-only" role="status">
                          Loading invoices…
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex flex-col gap-3 py-1"
                        >
                          {["w-[92%]", "w-full", "w-[96%]", "w-[88%]"].map(
                            (width) => (
                              <Skeleton key={width} className={`h-8 ${width}`} />
                            ),
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : demoState === "Empty" ? (
              <EmptyState
                icon={<Inbox aria-hidden="true" className="h-5 w-5" />}
                title="No invoices yet"
                description="Create your first invoice to start tracking billing activity."
              />
            ) : demoState === "Error" ? (
              <ErrorState
                title="Unable to load invoices"
                description="We couldn't retrieve your invoices right now."
                action={
                  <Button size="sm" onClick={() => setDemoState("Default")}>
                    <RotateCcw aria-hidden="true" className="h-4 w-4" />
                    Try again
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Input
                    type="search"
                    aria-label="Search invoices"
                    placeholder="Search invoices…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    prefix={<Search aria-hidden="true" className="h-4 w-4" />}
                    className="sm:max-w-xs"
                  />
                  <p aria-live="polite" className="font-lato text-sm text-muted">
                    Showing {matches.length} of {INVOICES.length} invoices
                  </p>
                </div>
                {selectedIds.size > 0 ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-md border border-subtle bg-surface-muted px-4 py-2.5">
                    <p className="font-montserrat text-sm font-medium text-foreground">
                      {selectedIds.size}{" "}
                      {selectedIds.size === 1 ? "invoice" : "invoices"} selected
                    </p>
                    <span className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" disabled>
                        Export
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedIds(new Set())}
                      >
                        Clear
                      </Button>
                    </span>
                  </div>
                ) : null}
                {matches.length > 0 ? (
                  <InvoiceTable
                    invoices={matches}
                    selectedIds={selectedIds}
                    onToggle={toggleOne}
                    onToggleAll={toggleAll}
                  />
                ) : (
                  <EmptyState
                    icon={<Inbox aria-hidden="true" className="h-5 w-5" />}
                    title="No invoices match your search."
                    description="Try a different invoice number or customer name."
                  />
                )}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-lato text-sm text-muted">
                    Showing {matches.length} of {INVOICES.length} invoices
                  </p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" disabled>
                      Previous
                    </Button>
                    <Button size="sm" variant="outline" disabled>
                      Next
                    </Button>
                  </div>
                </div>
                <p className="font-lato text-sm text-muted">
                  Below 640px the table scrolls horizontally inside its frame —
                  the markup stays a native table at every width.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Density</Subsection>
        <div className="flex flex-col gap-6">
          <DensityDemo density="compact" title="Compact — dense datasets" />
          <DensityDemo density="default" title="Default — product tables" />
          <DensityDemo
            density="comfortable"
            title="Comfortable — breathing room"
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Composition notes</Subsection>
        <Preview>
          <ul className="flex list-disc flex-col gap-1 pl-5 font-lato text-sm text-muted">
            <li>Amounts stay right-aligned with tabular numerals.</li>
            <li>Statuses always pair text with tone — never color alone.</li>
            <li>Selection lives in demo state; the primitive only paints it.</li>
            <li>Currency formatting belongs to the consuming layer.</li>
          </ul>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default TableSection;
