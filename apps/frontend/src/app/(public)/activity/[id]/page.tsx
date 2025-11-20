'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';
import { activityService } from '@/features/activity/activityService';
import type { Activity } from '@/types/Activity';

const DAYS_MAP: Record<string, string> = {
  MON: 'Lunes',
  TUE: 'Martes',
  WED: 'Miércoles',
  THU: 'Jueves',
  FRI: 'Viernes',
  SAT: 'Sábado',
  SUN: 'Domingo',
};

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = Number(params.id);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activityId) {
      loadActivityDetails();
    }
  }, [activityId]);

  const loadActivityDetails = async () => {
    try {
      setLoading(true);
      const [activityData, packagesData] = await Promise.all([
        activityService.getActivityById(activityId),
        activityService.getPackagesForActivity(activityId),
      ]);
      setActivity(activityData);
      setPackages(packagesData);
    } catch (err) {
      setError('Error al cargar los detalles de la actividad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        '¿Estás seguro de eliminar esta actividad? Esta acción no se puede deshacer.',
      )
    ) {
      return;
    }

    try {
      await activityService.deleteActivity(activityId);
      router.push('/activity');
    } catch (err) {
      alert('Error al eliminar la actividad');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">
            {error || 'Actividad no encontrada'}
          </p>
          <Link
            href="/activity"
            className="mt-4 inline-block text-red-500 underline"
          >
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/activity"
              className="text-white hover:underline text-sm"
            >
              Actividades
            </Link>
            <span className="text-sm">/</span>
            <span className="text-sm">{activity.name}</span>
          </div>
          <h1 className="text-5xl font-bold mb-2">{activity.name}</h1>
          {activity.destinationCity && (
            <div className="flex items-center gap-2 text-xl opacity-90">
              <svg
                className="w-5 h-5"
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
              </svg>
              <span>
                {activity.destinationCity.name}
                {activity.destinationCity.region &&
                  `, ${activity.destinationCity.region.name}`}
                {activity.destinationCity.region?.state &&
                  `, ${activity.destinationCity.region.state.name}`}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Contenido */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Descripción
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {activity.description || 'Sin descripción disponible'}
              </p>
            </div>

            {/* Horarios */}
            {activity.schedules && activity.schedules.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Horarios Disponibles
                </h2>
                <div className="space-y-4">
                  {activity.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="border-l-4 border-red-500 pl-4 py-2"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">
                          {schedule.daysOfWeek
                            .map((day) => DAYS_MAP[day])
                            .join(', ')}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Horario:</span>{' '}
                        {schedule.startTime}
                        {schedule.endTime && ` - ${schedule.endTime}`}
                      </div>
                      {schedule.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          {schedule.notes}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Zona horaria: {schedule.timezone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {activity.features && activity.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Características
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.features.map((feature) => (
                    <div
                      key={feature.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        {feature.iconUrl && (
                          <img
                            src={feature.iconUrl}
                            alt=""
                            className="w-8 h-8"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {feature.name}
                          </h3>
                          {feature.category && (
                            <p className="text-xs text-gray-500">
                              {feature.category}
                            </p>
                          )}
                          {feature.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paquetes que incluyen esta actividad */}
            {packages.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Paquetes Turísticos
                </h2>
                <p className="text-gray-600 mb-4">
                  Esta actividad está incluida en los siguientes paquetes:
                </p>
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <Link
                      key={pkg.id}
                      href={`/package/${pkg.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                      {pkg.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {pkg.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones</h3>
              <div className="space-y-3">
                <Link
                  href={`/activity/${activity.id}/edit`}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-center transition-colors"
                >
                  Editar Actividad
                </Link>
                <button
                  onClick={handleDelete}
                  className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-center transition-colors"
                >
                  Eliminar Actividad
                </button>
                <Link
                  href="/activity"
                  className="block w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-lg text-center transition-colors"
                >
                  Volver a la Lista
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
