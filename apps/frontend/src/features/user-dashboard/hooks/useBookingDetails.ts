import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { BookingDetailsResponse } from '@/types/booking-list';

export function useBookingDetails(bookingId: number) {
  const [booking, setBooking] = useState<BookingDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingDetails(bookingId);
      setBooking(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la reserva');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  return {
    booking,
    loading,
    error,
    refresh: fetchDetails,
  };
}
