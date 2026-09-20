import { useState } from "react";

const useAuth = () => {
  const [mode, setMode] = useState<"login" | "forgot" | "register">("login");
  const [loading, setLoading] = useState(false);

  const goToForgot = () => setMode("forgot");
  const goToLogin = () => setMode("login");
  const goToRegister = () => setMode("register");

  const handleLoginSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleForgotSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleRegisterSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return {
    mode,
    loading,
    goToForgot,
    goToLogin,
    goToRegister,
    handleLoginSubmit,
    handleForgotSubmit,
    handleRegisterSubmit,
  };
};

export default useAuth;
