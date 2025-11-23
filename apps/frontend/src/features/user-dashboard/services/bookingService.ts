import { api } from '@/lib/apis';
import {
  BookingFilters,
  BookingListItem,
  BookingDetailsResponse,
  CancelBookingDto,
} from '@/types/booking-list';

export const bookingService = {
  /**
   * Obtener todas las reservas del usuario actual
   * GET /bookings/me
   */
  async getMyBookings(
    filters?: BookingFilters,
  ): Promise<{ data: BookingListItem[]; total: number }> {
    const { data } = await api.get('/bookings/me', { params: filters });
    return data;
  },

  /**
   * Obtener detalles de una reserva específica
   * GET /bookings/:id
   */
  async getBookingDetails(id: number): Promise<BookingDetailsResponse> {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
  },

  /**
   * Cancelar una reserva
   * PATCH /bookings/:id/cancel
   */
  async cancelBooking(
    id: number,
    cancelData?: CancelBookingDto,
  ): Promise<BookingDetailsResponse> {
    const { data } = await api.patch(`/bookings/${id}/cancel`, cancelData);
    return data;
  },
};
