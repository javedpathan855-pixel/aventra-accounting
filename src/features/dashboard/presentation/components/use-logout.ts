"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { useToasts } from "@/shared/components/ui/toast";
import { logoutAction } from "@/features/auth/presentation/actions/auth-actions";

/**
 * Single logout implementation for every dashboard trigger (sidebar
 * button, profile menu). Server action invalidates the session;
 * this hook owns the submitting state, toast, and redirect only.
 */
const useLogout = () => {
  const router = useRouter();
  const { toast } = useToasts();
  const [signingOut, setSigningOut] = useState(false);
  const busyRef = useRef(false);

  const signOut = useCallback(async (): Promise<boolean> => {
    if (busyRef.current) {
      return false;
    }
    busyRef.current = true;
    setSigningOut(true);
    try {
      const result = await logoutAction();
      if (result.success) {
        toast({ title: "Signed out successfully", tone: "success" });
        router.push(result.data.redirectTo);
        router.refresh();
        return true;
      }
      toast({ title: result.error.message, tone: "error" });
      return false;
    } catch {
      toast({ title: "Something went wrong. Please try again.", tone: "error" });
      return false;
    } finally {
      busyRef.current = false;
      setSigningOut(false);
    }
  }, [router, toast]);

  return { signingOut, signOut };
};

export default useLogout;
