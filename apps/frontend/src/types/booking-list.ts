// Interfaces basadas en la respuesta del backend GET /bookings/me y GET /bookings/:id

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingListItem {
  id: number;
  bookingDate: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  status: BookingStatus;
  touristPackage: {
    id: number;
    name: string;
    description: string;
    location: string;
    images?: Array<{
      id: number;
      url: string;
      type: string;
    }>;
  };
  currency: {
    code: string;
    symbol: string;
  };
}

export interface BookingDetailsResponse {
  id: number;
  bookingDate: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  status: BookingStatus;
  cancellationReason?: string;
  touristPackage: {
    id: number;
    name: string;
    description: string;
    duration: number;
    cancellationPolicy: string;
    company: {
      id: number;
      name: string;
      email: string;
      phone?: string;
    };
    activities?: Array<{
      id: number;
      name: string;
      description: string;
      day: number;
      startTime?: string;
      endTime?: string;
    }>;
    locations?: Array<{
      location: {
        id: number;
        name: string;
        city: {
          name: string;
          region: {
            name: string;
            country: {
              name: string;
            };
          };
        };
      };
    }>;
  };
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
}

export interface BookingFilters {
  status?: BookingStatus;
  upcoming?: boolean;
  past?: boolean;
  page?: number;
  limit?: number;
}

export interface CancelBookingDto {
  reason?: string;
}
