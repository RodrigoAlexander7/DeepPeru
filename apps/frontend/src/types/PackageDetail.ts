export interface MediaItem {
  id: number;
  packageId: number;
  type: string; // "IMAGE", "VIDEO"
  url: string;
  caption?: string;
}

export interface Destination {
  id?: string;
  name: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ItineraryItem {
  day: number;
  title?: string;
  activities: {
    Activity: {
      id: number;
      name: string;
      description?: string;
      destinationCityId?: number;
    };
    activityId: number;
    startDate?: string;
    endDate?: string;
  }[];
  images?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface PricingOption {
  id: number;
  packageId: number;
  name: string;
  description: string | null;
  amount: string; // Viene como string desde el API
  currencyId: number; // 1 = USD, 2 = PEN, etc.
  perPerson: boolean;
  minParticipants: number | null;
  maxParticipants: number | null;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
}

export interface Language {
  id: number;
  code: string;
  name: string;
}

export interface PackageDetail {
  id: number;
  name: string;
  // Pricing ahora viene desde PricingOption
  PricingOption?: PricingOption[];

  // Otros campos opcionales
  currency?: string; // Deprecado, usar PricingOption
  price?: number;

  Language?: Language;
  // Descripción y meta
  description?: string;
  durationDays?: number; // en días
  rating?: number;
  difficulty?: string; // EASY, MEDIUM, HARD

  // Relaciones
  Media: MediaItem[];
  destinations: Destination[];
  itinerary?: ItineraryItem[];

  // Inclusiones/Exclusiones del backend
  includedItems?: string[];
  excludedItems?: string[];

  // Opcional: campos extra del backend
  activities?: any[];
  accessibilityOptions?: string[];
  PickupDetail?: any[];
  TourismCompany?: any;

  // Ubicación / meeting point
  meetingPoint?: string;
  meetingLatitude?: number;
  meetingLongitude?: number;

  // Información opcional
  additionalInfo?: string | null;
  safetyInfo?: string | null;
  timezone?: string;

  // Meta
  isActive?: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;

  // Reseñas
  reviews?: Review[];
}
