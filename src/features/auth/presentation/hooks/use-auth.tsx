"use client";

import { useState } from "react";

type AuthMode = "login" | "forgot" | "register" | "otp";

const useAuth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  // Email awaiting verification. Set by registration and by the
  // unverified-login path so the OTP screen survives mode switches
  // (and browser restarts via re-login) without extra persistence.
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const goToForgot = () => setMode("forgot");
  const goToLogin = () => setMode("login");
  const goToRegister = () => setMode("register");
  const goToOtp = (email?: string) => {
    if (email !== undefined) {
      setPendingEmail(email);
    }
    setMode("otp");
  };

  return {
    mode,
    pendingEmail,
    goToForgot,
    goToLogin,
    goToRegister,
    goToOtp,
  };
};

export default useAuth;
export type { AuthMode };
