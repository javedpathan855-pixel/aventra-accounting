import type { InvoiceData } from "../domain/invoice";

/**
 * Demo fixture matching the reference invoice. Presentation-only data;
 * real invoices arrive from the future data layer in this same shape.
 */
export const demoInvoice: InvoiceData = {
  number: "INV-1048",
  status: "Paid",
  issueDate: "15 Mar 2025",
  dueDate: "29 Mar 2025",
  paymentTerms: "Net 14",
  currency: "INR",
  placeOfSupply: "Uttar Pradesh (09)",
  paidOn: "15 Mar 2025",
  billTo: {
    name: "Acme Industries Pvt. Ltd.",
    addressLines: [
      "123 Business Park, Sector 62",
      "Noida, Uttar Pradesh 201309",
      "India",
    ],
    gstin: "09AAECA1234F1Z5",
  },
  seller: {
    name: "Aventra Accounting Pvt. Ltd.",
    addressLines: [],
  },
  items: [
    {
      id: "software-subscription",
      title: "Accounting Software Subscription",
      subtitle: "Aventra Pro — Monthly Plan",
      quantity: 1,
      unitPricePaise: 499900,
    },
    {
      id: "onboarding-setup",
      title: "Onboarding & Setup",
      subtitle: "Initial setup and data migration",
      quantity: 1,
      unitPricePaise: 250000,
    },
    {
      id: "user-license",
      title: "Additional User License",
      subtitle: "Standard user access",
      quantity: 3,
      unitPricePaise: 49900,
    },
    {
      id: "priority-support",
      title: "Priority Support",
      subtitle: "Dedicated support (1 month)",
      quantity: 1,
      unitPricePaise: 100000,
    },
  ],
  taxes: [
    { label: "CGST", ratePercent: 9 },
    { label: "SGST", ratePercent: 9 },
  ],
  payment: {
    bankName: "HDFC Bank",
    accountName: "Aventra Accounting Pvt. Ltd.",
    accountNumber: "5020 1234 5678 90",
    ifscCode: "HDFC0001234",
  },
  noteHeading: "A Note from Aventra",
  noteBody:
    "We're grateful to have you as a customer. Your trust motivates us to keep building simple, powerful tools for modern businesses.",
  noteSignoff: "Together,\ntowards a brighter business.",
  footerTagline: "Modern Accounting for Modern Businesses",
  website: "www.aventra.app",
};
