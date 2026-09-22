import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getMembershipContext } from "@/features/auth/infrastructure/auth/session";
import DashboardShell from "@/features/dashboard/presentation/components/dashboard-shell";

// Permanent home for the authenticated workspace. The guard lives
// here so every future /dashboard/* route inherits it; the memoized
// context helper keeps this to one session lookup per request.
// Server-enforced: no valid verified session with organization
// membership reaches the shell.
export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  let context: Awaited<ReturnType<typeof getMembershipContext>>;
  try {
    context = await getMembershipContext();
  } catch {
    redirect("/auth");
  }

  return (
    <DashboardShell
      userName={context.user.name}
      userEmail={context.user.email}
      userImage={context.user.image ?? null}
      organizationName={context.membership.organizationName}
      organizationRole={context.membership.role}
    >
      {children}
    </DashboardShell>
  );
};

export default DashboardLayout;
