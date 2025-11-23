import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-[var(--primary)] hover:bg-red-600 text-white font-medium rounded-full transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
