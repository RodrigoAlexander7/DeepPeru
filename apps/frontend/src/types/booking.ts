// src/features/booking/types.ts

export interface BookingFormData {
  // Paso 1: Datos de contacto
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  receiveTextUpdates: boolean;
  receiveEmailOffers: boolean;

  // Paso 2: Detalles de la actividad
  travelers: Traveler[];
  pickupLocation?: string;
  tourLanguage: string;

  // Paso 3: Pago
  paymentOption: 'now' | 'later';
  promoCode?: string;
}

export interface Traveler {
  id: string;
  firstName: string;
  lastName: string;
  isPrimary?: boolean;
}

export interface BookingSummaryData {
  packageId: number;
  packageName: string;
  packageImage: string;
  companyName: string;
  rating: number;
  reviewCount: number;
  date: string;
  time: string;
  travelers: number;
  totalPrice: number;
  cancellationPolicy: string;
}

export type BookingStep = 1 | 2 | 3;
