import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { BookingListItem, BookingFilters } from '@/types/booking-list';

export function useBookings(initialFilters?: BookingFilters) {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>(initialFilters || {});
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getMyBookings(filters);
      setBookings(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las reservas');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    bookings,
    loading,
    error,
    filters,
    setFilters,
    total,
    refresh: fetchBookings,
  };
}
