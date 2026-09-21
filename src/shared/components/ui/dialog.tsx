"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import {
  dialogContentVariants,
  dialogOverlayVariants,
} from "@/shared/animation/variants";
import Button from "./button";
import cn from "@/shared/utils/cn";

interface DialogContextValue {
  close: () => void;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  registerDescription: () => void;
  unregisterDescription: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialogContext = (component: string) => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(`${component} must be used within Dialog.`);
  }
  return context;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) {
    return [];
  }
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.getClientRects().length > 0);
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Controlled modal dialog. Focus moves inside on open and returns to the
 * trigger on close, Tab cycles within, Escape dismisses, and background
 * scroll locks with scrollbar compensation. Content lives in a portal so
 * transformed ancestors and stacking contexts cannot trap it.
 */
const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const baseId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const registerDescription = useCallback(() => {
    setHasDescription(true);
  }, []);

  const unregisterDescription = useCallback(() => {
    setHasDescription(false);
  }, []);

  return (
    <DialogContext.Provider
      value={{
        close,
        titleId: `${baseId}-title`,
        descriptionId: `${baseId}-description`,
        hasDescription,
        registerDescription,
        unregisterDescription,
      }}
    >
      <AnimatePresence>
        {open ? <DialogPortal key="dialog">{children}</DialogPortal> : null}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

const subscribeToMounted = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

const DialogPortal = ({ children }: { children: ReactNode }) => {
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );

  if (!mounted) {
    return null;
  }

  return createPortal(children, document.body);
};

const DIALOG_SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

interface DialogContentProps {
  size?: keyof typeof DIALOG_SIZES;
  className?: string;
  children: ReactNode;
}

const DialogContent = ({
  size = "md",
  className,
  children,
}: DialogContentProps) => {
  const { close, titleId, descriptionId, hasDescription } =
    useDialogContext("DialogContent");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = contentRef.current;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusables = getFocusableElements(node);
    (focusables[0] ?? node)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusables = getFocusableElements(contentRef.current);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <motion.div
        variants={dialogOverlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        aria-hidden="true"
        onClick={close}
        className="fixed inset-0 z-40 bg-overlay"
      />
      <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          variants={dialogContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            "pointer-events-auto flex max-h-[85dvh] w-full flex-col",
            "rounded-lg border border-border bg-surface p-6 shadow-lg",
            "focus-visible:outline-none",
            DIALOG_SIZES[size],
            className,
          )}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
};

const DialogHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={cn("flex shrink-0 flex-col gap-1", className)}>
      {children}
    </div>
  );
};

const DialogTitle = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId } = useDialogContext("DialogTitle");

  return (
    <h2 {...props} id={titleId} className={cn(
        "font-montserrat text-lg font-semibold text-foreground",
        className,
      )}>
      {children}
    </h2>
  );
};

const DialogDescription = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => {
  const { descriptionId, registerDescription, unregisterDescription } =
    useDialogContext("DialogDescription");

  useEffect(() => {
    registerDescription();
    return () => {
      unregisterDescription();
    };
  }, [registerDescription, unregisterDescription]);

  return (
    <p
      {...props}
      id={descriptionId}
      className={cn("font-lato text-sm text-muted", className)}
    >
      {children}
    </p>
  );
};

const DialogBody = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn("min-h-0 flex-1 overflow-y-auto", className)}
    >
      {children}
    </div>
  );
};

const DialogFooter = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface DialogCloseProps {
  children: ReactNode;
  className?: string;
}

const DialogClose = ({ children, className }: DialogCloseProps) => {
  const { close } = useDialogContext("DialogClose");

  return (
    <Button variant="ghost" size="sm" onClick={close} className={className}>
      {children}
    </Button>
  );
};

interface DialogXProps {
  label?: string;
}

const DialogX = ({ label = "Close dialog" }: DialogXProps) => {
  const { close } = useDialogContext("DialogX");

  return (
    <button
      type="button"
      onClick={close}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center",
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
  );
};

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogX,
  DialogPortal,
};
