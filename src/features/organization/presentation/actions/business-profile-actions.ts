"use server";

// Business-profile server actions: thin transport over the domain use-cases.
//
// The client form calls these instead of touching persistence. Tenancy
// always derives from the verified session (`requireTenantContext`) —
// the payload carries profile fields only, never an organizationId.
// Results use the API_RULES.md envelope plus an optional safe
// field-error map for the existing FieldError UI.

import { normalizeError, type AuthErrorCode } from "@/shared/errors/app-error";
import type { FieldErrors } from "@/shared/errors/validation";
import { getProductionRateLimiter } from "@/shared/infrastructure/rate-limit/database-rate-limiter";
import { prismaBusinessProfileRepository } from "@/features/organization/data/repositories/prisma-business-profile-repository";
import type { BusinessProfileData } from "@/features/organization/domain/repositories/business-profile-repository";
import { getBusinessProfile } from "@/features/organization/domain/use-cases/get-business-profile";
import { updateBusinessProfile } from "@/features/organization/domain/use-cases/update-business-profile";
import { requireTenantContext } from "@/features/auth/infrastructure/auth/session";

interface ActionError {
  code: AuthErrorCode;
  message: string;
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError; fieldErrors?: FieldErrors };

const toFailure = (error: unknown): Extract<ActionResult<never>, { success: false }> => {
  const appError = normalizeError(error);
  const details = appError.details;
  const fieldErrors =
    details && typeof details.fieldErrors === "object" && details.fieldErrors !== null
      ? (details.fieldErrors as FieldErrors)
      : undefined;

  return {
    success: false,
    error: { code: appError.code, message: appError.message } satisfies ActionError,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
};

const getBusinessProfileAction = async (): Promise<ActionResult<BusinessProfileData>> => {
  try {
    const { tenant } = await requireTenantContext();
    const data = await getBusinessProfile(
      prismaBusinessProfileRepository,
      tenant.organizationId,
    );
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

const updateBusinessProfileAction = async (
  input: unknown,
): Promise<ActionResult<BusinessProfileData>> => {
  try {
    const { user, tenant } = await requireTenantContext();
    const data = await updateBusinessProfile(tenant.organizationId, input, {
      repository: prismaBusinessProfileRepository,
      limits: getProductionRateLimiter(),
      userId: user.id,
    });
    return { success: true, data };
  } catch (error) {
    return toFailure(error);
  }
};

export { getBusinessProfileAction, updateBusinessProfileAction };
export type { ActionError, ActionResult };
