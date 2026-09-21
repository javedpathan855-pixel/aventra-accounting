"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import Button from "./button";
import Card from "./card";
import cn from "@/shared/utils/cn";

/* =========================================================
   TYPES
   ========================================================= */

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  dialogId: string;
  titleId: string;
  descriptionId: string;
}

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showClose?: boolean;
}

interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

/* =========================================================
   CONTEXT
   ========================================================= */

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog components must be used inside <Dialog>.");
  }

  return context;
};

/* =========================================================
   DIALOG
   ========================================================= */

const Dialog = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;

  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }

    onOpenChange?.(value);
  };

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        dialogId,
        titleId,
        descriptionId,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

/* =========================================================
   DIALOG TRIGGER
   ========================================================= */

const DialogTrigger = ({
  children,
  className,
  type = "button",
  asChild = false,
  ...props
}: DialogTriggerProps) => {
  const { open, setOpen } = useDialogContext();

  if (asChild) {
    return (
      <span
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <Button
      type={type}
      className={className}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </Button>
  );
};

/* =========================================================
   DIALOG CONTENT
   ========================================================= */

const DialogContent = ({
  children,
  className,
  showClose = true,
  ...props
}: DialogContentProps) => {
  const { open, setOpen, dialogId, titleId, descriptionId } =
    useDialogContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousActiveElement.current =
      document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const content = contentRef.current;

        if (!content) {
          return;
        }

        const focusableElements = content.querySelectorAll<HTMLElement>(
          [
            "button:not([disabled])",
            "a[href]",
            "input:not([disabled])",
            "textarea:not([disabled])",
            "select:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
          ].join(","),
        );

        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];

        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        [
          "button:not([disabled])",
          "input:not([disabled])",
          "textarea:not([disabled])",
          "select:not([disabled])",
          "a[href]",
          "[tabindex]:not([tabindex='-1'])",
        ].join(","),
      );

      firstFocusable?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);

      requestAnimationFrame(() => {
        previousActiveElement.current?.focus();
      });
    };
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-overlay backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Content */}
      <Card
        ref={contentRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "relative z-modal w-full max-w-lg",
          "max-h-[calc(100vh-2rem)]",
          "overflow-y-auto",
          "animate-in fade-in zoom-in-95 duration-200",
          className,
        )}
        {...props}
      >
        {children}

        {showClose && (
          <Button
            type="button"
            variant="ghost"
            aria-label="Close dialog"
            className="absolute right-4 top-4 h-9 w-9 p-0"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </Button>
        )}
      </Card>
    </div>
  );
};

/* =========================================================
   DIALOG HEADER
   ========================================================= */

const DialogHeader = ({ children, className, ...props }: DialogHeaderProps) => {
  return (
    <div
      className={cn("flex flex-col gap-1.5", "text-left", className)}
      {...props}
    >
      {children}
    </div>
  );
};

/* =========================================================
   DIALOG FOOTER
   ========================================================= */

const DialogFooter = ({ children, className, ...props }: DialogFooterProps) => {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* =========================================================
   DIALOG TITLE
   ========================================================= */

const DialogTitle = ({ children, className, ...props }: DialogTitleProps) => {
  const { titleId } = useDialogContext();

  return (
    <h2
      id={titleId}
      className={cn(
        "font-montserrat text-lg font-semibold",
        "text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

/* =========================================================
   DIALOG DESCRIPTION
   ========================================================= */

const DialogDescription = ({
  children,
  className,
  ...props
}: DialogDescriptionProps) => {
  const { descriptionId } = useDialogContext();

  return (
    <p
      id={descriptionId}
      className={cn("text-sm leading-6", "text-text-secondary", className)}
      {...props}
    >
      {children}
    </p>
  );
};

/* =========================================================
   DIALOG CLOSE
   ========================================================= */

const DialogClose = ({
  children = "Cancel",
  className,
  type = "button",
  ...props
}: DialogCloseProps) => {
  const { setOpen } = useDialogContext();

  return (
    <Button
      type={type}
      variant="outline"
      className={className}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </Button>
  );
};

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

export default Dialog;
