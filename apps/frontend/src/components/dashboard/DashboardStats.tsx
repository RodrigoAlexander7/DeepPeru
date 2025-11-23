'use client';

import { BookingListItem } from '@/types/booking-list';

interface DashboardStatsProps {
  bookings: BookingListItem[];
}

export default function DashboardStats({ bookings }: DashboardStatsProps) {
  // Calcular estadísticas
  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter((booking) => {
    const startDate = new Date(booking.startDate);
    return startDate > new Date() && booking.status !== 'CANCELLED';
  }).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === 'COMPLETED',
  ).length;

  const totalSpent = bookings
    .filter((booking) => booking.status !== 'CANCELLED')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  // Obtener símbolo de moneda (usar el primero disponible)
  const currencySymbol = bookings[0]?.currency.symbol || '$';

  const stats = [
    {
      label: 'Total de Reservas',
      value: totalBookings,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Próximas Reservas',
      value: upcomingBookings,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Completadas',
      value: completedBookings,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Total Gastado',
      value: `${currencySymbol}${totalSpent.toFixed(2)}`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 flex items-start gap-4"
        >
          <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
