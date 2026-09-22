import { useState } from "react";

const useAuth = () => {
  const [mode, setMode] = useState<"login" | "forgot" | "register" | "otp">(
    "login",
  );

  const goToForgot = () => setMode("forgot");
  const goToLogin = () => setMode("login");
  const goToRegister = () => setMode("register");
  const goToOtp = () => setMode("otp");

  return {
    mode,
    goToForgot,
    goToLogin,
    goToRegister,
    goToOtp,
  };
};

export default useAuth;
