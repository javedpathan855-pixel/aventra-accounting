"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { fastTransition } from "@/shared/animation/transitions";
import StatusBadge from "@/shared/components/ui/status-badge";
import { useToasts } from "@/shared/components/ui/toast";
import cn from "@/shared/utils/cn";

import {
  DASHBOARD_NAV_SECTIONS,
  type DashboardNavItem,
} from "../dashboard-nav";

interface SidebarNavProps {
  collapsed: boolean;
  pillId: string;
  onNavigate?: () => void;
}

const ITEM_BASE = cn(
  "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left",
  "font-montserrat text-sm font-medium",
  "transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
);

const NavLink = ({
  item,
  href,
  isActive,
  collapsed,
  pillId,
  onNavigate,
}: {
  item: DashboardNavItem;
  href: string;
  isActive: boolean;
  collapsed: boolean;
  pillId: string;
  onNavigate?: () => void;
}) => {
  const Icon = item.icon;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        ITEM_BASE,
        "group",
        collapsed && "justify-center px-0",
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
      <Icon
        aria-hidden="true"
        className="relative h-[18px] w-[18px] shrink-0"
        strokeWidth={1.75}
      />
      <span
        aria-hidden={collapsed}
        className={cn(
          "relative block overflow-hidden whitespace-nowrap transition-all duration-200",
          collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100",
        )}
      >
        {item.label}
      </span>
      {collapsed ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-full z-10 ml-3 whitespace-nowrap",
            "rounded-md bg-secondary px-2 py-1",
            "font-montserrat text-xs font-semibold text-secondary-foreground shadow-md",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            "group-focus-visible:opacity-100",
          )}
        >
          {item.label}
        </span>
      ) : null}
    </Link>
  );
};

const SoonButton = ({
  item,
  collapsed,
  onNotice,
}: {
  item: DashboardNavItem;
  collapsed: boolean;
  onNotice: () => void;
}) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onNotice}
      aria-label={`${item.label}, coming soon`}
      title={collapsed ? `${item.label} (coming soon)` : undefined}
      className={cn(
        ITEM_BASE,
        "group",
        collapsed && "justify-center px-0",
        "font-medium text-muted hover:bg-surface-muted hover:text-foreground",
      )}
    >
      <Icon
        aria-hidden="true"
        className="relative h-[18px] w-[18px] shrink-0"
        strokeWidth={1.75}
      />
      <span
        aria-hidden={collapsed}
        className={cn(
          "relative block overflow-hidden whitespace-nowrap transition-all duration-200",
          collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100",
        )}
      >
        {item.label}
      </span>
      {collapsed ? null : (
        <StatusBadge tone="neutral" className="relative ml-auto shrink-0 px-2 py-0.5 text-[11px]">
          Soon
        </StatusBadge>
      )}
      {collapsed ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-full z-10 ml-3 flex items-center gap-2 whitespace-nowrap",
            "rounded-md bg-secondary px-2 py-1 shadow-md",
            "font-montserrat text-xs font-semibold text-secondary-foreground",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            "group-focus-visible:opacity-100",
          )}
        >
          {item.label}
          <span className="rounded-full bg-secondary-foreground/15 px-1.5 py-px text-[10px]">
            Soon
          </span>
        </span>
      ) : null}
    </button>
  );
};

/**
 * Sectioned dashboard navigation from one typed source. Expanded mode
 * shows labels, sections, and Soon badges; collapsed mode is icon-only
 * with hover tooltips. Coming-soon items never navigate — they toast.
 */
const SidebarNav = ({ collapsed, pillId, onNavigate }: SidebarNavProps) => {
  const pathname = usePathname();
  const { toast } = useToasts();

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-5">
      {DASHBOARD_NAV_SECTIONS.map((section) => (
        <div key={section.id} className="flex flex-col gap-1">
          {collapsed ? null : (
            <p className="px-3 pb-1 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-muted">
              {section.label}
            </p>
          )}
          {section.items.map((item) => {
            if (item.status === "available" && item.href) {
              const href = item.href;
              return (
                <NavLink
                  key={item.id}
                  item={item}
                  href={href}
                  isActive={pathname === href}
                  collapsed={collapsed}
                  pillId={pillId}
                  onNavigate={onNavigate}
                />
              );
            }
            return (
              <SoonButton
                key={item.id}
                item={item}
                collapsed={collapsed}
                onNotice={() => {
                  toast({
                    title: item.notice ?? `${item.label} is coming soon.`,
                    tone: "info",
                  });
                  onNavigate?.();
                }}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;
