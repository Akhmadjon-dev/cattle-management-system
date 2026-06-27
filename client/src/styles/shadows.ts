/**
 * Design System — Shadow/Depth System
 * 3 levels of elevation for visual hierarchy
 */

export const shadows = {
  // Depth 1: Card-level shadow (subtle, resting state)
  // Used on: cards, small components, default state
  card: '0 1px 2px rgba(0, 0, 0, 0.05)',

  // Depth 2: Modal-level shadow (medium elevation)
  // Used on: modals, expanded cards, focused elements
  modal: '0 4px 12px rgba(0, 0, 0, 0.15)',

  // Depth 3: Tooltip-level shadow (highest elevation)
  // Used on: tooltips, dropdowns, floating elements
  tooltip: '0 10px 25px rgba(0, 0, 0, 0.2)',
} as const;

export type ShadowToken = keyof typeof shadows;

/**
 * Get shadow by elevation level
 * Usage: boxShadow: getShadow('card')
 */
export const getShadow = (token: ShadowToken): string => shadows[token];

/**
 * Dark mode shadows (lighter, more subtle)
 */
export const darkShadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.3)',
  modal: '0 4px 12px rgba(0, 0, 0, 0.4)',
  tooltip: '0 10px 25px rgba(0, 0, 0, 0.5)',
} as const;

/**
 * Tailwind shadow class mappings for reference
 * Tailwind's shadow presets don't match our custom system exactly,
 * so we use inline styles or custom CSS classes instead
 */
export const shadowsToTailwind = {
  card: 'shadow-sm', // Tailwind's closest match
  modal: 'shadow-lg',
  tooltip: 'shadow-2xl',
} as const;

/**
 * Component elevation presets
 */
export const componentElevation = {
  button: {
    default: 'none', // no shadow by default
    hover: shadows.card, // lift on hover
    active: 'none', // no shadow when pressed
  },

  card: {
    default: shadows.card,
    hover: shadows.modal, // lift on hover
    focused: shadows.modal,
  },

  modal: {
    overlay: shadows.modal,
    content: shadows.tooltip,
  },

  toast: {
    notification: shadows.tooltip,
  },
} as const;
