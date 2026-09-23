import { describe, expect, it } from "vitest";

import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
  mapProfileToForm,
} from "./business-profile-defaults";

describe("mapProfileToForm", () => {
  it("maps stored values onto controlled form strings", () => {
    const form = mapProfileToForm({
      organizationId: "org-a",
      organizationName: "Aventra Technologies Pvt. Ltd.",
      businessType: "Private Limited Company",
      industry: "Information Technology",
      website: "https://www.aventra.app",
      tagline: "Simplify Today. Grow Tomorrow.",
      email: "business@aventra.app",
      phone: "+91 98765 43210",
      altPhone: null,
      addressLine1: "123 Business Park, Tech Hub",
      addressLine2: null,
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560001",
      country: "India",
      primaryColor: "#f05803",
      secondaryColor: "#171717",
      brandTagline: "Simplify Today. Grow Tomorrow.",
      brandDescription: null,
      fontStyle: "lato-classic",
      layoutStyle: "classic",
    });

    expect(form.organizationName).toBe("Aventra Technologies Pvt. Ltd.");
    expect(form.altPhone).toBe("");
    expect(form.fontStyle).toBe("lato-classic");
    expect(form.layoutStyle).toBe("classic");
  });

  it("falls back to branding defaults for a fresh organization", () => {
    const form = mapProfileToForm(null);

    expect(form.organizationName).toBe("");
    expect(form.primaryColor).toBe(DEFAULT_PRIMARY_COLOR);
    expect(form.secondaryColor).toBe(DEFAULT_SECONDARY_COLOR);
    expect(form.fontStyle).toBe("montserrat-modern");
    expect(form.layoutStyle).toBe("modern");
  });
});
