// Server-side session/authorization helpers (DATABASE_AUTH_RULES.md).
//
// Single API for identity: pages, actions, and route handlers read the
// verified server session here instead of querying Better Auth
// independently. Server-only — reads request headers and the database.

import { headers } from "next/headers";
import { cache } from "react";

import { AppError } from "@/shared/errors/app-error";
import { prismaOrganizationRepository } from "@/features/auth/data/repositories/prisma-organization-repository";
import type { OwnerMembership } from "@/features/auth/domain/repositories/organization-repository";

import { getAuth } from "./auth";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

interface CurrentSession {
  user: CurrentUser;
}

const toCurrentUser = (user: {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}): CurrentUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image ?? null,
});

/** Verified server session, or null when signed out/expired. */
const getCurrentSession = async (): Promise<CurrentSession | null> => {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  return { user: toCurrentUser(session.user) };
};

/** Current user, or null. Never trust client-provided identity. */
const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const session = await getCurrentSession();
  return session?.user ?? null;
};

/** Require any authenticated session. Throws 401 otherwise. */
const requireAuth = async (): Promise<CurrentUser> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", {
      message: "Please sign in to continue.",
    });
  }
  return user;
};

/** Require a verified email. Throws 403 for unverified accounts. */
const requireVerifiedEmail = async (): Promise<CurrentUser> => {
  const user = await requireAuth();
  if (!user.emailVerified) {
    throw new AppError("EMAIL_NOT_VERIFIED");
  }
  return user;
};

interface MembershipContext {
  user: CurrentUser;
  membership: OwnerMembership;
}

/**
 * Require organization membership derived from the session — never
 * from client-supplied organizationId (TENANCY rules). Throws 403
 * when the user belongs to no organization.
 */
const requireOrganizationMembership = async (): Promise<MembershipContext> => {
  const user = await requireVerifiedEmail();
  const membership = await prismaOrganizationRepository.findMembershipByUserId(user.id);
  if (!membership) {
    throw new AppError("FORBIDDEN", {
      message: "No organization is linked to this account yet.",
    });
  }
  return { user, membership };
};

/**
 * Request-memoized membership context for route trees (e.g. dashboard
 * layout + page) that need the same verified identity without a second
 * session lookup in one request.
 */
const getMembershipContext = cache(async (): Promise<MembershipContext> => {
  return requireOrganizationMembership();
});

export {
  getCurrentSession,
  getCurrentUser,
  getMembershipContext,
  requireAuth,
  requireOrganizationMembership,
  requireVerifiedEmail,
};
export type { CurrentSession, CurrentUser, MembershipContext };
