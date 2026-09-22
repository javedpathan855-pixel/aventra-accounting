import { describe, expect, it } from "vitest";

import { DASHBOARD_NAV } from "./dashboard-nav";

describe("dashboard navigation", () => {
  it("exposes exactly one available destination with a real route", () => {
    const available = DASHBOARD_NAV.filter((item) => item.status === "available");

    expect(available.map((item) => item.id)).toEqual(["dashboard"]);
    for (const item of available) {
      expect(item.href).toBeTruthy();
    }
  });

  it("marks future modules coming-soon with a notice and no dead route", () => {
    const upcoming = DASHBOARD_NAV.filter((item) => item.status === "coming-soon");

    expect(upcoming.length).toBeGreaterThan(0);
    for (const item of upcoming) {
      expect(item.href).toBeUndefined();
      expect(item.notice).toBeTruthy();
    }
  });

  it("keeps unique ids and labels", () => {
    const ids = DASHBOARD_NAV.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of DASHBOARD_NAV) {
      expect(item.label).toBeTruthy();
    }
  });
});
