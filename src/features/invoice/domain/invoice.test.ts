import { describe, expect, it } from "vitest";

import {
  calcInvoiceTotals,
  calcInvoiceTotalsForStatus,
  calcSubtotalPaise,
  calcTaxPaise,
  formatINR,
  lineTotalPaise,
} from "./invoice";

const demoItems = [
  { quantity: 1, unitPricePaise: 499900 },
  { quantity: 1, unitPricePaise: 250000 },
  { quantity: 3, unitPricePaise: 49900 },
  { quantity: 1, unitPricePaise: 100000 },
];

describe("lineTotalPaise", () => {
  it("multiplies quantity by unit price in paise", () => {
    expect(lineTotalPaise({ quantity: 3, unitPricePaise: 49900 })).toBe(149700);
  });
});

describe("calcSubtotalPaise", () => {
  it("sums the demo invoice to 999600 paise", () => {
    expect(calcSubtotalPaise(demoItems)).toBe(999600);
  });

  it("returns 0 for no items", () => {
    expect(calcSubtotalPaise([])).toBe(0);
  });
});

describe("calcTaxPaise", () => {
  it("computes 9% CGST on the demo subtotal without float drift", () => {
    expect(calcTaxPaise(999600, 9)).toBe(89964);
  });

  it("rounds half paise up once per tax row", () => {
    expect(calcTaxPaise(999, 9)).toBe(90);
  });
});

describe("calcInvoiceTotals", () => {
  it("builds the exact demo totals", () => {
    const totals = calcInvoiceTotals(
      demoItems,
      [
        { label: "CGST", ratePercent: 9 },
        { label: "SGST", ratePercent: 9 },
      ],
      1179528,
    );

    expect(totals.subtotalPaise).toBe(999600);
    expect(totals.taxes).toEqual([
      { label: "CGST", ratePercent: 9, amountPaise: 89964 },
      { label: "SGST", ratePercent: 9, amountPaise: 89964 },
    ]);
    expect(totals.totalPaise).toBe(1179528);
    expect(totals.amountDuePaise).toBe(0);
  });

  it("leaves amount due when partially paid", () => {
    const totals = calcInvoiceTotals(demoItems, [], 500000);

    expect(totals.totalPaise).toBe(999600);
    expect(totals.amountDuePaise).toBe(499600);
  });
});

describe("calcInvoiceTotalsForStatus", () => {
  const taxes = [
    { label: "CGST", ratePercent: 9 },
    { label: "SGST", ratePercent: 9 },
  ];

  it("marks a Paid invoice as paid in full", () => {
    const totals = calcInvoiceTotalsForStatus(demoItems, taxes, "Paid");

    expect(totals.totalPaise).toBe(1179528);
    expect(totals.amountPaidPaise).toBe(1179528);
    expect(totals.amountDuePaise).toBe(0);
  });

  it("leaves the full total due for other statuses", () => {
    const totals = calcInvoiceTotalsForStatus(demoItems, taxes, "Unpaid");

    expect(totals.amountPaidPaise).toBe(0);
    expect(totals.amountDuePaise).toBe(1179528);
  });
});

describe("formatINR", () => {
  it("formats en-IN currency with two decimals", () => {
    expect(formatINR(999600)).toBe("₹9,996.00");
    expect(formatINR(89964)).toBe("₹899.64");
    expect(formatINR(1179528)).toBe("₹11,795.28");
    expect(formatINR(0)).toBe("₹0.00");
  });
});
