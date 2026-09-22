import { describe, expect, it } from "vitest";

import { nextTheme, normalizeTheme, THEME_ORDER } from "./theme-switcher";

describe("theme switcher model", () => {
  it("cycles light -> dark -> system -> light", () => {
    expect(THEME_ORDER).toEqual(["light", "dark", "system"]);
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
    expect(nextTheme("system")).toBe("light");
  });

  it("normalizes unknown stored values to system", () => {
    expect(normalizeTheme("light")).toBe("light");
    expect(normalizeTheme("dark")).toBe("dark");
    expect(normalizeTheme("system")).toBe("system");
    expect(normalizeTheme(undefined)).toBe("system");
    expect(normalizeTheme("midnight")).toBe("system");
  });
});
