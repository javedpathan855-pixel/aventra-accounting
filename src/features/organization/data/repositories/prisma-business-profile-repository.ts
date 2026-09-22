// Prisma-backed BusinessProfileRepository (data layer).
//
// Reads and writes the business-profile columns on the tenant's own
// organization row — no new table, no duplicated organization data.
// Server-only by construction (imports the Prisma singleton);
// presentation reaches it through use-cases/actions only.

import { getPrisma } from "@/shared/infrastructure/db/prisma";
import type {
  BusinessProfileData,
  BusinessProfileRepository,
} from "@/features/organization/domain/repositories/business-profile-repository";
import type { BusinessProfileInput } from "@/features/organization/domain/schemas/business-profile.schema";

interface OrganizationRow {
  id: string;
  name: string;
  businessType: string | null;
  industry: string | null;
  website: string | null;
  tagline: string | null;
  contactEmail: string | null;
  phone: string | null;
  altPhone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
  country: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  brandTagline: string | null;
  brandDescription: string | null;
  fontStyle: string | null;
  layoutStyle: string | null;
}

const toData = (row: OrganizationRow): BusinessProfileData => ({
  organizationId: row.id,
  organizationName: row.name,
  businessType: row.businessType,
  industry: row.industry,
  website: row.website,
  tagline: row.tagline,
  email: row.contactEmail,
  phone: row.phone,
  altPhone: row.altPhone,
  addressLine1: row.addressLine1,
  addressLine2: row.addressLine2,
  city: row.city,
  state: row.state,
  pinCode: row.pinCode,
  country: row.country,
  primaryColor: row.primaryColor,
  secondaryColor: row.secondaryColor,
  brandTagline: row.brandTagline,
  brandDescription: row.brandDescription,
  fontStyle: row.fontStyle,
  layoutStyle: row.layoutStyle,
});

const nullify = (value: string | undefined): string | null => value ?? null;

const toColumns = (input: BusinessProfileInput) => ({
  name: input.organizationName,
  businessType: input.businessType,
  industry: nullify(input.industry),
  website: nullify(input.website),
  tagline: nullify(input.tagline),
  contactEmail: nullify(input.email),
  phone: nullify(input.phone),
  altPhone: nullify(input.altPhone),
  addressLine1: input.addressLine1,
  addressLine2: nullify(input.addressLine2),
  city: input.city,
  state: input.state,
  pinCode: input.pinCode,
  country: input.country,
  primaryColor: input.primaryColor,
  secondaryColor: input.secondaryColor,
  brandTagline: nullify(input.brandTagline),
  brandDescription: nullify(input.brandDescription),
  fontStyle: input.fontStyle,
  layoutStyle: input.layoutStyle,
});

const prismaBusinessProfileRepository: BusinessProfileRepository = {
  getByOrganizationId: async (organizationId) => {
    const row = await getPrisma().organization.findUnique({
      where: { id: organizationId },
    });
    if (!row) {
      return null;
    }
    return toData(row);
  },

  update: async (organizationId, input) => {
    const row = await getPrisma().organization.update({
      where: { id: organizationId },
      data: toColumns(input),
    });
    return toData(row);
  },
};

export { prismaBusinessProfileRepository };
