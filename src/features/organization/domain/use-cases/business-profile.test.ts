// Business-profile use-case tests with an in-memory fake repository.
// Deterministic, no I/O: tenancy is an explicit argument, mirroring how
// the server boundary derives it from the session.

import { describe, expect, it, vi } from "vitest";

import { createInMemoryRateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";

import type {
  BusinessProfileData,
  BusinessProfileRepository,
} from "../repositories/business-profile-repository";
import { getBusinessProfile } from "./get-business-profile";
import { updateBusinessProfile } from "./update-business-profile";

const profileRow = (organizationId: string): BusinessProfileData => ({
  organizationId,
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
  fontStyle: "montserrat-modern",
  layoutStyle: "modern",
});

const createFakeRepository = (rows: Map<string, BusinessProfileData>) => {
  const repository: BusinessProfileRepository = {
    getByOrganizationId: vi.fn(async (organizationId: string) =>
      rows.get(organizationId) ?? null,
    ),
    update: vi.fn(async (organizationId: string, input) => {
      const next: BusinessProfileData = { ...input, organizationId };
      rows.set(organizationId, next);
      return next;
    }),
  };
  return repository;
};

const validInput = {
  ...profileRow("org-a"),
  organizationId: undefined,
  // Form-shaped input: empty optionals travel as "" (never null).
  altPhone: "",
  addressLine2: "",
  brandDescription: "",
};

describe("getBusinessProfile", () => {
  it("returns the tenant profile", async () => {
    const repository = createFakeRepository(
      new Map([["org-a", profileRow("org-a")]]),
    );

    const profile = await getBusinessProfile(repository, "org-a");

    expect(profile.organizationName).toBe("Aventra Technologies Pvt. Ltd.");
  });

  it("throws NOT_FOUND for a missing tenant row without leaking identifiers", async () => {
    const repository = createFakeRepository(new Map());

    await expect(getBusinessProfile(repository, "org-missing")).rejects.toMatchObject(
      { code: "NOT_FOUND" },
    );
  });
});

describe("updateBusinessProfile", () => {
  it("validates, rate-limits, and persists under the tenant id", async () => {
    const repository = createFakeRepository(
      new Map([["org-a", profileRow("org-a")]]),
    );

    const updated = await updateBusinessProfile("org-a", validInput, {
      repository,
      limits: createInMemoryRateLimiter(),
      userId: "user-1",
    });

    expect(updated.city).toBe("Bengaluru");
    expect(repository.update).toHaveBeenCalledWith(
      "org-a",
      expect.objectContaining({ city: "Bengaluru" }),
    );
  });

  it("rejects invalid input with field errors and writes nothing", async () => {
    const repository = createFakeRepository(
      new Map([["org-a", profileRow("org-a")]]),
    );

    await expect(
      updateBusinessProfile("org-a", { ...validInput, organizationName: "" }, {
        repository,
        limits: createInMemoryRateLimiter(),
        userId: "user-1",
      }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("never lets the client payload choose the tenant", async () => {
    const repository = createFakeRepository(
      new Map([
        ["org-a", profileRow("org-a")],
        ["org-b", profileRow("org-b")],
      ]),
    );

    // A hostile organizationId smuggled inside the payload is stripped
    // by the schema; persistence still targets the server-side tenant.
    await updateBusinessProfile(
      "org-a",
      { ...validInput, organizationId: "org-b" },
      { repository, limits: createInMemoryRateLimiter(), userId: "user-1" },
    );

    const storedB = await repository.getByOrganizationId("org-b");
    expect(storedB?.city).toBe("Bengaluru");
    expect(repository.update).toHaveBeenCalledWith(
      "org-a",
      expect.not.objectContaining({ organizationId: "org-b" }),
    );
  });
});
