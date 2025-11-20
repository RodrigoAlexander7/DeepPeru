'use client';

import Link from 'next/link';
import { Activity } from '@/types/Activity';

interface ActivityCardProps {
  activity: Activity;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function ActivityCard({
  activity,
  onDelete,
  showActions = false,
}: ActivityCardProps) {
  const handleDelete = () => {
    if (onDelete && confirm(`¿Estás seguro de eliminar "${activity.name}"?`)) {
      onDelete(activity.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Header con nombre y ciudad */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
        <h3 className="font-bold text-xl mb-1">{activity.name}</h3>
        {activity.destinationCity && (
          <div className="flex items-center gap-1 text-sm opacity-90">
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
            <span>
              {activity.destinationCity.name}
              {activity.destinationCity.region &&
                `, ${activity.destinationCity.region.name}`}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Descripción */}
        {activity.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {activity.description}
          </p>
        )}

        {/* Features */}
        {activity.features && activity.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Características:
            </h4>
            <div className="flex flex-wrap gap-2">
              {activity.features.slice(0, 3).map((feature) => (
                <span
                  key={feature.id}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {feature.name}
                </span>
              ))}
              {activity.features.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{activity.features.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Horarios */}
        {activity.schedules && activity.schedules.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Horarios disponibles:
            </h4>
            <div className="text-xs text-gray-600">
              {activity.schedules[0].daysOfWeek.join(', ')} -{' '}
              {activity.schedules[0].startTime}
              {activity.schedules[0].endTime &&
                ` - ${activity.schedules[0].endTime}`}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/activity/${activity.id}`}
            className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Ver Detalles
          </Link>
          {showActions && (
            <>
              <Link
                href={`/activity/${activity.id}/edit`}
                className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 bg-gray-200 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition-colors"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
