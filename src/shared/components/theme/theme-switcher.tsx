"use client";

import { useEffect, useState } from "react";

import cn from "@/shared/utils/cn";
import useTheme from "@/shared/hooks/use-theme";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

interface ThemeSwitcherProps {
  className?: string;
}

const THEMES: Array<{
  value: Theme;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "light",
    label: "Light",
    icon: <Sun size={20} />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon size={20} />,
  },
  {
    value: "system",
    label: "System",
    icon: <Monitor size={20} />,
  },
];

const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * next-themes resolves the current theme on the client.
   * Rendering the active state before mount can cause an
   * SSR/client hydration mismatch.
   */
  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1",
          "rounded-md border border-border",
          "bg-surface-muted p-1",
          className,
        )}
        role="group"
        aria-label="Theme selection"
      >
        {THEMES.map((item) => (
          <div
            key={item.value}
            className={cn(
              "rounded-sm px-3 py-2",
              "font-montserrat text-sm font-medium",
              "text-transparent",
              "select-none",
            )}
            aria-hidden="true"
          >
            {item.icon}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1",
        "rounded-md border border-border",
        "bg-surface-muted p-1",
        className,
      )}
      role="group"
      aria-label="Theme selection"
    >
      {THEMES.map((item) => {
        const isActive = theme === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setTheme(item.value)}
            aria-pressed={isActive}
            className={cn(
              "rounded-sm px-3 py-2",
              "font-montserrat text-sm font-medium",
              "transition-all duration-200",

              isActive
                ? ["bg-background", "text-foreground", "shadow-sm"]
                : [
                    "text-muted",
                    "hover:bg-background/60",
                    "hover:text-foreground",
                  ],

              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-ring/30",
              "focus-visible:ring-offset-1",
              "focus-visible:ring-offset-background",
            )}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
