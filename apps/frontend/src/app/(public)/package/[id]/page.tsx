'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { packageService } from '@/features/packageDetail/packageService';
import type { PackageDetail } from '@/types/PackageDetail';
import type { Activity } from '@/types/Activity';
import Link from 'next/link';

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);

        //const data = await packageService.getPackageDetail(packageId);
        const [packageData, activitiesData] = await Promise.all([
          packageService.getPackageDetail(packageId),
          packageService.getPackageActivities(packageId).catch(() => []),
        ]);
        setPackageData(packageData);
        setActivities(activitiesData);

        setPackageData(packageData);
        console.log('Datos del paquete cargado:', packageData);
      } catch (err) {
        setError('Error cargando detalles del paquete');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      loadPackage();
    }
  }, [packageId]);

  const handleReserveNow = () => {
    if (!packageData) return;

    // Obtener el precio desde PricingOption
    const priceOption = packageData.PricingOption?.[0];
    const price = priceOption?.amount ? parseFloat(priceOption.amount) : 0;
    const currency = priceOption?.currencyId === 2 ? 'PEN' : 'USD';
    const pricingName = priceOption?.name || 'Standard';

    const payload = {
      packageId: packageId,
      packageName: packageData.name,
      price: price,
      currency: currency,
      pricingName: pricingName,
      durationDays: packageData.durationDays ?? 1,
      description: packageData.description || '',
      image: packageData.Media?.[0]?.url ?? '',
      language: packageData.Language?.name || 'Español',

      destinations: packageData.destinations || [],
      activities:
        packageData.activities?.map((a) => ({
          name: a.Activity.name,
          description: a.Activity.description,
        })) || [],
      includedItems: packageData.includedItems || [],
      excludedItems: packageData.excludedItems || [],
    };

    // Construir query params con todos los datos del paquete
    const bookingParams = new URLSearchParams({
      packageId: packageId,
      packageName: packageData.name,
      price: String(price),
      currency: currency,
      pricingName: pricingName,
      durationDays: String(packageData.durationDays ?? 1),
      description: packageData.description || '',
      image: packageData.Media?.[0]?.url ?? '',
      language: packageData.Language?.name || 'Español',

      // Serializar arrays como JSON
      destinations: JSON.stringify(packageData.destinations || []),
      activities: JSON.stringify(
        packageData.activities?.map((a) => ({
          name: a.Activity.name,
          description: a.Activity.description,
        })) || [],
      ),
      includedItems: JSON.stringify(packageData.includedItems || []),
      excludedItems: JSON.stringify(packageData.excludedItems || []),
    });

    // Navegar a la página de booking con los parámetros
    router.push(`/booking/${packageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">
            {error || 'Paquete no encontrado'}
          </p>
        </div>
      </div>
    );
  }

  // Obtener precio para mostrar en la UI
  const priceOption = packageData.PricingOption?.[0];
  const displayPrice = priceOption?.amount ? parseFloat(priceOption.amount) : 0;
  const displayCurrency = priceOption?.currencyId === 2 ? 'PEN' : 'USD';
  const currencySymbol = displayCurrency === 'PEN' ? 'S/' : '$';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="transparent" />

      {/* Hero con imagen */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: packageData.Media?.[0]?.url
            ? `url(${packageData.Media[0].url})`
            : 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200)',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold text-white mb-2">
              {packageData.name}
            </h1>
            <p className="text-xl text-gray-100">
              {packageData.durationDays} días •{' '}
              {packageData.Language?.name || 'Español'}
            </p>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Contenido */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Descripción
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {packageData.description}
              </p>
            </div>

            {/* Destinos */}
            {packageData.destinations &&
              packageData.destinations.length > 0 && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Destinos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.destinations.map((dest, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="font-bold text-gray-900">{dest.name}</h3>
                        <p className="text-sm text-gray-600">{dest.country}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Actividades */}
            {activities && activities.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Actividades Incluidas
                </h2>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {activity.name}
                          </h3>
                          {activity.destinationCity && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
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
                              </svg>
                              <span>{activity.destinationCity.name}</span>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/activity/${activity.id}`}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          Ver detalles →
                        </Link>
                      </div>

                      {activity.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {activity.description}
                        </p>
                      )}

                      {/* Features */}
                      {activity.features && activity.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {activity.features.slice(0, 4).map((feature) => (
                            <span
                              key={feature.id}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                            >
                              {feature.name}
                            </span>
                          ))}
                          {activity.features.length > 4 && (
                            <span className="text-xs text-gray-500">
                              +{activity.features.length - 4} más
                            </span>
                          )}
                        </div>
                      )}

                      {/* Horarios */}
                      {activity.schedules && activity.schedules.length > 0 && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Horarios:</span>{' '}
                          {activity.schedules[0].daysOfWeek.join(', ')} -{' '}
                          {activity.schedules[0].startTime}
                          {activity.schedules[0].endTime &&
                            ` - ${activity.schedules[0].endTime}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Incluye / Excluye */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packageData.includedItems &&
                packageData.includedItems.length > 0 && (
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Incluye
                    </h3>
                    <ul className="space-y-2">
                      {packageData.includedItems.map((inc, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <span className="text-green-500 font-bold">✓</span>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {packageData.excludedItems &&
                packageData.excludedItems.length > 0 && (
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      No Incluye
                    </h3>
                    <ul className="space-y-2">
                      {packageData.excludedItems.map((exc, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <span className="text-red-500 font-bold">✗</span>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {/* Reviews */}
            {packageData.reviews && packageData.reviews.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Reseñas
                </h2>
                <div className="space-y-4">
                  {packageData.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-900">
                          {review.userName || 'Usuario'}
                        </p>
                        <div className="flex text-yellow-400">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Card de precio y reserva */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">
                  {priceOption?.name || 'Precio por persona'}
                </p>
                <p className="text-4xl font-bold text-red-500">
                  {currencySymbol}
                  {displayPrice.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-gray-600 text-sm">{displayCurrency}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-bold">
                      {packageData.durationDays ?? 0} días
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-gray-600">Destinos</p>
                    <p className="font-bold">
                      {packageData.destinations?.length ?? 0} lugares
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <p className="text-sm text-gray-600">Idioma</p>
                    <p className="font-bold">
                      {packageData.Language?.name || 'Español'}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTÓN DE RESERVA */}
              <button
                onClick={handleReserveNow}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors mb-3"
              >
                Reservar Ahora
              </button>

              <button className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-3 rounded-lg transition-colors">
                Contactar Empresa
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
