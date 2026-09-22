import { describe, expect, it, vi } from "vitest";

import { AppError } from "@/shared/errors/app-error";

import { ensureOwnerOrganization } from "./ensure-owner-organization";
import type { OrganizationRepository } from "../repositories/organization-repository";

const deps = () => ({
  generateId: vi.fn(() => "id-1"),
  randomSuffix: vi.fn(() => "abc123"),
});

const existingMembership = {
  organizationId: "org-1",
  organizationName: "Nextgen Services",
  slug: "nextgen-services-abc123",
  role: "owner",
};

describe("ensureOwnerOrganization", () => {
  it("returns the existing membership without writing on repeats", async () => {
    const repository: OrganizationRepository = {
      findMembershipByUserId: vi.fn(async () => existingMembership),
      slugTaken: vi.fn(async () => false),
      createOrganizationWithOwner: vi.fn(),
    };

    const result = await ensureOwnerOrganization(
      repository,
      { userId: "user-1", organizationName: "Nextgen Services" },
      deps(),
    );

    expect(result).toEqual({ ...existingMembership, created: false });
    expect(repository.createOrganizationWithOwner).not.toHaveBeenCalled();
  });

  it("creates organization plus owner membership exactly once", async () => {
    const repository: OrganizationRepository = {
      findMembershipByUserId: vi.fn(async () => null),
      slugTaken: vi.fn(async () => false),
      createOrganizationWithOwner: vi.fn(async (input) => ({
        organizationId: input.organizationId,
        organizationName: input.name,
        slug: input.slug,
        role: "owner",
      })),
    };

    const result = await ensureOwnerOrganization(
      repository,
      { userId: "user-1", organizationName: "Nextgen Services" },
      deps(),
    );

    expect(result.created).toBe(true);
    expect(result.role).toBe("owner");
    expect(result.slug).toBe("nextgen-services-abc123");
    expect(repository.createOrganizationWithOwner).toHaveBeenCalledTimes(1);
  });

  it("retries with a fresh slug when the candidate is taken", async () => {
    const repository: OrganizationRepository = {
      findMembershipByUserId: vi.fn(async () => null),
      slugTaken: vi.fn(async () => false),
      createOrganizationWithOwner: vi.fn(async (input) => ({
        organizationId: input.organizationId,
        organizationName: input.name,
        slug: input.slug,
        role: "owner",
      })),
    };
    repository.slugTaken = vi
      .fn(async () => true)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false);
    const suffixes = ["taken01", "free02"];
    const localDeps = { generateId: vi.fn(() => "id-1"), randomSuffix: vi.fn(() => suffixes.shift()!) };

    const result = await ensureOwnerOrganization(
      repository,
      { userId: "user-1", organizationName: "Nextgen Services" },
      localDeps,
    );

    expect(result.slug).toBe("nextgen-services-free02");
  });

  it("rejects an empty organization name without touching storage", async () => {
    const repository: OrganizationRepository = {
      findMembershipByUserId: vi.fn(async () => null),
      slugTaken: vi.fn(),
      createOrganizationWithOwner: vi.fn(),
    };

    await expect(
      ensureOwnerOrganization(repository, { userId: "user-1", organizationName: "   " }, deps()),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(repository.createOrganizationWithOwner).not.toHaveBeenCalled();
  });

  it("surfaces a conflict when every slug attempt races", async () => {
    const repository: OrganizationRepository = {
      findMembershipByUserId: vi.fn(async () => null),
      slugTaken: vi.fn(async () => false),
      createOrganizationWithOwner: vi.fn(async () => {
        throw new AppError("CONFLICT");
      }),
    };

    await expect(
      ensureOwnerOrganization(
        repository,
        { userId: "user-1", organizationName: "Nextgen Services" },
        deps(),
      ),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(repository.createOrganizationWithOwner).toHaveBeenCalledTimes(5);
  });
});
