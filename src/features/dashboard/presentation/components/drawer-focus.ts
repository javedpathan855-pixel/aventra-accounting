// Dashboard drawer focus management (dashboard-specific, not a second
// generic dialog system). Pure index helpers are unit-tested; the hook
// wires initial focus, Tab containment, and trigger restoration.

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Visible, enabled focusables inside a container. */
const getDrawerFocusable = (root: HTMLElement | null): HTMLElement[] => {
  if (!root || typeof root.querySelectorAll !== "function") {
    return [];
  }
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0,
  );
};

/**
 * Pure Tab-cycle step. Returns the element that should receive focus
 * next, or null when the container has no focusables (caller then keeps
 * focus on the container itself).
 */
const nextFocusInTrap = (
  focusables: readonly HTMLElement[],
  active: unknown,
  shiftKey: boolean,
): HTMLElement | null => {
  if (focusables.length === 0) {
    return null;
  }
  const first = focusables[0] as HTMLElement;
  const last = focusables[focusables.length - 1] as HTMLElement;
  if (shiftKey && active === first) {
    return last;
  }
  if (!shiftKey && active === last) {
    return first;
  }
  return null;
};

interface DrawerFocus {
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Move initial focus into the drawer on open, contain Tab while open,
 * and restore focus to the menu trigger on close. Escape and overlay
 * dismissal stay with the caller; this hook owns focus only.
 */
const useDrawerFocus = (open: boolean): DrawerFocus => {
  const panelRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    const trigger = triggerRef.current;

    // Initial focus: first focusable, else the panel itself.
    const focusables = getDrawerFocusable(node);
    const initialTarget = focusables[0] ?? node;
    if (initialTarget && typeof initialTarget.focus === "function") {
      initialTarget.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }
      const items = getDrawerFocusable(panelRef.current);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const next = nextFocusInTrap(items, document.activeElement, event.shiftKey);
      if (next) {
        event.preventDefault();
        next.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // Restoration: explicit trigger first, else the opener.
      const restoreTarget = trigger ?? previouslyFocused.current;
      if (restoreTarget && typeof restoreTarget.focus === "function") {
        restoreTarget.focus();
      }
    };
  }, [open ]);

  return { panelRef, triggerRef };
};

export { getDrawerFocusable, nextFocusInTrap, useDrawerFocus };
export type { DrawerFocus };
