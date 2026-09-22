// Get-business-profile use case (domain layer).
//
// Reads the tenant's profile row. The organizationId arrives from the
// server-side tenant context — never from client input. Missing rows
// surface as NOT_FOUND (safe envelope, no identifiers leaked).

import { AppError } from "@/shared/errors/app-error";

import type {
  BusinessProfileData,
  BusinessProfileRepository,
} from "../repositories/business-profile-repository";

const getBusinessProfile = async (
  repository: BusinessProfileRepository,
  organizationId: string,
): Promise<BusinessProfileData> => {
  const profile = await repository.getByOrganizationId(organizationId);
  if (!profile) {
    throw new AppError("NOT_FOUND", {
      message: "Business profile was not found.",
    });
  }
  return profile;
};

export { getBusinessProfile };
