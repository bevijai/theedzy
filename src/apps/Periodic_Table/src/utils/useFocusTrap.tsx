import { useEffect } from 'react';

function getFocusableElements(container: HTMLElement) {
  const selectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]'
  ];
  return Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(Boolean);
}

export default function useFocusTrap(containerRef: { current: HTMLElement | null }, active: boolean) {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const focusable = getFocusableElements(container);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // move focus to first focusable element
    if (first) first.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const idx = focusable.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey) {
          if (idx === 0 || document.activeElement === container) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (idx === focusable.length - 1) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [containerRef, active]);
}
