import React from 'react';
import { shadows } from '@/styles/shadows';

interface CardProps {
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  };
  hoverable?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable Card component with 3 sizes and optional icon/badge
 * Replaces all inline card styling (bg-white rounded-lg shadow p-6, etc.)
 *
 * Usage:
 * <Card size="md">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 *
 * <Card size="lg" icon="📊" badge={{ text: 'Active', variant: 'success' }}>
 *   Featured card with badge
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  size = 'md',
  icon,
  badge,
  hoverable = false,
  children,
  className,
}) => {
  // Size-based padding
  const sizeClasses = {
    sm: 'p-3',    // 12px
    md: 'p-4',    // 16px
    lg: 'p-6',    // 24px
  };

  // Badge styling
  const badgeVariants = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  // Hover effect if enabled
  const hoverClasses = hoverable
    ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`
        bg-white
        rounded-lg
        border border-gray-200
        ${sizeClasses[size]}
        ${hoverClasses}
        relative
        ${className || ''}
      `}
      style={{
        boxShadow: shadows.card,
      }}
    >
      {/* Icon (top-left) */}
      {icon && (
        <div className="absolute top-4 left-4 text-2xl">
          {icon}
        </div>
      )}

      {/* Badge (top-right) */}
      {badge && (
        <div
          className={`
            absolute top-4 right-4
            px-3 py-1
            rounded-full
            text-xs font-medium
            ${badgeVariants[badge.variant]}
          `}
        >
          {badge.text}
        </div>
      )}

      {/* Content */}
      <div className={icon ? 'ml-10' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;
