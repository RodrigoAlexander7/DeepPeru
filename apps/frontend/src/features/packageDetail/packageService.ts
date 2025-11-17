import { api } from '@/lib/apis';
import type { PackageDetail } from '@/types/PackageDetail';

export interface BookingRequest {
  userId: string;
  guests: number;
  startDate: string;
  endDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  extras?: string[];
  note?: string;
  paymentMethodId?: string;
}

export interface BookingResponse {
  id: string;
  packageId: string;
  status: string;
  createdAt: string;
}

export const packageService = {
  async getPackageDetail(id: string | number): Promise<PackageDetail> {
    const { data } = await api.get<PackageDetail>(`/tourist-packages/${id}`);

    // Validar estructura mínima
    if (!data || !data.id || !data.name) {
      throw new Error('Datos de paquete inválidos');
    }

    // Asegurar valores por defecto
    return {
      ...data,
      price: data.price ?? 0,
      currency: data.currency ?? 'USD',
      durationDays: data.durationDays ?? 1,
      destinations: data.destinations ?? [],
      itinerary: data.itinerary ?? [],
      inclusions: data.inclusions ?? [],
      exclusions: data.exclusions ?? [],
      reviews: data.reviews ?? [],
    };
  },

  async bookPackage(
    packageId: string | number,
    payload: BookingRequest,
  ): Promise<BookingResponse> {
    const { data } = await api.post<BookingResponse>(
      `/tourist-packages/${packageId}/bookings`,
      payload,
    );
    return data;
  },

  async getPackageBookings(packageId: string | number) {
    const { data } = await api.get(`/tourist-packages/${packageId}/bookings`);
    return data;
  },
};
