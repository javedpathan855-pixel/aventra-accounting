import { calcInvoiceTotalsForStatus, type InvoiceData } from "../../domain/invoice";
import { InvoiceFooter } from "../components/invoice-footer";
import {
  InvoiceBrand,
  InvoiceTagline,
} from "../components/invoice-brand";
import { InvoiceItemsTable } from "../components/invoice-items-table";
import { InvoiceNote } from "../components/invoice-note";
import { InvoiceBillTo, InvoiceDetailsCard } from "../components/invoice-parties";
import { InvoicePaymentInfo, InvoiceSignature } from "../components/invoice-payment";
import { InvoicePage } from "../components/invoice-page";
import { InvoiceTotals } from "../components/invoice-totals";

interface DefaultInvoiceTemplateProps {
  invoice: InvoiceData;
}

/**
 * Default A4 invoice — clean hairline panels on white, typed signature,
 * no watermark. Same canonical data model as premium; only the
 * presentation treatment differs.
 */
const DefaultInvoiceTemplate = ({ invoice }: DefaultInvoiceTemplateProps) => {
  const totals = calcInvoiceTotalsForStatus(
    invoice.items,
    invoice.taxes,
    invoice.status,
  );

  return (
    <InvoicePage>
      <div className="flex items-start justify-between gap-[6mm]">
        <InvoiceBrand />
        <InvoiceTagline />
      </div>

      <div className="mt-[4mm] flex items-start justify-between gap-[8mm]">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-montserrat text-[10pt] font-bold uppercase tracking-[0.32em] text-primary">
            Invoice
          </p>
          <h1 className="mt-[1mm] font-montserrat text-[30pt] font-extrabold leading-none text-foreground">
            {invoice.number}
          </h1>
          <p className="mt-[3mm] font-lato text-[10.5pt] font-bold text-foreground">
            Thank you for being part of our journey.
          </p>
          <p className="mt-[1.5mm] font-lato text-[9pt] leading-relaxed text-muted">
            This invoice includes the services and products as per our
            agreement. Please find the details below.
          </p>
        </div>
        <div className="w-[68mm] shrink-0">
          <InvoiceDetailsCard invoice={invoice} tone="default" />
        </div>
      </div>

      <div className="mt-[3mm] max-w-[110mm]">
        <InvoiceBillTo billTo={invoice.billTo} />
      </div>

      <div className="mt-[3mm]">
        <InvoiceItemsTable invoice={invoice} tone="default" />
      </div>

      <div className="mt-[3mm] grid grid-cols-[1fr_62mm] items-start gap-[6mm]">
        <InvoiceNote invoice={invoice} tone="default" />
        <InvoiceTotals invoice={invoice} totals={totals} tone="default" />
      </div>

      <div className="mt-[3mm] grid grid-cols-[1fr_62mm] items-start gap-[6mm]">
        <InvoicePaymentInfo invoice={invoice} />
        <InvoiceSignature invoice={invoice} tone="default" />
      </div>

      <div className="mt-[3mm]">
        <InvoiceFooter invoice={invoice} />
      </div>
    </InvoicePage>
  );
};

export { DefaultInvoiceTemplate };
