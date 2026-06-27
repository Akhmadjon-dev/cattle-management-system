/**
 * Design System — Color Palette
 * 8 semantic colors used throughout the application
 */

export const colors = {
  // Primary brand color (CTAs, active states, links)
  primary: '#059669',
  primary_dark: '#047857',

  // Secondary accent (complement to primary)
  secondary: '#8b5cf6',

  // Semantic status colors
  success: '#10b981',
  error: '#dc2626',
  warning: '#f59e0b',
  danger: '#6b7280',

  // Neutral/grayscale
  neutral: '#6b7280',
  neutral_light: '#f3f4f6',

  // Aliases for common use cases
  text_primary: '#111827', // gray-900
  text_secondary: '#6b7280', // gray-600
  text_muted: '#9ca3af', // gray-400
  bg_primary: '#ffffff',
  bg_secondary: '#f3f4f6',
  bg_tertiary: '#f9fafb',
  border: '#e5e7eb',
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Get color by semantic name
 * Usage: getColor('primary'), getColor('success')
 */
export const getColor = (token: ColorToken): string => colors[token];

/**
 * Dark mode color overrides
 * Automatically applied when document.documentElement has 'dark' class
 */
export const darkColors = {
  bg_primary: '#1f2937', // gray-800
  bg_secondary: '#111827', // gray-900
  bg_tertiary: '#0f172a', // slate-900
  text_primary: '#f9fafb', // gray-50
  text_secondary: '#d1d5db', // gray-300
  text_muted: '#9ca3af', // gray-400
  border: '#374151', // gray-700
} as const;
