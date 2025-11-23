'use client';

import { useRouter } from 'next/navigation';
import { useBookings } from '@/features/user-dashboard/hooks/useBookings';
import { BookingFilters as BookingFiltersType } from '@/types/booking-list';
import BookingCard from './BookingCard';
import BookingFilters from './BookingFilters';
import EmptyState from './EmptyState';

interface BookingsListProps {
  filters?: BookingFiltersType;
}

export default function BookingsList({ filters }: BookingsListProps) {
  const router = useRouter();
  const {
    bookings,
    loading,
    error,
    filters: currentFilters,
    setFilters,
  } = useBookings(filters);

  const handleBookingClick = (bookingId: number) => {
    router.push(`/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <BookingFilters currentFilters={currentFilters} onChange={setFilters} />

      {/* Lista de reservas */}
      {bookings.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-16 h-16"
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
          }
          title="No hay reservas"
          description="No se encontraron reservas con los filtros seleccionados. Intenta cambiar los filtros o explora nuevos paquetes turísticos."
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
              onClick={() => handleBookingClick(booking.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
