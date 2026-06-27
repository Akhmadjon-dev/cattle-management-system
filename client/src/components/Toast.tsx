import React, { useEffect, useState } from 'react';
import { shadows } from '@/styles/shadows';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  duration?: number; // milliseconds
  onDismiss?: () => void;
}

/**
 * Reusable Toast notification component
 * Auto-dismisses after duration (default 3000ms)
 * Respects prefers-reduced-motion for animations
 *
 * Usage:
 * {showSuccess && (
 *   <Toast message="Cattle updated successfully" variant="success" />
 * )}
 *
 * {error && (
 *   <Toast message="Failed to update cattle" variant="error" />
 * )}
 */
const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'success',
  duration = 3000,
  onDismiss,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss?.();
      }, 300); // Allow fade-out animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  // Toast styling based on variant
  const variantClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  const variantIcons = {
    success: '✓',
    error: '✕',
  };

  // Check for motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className={`
        fixed bottom-4 right-4
        flex items-center gap-3
        px-4 py-3
        rounded-lg
        text-base font-medium
        ${variantClasses[variant]}
        z-50
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
      style={{
        boxShadow: shadows.tooltip,
        animation: prefersReducedMotion ? 'none' : undefined,
      }}
      role="alert"
      aria-live="polite"
    >
      <span className="text-lg font-bold">{variantIcons[variant]}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
