'use client';

import { useRouter } from 'next/navigation';
import { useBookings } from '@/features/user-dashboard/hooks/useBookings';
import {
  DashboardStats,
  DashboardCard,
  BookingCard,
  EmptyState,
} from '@/components/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { bookings, loading, error } = useBookings({
    upcoming: true,
    limit: 3,
  });

  // Obtener todas las reservas para las estadísticas
  const { bookings: allBookings } = useBookings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar las reservas
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido a tu panel de control de viajes
        </p>
      </div>

      {/* Stats */}
      <DashboardStats bookings={allBookings} />

      {/* Próximas Reservas */}
      <DashboardCard
        title="Próximas Reservas"
        action={
          bookings.length > 0
            ? {
                label: 'Ver todas',
                onClick: () => router.push('/bookings'),
              }
            : undefined
        }
      >
        {bookings.length === 0 ? (
          <EmptyState
            icon={
              <svg
                className="w-12 h-12"
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
            }
            title="No tienes próximas reservas"
            description="Explora nuestros increíbles paquetes turísticos y comienza tu próxima aventura."
            action={{
              label: 'Explorar paquetes',
              onClick: () => router.push('/search'),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => router.push(`/bookings/${booking.id}`)}
              />
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
