"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import AnimationProvider from "@/shared/animation/motion";
import { formTransitionVariants } from "@/shared/animation/variants";
import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import { ToastProvider } from "@/shared/components/ui/toast";
import AuthLoginForm from "../forms/auth-login-form";
import AuthRegisterForm from "../forms/auth-register-form";
import AuthForgotForm from "../forms/auth-forgot-form";
import useAuth from "../hooks/use-auth";
import AuthOtpForm from "../forms/auth-otp-form";

const AuthPageClient = () => {
  const { mode, pendingEmail, goToForgot, goToLogin, goToRegister, goToOtp } = useAuth();
  const router = useRouter();

  return (
    <ToastProvider>
      <div className="flex w-full flex-col items-center justify-between gap-6 p-6 lg:min-h-dvh">
        <div className="flex w-full items-center justify-end">
          <ThemeSwitcher />
        </div>
        <div className="flex w-full items-center justify-center">
          <AnimationProvider>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                variants={formTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {mode === "login" ? (
                  <AuthLoginForm
                    onForgotPassword={goToForgot}
                    onRegister={goToRegister}
                    goToOtp={goToOtp}
                  />
                ) : mode === "forgot" ? (
                  <AuthForgotForm onBackToLogin={goToLogin} />
                ) : mode === "otp" ? (
                  <AuthOtpForm
                    email={pendingEmail}
                    onBackToLogin={goToLogin}
                    onVerified={(redirectTo) => {
                      router.push(redirectTo);
                      router.refresh();
                    }}
                  />
                ) : (
                  <AuthRegisterForm
                    onBackToLogin={goToLogin}
                    goToOtp={goToOtp}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </AnimationProvider>
        </div>
        <div />
      </div>
    </ToastProvider>
  );
};

export default AuthPageClient;
