import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";

interface InvoicePageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Fixed A4 portrait document shell. Physical millimetre sizing keeps
 * screen, print preview, PDF, and paper identical — never px guesses,
 * transforms, or zoom. `data-theme="light"` pins the document to the
 * light token set so the printed page is stable in any app theme.
 */
const InvoicePage = ({ children, className }: InvoicePageProps) => {
  return (
    <div
      data-theme="light"
      className={cn(
        "invoice-print-page",
        "relative flex w-[210mm] flex-col overflow-hidden",
        "min-h-[297mm] bg-surface px-[12mm] pb-[6mm] pt-[8mm]",
        "rounded-xl text-left text-foreground shadow-lg",
        "print:m-0 print:rounded-none print:shadow-none",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface InvoiceWatermarkProps {
  letter?: string;
}

/**
 * Oversized decorative brand initial, clipped by the page overflow.
 * Pure text — crisp at any resolution, prints via color-adjust rules.
 */
const InvoiceWatermark = ({ letter = "A" }: InvoiceWatermarkProps) => {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[28mm] -right-[10mm] select-none font-montserrat text-[110mm] font-black leading-none text-primary opacity-[0.07]"
    >
      {letter}
    </span>
  );
};

export { InvoicePage, InvoiceWatermark };
