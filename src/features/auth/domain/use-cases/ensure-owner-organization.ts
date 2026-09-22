// Ensure-owner-organization use case (domain layer).
//
// Idempotent tenant bootstrap: registering (or first verified sign-in)
// guarantees User + Organization + owner Membership with no partial
// states visible to callers. Safe to retry on duplicate requests,
// double-clicks, and network replays — the membership check makes
// repeats a no-op, and slug races retry with a fresh suffix.

import { AppError } from "@/shared/errors/app-error";

import { slugifyOrganizationName } from "../services/auth-helpers";
import type {
  OrganizationRepository,
  OwnerMembership,
} from "../repositories/organization-repository";

interface EnsureOwnerOrganizationInput {
  userId: string;
  organizationName: string;
}

interface EnsureOwnerOrganizationDeps {
  generateId: () => string;
  randomSuffix: () => string;
}

interface EnsureOwnerOrganizationResult extends OwnerMembership {
  created: boolean;
}

const MAX_SLUG_ATTEMPTS = 5;

/**
 * Ensure the user owns exactly one bootstrap organization. Returns the
 * existing membership when present; otherwise creates organization +
 * owner member in one repository transaction.
 */
const ensureOwnerOrganization = async (
  repository: OrganizationRepository,
  input: EnsureOwnerOrganizationInput,
  deps: EnsureOwnerOrganizationDeps,
): Promise<EnsureOwnerOrganizationResult> => {
  const existing = await repository.findMembershipByUserId(input.userId);
  if (existing) {
    return { ...existing, created: false };
  }

  const name = input.organizationName.trim();
  if (!name) {
    throw new AppError("VALIDATION_ERROR");
  }

  const base = slugifyOrganizationName(name);
  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
    // Always suffixed: the name is user-supplied and slugs are globally
    // unique, so a bare name slug would be squattable and racy.
    const slug = `${base}-${deps.randomSuffix()}`;

    if (await repository.slugTaken(slug)) {
      continue;
    }

    try {
      const created = await repository.createOrganizationWithOwner({
        organizationId: deps.generateId(),
        memberId: deps.generateId(),
        name,
        slug,
        userId: input.userId,
      });
      return { ...created, created: true };
    } catch (error) {
      lastError = error;
    }
  }

  throw new AppError("CONFLICT", { cause: lastError });
};

export { ensureOwnerOrganization, MAX_SLUG_ATTEMPTS };
export type {
  EnsureOwnerOrganizationDeps,
  EnsureOwnerOrganizationInput,
  EnsureOwnerOrganizationResult,
};
