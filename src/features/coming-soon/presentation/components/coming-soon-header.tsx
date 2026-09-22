"use client";

import { useRouter } from "next/navigation";

import AventraLogo from "@/shared/components/ui/aventra-logo";
import Button from "@/shared/components/ui/button";
import ThemeSwitcher from "@/shared/components/theme/theme-switcher";

interface ComingSoonHeaderProps {
  authenticated: boolean;
}

const ComingSoonHeader = ({ authenticated }: ComingSoonHeaderProps) => {
  const router = useRouter();

  return (
    <header className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <AventraLogo variant="Short" />
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeSwitcher />
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(authenticated ? "/dashboard" : "/auth")}
        >
          {authenticated ? "Dashboard" : "Sign in"}
        </Button>
      </div>
    </header>
  );
};

export default ComingSoonHeader;
