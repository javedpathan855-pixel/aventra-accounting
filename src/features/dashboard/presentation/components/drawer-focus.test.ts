import { describe, expect, it } from "vitest";

import { nextFocusInTrap } from "./drawer-focus";

describe("drawer focus trap", () => {
  const first = { id: "first" };
  const middle = { id: "middle" };
  const last = { id: "last" };
  const items = [first, middle, last] as unknown as HTMLElement[];

  it("returns null when focus is in the middle of the trap", () => {
    expect(nextFocusInTrap(items, middle, false)).toBeNull();
    expect(nextFocusInTrap(items, middle, true)).toBeNull();
  });

  it("wraps forward from the last item to the first", () => {
    expect(nextFocusInTrap(items, last, false)).toBe(first);
  });

  it("wraps backward from the first item to the last", () => {
    expect(nextFocusInTrap(items, first, true)).toBe(last);
  });

  it("returns null when the drawer has no focusables", () => {
    expect(nextFocusInTrap([], null, false)).toBeNull();
  });
});
