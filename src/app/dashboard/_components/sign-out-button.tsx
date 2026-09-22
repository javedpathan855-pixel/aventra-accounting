"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/shared/components/ui/button";
import { useToasts } from "@/shared/components/ui/toast";
import { logoutAction } from "@/features/auth/presentation/actions/auth-actions";

const SignOutButton = () => {
  const router = useRouter();
  const { toast } = useToasts();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    try {
      const result = await logoutAction();
      if (result.success) {
        toast({ title: "Signed out successfully", tone: "success" });
        router.push(result.data.redirectTo);
        router.refresh();
      } else {
        toast({ title: result.error.message, tone: "error" });
      }
    } catch {
      toast({ title: "Something went wrong. Please try again.", tone: "error" });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
      {signingOut ? "Signing out…" : "Sign out"}
    </Button>
  );
};

export { SignOutButton };
