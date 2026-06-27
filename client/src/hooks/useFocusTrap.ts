import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a modal/dialog element
 * Prevents keyboard focus from escaping to background elements
 * Also handles Escape key to close modal
 *
 * Usage:
 * const modalRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(modalRef, () => setIsOpen(false));
 *
 * <div ref={modalRef} className="modal">
 *   <button>First focusable element</button>
 *   ...
 *   <button>Last focusable element</button>
 * </div>
 */
export function useFocusTrap(
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Store the element that had focus before modal opened
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the modal
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    if (firstElement) {
      firstElement.focus();
    }

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modal
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Tab key manages focus trap
      if (e.key === 'Tab') {
        // Shift+Tab on first element → focus last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
          return;
        }

        // Tab on last element → focus first element
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [ref, onClose]);
}
