// Business-profile persistence contract (domain layer).
//
// Tenant identity arrives as an explicit `organizationId` argument from
// the server boundary (session → tenant context → use-case). The
// contract never accepts client-supplied tenancy from anywhere else,
// and the Prisma implementation lives in data/repositories; the domain
// never imports it.

import type { BusinessProfileInput } from "../schemas/business-profile.schema";

interface BusinessProfileData {
  organizationId: string;
  organizationName: string;
  businessType: string | null;
  industry: string | null;
  website: string | null;
  tagline: string | null;
  email: string | null;
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

interface BusinessProfileRepository {
  /** Profile row for a tenant organization, or null when missing. */
  getByOrganizationId(organizationId: string): Promise<BusinessProfileData | null>;
  /** Replace the tenant's profile fields atomically. */
  update(
    organizationId: string,
    input: BusinessProfileInput,
  ): Promise<BusinessProfileData>;
}

export type { BusinessProfileData, BusinessProfileRepository };
