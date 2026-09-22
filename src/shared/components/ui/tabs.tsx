"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { fastTransition } from "@/shared/animation/transitions";
import { formTransitionVariants } from "@/shared/animation/variants";
import cn from "@/shared/utils/cn";

type TabsVariant = "elevated" | "underline" | "soft";
type TabsAlign = "start" | "center" | "stretch";

interface TriggerRegistration {
  disabled: boolean;
  element: HTMLButtonElement | null;
}

interface TabsContextValue {
  activeValue: string;
  select: (value: string) => void;
  registerTrigger: (value: string, registration: TriggerRegistration) => void;
  unregisterTrigger: (value: string) => void;
  orderedTriggers: () => Array<{ value: string } & TriggerRegistration>;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = (component: string) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} must be used within Tabs.`);
  }
  return context;
};

interface TabsVariantContextValue {
  variant: TabsVariant;
  align: TabsAlign;
}

const TabsVariantContext = createContext<TabsVariantContextValue>({
  variant: "elevated",
  align: "start",
});

const useTabsVariant = () => useContext(TabsVariantContext);

const sanitizeForId = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "-");

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

/**
 * Accessible tab system with automatic activation: arrows move selection
 * and focus together, Home/End jump to the ends, disabled triggers are
 * skipped. Provide `value` or `defaultValue` — lightweight local content
 * switches instantly, so manual activation is unnecessary here. Visual
 * variant and alignment live on TabsList, next to the triggers they style.
 */
const Tabs = ({
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
}: TabsProps) => {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [registrations, setRegistrations] = useState(
    () => new Map<string, TriggerRegistration>(),
  );

  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const select = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const registerTrigger = useCallback(
    (triggerValue: string, registration: TriggerRegistration) => {
      setRegistrations((previous) => {
        const existing = previous.get(triggerValue);
        if (
          existing &&
          existing.disabled === registration.disabled &&
          existing.element === registration.element
        ) {
          return previous;
        }
        const next = new Map(previous);
        next.set(triggerValue, registration);
        return next;
      });
    },
    [],
  );

  const unregisterTrigger = useCallback((triggerValue: string) => {
    setRegistrations((previous) => {
      if (!previous.has(triggerValue)) {
        return previous;
      }
      const next = new Map(previous);
      next.delete(triggerValue);
      return next;
    });
  }, []);

  const orderedTriggers = useCallback(() => {
    return Array.from(registrations.entries()).map(
      ([triggerValue, registration]) => ({
        value: triggerValue,
        ...registration,
      }),
    );
  }, [registrations]);

  return (
    <TabsContext.Provider
      value={{
        activeValue,
        select,
        registerTrigger,
        unregisterTrigger,
        orderedTriggers,
        baseId: sanitizeForId(baseId),
      }}
    >
      <div className={cn("flex w-full flex-col gap-4", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TabsVariant;
  align?: TabsAlign;
}

const LIST_STYLES: Record<TabsVariant, string> = {
  elevated:
    "gap-1 overflow-x-auto rounded-lg bg-background p-1.5 shadow-primary-lg dark:shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  underline:
    "gap-1 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  soft: "gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
};

const TabsList = ({
  variant = "elevated",
  align = "start",
  className,
  children,
  ...props
}: TabsListProps) => {
  const { activeValue, select, orderedTriggers } = useTabsContext("TabsList");
  const variantValue = useMemo(() => ({ variant, align }), [variant, align]);

  const moveSelection = (direction: 1 | -1) => {
    const enabled = orderedTriggers().filter((item) => !item.disabled);
    if (enabled.length === 0) {
      return;
    }
    const currentIndex = enabled.findIndex(
      (item) => item.value === activeValue,
    );
    const nextIndex =
      (currentIndex + direction + enabled.length) % enabled.length;
    const next = enabled[nextIndex];
    select(next.value);
    next.element?.focus();
  };

  const jumpToEdge = (edge: "first" | "last") => {
    const enabled = orderedTriggers().filter((item) => !item.disabled);
    if (enabled.length === 0) {
      return;
    }
    const next = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
    select(next.value);
    next.element?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveSelection(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveSelection(-1);
        break;
      case "Home":
        event.preventDefault();
        jumpToEdge("first");
        break;
      case "End":
        event.preventDefault();
        jumpToEdge("last");
        break;
      default:
        break;
    }
  };

  return (
    <TabsVariantContext.Provider value={variantValue}>
      <div
        {...props}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex max-w-full items-center",
          align === "stretch" ? "w-full" : "w-fit",
          align === "center" && "justify-center",
          align === "start" && "justify-start",
          LIST_STYLES[variant],
          className,
        )}
      >
        {children}
      </div>
    </TabsVariantContext.Provider>
  );
};

interface TabsTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> {
  value: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

const TRIGGER_INDICATOR: Record<TabsVariant, string> = {
  elevated: "rounded-md border border-border bg-primary shadow-sm",
  underline: "inset-x-0 top-auto h-[3px] rounded-full bg-primary",
  soft: "rounded-md bg-primary-muted",
};

const TabsTrigger = ({
  value,
  disabled = false,
  icon,
  badge,
  className,
  children,
  ...props
}: TabsTriggerProps) => {
  const { activeValue, select, registerTrigger, unregisterTrigger, baseId } =
    useTabsContext("TabsTrigger");
  const { variant, align } = useTabsVariant();
  const isActive = activeValue === value;

  /*
   * Stable ref callback: React re-fires inline ref arrows on every render
   * (detach with null + re-attach), which would loop registration
   * setState forever. Memoizing on value/disabled keeps registration
   * tied to identity changes only; unmount still cleans up via null.
   */
  const setTriggerRef: RefCallback<HTMLButtonElement> = useCallback(
    (node) => {
      if (node) {
        registerTrigger(value, { disabled, element: node });
      } else {
        unregisterTrigger(value);
      }
    },
    [value, disabled, registerTrigger, unregisterTrigger],
  );

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    select(value);
    event.currentTarget.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <button
      {...props}
      ref={setTriggerRef}
      type="button"
      role="tab"
      id={`${baseId}-tab-${sanitizeForId(value)}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${sanitizeForId(value)}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative flex shrink-0 items-center gap-2 font-montserrat text-sm",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        align === "stretch" && "flex-1 justify-center",
        isActive ? "font-semibold" : "font-medium",
        variant === "elevated" && [
          "rounded-md px-3.5 py-2",
          isActive ? "text-primary-foreground" : "text-muted",
          !disabled && !isActive && "hover:text-foreground",
        ],
        variant === "underline" && [
          "whitespace-nowrap px-2 pb-2.5 pt-1",
          isActive ? "text-foreground" : "text-muted",
          !disabled && !isActive && "hover:text-foreground",
        ],
        variant === "soft" && [
          "rounded-md px-3 py-1.5",
          isActive ? "text-primary" : "text-muted",
          !disabled &&
            !isActive &&
            "hover:bg-surface-muted hover:text-foreground",
        ],
        className,
      )}
    >
      {isActive ? (
        <motion.span
          layoutId={`${baseId}-indicator`}
          transition={fastTransition}
          aria-hidden="true"
          className={cn("absolute inset-0", TRIGGER_INDICATOR[variant])}
        />
      ) : null}
      {icon ? (
        <span
          aria-hidden="true"
          className="relative flex shrink-0 [&>svg]:h-4 [&>svg]:w-4"
        >
          {icon}
        </span>
      ) : null}
      <span className="relative truncate">{children}</span>
      {badge !== undefined ? (
        <span
          aria-hidden="true"
          className="relative rounded-full bg-foreground/10 px-1.5 py-px font-montserrat text-xs font-semibold leading-4"
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

const TabsContent = ({ value, className, children }: TabsContentProps) => {
  const { activeValue, baseId } = useTabsContext("TabsContent");
  const isActive = activeValue === value;

  return (
    <AnimatePresence initial={false}>
      {isActive ? (
        <motion.div
          key={`${baseId}-panel-${sanitizeForId(value)}`}
          role="tabpanel"
          id={`${baseId}-panel-${sanitizeForId(value)}`}
          aria-labelledby={`${baseId}-tab-${sanitizeForId(value)}`}
          tabIndex={0}
          variants={formTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
export type { TabsAlign, TabsVariant };
