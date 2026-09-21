"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AnimationProvider from "@/shared/animation/motion";
import { fastTransition } from "@/shared/animation/transitions";
import { formTransitionVariants } from "@/shared/animation/variants";
import AventraLogo from "@/shared/components/ui/aventra-logo";
import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import cn from "@/shared/utils/cn";

import { SHOWCASE_NAV } from "./showcase-registry";

const ShowcaseShell = () => {
  const [activeId, setActiveId] = useState("overview");

  const activeItem = SHOWCASE_NAV.flatMap((group) => group.items).find(
    (item) => item.id === activeId,
  );
  const ActiveComponent = activeItem?.Component;

  const navigate = (sectionId: string) => {
    setActiveId(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimationProvider>
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-background shadow-xs print:hidden">
          <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <AventraLogo variant="Short" />
              <div className="flex min-w-0 flex-col leading-tight">
                <p className="truncate font-montserrat text-sm font-bold text-foreground">
                  Aventra
                </p>
                <p className="truncate font-lato text-xs text-muted">
                  Design System
                </p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
          <nav
            aria-label="Showcase sections"
            className="border-t border-border lg:hidden"
          >
            <div className="flex gap-1 overflow-x-auto px-4 py-2 sm:px-6">
              {SHOWCASE_NAV.flatMap((group) => group.items).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  aria-current={item.id === activeId ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-1.5",
                    "font-montserrat text-sm font-medium",
                    "transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    item.id === activeId
                      ? "bg-primary-muted text-primary"
                      : "text-muted hover:bg-surface-muted hover:text-foreground",
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </nav>
        </header>

        <div className="mx-auto flex w-full items-start gap-8 px-4 py-8 sm:px-6 lg:px-8 print:block print:p-0">
          <aside className="sticky top-24 hidden h-fit max-h-[calc(100dvh-7rem)] w-60 shrink-0 overflow-y-auto lg:block print:hidden">
            <nav aria-label="Showcase sections" className="flex flex-col gap-5">
              {SHOWCASE_NAV.map((group) => (
                <div key={group.label} className="flex flex-col gap-1">
                  <p className="px-3 font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative rounded-md px-3 py-2 text-left",
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
                            layoutId="showcase-nav-active"
                            transition={fastTransition}
                            aria-hidden="true"
                            className="absolute inset-0 rounded-md bg-primary-muted"
                          />
                        ) : null}
                        <span className="relative">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 flex-1 pb-16 print:pb-0">
            <AnimatePresence mode="wait" initial={false}>
              {ActiveComponent ? (
                <motion.div
                  key={activeId}
                  variants={formTransitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <ActiveComponent
                    onNavigate={(sectionId: string) => navigate(sectionId)}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AnimationProvider>
  );
};

export default ShowcaseShell;
