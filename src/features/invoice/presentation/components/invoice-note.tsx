import { NotebookPen } from "lucide-react";

import cn from "@/shared/utils/cn";
import type { InvoiceData } from "../../domain/invoice";
import type { InvoicePanelTone } from "./invoice-parties";

/** Customer note card with script signoff. */
const InvoiceNote = ({
  invoice,
  tone,
}: {
  invoice: InvoiceData;
} & { tone: InvoicePanelTone }) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-[1.8mm] rounded-[3mm] p-[4mm]",
        tone === "premium" ? "bg-primary-muted/60" : "border border-subtle bg-surface",
      )}
    >
      <p className="flex items-center gap-[2.5mm]">
        <NotebookPen
          aria-hidden="true"
          className="h-[5mm] w-[5mm] text-primary"
          strokeWidth={1.75}
        />
        <span className="font-montserrat text-[11pt] font-bold text-foreground">
          {invoice.noteHeading}
        </span>
      </p>
      <p className="font-lato text-[9pt] leading-relaxed text-muted">
        {invoice.noteBody}
      </p>
      <span aria-hidden="true" className="h-[0.7mm] w-[10mm] bg-primary" />
      {tone === "premium" ? (
        <p className="whitespace-pre-line font-signature text-[13pt] leading-snug text-foreground">
          {invoice.noteSignoff}
        </p>
      ) : (
        <p className="whitespace-pre-line font-lato text-[9pt] italic leading-relaxed text-muted">
          {invoice.noteSignoff}
        </p>
      )}
    </div>
  );
};

export { InvoiceNote };
