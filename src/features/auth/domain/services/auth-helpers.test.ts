import { describe, expect, it } from "vitest";

import { normalizeEmail, slugifyOrganizationName } from "./auth-helpers";

describe("normalizeEmail", () => {
  it("lowercases and trims so uniqueness checks are consistent", () => {
    expect(normalizeEmail("  Rahul@Example.COM ")).toBe("rahul@example.com");
    expect(normalizeEmail("AVENTRA@NEXTGEN.IN")).toBe("aventra@nextgen.in");
  });
});

describe("slugifyOrganizationName", () => {
  it("derives a url-safe base slug", () => {
    expect(slugifyOrganizationName("Nextgen Services")).toBe("nextgen-services");
    expect(slugifyOrganizationName("  Aventra & Co. Pvt Ltd! ")).toBe(
      "aventra-co-pvt-ltd",
    );
  });

  it("strips diacritics and caps length", () => {
    expect(slugifyOrganizationName("Müller Béhör")).toBe("muller-behor");
    expect(slugifyOrganizationName("a".repeat(100)).length).toBeLessThanOrEqual(40);
  });

  it("falls back for names without usable characters", () => {
    expect(slugifyOrganizationName("!!!")).toBe("organization");
    expect(slugifyOrganizationName("")).toBe("organization");
  });
});
