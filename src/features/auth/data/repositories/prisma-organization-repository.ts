// Prisma-backed OrganizationRepository (data layer).
//
// Implements the domain contract with Prisma transactions so
// organization + owner membership are created atomically — never one
// without the other. Server-only by construction (imports the Prisma
// singleton); presentation must reach it through use-cases/actions.

import { getPrisma } from "@/shared/infrastructure/db/prisma";
import type {
  CreateOwnerOrganizationInput,
  OrganizationRepository,
  OwnerMembership,
} from "@/features/auth/domain/repositories/organization-repository";

const toMembership = (row: {
  organizationId: string;
  role: string;
  organization: { name: string; slug: string };
}): OwnerMembership => ({
  organizationId: row.organizationId,
  organizationName: row.organization.name,
  slug: row.organization.slug,
  role: row.role,
});

const prismaOrganizationRepository: OrganizationRepository = {
  findMembershipByUserId: async (userId) => {
    const member = await getPrisma().member.findFirst({
      where: { userId },
      include: { organization: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "asc" },
    });
    return member ? toMembership(member) : null;
  },

  slugTaken: async (slug) => {
    const existing = await getPrisma().organization.findUnique({
      where: { slug },
      select: { id: true },
    });
    return existing !== null;
  },

  createOrganizationWithOwner: async (input: CreateOwnerOrganizationInput) => {
    const created = await getPrisma().$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: { id: input.organizationId, name: input.name, slug: input.slug },
      });
      const member = await tx.member.create({
        data: {
          id: input.memberId,
          organizationId: organization.id,
          userId: input.userId,
          role: "owner",
        },
      });
      return { organizationId: member.organizationId, role: member.role, organization };
    });

    return {
      organizationId: created.organizationId,
      organizationName: created.organization.name,
      slug: created.organization.slug,
      role: created.role,
    };
  },
};

export { prismaOrganizationRepository };
