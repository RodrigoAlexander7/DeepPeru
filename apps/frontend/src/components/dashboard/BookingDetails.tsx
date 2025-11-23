'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingDetails } from '@/features/user-dashboard/hooks/useBookingDetails';
import BookingStatusBadge from './BookingStatusBadge';
import CancelBookingModal from './CancelBookingModal';

interface BookingDetailsProps {
  bookingId: string | number;
}

export default function BookingDetails({ bookingId }: BookingDetailsProps) {
  const router = useRouter();
  const { booking, loading, error, refresh } = useBookingDetails(bookingId);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Si la fecha no es válida, retornar el string

      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const canBeCancelled =
    booking?.status === 'CONFIRMED' || booking?.status === 'PENDING';

  // Helpers para obtener datos compatibles con ambas estructuras
  const getPackageData = () => {
    if (!booking) return null;
    return (booking as any).TouristPackage || booking.touristPackage;
  };

  const getCompanyData = () => {
    const pkg = getPackageData();
    return pkg?.TourismCompany || pkg?.company;
  };

  const getCurrencyData = () => {
    if (!booking) return null;
    return (booking as any).Currency || booking.currency;
  };

  const getStartDate = () => {
    if (!booking) return '';
    return booking.startDate || booking.travelDate;
  };

  const getEndDate = () => {
    if (!booking) return '';
    if (booking.endDate) return booking.endDate;

    const packageData = getPackageData();
    const travelDateStr = booking.travelDate || booking.startDate;

    if (!travelDateStr) return '';

    try {
      const start = new Date(travelDateStr);

      // Verificar si la fecha es válida ANTES de hacer cualquier operación
      if (isNaN(start.getTime())) {
        console.warn('Invalid travel date:', travelDateStr);
        return travelDateStr; // Si la fecha no es válida, retornar el string original
      }

      const duration = packageData?.durationDays || packageData?.duration || 1;
      start.setDate(start.getDate() + duration - 1);

      // Verificar nuevamente después de hacer el cálculo
      if (isNaN(start.getTime())) {
        return travelDateStr;
      }

      return start.toISOString();
    } catch (error) {
      console.error('Error calculating end date:', error);
      return travelDateStr;
    }
  };

  const getTotalPrice = () => {
    if (!booking) return 0;
    const rawPrice = booking.totalPrice || (booking as any).totalAmount || 0;
    return typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
  };

  const getNumberOfTravelers = () => {
    if (!booking) return 0;
    return (
      booking.numberOfTravelers || (booking as any).numberOfParticipants || 0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">
          {error || 'No se pudo cargar la reserva'}
        </p>
        <button
          onClick={() => router.push('/bookings')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Volver a Mis Reservas
        </button>
      </div>
    );
  }

  const packageData = getPackageData();
  const companyData = getCompanyData();
  const currencyData = getCurrencyData();
  const startDate = getStartDate();
  const endDate = getEndDate();
  const totalPrice = getTotalPrice();
  const numberOfTravelers = getNumberOfTravelers();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Reserva #{booking.id}
              </h1>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-gray-600">
              Fecha de reserva: {formatDate(booking.bookingDate)}
            </p>
          </div>
          {canBeCancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancelar Reserva
            </button>
          )}
        </div>

        {booking.cancellationReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-800 mb-1">
              Motivo de cancelación:
            </p>
            <p className="text-sm text-red-700">{booking.cancellationReason}</p>
          </div>
        )}
      </div>

      {/* Información del Paquete */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Información del Paquete
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {packageData?.name || 'Paquete sin nombre'}
            </h3>
            <p className="text-gray-600 mt-1">
              {packageData?.description || 'Sin descripción'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fecha de inicio</p>
              <p className="font-semibold text-gray-900">
                {formatDate(startDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de finalización</p>
              <p className="font-semibold text-gray-900">
                {formatDate(endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duración</p>
              <p className="font-semibold text-gray-900">
                {packageData?.durationDays || packageData?.duration || 1} días
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de viajeros</p>
              <p className="font-semibold text-gray-900">{numberOfTravelers}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              Política de cancelación
            </p>
            <p className="text-gray-900">
              {packageData?.cancellationPolicy || 'No especificada'}
            </p>
          </div>
        </div>
      </div>

      {/* Información de la Empresa */}
      {companyData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Empresa Operadora
          </h2>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">{companyData.name}</p>
            <p className="text-sm text-gray-600">Email: {companyData.email}</p>
            {companyData.phone && (
              <p className="text-sm text-gray-600">
                Teléfono: {companyData.phone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Itinerario (Actividades) */}
      {packageData?.activities && packageData.activities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Itinerario</h2>
          <div className="space-y-4">
            {packageData.activities
              .sort((a: any, b: any) => a.day - b.day)
              .map((activity: any) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-[var(--primary)] pl-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[var(--primary)]">
                      Día {activity.day}
                    </span>
                    {activity.startTime && (
                      <span className="text-sm text-gray-600">
                        • {activity.startTime}
                        {activity.endTime && ` - ${activity.endTime}`}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {activity.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Locaciones */}
      {packageData?.PackageLocation &&
        packageData.PackageLocation.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Locaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageData.PackageLocation.map((loc: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <svg
                    className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {loc.location.name}
                    </p>
                    {loc.location.City && (
                      <>
                        <p className="text-sm text-gray-600">
                          {loc.location.City.name}
                          {loc.location.City.Region &&
                            `, ${loc.location.City.Region.name}`}
                        </p>
                        {loc.location.City.Region?.Country && (
                          <p className="text-sm text-gray-500">
                            {loc.location.City.Region.Country.name}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Resumen de Pago */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Resumen de Pago
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Moneda</span>
            <span className="font-semibold text-gray-900">
              {currencyData?.name || 'N/A'} ({currencyData?.code || 'N/A'})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-[var(--primary)]">
              {currencyData?.symbol || '$'}
              {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Modal de Cancelación */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        bookingId={booking.id}
        cancellationPolicy={
          packageData?.cancellationPolicy || 'No especificada'
        }
        onSuccess={() => {
          refresh();
        }}
      />
    </div>
  );
}
