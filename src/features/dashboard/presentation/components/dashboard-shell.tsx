"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";

import AnimationProvider from "@/shared/animation/motion";
import { dialogOverlayVariants } from "@/shared/animation/variants";
import { ToastProvider } from "@/shared/components/ui/toast";

import DashboardSidebar from "./dashboard-sidebar";

interface DashboardShellProps {
  userName: string;
  userEmail: string;
  organizationName: string;
  organizationRole: string;
  children: ReactNode;
}

const COLLAPSE_STORAGE_KEY = "aventra-sidebar-collapsed";

const readCollapsed = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

/*
 * Collapse preference survives reloads via localStorage. The external
 * store mirrors the mounted-guard pattern used by ThemeSwitcher: the
 * server snapshot is always expanded (matching SSR markup), and the
 * client snapshot is read after hydration — no mismatch, no effect
 * cascading, toggle always wins through the manual override.
 */
const subscribeToCollapse = () => () => {};
const getCollapsedSnapshot = () => readCollapsed();
const getCollapsedServerSnapshot = () => false;

const DashboardShell = ({
  userName,
  userEmail,
  organizationName,
  organizationRole,
  children,
}: DashboardShellProps) => {
  const [manualCollapsed, setManualCollapsed] = useState<boolean | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const storedCollapsed = useSyncExternalStore(
    subscribeToCollapse,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );
  const collapsed = manualCollapsed ?? storedCollapsed;
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  const toggleCollapse = () => {
    const next = !collapsed;
    try {
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Persistence is a nicety; the toggle itself must always work.
    }
    setManualCollapsed(next);
  };

  // Drawer ergonomics: Escape closes, background stays put while open.
  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const identity = { userName, userEmail, organizationName, organizationRole };

  return (
    <AnimationProvider>
      <ToastProvider>
        <div className="flex min-h-dvh w-full bg-background text-foreground">
          <DashboardSidebar
            variant="desktop"
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            pillId="dashboard-nav-active-desktop"
            {...identity}
          />

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
                <DashboardSidebar
                  key="dashboard-drawer-panel"
                  variant="drawer"
                  collapsed={false}
                  pillId="dashboard-nav-active-mobile"
                  onNavigate={() => setDrawerOpen(false)}
                  onClose={() => setDrawerOpen(false)}
                  {...identity}
                />
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
                <div className="flex shrink-0 items-center gap-3">
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
