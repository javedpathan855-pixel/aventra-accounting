"use client";

import { useSyncExternalStore } from "react";

import cn from "@/shared/utils/cn";
import useTheme from "@/shared/hooks/use-theme";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

type ThemeSwitcherVariant = "full" | "compact";

interface ThemeSwitcherProps {
  className?: string;
  /**
   * `full` renders the segmented light/dark/system control.
   * `compact` renders the single cycling icon button for collapsed
   * rails — same state owner, same theme order, no duplicated logic.
   */
  variant?: ThemeSwitcherVariant;
}

const THEME_ORDER: readonly Theme[] = ["light", "dark", "system"];

/** Pure next-theme step shared by both variants (unit-tested). */
const nextTheme = (current: Theme): Theme => {
  const index = THEME_ORDER.indexOf(current);
  return THEME_ORDER[(index + 1) % THEME_ORDER.length] as Theme;
};

const normalizeTheme = (value: string | undefined): Theme =>
  value === "light" || value === "dark" || value === "system" ? value : "system";

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

const ThemeCycleControl = ({ className }: { className?: string }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = normalizeTheme(theme);
  const upcoming = nextTheme(current);
  const effective = current === "system" ? (resolvedTheme ?? "light") : current;
  const Icon = effective === "dark" ? Moon : effective === "light" ? Sun : Monitor;

  const mounted = useMounted();
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md text-transparent",
          className,
        )}
      >
        <Monitor size={18} />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(upcoming)}
      aria-label={`Theme: ${current}. Activate to switch to ${upcoming} mode.`}
      title={`Theme: ${current} — switch to ${upcoming}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-muted",
        "transition-colors duration-200 hover:bg-surface-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
  );
};

const ThemeSwitcher = ({ className, variant = "full" }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (variant === "compact") {
    return <ThemeCycleControl className={className} />;
  }

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

export { nextTheme, normalizeTheme, THEME_ORDER };
export type { Theme, ThemeSwitcherVariant };
export default ThemeSwitcher;
