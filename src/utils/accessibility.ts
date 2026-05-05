/**
 * Accessibility Utilities
 * ARIA labels, focus management, and keyboard navigation helpers
 */

/**
 * ARIA attributes for common components
 */
export const getAriaAttributes = (component: string, options?: Record<string, unknown>) => {
  const baseAttributes: Record<string, Record<string, unknown>> = {
    button: {
      role: 'button',
      'aria-pressed': options?.pressed ?? false,
    },
    link: {
      role: 'link',
      tabIndex: 0,
    },
    modal: {
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': options?.labelId ?? 'modal-title',
    },
    alert: {
      role: 'alert',
      'aria-live': options?.live ?? 'polite',
      'aria-atomic': true,
    },
    navigation: {
      role: 'navigation',
      'aria-label': options?.label ?? 'Main navigation',
    },
    search: {
      role: 'search',
      'aria-label': 'Search',
    },
    tab: {
      role: 'tab',
      'aria-selected': options?.selected ?? false,
      'aria-controls': options?.controls,
    },
    form: {
      role: 'form',
      'aria-label': options?.label,
    },
  };

  return baseAttributes[component] || {};
};

/**
 * Label element for accessibility
 */
export interface AccessibleLabelProps {
  htmlFor: string;
  children: string;
  required?: boolean;
  error?: boolean;
}

/**
 * Create accessible form labels
 */
export const createAccessibleLabel = ({
  htmlFor,
  children,
  required = false,
  error = false,
}: AccessibleLabelProps): string => {
  const requiredMarkup = required ? ' <span aria-label="required">*</span>' : '';
  return `<label for="${htmlFor}" aria-invalid="${error}">${children}${requiredMarkup}</label>`;
};

/**
 * Keyboard event handlers for accessibility
 */
export const isActionKey = (e: React.KeyboardEvent): boolean => {
  return e.key === 'Enter' || e.key === ' ';
};

export const isEscapeKey = (e: React.KeyboardEvent): boolean => {
  return e.key === 'Escape';
};

export const isArrowKey = (e: React.KeyboardEvent): 'up' | 'down' | 'left' | 'right' | null => {
  if (e.key === 'ArrowUp') return 'up';
  if (e.key === 'ArrowDown') return 'down';
  if (e.key === 'ArrowLeft') return 'left';
  if (e.key === 'ArrowRight') return 'right';
  return null;
};

/**
 * Focus management utilities
 */
export const focusElement = (element: HTMLElement | null): void => {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
};

export const focusFirstFocusableElement = (container: HTMLElement): void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const focusLastFocusableElement = (container: HTMLElement): void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
  }
};

/**
 * Skip link for keyboard navigation
 */
export interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * Announce messages to screen readers
 */
export const announceToScreenReader = (message: string, timeout = 1000): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // screen-reader-only class
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, timeout);
};

/**
 * Get focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
  return Array.from(container.querySelectorAll(focusableSelector)) as HTMLElement[];
};

/**
 * Trap focus within a modal or container
 */
export const trapFocus = (container: HTMLElement, e: KeyboardEvent): void => {
  if (e.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (e.shiftKey) {
    if (activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
};

export default {
  getAriaAttributes,
  createAccessibleLabel,
  isActionKey,
  isEscapeKey,
  isArrowKey,
  focusElement,
  focusFirstFocusableElement,
  focusLastFocusableElement,
  announceToScreenReader,
  getFocusableElements,
  trapFocus,
};
