import { Wallet } from "lucide-react";

import cn from "@/shared/utils/cn";
import {
  formatINR,
  type InvoiceData,
  type InvoiceTotals,
} from "../../domain/invoice";
import type { InvoicePanelTone } from "./invoice-parties";

/** Totals column with amount-due band. Values come from calcInvoiceTotals. */
const InvoiceTotals = ({
  invoice,
  totals,
  tone,
}: {
  invoice: InvoiceData;
  totals: InvoiceTotals;
} & { tone: InvoicePanelTone }) => {
  return (
    <div className="flex flex-col">
      <dl className="flex flex-col gap-[2mm]">
        <div className="flex items-baseline justify-between gap-[4mm]">
          <dt className="font-lato text-[9.5pt] text-muted">Subtotal</dt>
          <dd className="font-montserrat text-[10pt] font-semibold text-foreground">
            {formatINR(totals.subtotalPaise)}
          </dd>
        </div>
        {totals.taxes.map((tax) => (
          <div
            key={tax.label}
            className="flex items-baseline justify-between gap-[4mm]"
          >
            <dt className="font-lato text-[9.5pt] text-muted">
              {tax.label} ({tax.ratePercent}%)
            </dt>
            <dd className="font-montserrat text-[10pt] font-semibold text-foreground">
              {formatINR(tax.amountPaise)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-[2mm] flex items-center justify-between gap-[4mm] border-t border-subtle pt-[2mm]">
        <p className="font-montserrat text-[12pt] font-bold text-foreground">
          Total
        </p>
        <p className="font-montserrat text-[19pt] font-bold text-foreground">
          {formatINR(totals.totalPaise)}
        </p>
      </div>
      <div
        className={cn(
          "mt-[2.5mm] flex flex-col gap-[1mm] rounded-[2.5mm] px-[4mm] py-[2.5mm]",
          tone === "premium" ? "bg-primary-muted" : "border border-subtle bg-surface",
        )}
      >
        <div className="flex items-center justify-between gap-[4mm]">
          <span className="flex items-center gap-[2.5mm]">
            <Wallet
              aria-hidden="true"
              className="h-[5mm] w-[5mm] text-primary"
              strokeWidth={1.75}
            />
            <span className="font-montserrat text-[11pt] font-bold text-primary">
              Amount Due
            </span>
          </span>
          <span className="font-montserrat text-[14pt] font-bold text-primary">
            {formatINR(totals.amountDuePaise)}
          </span>
        </div>
        {invoice.paidOn ? (
          <p className="font-lato text-[8.5pt] text-muted">
            Paid in full on {invoice.paidOn}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export { InvoiceTotals };
