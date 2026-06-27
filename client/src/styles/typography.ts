/**
 * Design System — Typography Scale
 * 4-tier hierarchy for consistent text styling
 */

export const typography = {
  // Display: Page titles and hero content (36px)
  display: 'text-4xl font-bold leading-tight tracking-tight',

  // Heading: Section headers (24px)
  heading: 'text-2xl font-bold leading-snug tracking-normal',

  // Subheading: Labels, card titles, section headers (18px)
  subheading: 'text-lg font-semibold leading-normal tracking-normal',

  // Body: Primary content, body text (16px)
  body: 'text-base font-normal leading-relaxed',

  // Small: Secondary info, captions, metadata (14px)
  small: 'text-sm font-normal leading-normal',

  // Code: Error messages, IDs, monospace content (13px)
  code: 'text-xs font-mono leading-normal',

  // Utility classes for common combinations
  label: 'text-sm font-medium leading-normal',
  button: 'text-base font-semibold leading-normal',
  caption: 'text-xs font-normal leading-tight',
} as const;

export type TypographyToken = keyof typeof typography;

/**
 * Get typography classes by semantic name
 * Usage: <h1 className={getTypography('display')}>Title</h1>
 */
export const getTypography = (token: TypographyToken): string => typography[token];

/**
 * Font size mappings (for reference in CSS-in-JS or calculations)
 */
export const fontSizes = {
  display: '36px', // text-4xl
  heading: '24px', // text-2xl
  subheading: '18px', // text-lg
  body: '16px', // text-base
  small: '14px', // text-sm
  code: '13px', // text-xs
} as const;

/**
 * Font weight reference
 */
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Line height reference
 */
export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;
