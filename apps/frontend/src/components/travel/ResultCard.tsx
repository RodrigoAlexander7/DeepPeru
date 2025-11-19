// src/components/travel/ResultCard.tsx
'use client';

import { TouristPackage } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ResultCardProps {
  package: TouristPackage;
}

export default function ResultCard({ package: pkg }: ResultCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  console.log('paquetes recivbidos', pkg);
  // Obtener precio (primer pricing activo)
  const pricing =
    pkg.PricingOption?.find((p) => p.isActive) || pkg.PricingOption?.[0];
  const price = pricing?.basePrice || 0;
  const discountedPrice = pricing?.discountedPrice;

  // Obtener imagen (media primaria)
  const primaryMedia = pkg.Media?.find((m) => m.isPrimary);
  const image = primaryMedia?.url || pkg.Media?.[0]?.url;

  // Obtener ubicación
  const location = pkg.representativeCity
    ? `${pkg.representativeCity.name}, ${pkg.representativeCity.region?.name || 'Perú'}`
    : 'Ubicación no especificada';

  // Obtener fechas del primer schedule
  const schedule = pkg.Schedule?.find((s) => s.isActive) || pkg.Schedule?.[0];

  // Formatear duración
  const formatDuration = (duration: string) => {
    return duration
      .replace(/h/gi, ' horas')
      .replace(/D/gi, ' días')
      .replace(/N/gi, ' noches')
      .replace(/day/gi, ' día');
  };

  // Color de dificultad
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      EASY: 'bg-green-100 text-green-700',
      MODERATE: 'bg-yellow-100 text-yellow-700',
      CHALLENGING: 'bg-orange-100 text-orange-700',
      EXTREME: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  // Traducir dificultad
  const difficultyLabels: Record<string, string> = {
    EASY: 'Fácil',
    MODERATE: 'Moderado',
    CHALLENGING: 'Desafiante',
    EXTREME: 'Extremo',
  };

  // Determinar badge
  const badge =
    discountedPrice && discountedPrice < price
      ? 'New'
      : pkg.rating >= 4.5
        ? 'Premium'
        : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] duration-300">
      {/* Image */}
      <div className="relative h-56">
        {image ? (
          <img
            src={image}
            alt={pkg.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback gradient */}
        <div
          className={`w-full h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 ${image ? 'hidden' : ''}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {badge && (
            <span
              className={`
              px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm
              ${badge === 'Premium' ? 'bg-red-500' : 'bg-green-500'}
            `}
            >
              {badge}
            </span>
          )}

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(pkg.difficulty)}`}
          >
            {difficultyLabels[pkg.difficulty] || pkg.difficulty}
          </span>
        </div>

        {/* Rating */}
        {pkg.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              {pkg.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2 min-h-[3.5rem]">
          {pkg.name}
        </h3>

        {/* Company with logo */}
        <div className="flex items-center gap-2 mb-3">
          {pkg.TourismCompany?.logoUrl && (
            <img
              src={pkg.TourismCompany.logoUrl}
              alt={pkg.TourismCompany.name}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <p className="text-sm text-gray-600 line-clamp-1">
            {pkg.TourismCompany?.name || 'Compañía desconocida'}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <svg
            className="w-4 h-4 flex-shrink-0"
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
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatDuration(pkg.duration)}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {pkg.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {discountedPrice && discountedPrice < price ? (
              <>
                <span className="text-lg text-gray-400 line-through mr-2">
                  ${price}
                </span>
                <span className="text-2xl font-bold text-red-500">
                  ${discountedPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-red-500">${price}</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setLoading(true);
            router.push(`/package/${pkg.id}`);
          }}
          disabled={loading}
          className={`w-full font-medium py-3 rounded-full transition-colors flex items-center justify-center
            ${loading ? 'bg-gray-300 text-gray-600' : 'bg-red-500 hover:bg-red-600 text-white'}
          `}
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Ver detalles'
          )}
        </button>
      </div>
    </div>
  );
}
