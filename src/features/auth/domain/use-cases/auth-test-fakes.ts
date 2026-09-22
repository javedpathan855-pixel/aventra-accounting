// In-memory fakes for auth use-case tests. Deterministic, no I/O:
// provider state, organization rows, notifications, events, and the
// clock-driven limiter are all local.

import { vi } from "vitest";

import { createInMemoryRateLimiter } from "@/shared/infrastructure/rate-limit/rate-limiter";
import type {
  AuthProvider,
  NotificationPort,
  ProviderUser,
  SecurityEventSink,
} from "../repositories/auth-provider";
import type { OrganizationRepository } from "../repositories/organization-repository";

interface FakeState {
  users: Map<string, ProviderUser & { password: string }>;
  otp: Map<string, string>;
  otpAttempts: Map<string, number>;
  verified: Set<string>;
  memberships: Map<string, { organizationId: string; organizationName: string; slug: string; role: string }>;
  slugs: Set<string>;
  sentNotices: string[];
  events: Array<{ event: string; context?: unknown }>;
}

const createState = (): FakeState => ({
  users: new Map(),
  otp: new Map(),
  otpAttempts: new Map(),
  verified: new Set<string>(),
  memberships: new Map(),
  slugs: new Set(),
  sentNotices: [],
  events: [],
});

interface Fakes {
  state: FakeState;
  auth: AuthProvider;
  orgs: OrganizationRepository;
  notify: NotificationPort;
  events: SecurityEventSink;
  limits: ReturnType<typeof createInMemoryRateLimiter>;
  ids: { generateId: () => string; randomSuffix: () => string };
}

const createFakes = (): Fakes => {
  const state = createState();

  let idCounter = 0;
  const ids = {
    generateId: () => `id-${(idCounter += 1)}`,
    randomSuffix: () => `sfx${idCounter}`,
  };

  const events: SecurityEventSink = {
    log: vi.fn((event, context) => {
      state.events.push({ event, context });
    }),
  };

  const notify: NotificationPort = {
    sendExistingAccountNotice: vi.fn(async (email: string) => {
      state.sentNotices.push(email);
    }),
  };

  const auth: AuthProvider = {
    findUserByEmail: vi.fn(async (email: string) => {
      const user = state.users.get(email);
      if (!user) {
        return null;
      }
      return { ...user, emailVerified: state.verified.has(email) };
    }),
    signUpWithPassword: vi.fn(async (input) => {
      const { AppError } = await import("@/shared/errors/app-error");
      if (state.users.has(input.email)) {
        throw new AppError("CONFLICT");
      }
      const user = {
        id: `user-${input.email}`,
        name: input.name,
        email: input.email,
        password: input.password,
        emailVerified: false,
      };
      state.users.set(input.email, user);
      return { ...user };
    }),
    sendVerificationOtp: vi.fn(async (email: string) => {
      state.otp.set(email, "482913");
      state.otpAttempts.set(email, 0);
    }),
    verifyOtp: vi.fn(async (email: string, otp: string) => {
      const { AppError } = await import("@/shared/errors/app-error");
      const expected = state.otp.get(email);
      const attempts = (state.otpAttempts.get(email) ?? 0) + 1;
      state.otpAttempts.set(email, attempts);
      if (attempts > 5) {
        state.otp.delete(email);
        throw new AppError("VERIFICATION_ATTEMPTS_EXCEEDED");
      }
      if (!expected || expected !== otp) {
        throw new AppError("VERIFICATION_FAILED");
      }
      state.otp.delete(email);
      state.verified.add(email);
      const user = state.users.get(email);
      if (!user) {
        throw new AppError("VERIFICATION_FAILED");
      }
      return { ...user, emailVerified: true };
    }),
    signInWithPassword: vi.fn(async (input: { email: string; password: string }) => {
      const { AppError } = await import("@/shared/errors/app-error");
      const user = state.users.get(input.email);
      if (!user || user.password !== input.password) {
        throw new AppError("INVALID_CREDENTIALS");
      }
      if (!state.verified.has(input.email)) {
        throw new AppError("EMAIL_NOT_VERIFIED");
      }
      return { ...user, emailVerified: true };
    }),
    signOut: vi.fn(async () => {}),
    requestPasswordReset: vi.fn(async () => {}),
    resetPasswordWithToken: vi.fn(async (input: { token: string; newPassword: string }) => {
      const { AppError } = await import("@/shared/errors/app-error");
      if (input.token !== "valid-token") {
        throw new AppError("VERIFICATION_FAILED");
      }
    }),
  };

  const orgs: OrganizationRepository = {
    findMembershipByUserId: vi.fn(async (userId: string) => {
      for (const [uid, membership] of state.memberships) {
        if (uid === userId) {
          return membership;
        }
      }
      return null;
    }),
    findMembershipsByUserId: vi.fn(async (userId: string) => {
      const membership = state.memberships.get(userId);
      return membership ? [membership] : [];
    }),
    findMembership: vi.fn(async (userId: string, organizationId: string) => {
      const membership = state.memberships.get(userId);
      if (membership && membership.organizationId === organizationId) {
        return membership;
      }
      return null;
    }),
    slugTaken: vi.fn(async (slug: string) => state.slugs.has(slug)),
    createOrganizationWithOwner: vi.fn(async (input) => {
      const { AppError } = await import("@/shared/errors/app-error");
      if (state.slugs.has(input.slug)) {
        throw new AppError("CONFLICT");
      }
      state.slugs.add(input.slug);
      const membership = {
        organizationId: input.organizationId,
        organizationName: input.name,
        slug: input.slug,
        role: "owner",
      };
      state.memberships.set(input.userId, membership);
      return membership;
    }),
  };

  return { state, auth, orgs, notify, events, limits: createInMemoryRateLimiter(), ids };
};

export { createFakes };
