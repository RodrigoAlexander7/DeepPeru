import { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { BookingDetailsResponse, CancelBookingDto } from '@/types/booking-list';

export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = async (
    bookingId: number,
    cancelData?: CancelBookingDto,
  ): Promise<BookingDetailsResponse> => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingService.cancelBooking(bookingId, cancelData);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Error al cancelar la reserva';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    cancelBooking,
    loading,
    error,
    clearError: () => setError(null),
  };
}
