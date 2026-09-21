"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { fastTransition } from "@/shared/animation/transitions";
import { toastVariants } from "@/shared/animation/variants";
import Button from "./button";
import cn from "@/shared/utils/cn";

type ToastTone = "default" | "success" | "info" | "warning" | "error";

type ToastPosition =
  | "top-right"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 4000;

const TONE_ICON: Record<ToastTone, typeof Info> = {
  default: BellRing,
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  error: CircleAlert,
};

const TONE_MEDALLION: Record<ToastTone, string> = {
  default: "bg-primary-muted text-primary",
  success: "bg-success-muted text-success",
  info: "bg-info-muted text-info",
  warning: "bg-warning-muted text-warning",
  error: "bg-error-muted text-error",
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-right":
    "fixed left-4 right-4 top-4 sm:left-auto sm:right-6 sm:top-6 sm:w-96",
  "bottom-right":
    "fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96",
  "top-center":
    "fixed left-4 right-4 top-4 sm:left-1/2 sm:right-auto sm:top-6 sm:w-96 sm:-translate-x-1/2",
  "bottom-center":
    "fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-96 sm:-translate-x-1/2",
};

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: ToastAction;
  duration?: number;
}

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: ToastAction;
  duration: number;
}

interface ToastsContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastsContext = createContext<ToastsContextValue | null>(null);

const useToasts = () => {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error("useToasts must be used within ToastProvider.");
  }
  return context;
};

const subscribeToMounted = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

interface ToastProviderProps {
  position?: ToastPosition;
  duration?: number;
  children: ReactNode;
}

/**
 * Imperative toast system. `toast()` posts a transient notification;
 * items auto-dismiss, pause while hovered or focused, and cap at four
 * with the oldest dismissed first. The viewport portals to the document
 * body so it floats above transformed ancestors and modal layers.
 */
const ToastProvider = ({
  position = "top-right",
  duration = DEFAULT_DURATION,
  children,
}: ToastProviderProps) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setItems((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const scheduleDismiss = useCallback(
    (id: number, delay: number) => {
      const existing = timersRef.current.get(id);
      if (existing !== undefined) {
        clearTimeout(existing);
      }
      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), delay),
      );
    },
    [dismiss],
  );

  const toast = useCallback(
    (options: ToastOptions) => {
      idRef.current += 1;
      const id = idRef.current;
      const delay = options.duration ?? duration;
      setItems((previous) => {
        const next: ToastItem[] = [
          ...previous,
          {
            id,
            title: options.title,
            description: options.description,
            tone: options.tone ?? "default",
            action: options.action,
            duration: delay,
          },
        ];
        if (next.length <= MAX_TOASTS) {
          return next;
        }
        const dropped = next.slice(0, next.length - MAX_TOASTS);
        dropped.forEach((item) => {
          const timer = timersRef.current.get(item.id);
          if (timer !== undefined) {
            clearTimeout(timer);
            timersRef.current.delete(item.id);
          }
        });
        return next.slice(next.length - MAX_TOASTS);
      });
      scheduleDismiss(id, delay);
      return id;
    },
    [duration, scheduleDismiss],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastsContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted
        ? createPortal(
            <div
              role="region"
              aria-label="Notifications"
              className={cn(
                "pointer-events-none z-50 flex flex-col gap-2",
                POSITION_CLASSES[position],
              )}
            >
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <ToastView
                    key={item.id}
                    item={item}
                    onPause={() => {
                      const timer = timersRef.current.get(item.id);
                      if (timer !== undefined) {
                        clearTimeout(timer);
                        timersRef.current.delete(item.id);
                      }
                    }}
                    onResume={() => scheduleDismiss(item.id, item.duration)}
                    onDismiss={() => dismiss(item.id)}
                  />
                ))}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </ToastsContext.Provider>
  );
};

interface ToastViewProps {
  item: ToastItem;
  onPause: () => void;
  onResume: () => void;
  onDismiss: () => void;
}

const ToastView = ({ item, onPause, onResume, onDismiss }: ToastViewProps) => {
  const Icon = TONE_ICON[item.tone];

  return (
    <motion.div
      layout
      transition={fastTransition}
      role={item.tone === "error" ? "alert" : "status"}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3",
        "rounded-md border border-border bg-surface p-4 shadow-lg",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          TONE_MEDALLION[item.tone],
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-montserrat text-sm font-semibold text-foreground">
          {item.title}
        </span>
        {item.description ? (
          <span className="font-lato text-sm text-muted">
            {item.description}
          </span>
        ) : null}
        {item.action ? (
          <span className="mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={item.action.onClick}
            >
              {item.action.label}
            </Button>
          </span>
        ) : null}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center",
          "rounded-md text-muted",
          "transition-colors duration-200",
          "hover:bg-primary-muted hover:text-primary",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring/30",
        )}
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export { ToastProvider, useToasts };
export type { ToastPosition, ToastTone };
