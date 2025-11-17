export interface ItineraryItem {
  day: number;
  title?: string;
  activities: string[];
  images?: string[]; // URLs
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt?: string; // ISO
}

export interface Destination {
  id?: string;
  name: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
}

export interface PackageDetail {
  id: string;
  name: string;
  description?: string;
  price: number; // en la moneda acordada
  currency?: string; // "USD", "PEN", etc.
  durationDays?: number; // duración en días
  destinations: Destination[];
  itinerary?: ItineraryItem[];
  inclusions?: string[]; // lista de inclusiones
  exclusions?: string[]; // lista de exclusiones
  reviews?: Review[];
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
