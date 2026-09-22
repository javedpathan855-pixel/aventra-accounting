// Tenancy persistence contract (domain layer).
//
// Application code derives tenant identity from the verified session
// and touches organization rows only through this interface. The Prisma
// implementation lives in data/repositories; the domain never imports it.

interface OwnerMembership {
  organizationId: string;
  organizationName: string;
  slug: string;
  role: string;
}

interface CreateOwnerOrganizationInput {
  organizationId: string;
  memberId: string;
  name: string;
  slug: string;
  userId: string;
}

interface OrganizationRepository {
  /** Any membership for the user (the tenant bootstrap check). */
  findMembershipByUserId(userId: string): Promise<OwnerMembership | null>;
  /** Every membership for the user (tenant-context validation). */
  findMembershipsByUserId(userId: string): Promise<OwnerMembership[]>;
  /** Membership of the user in one organization, or null. */
  findMembership(userId: string, organizationId: string): Promise<OwnerMembership | null>;
  /** True when the slug is already taken by another organization. */
  slugTaken(slug: string): Promise<boolean>;
  /**
   * Create organization + owner membership atomically. Must fail safe
   * on slug races (unique constraint) so callers can retry.
   */
  createOrganizationWithOwner(input: CreateOwnerOrganizationInput): Promise<OwnerMembership>;
}

export type {
  CreateOwnerOrganizationInput,
  OrganizationRepository,
  OwnerMembership,
};
