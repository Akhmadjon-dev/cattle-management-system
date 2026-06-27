import React from 'react';

type StatusType = 'active' | 'sold' | 'deceased' | 'removed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

/**
 * Reusable StatusBadge component for cattle status display
 * Replaces all inline status badge styling
 *
 * Usage:
 * <StatusBadge status="active" />
 * <StatusBadge status="sold" />
 * <StatusBadge status="deceased" />
 * <StatusBadge status="removed" />
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Status configuration: icon, label, colors
  const statusConfig: Record<StatusType, {
    icon: string;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }> = {
    active: {
      icon: '🟢',
      label: 'Active',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    sold: {
      icon: '💰',
      label: 'Sold',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
    },
    deceased: {
      icon: '💀',
      label: 'Deceased',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    removed: {
      icon: '➖',
      label: 'Removed',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-3 py-1
        rounded-full
        text-sm font-medium
        border
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        ${className || ''}
      `}
      aria-label={`Status: ${config.label}`}
    >
      <span className="text-base">{config.icon}</span>
      <span className="capitalize">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
