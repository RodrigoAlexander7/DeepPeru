'use client';

import Image from 'next/image';
import { BookingListItem } from '@/types/booking-list';
import BookingStatusBadge from './BookingStatusBadge';

interface BookingCardProps {
  booking: BookingListItem;
  onClick?: () => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  const imageUrl =
    booking.touristPackage.images?.[0]?.url || '/images/placeholder.jpg';

  // Formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={booking.touristPackage.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {booking.touristPackage.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {booking.touristPackage.description}
        </p>

        {/* Fechas */}
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </span>
        </div>

        {/* Viajeros */}
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>
            {booking.numberOfTravelers}{' '}
            {booking.numberOfTravelers === 1 ? 'viajero' : 'viajeros'}
          </span>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-xl font-bold text-gray-900">
            {booking.currency.symbol}
            {booking.totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Botón */}
        <button className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
          Ver detalles
        </button>
      </div>
    </div>
  );
}
