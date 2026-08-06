import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface FocusableRef {
  current: HTMLElement | null;
}

export function useFocusTrap(ref: FocusableRef, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const panel = ref.current;
    if (!panel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusables =
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const items = Array.from(
        panel.querySelectorAll<HTMLButtonElement>("[data-nav-item]"),
      );
      if (items.length === 0) return;
      e.preventDefault();
      const currentIndex = items.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (currentIndex === -1) {
        items[e.key === "ArrowDown" ? 0 : items.length - 1].focus();
        return;
      }
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (currentIndex + delta + items.length) % items.length;
      items[nextIndex].focus();
    };

    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [ref, active]);
}
