import { describe, expect, it } from "vitest";

import {
  MODULE_STATUS_LABEL,
  MODULE_STATUS_TONE,
  PREVIEW_CUSTOMERS,
  PREVIEW_INVOICES,
  PREVIEW_REPORTS,
  ROADMAP_GROUPS,
} from "./roadmap-content";

describe("roadmap content model", () => {
  it("covers the planned groups with unique module ids", () => {
    expect(ROADMAP_GROUPS.map((group) => group.id)).toEqual([
      "core-business",
      "financial-operations",
      "compliance-organization",
    ]);

    const ids = ROADMAP_GROUPS.flatMap((group) => group.modules.map((entry) => entry.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(9);
  });

  it("labels every status honestly with a matching tone", () => {
    for (const group of ROADMAP_GROUPS) {
      for (const entry of group.modules) {
        expect(MODULE_STATUS_LABEL[entry.status]).toBeTruthy();
        expect(MODULE_STATUS_TONE[entry.status]).toBeTruthy();
        expect(entry.name).toBeTruthy();
        expect(entry.description).toBeTruthy();
      }
    }
  });

  it("keeps unimplemented modules out of the ready state", () => {
    const ready = ROADMAP_GROUPS.flatMap((group) => group.modules).filter(
      (entry) => entry.status === "foundation-ready",
    );

    expect(ready.map((entry) => entry.id)).toEqual(["organization"]);
  });

  it("provides labeled sample data for the preview", () => {
    expect(PREVIEW_INVOICES.length).toBeGreaterThan(0);
    expect(PREVIEW_CUSTOMERS.length).toBeGreaterThan(0);
    expect(PREVIEW_REPORTS.length).toBeGreaterThan(0);
  });
});
