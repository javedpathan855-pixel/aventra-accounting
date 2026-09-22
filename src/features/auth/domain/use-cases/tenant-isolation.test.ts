// Multi-tenant authorization tests (Phase 2.5).
//
// User A + Organization A, User B + Organization B. Every assertion
// verifies server-side denial through the repository contract and the
// tenant resolver — never by hiding UI elements.

import { describe, expect, it } from "vitest";

import { AppError } from "@/shared/errors/app-error";
import { normalizeEmail } from "../services/auth-helpers";
import { resolveTenantContext } from "../services/tenant-context";

import { createFakes } from "./auth-test-fakes";
import { registerUser } from "./register-user";

const register = async (
  fakes: ReturnType<typeof createFakes>,
  input: { name: string; organization: string; email: string; password: string },
  clientIp: string,
) =>
  registerUser(
    {
      name: input.name,
      organization: input.organization,
      email: input.email,
      password: input.password,
      confirmPassword: input.password,
      terms: true,
    },
    {
      auth: fakes.auth,
      orgs: fakes.orgs,
      notify: fakes.notify,
      limits: fakes.limits,
      events: fakes.events,
      generateId: fakes.ids.generateId,
      randomSuffix: fakes.ids.randomSuffix,
      clientIp,
    },
  );

describe("multi-tenant authorization", () => {
  it("isolates two registrations into distinct organizations", async () => {
    const fakes = createFakes();
    const emailA = "tenant-a@example.com";
    const emailB = "tenant-b@example.com";

    await register(
      fakes,
      { name: "Tenant A", organization: "Org A", email: emailA, password: "Password-1" },
      "10.0.0.1",
    );
    await register(
      fakes,
      { name: "Tenant B", organization: "Org B", email: emailB, password: "Password-1" },
      "10.0.0.2",
    );

    const membershipsA = await fakes.orgs.findMembershipsByUserId(
      `user-${normalizeEmail(emailA)}`,
    );
    const membershipsB = await fakes.orgs.findMembershipsByUserId(
      `user-${normalizeEmail(emailB)}`,
    );

    expect(membershipsA).toHaveLength(1);
    expect(membershipsB).toHaveLength(1);
    expect(membershipsA[0]?.organizationId).not.toBe(
      membershipsB[0]?.organizationId,
    );
  });

  it("denies User A access to Organization B server-side", async () => {
    const fakes = createFakes();
    const emailA = "cross-a@example.com";
    const emailB = "cross-b@example.com";

    await register(
      fakes,
      { name: "Cross A", organization: "Org A", email: emailA, password: "Password-1" },
      "10.0.0.3",
    );
    await register(
      fakes,
      { name: "Cross B", organization: "Org B", email: emailB, password: "Password-1" },
      "10.0.0.4",
    );

    const userIdA = `user-${normalizeEmail(emailA)}`;
    const membershipsA = await fakes.orgs.findMembershipsByUserId(userIdA);
    const membershipsB = await fakes.orgs.findMembershipsByUserId(
      `user-${normalizeEmail(emailB)}`,
    );
    const orgB = membershipsB[0]?.organizationId as string;

    // Repository boundary: A has no membership row in B's organization.
    await expect(fakes.orgs.findMembership(userIdA, orgB)).resolves.toBeNull();

    // Tenant boundary: presenting B's organization as A's active tenant
    // is denied, never silently re-scoped.
    let error: unknown = null;
    try {
      resolveTenantContext({
        userId: userIdA,
        memberships: membershipsA,
        activeOrganizationId: orgB,
      });
    } catch (thrown) {
      error = thrown;
    }
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).code).toBe("FORBIDDEN");
  });
});
