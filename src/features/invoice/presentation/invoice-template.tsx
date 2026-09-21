import type { InvoiceData } from "../domain/invoice";
import { DefaultInvoiceTemplate } from "./templates/default-invoice-template";
import { PremiumInvoiceTemplate } from "./templates/premium-invoice-template";

export type InvoiceTemplateId = "default" | "premium";

interface InvoiceTemplateProps {
  template: InvoiceTemplateId;
  invoice: InvoiceData;
}

/**
 * Template switcher: one canonical invoice model, two presentations.
 * Add future templates (PDF export, email) here without touching data.
 */
const InvoiceTemplate = ({ template, invoice }: InvoiceTemplateProps) => {
  if (template === "premium") {
    return <PremiumInvoiceTemplate invoice={invoice} />;
  }

  return <DefaultInvoiceTemplate invoice={invoice} />;
};

export { InvoiceTemplate };
export type { InvoiceTemplateProps };
