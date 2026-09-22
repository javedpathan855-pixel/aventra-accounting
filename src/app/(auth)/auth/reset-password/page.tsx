"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ToastProvider } from "@/shared/components/ui/toast";
import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import AuthResetForm from "@/features/auth/presentation/forms/auth-reset-form";
import AuthShowcase from "@/features/auth/presentation/components/auth-showcase";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  return (
    <div className="flex w-full flex-col items-center justify-between gap-6 p-6 lg:min-h-dvh">
      <div className="flex w-full items-center justify-end">
        <ThemeSwitcher />
      </div>
      <div className="flex w-full items-center justify-center">
        {token ? (
          <AuthResetForm token={token} onBackToLogin={() => router.push("/auth")} />
        ) : (
          <p className="font-lato text-base text-muted">
            This reset link is invalid or has expired. Please request a new one.
          </p>
        )}
      </div>
      <div />
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <div className="w-full min-w-0 lg:w-1/2">
        <AuthShowcase />
      </div>
      <div className="flex w-full min-w-0 flex-1 lg:w-1/2">
        <ToastProvider>
          <Suspense>
            <ResetPasswordContent />
          </Suspense>
        </ToastProvider>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
