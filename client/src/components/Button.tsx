import React, { forwardRef } from 'react';
import { colors } from '@/styles/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Reusable Button component with 4 variants and 3 sizes
 * Replaces all inline button styling across the app
 *
 * Usage:
 * <Button variant="primary" size="md">Add Cattle</Button>
 * <Button variant="danger" size="sm" icon="🗑️">Delete</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      loading,
      fullWidth,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    // Size-based padding
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-base',
    };

    // Variant-based colors and styles
    const variantClasses = {
      primary: `bg-[${colors.primary}] hover:bg-[${colors.primary_dark}] text-white font-semibold transition-colors`,
      secondary: 'bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-colors',
      danger: `bg-[${colors.danger}] hover:opacity-80 text-white font-semibold transition-opacity`,
      ghost: `text-[${colors.primary}] hover:bg-[${colors.neutral_light}] transition-colors`,
    };

    // Disabled state
    const disabledClasses = disabled || loading
      ? 'opacity-60 cursor-not-allowed'
      : 'cursor-pointer';

    // Focus state
    const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

    // Full width option
    const widthClasses = fullWidth ? 'w-full' : '';

    // Rounded corners
    const borderClasses = 'rounded-lg';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabledClasses}
          ${focusClasses}
          ${borderClasses}
          ${widthClasses}
          ${className || ''}
        `}
        style={{
          // Inline styles for design token colors (Tailwind doesn't support arbitrary values in older versions)
          backgroundColor:
            (variant === 'primary' || variant === 'danger') && !disabled && !loading
              ? variant === 'danger' ? colors.danger : colors.primary
              : undefined,
          color: variant === 'ghost' ? colors.primary : undefined,
        }}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && <span className="text-lg">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
