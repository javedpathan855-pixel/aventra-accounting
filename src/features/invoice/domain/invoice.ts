/**
 * Invoice domain model.
 *
 * Money is represented in integer paise throughout. All calculations
 * stay in integers and rounding happens once per tax row, so totals
 * cannot drift through binary floating point.
 */

export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue" | "Draft";

export interface InvoiceItem {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  /** Unit price in integer paise. */
  unitPricePaise: number;
}

export interface InvoiceParty {
  name: string;
  addressLines: string[];
  gstin?: string;
}

export interface InvoiceTaxInput {
  label: string;
  ratePercent: number;
}

export interface InvoiceTaxRow extends InvoiceTaxInput {
  amountPaise: number;
}

export interface InvoicePaymentInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface InvoiceData {
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  placeOfSupply: string;
  paidOn?: string;
  billTo: InvoiceParty;
  seller: InvoiceParty;
  items: InvoiceItem[];
  taxes: InvoiceTaxInput[];
  payment: InvoicePaymentInfo;
  noteHeading: string;
  noteBody: string;
  noteSignoff: string;
  footerTagline: string;
  website: string;
}

export interface InvoiceTotals {
  subtotalPaise: number;
  taxes: InvoiceTaxRow[];
  totalPaise: number;
  amountPaidPaise: number;
  amountDuePaise: number;
}

export const lineTotalPaise = (item: Pick<InvoiceItem, "quantity" | "unitPricePaise">): number =>
  item.quantity * item.unitPricePaise;

export const calcSubtotalPaise = (
  items: Array<Pick<InvoiceItem, "quantity" | "unitPricePaise">>,
): number => items.reduce((sum, item) => sum + lineTotalPaise(item), 0);

export const calcTaxPaise = (subtotalPaise: number, ratePercent: number): number =>
  Math.round((subtotalPaise * ratePercent) / 100);

/**
 * Builds authoritative totals from line items. Pass amountPaidPaise
 * explicitly — a Paid invoice pays the full total, anything else pays
 * what was actually received.
 */
export const calcInvoiceTotals = (
  items: Array<Pick<InvoiceItem, "quantity" | "unitPricePaise">>,
  taxes: InvoiceTaxInput[],
  amountPaidPaise: number,
): InvoiceTotals => {
  const subtotalPaise = calcSubtotalPaise(items);
  const taxRows = taxes.map((tax) => ({
    ...tax,
    amountPaise: calcTaxPaise(subtotalPaise, tax.ratePercent),
  }));
  const totalPaise =
    subtotalPaise + taxRows.reduce((sum, row) => sum + row.amountPaise, 0);

  return {
    subtotalPaise,
    taxes: taxRows,
    totalPaise,
    amountPaidPaise,
    amountDuePaise: totalPaise - amountPaidPaise,
  };
};

/**
 * Convenience over calcInvoiceTotals for display flows: a Paid invoice
 * counts as paid in full, anything else counts as unpaid. Partial
 * payments travel explicitly through calcInvoiceTotals instead.
 */
export const calcInvoiceTotalsForStatus = (
  items: Array<Pick<InvoiceItem, "quantity" | "unitPricePaise">>,
  taxes: InvoiceTaxInput[],
  status: InvoiceStatus,
): InvoiceTotals => {
  const base = calcInvoiceTotals(items, taxes, 0);
  const amountPaidPaise = status === "Paid" ? base.totalPaise : 0;

  return {
    ...base,
    amountPaidPaise,
    amountDuePaise: base.totalPaise - amountPaidPaise,
  };
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const formatINR = (paise: number): string =>
  inrFormatter.format(paise / 100);
