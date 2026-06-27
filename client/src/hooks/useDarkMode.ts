import { useState, useEffect } from 'react';

/**
 * Hook for managing dark mode preference
 * - Checks system preference on first load (prefers-color-scheme)
 * - Stores user preference in localStorage
 * - Applies 'dark' class to document root for CSS dark mode handling
 *
 * Usage:
 * const [isDark, toggleDark] = useDarkMode();
 *
 * <button onClick={toggleDark}>
 *   {isDark ? '☀️ Light' : '🌙 Dark'}
 * </button>
 */
export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('dark-mode');
    if (stored !== null) {
      return stored === 'true';
    }

    // Fall back to system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  });

  // Update DOM and localStorage when dark mode changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('dark-mode', String(isDark));

    // Apply/remove 'dark' class on document root
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Listen to system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const stored = localStorage.getItem('dark-mode');
      if (stored === null) {
        setIsDark(e.matches);
      }
    };

    // Modern browsers: addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy: addListener
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleDark = () => setIsDark(!isDark);

  return [isDark, toggleDark];
}
