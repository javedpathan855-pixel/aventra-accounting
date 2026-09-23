import { describe, expect, it } from "vitest";

import {
  FAVICON_CONSTRAINTS,
  LOGO_CONSTRAINTS,
  validateImageFile,
} from "./upload-validation";

describe("validateImageFile", () => {
  it("accepts a valid logo file", () => {
    expect(
      validateImageFile(
        { type: "image/png", size: 500_000, name: "logo.png" },
        LOGO_CONSTRAINTS,
      ),
    ).toBeNull();
  });

  it("rejects oversized files", () => {
    expect(
      validateImageFile(
        { type: "image/png", size: 3 * 1024 * 1024, name: "logo.png" },
        LOGO_CONSTRAINTS,
      ),
    ).toBe("File must be 2MB or smaller");
    expect(
      validateImageFile(
        { type: "image/png", size: 2 * 1024 * 1024, name: "icon.png" },
        FAVICON_CONSTRAINTS,
      ),
    ).toBe("File must be 1MB or smaller");
  });

  it("rejects unsupported types and mismatched extensions", () => {
    expect(
      validateImageFile(
        { type: "image/gif", size: 100_000, name: "logo.gif" },
        LOGO_CONSTRAINTS,
      ),
    ).toBe("Unsupported file type");
    // MIME spoofed but extension outside the allow-list.
    expect(
      validateImageFile(
        { type: "image/png", size: 100_000, name: "logo.bmp" },
        LOGO_CONSTRAINTS,
      ),
    ).toBe("Unsupported file type");
  });

  it("accepts favicon formats including ICO", () => {
    expect(
      validateImageFile(
        { type: "image/x-icon", size: 50_000, name: "favicon.ico" },
        FAVICON_CONSTRAINTS,
      ),
    ).toBeNull();
  });
});
