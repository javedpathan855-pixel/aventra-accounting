"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import AnimationProvider from "@/shared/animation/motion";
import { fastTransition } from "@/shared/animation/transitions";
import {
  dialogContentVariants,
  dialogOverlayVariants,
} from "@/shared/animation/variants";
import AventraLogo from "@/shared/components/ui/aventra-logo";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";
import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import { ToastProvider, useToasts } from "@/shared/components/ui/toast";
import cn from "@/shared/utils/cn";
import { SignOutButton } from "@/app/dashboard/_components/sign-out-button";

import { DASHBOARD_NAV } from "../dashboard-nav";

interface DashboardShellProps {
  userName: string;
  userEmail: string;
  organizationName: string;
  organizationRole: string;
  children: ReactNode;
}

const NavList = ({
  pillId,
  onNavigate,
}: {
  pillId: string;
  onNavigate?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToasts();

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {DASHBOARD_NAV.map((item) => {
        const Icon = item.icon;
        if (item.status === "available" && item.href) {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                router.push(item.href as string);
                onNavigate?.();
              }}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-left",
                "font-montserrat text-sm font-medium",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                isActive
                  ? "font-semibold text-primary"
                  : "text-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={pillId}
                  transition={fastTransition}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-md bg-primary-muted"
                />
              ) : null}
              <Icon aria-hidden="true" className="relative h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="relative">{item.label}</span>
            </button>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              toast({ title: item.notice ?? `${item.label} is coming soon.`, tone: "info" });
              onNavigate?.();
            }}
            aria-label={`${item.label}, coming soon`}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-left",
              "font-montserrat text-sm font-medium text-muted",
              "transition-colors duration-200 hover:bg-surface-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            )}
          >
            <Icon aria-hidden="true" className="relative h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="relative">{item.label}</span>
            <StatusBadge tone="neutral" className="relative ml-auto px-2 py-0.5 text-[11px]">
              Soon
            </StatusBadge>
          </button>
        );
      })}
    </nav>
  );
};

const DashboardShell = ({
  userName,
  userEmail,
  organizationName,
  organizationRole,
  children,
}: DashboardShellProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  return (
    <AnimationProvider>
      <ToastProvider>
        <div className="flex min-h-dvh w-full bg-background text-foreground">
          {/* Desktop sidebar */}
          <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
            <div className="flex items-center gap-2 px-5 pb-2 pt-5">
              <AventraLogo variant="Short" />
              <div className="flex min-w-0 flex-col leading-tight">
                <p className="truncate font-montserrat text-base font-bold text-foreground">
                  Aventra
                </p>
                <p className="font-lato text-xs text-muted">Accounting</p>
              </div>
            </div>
            <div className="px-5 py-3">
              <div className="flex items-center justify-between gap-2 rounded-md border border-border-subtle bg-background px-3 py-2">
                <p className="truncate font-montserrat text-sm font-semibold text-foreground">
                  {organizationName}
                </p>
                <StatusBadge tone="success" className="shrink-0 px-2 py-0.5 text-[11px]">
                  {organizationRole}
                </StatusBadge>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
              <NavList pillId="dashboard-nav-active-desktop" />
            </div>
            <div className="flex flex-col gap-3 px-5 pb-5">
              <Divider />
              <p className="truncate font-lato text-xs text-muted" title={userEmail}>
                {userEmail}
              </p>
              <SignOutButton />
            </div>
          </aside>

          {/* Mobile drawer */}
          <AnimatePresence>
            {drawerOpen ? (
              <>
                <motion.div
                  key="dashboard-drawer-scrim"
                  variants={dialogOverlayVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  aria-hidden="true"
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 z-50 bg-overlay lg:hidden"
                />
                <motion.aside
                  key="dashboard-drawer-panel"
                  variants={dialogContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  aria-label="Dashboard navigation"
                  className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-surface lg:hidden"
                >
                  <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-5">
                    <div className="flex min-w-0 items-center gap-2">
                      <AventraLogo variant="Short" />
                      <p className="truncate font-montserrat text-base font-bold text-foreground">
                        {organizationName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      aria-label="Close navigation"
                      className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                    <NavList
                      pillId="dashboard-nav-active-mobile"
                      onNavigate={() => setDrawerOpen(false)}
                    />
                  </div>
                  <div className="flex flex-col gap-3 px-5 pb-5">
                    <Divider />
                    <SignOutButton />
                  </div>
                </motion.aside>
              </>
            ) : null}
          </AnimatePresence>

          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 border-b border-border bg-background">
              <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open navigation"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 lg:hidden"
                  >
                    <Menu aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <p className="truncate font-montserrat text-sm font-semibold text-foreground">
                    {organizationName}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <ThemeSwitcher />
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted font-montserrat text-sm font-bold text-primary"
                    title={userEmail}
                  >
                    {initial}
                  </span>
                  <span className="hidden min-w-0 flex-col leading-tight md:flex">
                    <span className="truncate font-montserrat text-sm font-semibold text-foreground">
                      {userName}
                    </span>
                    <span className="truncate font-lato text-xs text-muted">
                      {userEmail}
                    </span>
                  </span>
                </div>
              </div>
            </header>
            <main className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </AnimationProvider>
  );
};

export default DashboardShell;
