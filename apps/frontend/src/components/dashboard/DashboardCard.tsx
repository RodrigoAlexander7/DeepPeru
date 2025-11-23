import { ReactNode } from 'react';

interface DashboardCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function DashboardCard({
  title,
  children,
  className = '',
  action,
}: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-[var(--primary)] hover:text-red-600 font-medium transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
