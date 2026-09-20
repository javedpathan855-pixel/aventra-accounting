"use client";

import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import AuthLoginForm from "../components/auth-login-form";
import AuthRegisterForm from "../components/auth-register-form";
import AuthShowcase from "../components/auth-showcase";
import AuthForgotForm from "../components/auth-forgot-form";
import useAuth from "../hooks/use-auth";

const AuthPageClient = () => {
  const { mode, goToForgot, goToLogin, goToRegister } = useAuth();

  return (
    <div className="flex h-screen w-full">
      <div className="w-full h-full">
        <AuthShowcase />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-between p-6">
        <div className="w-full flex items-center justify-end">
          <ThemeSwitcher />
        </div>
        <div className="flex items-center justify-center">
          {mode === "login" ? (
            <AuthLoginForm
              onForgotPassword={goToForgot}
              onRegister={goToRegister}
            />
          ) : mode === "forgot" ? (
            <AuthForgotForm onBackToLogin={goToLogin} />
          ) : (
            <AuthRegisterForm onBackToLogin={goToLogin} />
          )}
        </div>
        <div />
      </div>
    </div>
  );
};

export default AuthPageClient;
