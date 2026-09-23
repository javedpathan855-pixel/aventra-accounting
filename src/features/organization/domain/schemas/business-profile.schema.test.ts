import { describe, expect, it } from "vitest";

import { BusinessProfileSchema } from "./business-profile.schema";

const valid = {
  organizationName: "Aventra Technologies Pvt. Ltd.",
  businessType: "Private Limited Company",
  industry: "Information Technology",
  website: "https://www.aventra.app",
  tagline: "Simplify Today. Grow Tomorrow.",
  email: "business@aventra.app",
  phone: "+91 98765 43210",
  altPhone: "+91 98765 43211",
  addressLine1: "123 Business Park, Tech Hub",
  addressLine2: "8th Floor, Tower A",
  city: "Bengaluru",
  state: "Karnataka",
  pinCode: "560001",
  country: "India",
  primaryColor: "#f05803",
  secondaryColor: "#171717",
  brandTagline: "Simplify Today. Grow Tomorrow.",
  brandDescription: "A modern accounting solution for growing businesses.",
  fontStyle: "montserrat-modern",
  layoutStyle: "modern",
};

describe("BusinessProfileSchema", () => {
  it("accepts a complete valid profile", () => {
    const result = BusinessProfileSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    for (const field of [
      "organizationName",
      "businessType",
      "addressLine1",
      "city",
      "state",
      "pinCode",
      "country",
    ] as const) {
      const result = BusinessProfileSchema.safeParse({ ...valid, [field]: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors[field]).toBeTruthy();
      }
    }
  });

  it("rejects invalid URLs, emails, phones, and PIN codes", () => {
    expect(
      BusinessProfileSchema.safeParse({ ...valid, website: "not-a-url" }).success,
    ).toBe(false);
    expect(
      BusinessProfileSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
    expect(BusinessProfileSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(
      false,
    );
    expect(
      BusinessProfileSchema.safeParse({ ...valid, pinCode: "!@#" }).success,
    ).toBe(false);
  });

  it("treats blank optionals as absent", () => {
    const result = BusinessProfileSchema.safeParse({
      ...valid,
      industry: "",
      website: "",
      tagline: "",
      email: "",
      phone: "",
      altPhone: "",
      addressLine2: "",
      brandTagline: "",
      brandDescription: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.website).toBeUndefined();
      expect(result.data.email).toBeUndefined();
      expect(result.data.brandDescription).toBeUndefined();
    }
  });

  it("rejects invalid hex colors", () => {
    expect(
      BusinessProfileSchema.safeParse({ ...valid, primaryColor: "f05803" }).success,
    ).toBe(false);
    expect(
      BusinessProfileSchema.safeParse({ ...valid, primaryColor: "#fff" }).success,
    ).toBe(false);
    expect(
      BusinessProfileSchema.safeParse({ ...valid, secondaryColor: "#zzzzzz" })
        .success,
    ).toBe(false);
  });

  it("enforces the 200-character brand description limit", () => {
    const ok = BusinessProfileSchema.safeParse({
      ...valid,
      brandDescription: "a".repeat(200),
    });
    const tooLong = BusinessProfileSchema.safeParse({
      ...valid,
      brandDescription: "a".repeat(201),
    });

    expect(ok.success).toBe(true);
    expect(tooLong.success).toBe(false);
  });

  it("rejects unknown font and layout styles", () => {
    expect(
      BusinessProfileSchema.safeParse({ ...valid, fontStyle: "Inter (Modern)" })
        .success,
    ).toBe(false);
    expect(
      BusinessProfileSchema.safeParse({ ...valid, layoutStyle: "fancy" }).success,
    ).toBe(false);
  });
});
