import { BookingStatus } from '@/types/booking-list';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export default function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      label: 'Pendiente',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    CONFIRMED: {
      label: 'Confirmada',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    CANCELLED: {
      label: 'Cancelada',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    COMPLETED: {
      label: 'Completada',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
