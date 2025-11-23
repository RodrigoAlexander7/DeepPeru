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
    // Construir query params
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.upcoming !== undefined)
      params.append('upcoming', String(filters.upcoming));
    if (filters?.past !== undefined)
      params.append('past', String(filters.past));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const url = `/api/bookings/me${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener las reservas');
    }

    const result = await response.json();

    // El backend retorna { data: [], meta: { total, page, limit, totalPages } }
    // Transformar a { data: [], total: number }
    return {
      data: result.data || [],
      total: result.meta?.total || 0,
    };
  },

  /**
   * Obtener detalles de una reserva específica
   * GET /bookings/:id
   */
  async getBookingDetails(
    id: string | number,
  ): Promise<BookingDetailsResponse> {
    const response = await fetch(`/api/bookings/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || 'Error al obtener los detalles de la reserva',
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * Cancelar una reserva
   * PATCH /bookings/:id/cancel
   */
  async cancelBooking(
    id: string | number,
    cancelData?: CancelBookingDto,
  ): Promise<BookingDetailsResponse> {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelData || {}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cancelar la reserva');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Crear una nueva reserva
   * POST /bookings
   */
  async createBooking(bookingData: {
    packageId: number;
    pricingOptionId?: number;
    travelDate: string;
    numberOfParticipants: number;
    currencyId: number;
  }): Promise<any> {
    // Usar el endpoint de Next.js que maneja la autenticación
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error del servidor:', data);
      throw new Error(
        data.message || data.error || 'Error al crear la reserva',
      );
    }

    return data;
  },
};
