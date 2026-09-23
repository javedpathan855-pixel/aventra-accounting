// Server-action tenancy tests. The session and repository modules are
// mocked at the boundary; assertions prove the tenant id always comes
// from the verified session, never from the client payload.

import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/shared/errors/app-error";

const { mockRequireTenantContext, mockUpdate, mockGetByOrganizationId } = vi.hoisted(
  () => ({
    mockRequireTenantContext: vi.fn(),
    mockUpdate: vi.fn(),
    mockGetByOrganizationId: vi.fn(),
  }),
);

vi.mock("@/features/auth/infrastructure/auth/session", () => ({
  requireTenantContext: mockRequireTenantContext,
}));

vi.mock(
  "@/features/organization/data/repositories/prisma-business-profile-repository",
  () => ({
    prismaBusinessProfileRepository: {
      getByOrganizationId: mockGetByOrganizationId,
      update: mockUpdate,
    },
  }),
);

import {
  getBusinessProfileAction,
  updateBusinessProfileAction,
} from "./business-profile-actions";

const validInput = {
  organizationName: "Aventra Technologies Pvt. Ltd.",
  businessType: "Private Limited Company",
  industry: "Information Technology",
  website: "https://www.aventra.app",
  tagline: "Simplify Today. Grow Tomorrow.",
  email: "business@aventra.app",
  phone: "+91 98765 43210",
  altPhone: "",
  addressLine1: "123 Business Park, Tech Hub",
  addressLine2: "",
  city: "Bengaluru",
  state: "Karnataka",
  pinCode: "560001",
  country: "India",
  primaryColor: "#f05803",
  secondaryColor: "#171717",
  brandTagline: "Simplify Today. Grow Tomorrow.",
  brandDescription: "",
  fontStyle: "montserrat-modern",
  layoutStyle: "modern",
};

const sessionContext = () => ({
  user: { id: "user-1", name: "Owner", email: "owner@aventra.app", emailVerified: true },
  membership: {
    organizationId: "org-a",
    organizationName: "Aventra",
    slug: "aventra",
    role: "owner",
  },
  tenant: {
    userId: "user-1",
    organizationId: "org-a",
    membership: {
      organizationId: "org-a",
      organizationName: "Aventra",
      slug: "aventra",
      role: "owner",
    },
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateBusinessProfileAction", () => {
  it("persists under the session tenant and strips smuggled tenancy", async () => {
    mockRequireTenantContext.mockResolvedValue(sessionContext());
    mockUpdate.mockImplementation(async (organizationId: string, input: unknown) => ({
      ...(input as Record<string, unknown>),
      organizationId,
    }));

    const result = await updateBusinessProfileAction({
      ...validInput,
      organizationId: "org-evil",
    });

    expect(result.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      "org-a",
      expect.not.objectContaining({ organizationId: "org-evil" }),
    );
  });

  it("returns field errors for invalid input without persisting", async () => {
    mockRequireTenantContext.mockResolvedValue(sessionContext());

    const result = await updateBusinessProfileAction({
      ...validInput,
      organizationName: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.fieldErrors?.organizationName).toBeTruthy();
    }
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("denies unauthenticated callers with a safe envelope", async () => {
    mockRequireTenantContext.mockRejectedValue(new AppError("INVALID_CREDENTIALS"));

    const result = await updateBusinessProfileAction(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("INVALID_CREDENTIALS");
    }
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe("getBusinessProfileAction", () => {
  it("reads through the session tenant", async () => {
    mockRequireTenantContext.mockResolvedValue(sessionContext());
    mockGetByOrganizationId.mockResolvedValue({
      organizationId: "org-a",
      organizationName: "Aventra",
    });

    const result = await getBusinessProfileAction();

    expect(result.success).toBe(true);
    expect(mockGetByOrganizationId).toHaveBeenCalledWith("org-a");
  });
});
