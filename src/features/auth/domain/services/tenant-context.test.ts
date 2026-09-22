import { describe, expect, it } from "vitest";

import { AppError } from "@/shared/errors/app-error";
import type { OwnerMembership } from "../repositories/organization-repository";

import { resolveTenantContext } from "./tenant-context";

const membership = (
  organizationId: string,
  organizationName = `Org ${organizationId}`,
): OwnerMembership => ({
  organizationId,
  organizationName,
  slug: `org-${organizationId}`,
  role: "owner",
});

const expectForbidden = (run: () => unknown) => {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).code).toBe("FORBIDDEN");
    return;
  }
  throw new Error("Expected FORBIDDEN but no error was thrown");
};

describe("resolveTenantContext", () => {
  it("falls back deterministically to the only membership", () => {
    const context = resolveTenantContext({
      userId: "user-a",
      memberships: [membership("org-a")],
    });

    expect(context.organizationId).toBe("org-a");
  });

  it("resolves the session-active organization when the user belongs to it", () => {
    const context = resolveTenantContext({
      userId: "user-a",
      memberships: [membership("org-a"), membership("org-b")],
      activeOrganizationId: "org-b",
    });

    expect(context.organizationId).toBe("org-b");
  });

  it("denies an active organization the user is not a member of", () => {
    expectForbidden(() =>
      resolveTenantContext({
        userId: "user-a",
        memberships: [membership("org-a")],
        activeOrganizationId: "org-b",
      }),
    );
  });

  it("denies when the user belongs to no organization", () => {
    expectForbidden(() =>
      resolveTenantContext({ userId: "user-a", memberships: [] }),
    );
  });

  it("denies without an explicit selection when several memberships exist", () => {
    expectForbidden(() =>
      resolveTenantContext({
        userId: "user-a",
        memberships: [membership("org-a"), membership("org-b")],
      }),
    );
  });

  it("never resolves a foreign organization silently (cross-tenant)", () => {
    // User A owns Org A; User B owns Org B. Presenting B's org as A's
    // active organization must be denied server-side, not re-scoped.
    expectForbidden(() =>
      resolveTenantContext({
        userId: "user-a",
        memberships: [membership("org-a", "Org A")],
        activeOrganizationId: "org-b",
      }),
    );
  });
});
