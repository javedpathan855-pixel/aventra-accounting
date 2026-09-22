import { describe, expect, it } from "vitest";

import { avatarInitial } from "./avatar";

describe("avatarInitial", () => {
  it("returns the upper-cased first character", () => {
    expect(avatarInitial("Aventra")).toBe("A");
    expect(avatarInitial("javed")).toBe("J");
  });

  it("trims leading whitespace before reading the initial", () => {
    expect(avatarInitial("  Priya Sharma")).toBe("P");
  });

  it("falls back to A for empty or blank names", () => {
    expect(avatarInitial("")).toBe("A");
    expect(avatarInitial("   ")).toBe("A");
  });
});
