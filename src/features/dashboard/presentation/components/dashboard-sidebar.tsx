"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Ellipsis,
  LogOut,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  X,
  Zap,
} from "lucide-react";

import { normalTransition } from "@/shared/animation/transitions";
import { dialogContentVariants } from "@/shared/animation/variants";
import useTheme from "@/shared/hooks/use-theme";
import AventraLogo from "@/shared/components/ui/aventra-logo";
import Button from "@/shared/components/ui/button";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";
import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import cn from "@/shared/utils/cn";

import SidebarNav from "./sidebar-nav";
import useLogout from "./use-logout";

interface SidebarIdentity {
  userName: string;
  userEmail: string;
  organizationName: string;
  organizationRole: string;
}

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 272;

const ThemeCycleButton = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const order = ["light", "dark", "system"] as const;
  type ThemeName = (typeof order)[number];
  const current: ThemeName = order.includes(theme as ThemeName)
    ? (theme as ThemeName)
    : "system";
  const next = order[(order.indexOf(current) + 1) % order.length];
  const effective = current === "system" ? (resolvedTheme ?? "light") : current;
  const Icon = effective === "dark" ? Moon : effective === "light" ? Sun : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}. Activate to switch to ${next} mode.`}
      title={`Theme: ${current} — switch to ${next}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-muted",
        "transition-colors duration-200 hover:bg-surface-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
      )}
    >
      <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
  );
};

const ProfileMenu = ({
  userName,
  userEmail,
  collapsed,
}: {
  userName: string;
  userEmail: string;
  collapsed: boolean;
}) => {
  const router = useRouter();
  const { signingOut, signOut } = useLogout();
  const [open, setOpen] = useState(false);
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open ]);

  const goRoadmap = () => {
    setOpen(false);
    router.push("/coming-soon");
  };

  const doSignOut = async () => {
    const done = await signOut();
    if (done) {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={collapsed ? `${userName}, account menu` : "Account menu"}
        title={collapsed ? userName : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left",
          "transition-colors duration-200 hover:bg-surface-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          collapsed && "justify-center px-0",
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted font-montserrat text-sm font-bold text-primary"
        >
          {initial}
        </span>
        {collapsed ? null : (
          <>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate font-montserrat text-sm font-semibold text-foreground">
                {userName}
              </span>
              <span className="truncate font-lato text-xs text-muted">{userEmail}</span>
            </span>
            <Ellipsis aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
          </>
        )}
      </button>
      <AnimatePresence>
        {open ? (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              role="menu"
              aria-label="Account"
              variants={dialogContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                "absolute bottom-full left-0 z-50 mb-2 w-56",
                "rounded-md border border-border bg-surface-elevated p-1.5 shadow-lg",
              )}
            >
              <p className="truncate px-2.5 pb-1 pt-1.5 font-lato text-xs text-muted">
                {userEmail}
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={goRoadmap}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left",
                  "font-montserrat text-sm font-medium text-foreground",
                  "transition-colors hover:bg-surface-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                )}
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted" />
                View roadmap
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={doSignOut}
                disabled={signingOut}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left",
                  "font-montserrat text-sm font-medium text-foreground",
                  "transition-colors hover:bg-surface-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <LogOut aria-hidden="true" className="h-4 w-4 text-muted" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

interface SidebarBodyProps extends SidebarIdentity {
  collapsed: boolean;
  pillId: string;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}

const SidebarBody = ({
  collapsed,
  onToggleCollapse,
  pillId,
  onNavigate,
  userName,
  userEmail,
  organizationName,
  organizationRole,
}: SidebarBodyProps) => {
  const router = useRouter();
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 px-5 pb-2 pt-5",
          collapsed && "flex-col justify-center px-0",
        )}
      >
        <AventraLogo variant="Short" />
        {collapsed || !onToggleCollapse ? null : (
          <>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <p className="truncate font-montserrat text-base font-bold text-foreground">
                Aventra
              </p>
              <p className="font-lato text-xs text-muted">Accounting</p>
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-expanded={!collapsed}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted",
                "transition-colors duration-200 hover:bg-surface-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              )}
            >
              <ToggleIcon aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      {collapsed && onToggleCollapse ? (
        <div className="flex justify-center px-0 pb-2 pt-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-muted",
              "transition-colors duration-200 hover:bg-surface-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            )}
          >
            <ToggleIcon aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {collapsed ? null : (
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
      )}

      <div className={cn("min-h-0 flex-1 overflow-y-auto pb-4", collapsed ? "px-2.5" : "px-3")}>
        <SidebarNav collapsed={collapsed} pillId={pillId} onNavigate={onNavigate} />
      </div>

      <div className={cn("flex flex-col gap-3 pb-5", collapsed ? "items-center px-0" : "px-5")}>
        {collapsed ? null : (
          <div className="rounded-md border border-border-subtle bg-primary-muted/50 p-4">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-muted text-primary"
            >
              <Zap className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="mt-3 font-montserrat text-sm font-semibold leading-snug text-foreground">
              Building something powerful for you
            </p>
            <p className="mt-1 font-lato text-xs leading-relaxed text-muted">
              A complete accounting workspace is on the way.
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-1 h-auto justify-start p-0"
              onClick={() => {
                router.push("/coming-soon");
                onNavigate?.();
              }}
            >
              View roadmap
            </Button>
          </div>
        )}
        <Divider className={collapsed ? "w-10" : undefined} />
        <ProfileMenu userName={userName} userEmail={userEmail} collapsed={collapsed} />
        {collapsed ? <ThemeCycleButton /> : <ThemeSwitcher />}
      </div>
    </>
  );
};

/**
 * Production dashboard sidebar. Desktop renders as a width-animated
 * collapsible rail; the drawer variant reuses the same navigation
 * source at full width. All tokens semantic; all motion centralized.
 */
const DashboardSidebar = (
  props: SidebarIdentity & {
    variant: "desktop" | "drawer";
    collapsed: boolean;
    pillId: string;
    onNavigate?: () => void;
    onClose?: () => void;
    onToggleCollapse?: () => void;
  },
) => {
  const { variant, collapsed, onNavigate, onClose, onToggleCollapse, pillId, ...identity } = props;

  if (variant === "drawer") {
    return (
      <motion.aside
        variants={dialogContentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        aria-label="Dashboard navigation"
        className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-surface lg:hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className={cn(
            "absolute right-3 top-5 flex h-9 w-9 items-center justify-center rounded-md text-muted",
            "transition-colors hover:bg-surface-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          )}
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        <SidebarBody
          {...identity}
          collapsed={false}
          pillId={pillId}
          onNavigate={onNavigate}
        />
      </motion.aside>
    );
  }

  return (
    <motion.aside
      aria-label="Dashboard navigation"
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={normalTransition}
      className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface lg:flex"
    >
      <SidebarBody {...identity} collapsed={collapsed} pillId={pillId} onToggleCollapse={onToggleCollapse} />
    </motion.aside>
  );
};

export default DashboardSidebar;
