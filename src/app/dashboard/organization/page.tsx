import { redirect } from "next/navigation";

import { prismaBusinessProfileRepository } from "@/features/organization/data/repositories/prisma-business-profile-repository";
import { getBusinessProfile } from "@/features/organization/domain/use-cases/get-business-profile";
import { requireTenantContext } from "@/features/auth/infrastructure/auth/session";
import BusinessProfileClient from "@/features/organization/presentation/components/business-profile-client";
import { mapProfileToForm } from "@/features/organization/presentation/business-profile-defaults";

export const dynamic = "force-dynamic";

// Organization → Business Profile. The dashboard layout owns the shell
// and the session guard; this page resolves the tenant from the
// verified session and loads the profile server-side, so the client
// receives initial values and never an organizationId to trust.
const OrganizationPage = async () => {
  let initial: ReturnType<typeof mapProfileToForm>;
  try {
    const { tenant } = await requireTenantContext();
    const profile = await getBusinessProfile(
      prismaBusinessProfileRepository,
      tenant.organizationId,
    );
    initial = mapProfileToForm(profile);
  } catch {
    redirect("/auth");
  }

  return <BusinessProfileClient initial={initial} />;
};

export default OrganizationPage;
