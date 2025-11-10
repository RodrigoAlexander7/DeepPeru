'use client';

import { PackageCard } from '@/types';

interface ResultCardProps {
  package: PackageCard;
}

export default function ResultCard({ package: pkg }: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Imagen o fondo de color sólido */}
      <div className="relative h-48 bg-gray-200">
        {/* Badge si existe */}
        {pkg.badge && (
          <span
            className={`
              absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10
              ${pkg.badge === 'Premium' ? 'bg-red-500' : 'bg-green-500'}
            `}
          >
            {pkg.badge}
          </span>
        )}

        {/* Imagen o fondo gris si no hay imagen */}
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400" />
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
          {pkg.title}
        </h3>

        {/* Compañía */}
        <p className="text-sm text-gray-600 mb-3">{pkg.company}</p>

        {/* Ubicación */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{pkg.location}</span>
        </div>

        {/* Fechas */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
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
            {new Date(pkg.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
            {' - '}
            {new Date(pkg.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-red-500">${pkg.price}</span>
        </div>

        {/* Botón de acción*/}
        <button
          onClick={() => console.log('Reservar:', pkg.id)}
          className="w-full bg-pink-100 hover:bg-pink-200 text-pink-600 font-medium py-2.5 rounded-full transition-colors"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
