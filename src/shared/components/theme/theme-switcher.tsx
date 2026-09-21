"use client";

import { useSyncExternalStore } from "react";

import cn from "@/shared/utils/cn";
import useTheme from "@/shared/hooks/use-theme";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

interface ThemeSwitcherProps {
  className?: string;
}

const subscribeToMounted = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

/*
 * next-themes resolves the current theme on the client.
 * Rendering the active state before mount can cause an
 * SSR/client hydration mismatch. The store snapshot is
 * false on the server and true after hydration, so the
 * placeholder and interactive states match the previous
 * mounted-guard behavior without a setState-in-effect.
 */
const useMounted = () => {
  return useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );
};

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

  const mounted = useMounted();
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
            aria-label={item.label}
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
            <span aria-hidden="true">{item.icon}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
