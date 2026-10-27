'use client';

import { RefObject, useEffect } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Modal behaviour for a hand-built dialog: moves focus in, keeps Tab inside, closes on Escape,
// locks page scroll, and returns focus to whatever opened it.
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const items = () => Array.from(el?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((n) => n.offsetParent !== null);
    (items()[0] ?? el)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !el) return;
      const list = items();
      if (!list.length) return e.preventDefault();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [ref, open, onClose]);
}
