// Update-business-profile use case (domain layer).
//
// Validates the full profile server-side (client validation is UX
// only), enforces the per-user write budget, then persists through the
// repository contract. Tenancy: `organizationId` is a server-derived
// argument — the client payload carries fields only, never identity.

import type { RateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import { AppError } from "@/shared/errors/app-error";
import { parseOrThrow } from "@/shared/errors/validation";

import { BUSINESS_PROFILE_LIMITS } from "../services/business-profile-limits";
import { BusinessProfileSchema } from "../schemas/business-profile.schema";
import type {
  BusinessProfileData,
  BusinessProfileRepository,
} from "../repositories/business-profile-repository";

interface UpdateBusinessProfileDeps {
  repository: BusinessProfileRepository;
  limits: RateLimiter;
  userId: string;
}

const updateBusinessProfile = async (
  organizationId: string,
  input: unknown,
  deps: UpdateBusinessProfileDeps,
): Promise<BusinessProfileData> => {
  const parsed = parseOrThrow(BusinessProfileSchema, input);

  const limit = await deps.limits.check(
    `business-profile:user:${deps.userId}`,
    BUSINESS_PROFILE_LIMITS.update.max,
    BUSINESS_PROFILE_LIMITS.update.windowMs,
  );
  if (!limit.allowed) {
    throw new AppError("RATE_LIMITED");
  }

  return deps.repository.update(organizationId, parsed);
};

export { updateBusinessProfile };
export type { UpdateBusinessProfileDeps };
