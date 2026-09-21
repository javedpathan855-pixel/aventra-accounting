import { Building2, CalendarDays, Check } from "lucide-react";

import cn from "@/shared/utils/cn";
import type { InvoiceData } from "../../domain/invoice";
import { IconBadge } from "./invoice-brand";

export type InvoicePanelTone = "default" | "premium";

interface ToneProps {
  tone: InvoicePanelTone;
}

/** Bill-to block with building icon tile. */
const InvoiceBillTo = ({ billTo }: { billTo: InvoiceData["billTo"] }) => {
  return (
    <div className="flex items-start gap-[4mm]">
      <IconBadge>
        <Building2 className="h-[5mm] w-[5mm]" strokeWidth={1.75} />
      </IconBadge>
      <div className="flex min-w-0 flex-col">
        <p className="font-montserrat text-[9pt] font-semibold uppercase tracking-[0.18em] text-muted">
          Bill to
        </p>
        <p className="mt-[1.5mm] font-montserrat text-[12pt] font-bold leading-snug text-foreground">
          {billTo.name}
        </p>
        {billTo.addressLines.map((line) => (
          <p key={line} className="font-lato text-[9pt] leading-relaxed text-muted">
            {line}
          </p>
        ))}
        {billTo.gstin ? (
          <p className="mt-[1mm] font-lato text-[9pt] text-muted">
            GSTIN: {billTo.gstin}
          </p>
        ) : null}
      </div>
    </div>
  );
};

interface DetailRow {
  label: string;
  value: string;
}

/** Key/value details card with paid-status bar. */
const InvoiceDetailsCard = ({
  invoice,
  tone,
}: {
  invoice: InvoiceData;
} & ToneProps) => {
  const rows: DetailRow[] = [
    { label: "Issue Date", value: invoice.issueDate },
    { label: "Due Date", value: invoice.dueDate },
    { label: "Payment Terms", value: invoice.paymentTerms },
    { label: "Currency", value: invoice.currency },
    { label: "Place of Supply", value: invoice.placeOfSupply },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-[2.5mm] rounded-[3mm] p-[3.5mm]",
        tone === "premium" ? "bg-primary-muted/60" : "border border-subtle bg-surface",
      )}
    >
      <div className="flex items-start gap-[3mm]">
        <IconBadge>
          <CalendarDays className="h-[5mm] w-[5mm]" strokeWidth={1.75} />
        </IconBadge>
        <dl className="flex min-w-0 flex-1 flex-col gap-[1.2mm]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-[4mm]">
              <dt className="font-lato text-[9pt] text-muted">{row.label}</dt>
              <dd className="text-right font-lato text-[9pt] font-semibold text-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div
        className={cn(
          "flex items-center gap-[4mm] rounded-[2.5mm] px-[4mm] py-[2mm]",
          tone === "premium" ? "bg-primary-muted" : "border border-subtle bg-surface",
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-[7mm] w-[7mm] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Check className="h-[4mm] w-[4mm]" strokeWidth={3} />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-lato text-[8pt] text-muted">Status</span>
          <span className="font-montserrat text-[11pt] font-bold text-primary">
            {invoice.status}
          </span>
        </div>
        <span aria-hidden="true" className="mx-[1mm] h-[9mm] w-px bg-primary/40" />
        <div className="flex flex-col leading-tight">
          <span className="font-lato text-[8pt] text-muted">Paid on</span>
          <span className="font-lato text-[10pt] font-semibold text-foreground">
            {invoice.paidOn ?? invoice.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export { InvoiceBillTo, InvoiceDetailsCard };
export type { DetailRow };
