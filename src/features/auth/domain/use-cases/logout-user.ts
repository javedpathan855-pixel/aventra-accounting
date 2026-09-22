// Logout use case: server-side session invalidation, then UI redirect.

import type { AuthProvider, SecurityEventSink } from "../repositories/auth-provider";

interface LogoutUserDeps {
  auth: AuthProvider;
  events: SecurityEventSink;
  userId?: string;
}

const logoutUser = async (deps: LogoutUserDeps): Promise<{ redirectTo: string }> => {
  await deps.auth.signOut();
  deps.events.log("logout", deps.userId ? { userId: deps.userId } : undefined);
  return { redirectTo: "/auth" };
};

export { logoutUser };
export type { LogoutUserDeps };
