import type { Metadata } from "next";

import NotFoundContent from "./_components/not-found-content";

export const metadata: Metadata = {
  title: "Page Not Found | Aventra Accounting",
  description:
    "The page you are looking for may have moved or no longer exists.",
};

const NotFound = () => {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-background px-6 py-16">
      <NotFoundContent />
    </main>
  );
};

export default NotFound;
