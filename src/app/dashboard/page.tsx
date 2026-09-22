import { redirect } from "next/navigation";

import { getMembershipContext } from "@/features/auth/infrastructure/auth/session";
import WorkspaceHome from "@/features/dashboard/presentation/components/workspace-home";

// Current state of the dashboard workspace. The layout owns the shell
// and the guard; this page owns the home content only, so a future
// DashboardOverview can replace it without touching either.
const DashboardPage = async () => {
  let context: Awaited<ReturnType<typeof getMembershipContext>>;
  try {
    context = await getMembershipContext();
  } catch {
    redirect("/auth");
  }

  return (
    <WorkspaceHome
      userName={context.user.name}
      organizationName={context.membership.organizationName}
    />
  );
};

export default DashboardPage;
