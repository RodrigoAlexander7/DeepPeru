// Interfaces basadas en la respuesta del backend GET /bookings/me y GET /bookings/:id

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingListItem {
  id: string;
  userId: string;
  packageId: number;
  pricingOptionId?: number;
  paymentId?: string;
  paymentStatus: string;
  currencyId: number;
  totalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  companyAmount: number;
  bookingDate: string;
  travelDate: string;
  numberOfParticipants: number;
  status: BookingStatus;
  // Campos calculados para compatibilidad con componentes
  startDate?: string;
  endDate?: string;
  numberOfTravelers?: number;
  totalPrice?: number;
  // Relaciones del backend (Prisma usa mayúsculas)
  TouristPackage?: {
    id: number;
    name: string;
    description?: string;
    durationDays?: number;
    TourismCompany?: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      logoUrl?: string;
    };
    Media?: Array<{
      id: number;
      url: string;
      type: string;
      order?: number;
    }>;
  };
  PricingOption?: {
    id: number;
    name: string;
    amount: number;
    perPerson: boolean;
    minParticipants?: number;
    maxParticipants?: number;
  };
  Currency?: {
    id: number;
    code: string;
    symbol: string;
    name: string;
  };
  // Alias para compatibilidad (minúsculas)
  touristPackage?: {
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
  currency?: {
    code: string;
    symbol: string;
  };
}

export interface BookingDetailsResponse {
  id: string;
  userId: string;
  packageId: number;
  pricingOptionId?: number;
  paymentId?: string;
  paymentStatus: string;
  currencyId: number;
  totalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  companyAmount: number;
  bookingDate: string;
  travelDate: string;
  numberOfParticipants: number;
  status: BookingStatus;
  cancellationReason?: string;
  // Campos calculados para compatibilidad
  startDate?: string;
  endDate?: string;
  numberOfTravelers?: number;
  totalPrice?: number;
  // Relaciones del backend (Prisma usa mayúsculas)
  TouristPackage?: {
    id: number;
    name: string;
    description?: string;
    durationDays: number;
    cancellationPolicy?: string;
    TourismCompany?: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      logoUrl?: string;
    };
    Media?: Array<{
      id: number;
      url: string;
      type: string;
      order?: number;
    }>;
    activities?: Array<{
      id: number;
      name: string;
      description?: string;
      day: number;
      startTime?: string;
      endTime?: string;
    }>;
    PackageLocation?: Array<{
      location: {
        id: number;
        name: string;
        City?: {
          name: string;
          Region?: {
            name: string;
            Country?: {
              name: string;
            };
          };
        };
      };
    }>;
  };
  PricingOption?: {
    id: number;
    name: string;
    amount: number;
    perPerson: boolean;
    minParticipants?: number;
    maxParticipants?: number;
  };
  Currency?: {
    id: number;
    code: string;
    symbol: string;
    name: string;
  };
  // Alias para compatibilidad (minúsculas)
  touristPackage?: {
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
  currency?: {
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
