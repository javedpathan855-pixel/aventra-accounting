// Canonical tenant-context resolution (domain layer, pure).
//
// Contract:
//
//   verified session
//     → activeOrganizationId (Better Auth session, organization plugin)
//     → membership validation (server-side, never client-supplied IDs)
//     → tenant context
//     → tenant-scoped operation
//
// Rules:
// - No memberships → FORBIDDEN (never invent tenant data).
// - activeOrganizationId that the user belongs to → resolved.
// - activeOrganizationId the user does NOT belong to → FORBIDDEN.
//   There is no silent fallback to another organization.
// - No activeOrganizationId + exactly one membership → deterministic
//   fallback (current single-organization foundation).
// - No activeOrganizationId + several memberships → FORBIDDEN until an
//   explicit organization is selected (future switching UI).
//
// Client organizationId (forms, URLs, hidden inputs) must never reach
// this function — callers pass only the session-owned value.

import { AppError } from "@/shared/errors/app-error";

import type { OwnerMembership } from "../repositories/organization-repository";

interface TenantContextInput {
  userId: string;
  memberships: OwnerMembership[];
  /** Session-owned active organization; undefined when never selected. */
  activeOrganizationId?: string | null;
}

interface TenantContext {
  userId: string;
  organizationId: string;
  membership: OwnerMembership;
}

const resolveTenantContext = (input: TenantContextInput): TenantContext => {
  const { userId, memberships, activeOrganizationId } = input;

  if (memberships.length === 0) {
    throw new AppError("FORBIDDEN", {
      message: "No organization is linked to this account yet.",
    });
  }

  if (activeOrganizationId) {
    const match = memberships.find(
      (membership) => membership.organizationId === activeOrganizationId,
    );
    if (!match) {
      // Invalid or foreign organization: deny, never fall back silently.
      throw new AppError("FORBIDDEN");
    }
    return { userId, organizationId: match.organizationId, membership: match };
  }

  if (memberships.length === 1) {
    const only = memberships[0] as OwnerMembership;
    return { userId, organizationId: only.organizationId, membership: only };
  }

  throw new AppError("FORBIDDEN", {
    message: "Select an organization to continue.",
  });
};

export { resolveTenantContext };
export type { TenantContext, TenantContextInput };
