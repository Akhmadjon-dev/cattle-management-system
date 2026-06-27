/**
 * Design System — Spacing Scale
 * Based on 8px base grid for consistent visual rhythm
 */

export const spacing = {
  // Micro spacing (4px) — badges, small icons, minimal gaps
  xs: '4px',

  // Base unit (8px) — button padding, input height
  sm: '8px',

  // Small gap (12px) — element spacing
  md: '12px',

  // Standard gap (16px) — default component spacing, input padding
  lg: '16px',

  // Medium gap (24px) — section spacing between components
  xl: '24px',

  // Large gap (32px) — major section spacing
  xxl: '32px',

  // Extra large (48px) — page section spacing
  xxxl: '48px',

  // Massive (64px) — hero sections, full-page spacing
  giant: '64px',
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Convert spacing tokens to numeric values (in pixels)
 * Useful for calculations or inline styles
 */
export const spacingValues = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  giant: 64,
} as const;

/**
 * Get spacing value by token
 * Usage: gap: getSpacing('lg')
 */
export const getSpacing = (token: SpacingToken): string => spacing[token];

/**
 * Common spacing combinations for Tailwind className generation
 * Maps to Tailwind spacing scale (Tailwind uses 4px base)
 * Reference: spacing.lg = 16px = "4" in Tailwind (16/4 = 4)
 */
export const tailwindSpacingMap = {
  xs: '1', // 4px
  sm: '2', // 8px
  md: '3', // 12px
  lg: '4', // 16px
  xl: '6', // 24px
  xxl: '8', // 32px
  xxxl: '12', // 48px
  giant: '16', // 64px
} as const;

/**
 * Component-level spacing presets
 */
export const componentSpacing = {
  // Button padding
  button: {
    sm: `${spacing.sm} ${spacing.md}`, // 8px 12px
    md: `${spacing.sm} ${spacing.lg}`, // 8px 16px
    lg: `${spacing.md} ${spacing.lg}`, // 12px 16px
  },

  // Card padding
  card: {
    sm: spacing.md, // 12px
    md: spacing.lg, // 16px
    lg: spacing.xl, // 24px
  },

  // Input padding
  input: {
    padding: `${spacing.sm} ${spacing.md}`, // 8px 12px
    height: '40px', // standard touch target
  },

  // Gap between form elements
  formGap: spacing.md, // 12px

  // Section spacing
  section: spacing.xxxl, // 48px
} as const;
