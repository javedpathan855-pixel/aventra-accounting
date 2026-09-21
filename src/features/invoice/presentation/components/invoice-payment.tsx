import { Landmark } from "lucide-react";

import type { InvoiceData } from "../../domain/invoice";
import type { InvoicePanelTone } from "./invoice-parties";

/** Payment information grid. */
const InvoicePaymentInfo = ({ invoice }: { invoice: InvoiceData }) => {
  const rows: Array<[string, string]> = [
    ["Bank Name", invoice.payment.bankName],
    ["Account Name", invoice.payment.accountName],
    ["Account Number", invoice.payment.accountNumber],
    ["IFSC Code", invoice.payment.ifscCode],
  ];

  return (
    <div className="flex flex-col gap-[3mm]">
      <p className="flex items-center gap-[2.5mm]">
        <Landmark
          aria-hidden="true"
          className="h-[5mm] w-[5mm] text-foreground"
          strokeWidth={1.75}
        />
        <span className="font-montserrat text-[11pt] font-bold text-foreground">
          Payment Information
        </span>
      </p>
      <dl className="grid grid-cols-[32mm_1fr] gap-x-[4mm] gap-y-[1.2mm]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-lato text-[9pt] text-muted">{label}</dt>
            <dd className="font-lato text-[9pt] font-semibold text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

interface InvoiceSignatureProps {
  invoice: InvoiceData;
  tone: InvoicePanelTone;
}

/** Authorised signatory block. */
const InvoiceSignature = ({ invoice, tone }: InvoiceSignatureProps) => {
  return (
    <div className="flex flex-col items-end gap-[1mm] text-right">
      {tone === "premium" ? (
        <p className="font-signature text-[24pt] leading-none text-foreground">
          Aventra
        </p>
      ) : null}
      <div className="flex flex-col items-end">
        <p className="font-lato text-[9.5pt] font-semibold text-foreground">
          {invoice.seller.name}
        </p>
        <p className="font-lato text-[9pt] text-muted">Authorised Signatory</p>
      </div>
    </div>
  );
};

export { InvoicePaymentInfo, InvoiceSignature };
