import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth/infrastructure/auth/session";
import ComingSoonPage from "@/features/coming-soon/presentation/page/coming-soon-page";

export const metadata: Metadata = {
  title: "Aventra Accounting — Coming Soon",
  description:
    "Aventra Accounting is taking shape: invoices, customers, payments, expenses, and reporting in one calm workspace. See what is ready and what is coming.",
};

/**
 * Public product page. Reads the session only to aim the calls to
 * action (dashboard for members, sign-in otherwise) — content is
 * identical either way and needs no protection.
 */
const ComingSoonRoute = async () => {
  let authenticated = false;
  try {
    authenticated = (await getCurrentUser()) !== null;
  } catch {
    authenticated = false;
  }

  return <ComingSoonPage authenticated={authenticated} />;
};

export default ComingSoonRoute;
