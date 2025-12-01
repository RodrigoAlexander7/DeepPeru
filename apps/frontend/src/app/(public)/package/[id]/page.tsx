'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { packageService } from '@/features/travel-package-detail/packageService';
import type { PackageDetail, PricingOption } from '@/types/PackageDetail';
import type { Activity } from '@/types/Activity';
import Link from 'next/link';
import { Calendar, MapPin, Languages } from 'lucide-react';

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Estado para manejar el número de personas por cada opción de precio
  const [participantsByOption, setParticipantsByOption] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const [packageData, activitiesData] = await Promise.all([
          packageService.getPackageDetail(packageId),
          packageService.getPackageActivities(packageId).catch(() => []),
        ]);

        setPackageData(packageData);
        setActivities(activitiesData);

        // Inicializar el número de personas para cada opción de precio
        if (packageData.PricingOption) {
          const initialParticipants: Record<number, number> = {};
          packageData.PricingOption.forEach((option) => {
            // Inicializar con el mínimo de participantes o 1
            initialParticipants[option.id] = option.minParticipants || 1;
          });
          setParticipantsByOption(initialParticipants);
        }

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

  const handleParticipantChange = (optionId: number, change: number) => {
    setParticipantsByOption((prev) => {
      const option = packageData?.PricingOption?.find(
        (opt) => opt.id === optionId,
      );
      if (!option) return prev;

      const currentCount = prev[optionId] || 1;
      const newCount = currentCount + change;

      // Validar mínimo y máximo
      const min = option.minParticipants || 1;
      const max = option.maxParticipants || 999;

      if (newCount < min || newCount > max) {
        return prev;
      }

      return {
        ...prev,
        [optionId]: newCount,
      };
    });
  };

  const handleReserveWithOption = (pricingOption: PricingOption) => {
    if (!packageData) return;

    const participants = participantsByOption[pricingOption.id] || 1;
    const pricePerUnit = parseFloat(pricingOption.amount);
    const totalPrice = pricingOption.perPerson
      ? pricePerUnit * participants
      : pricePerUnit;
    const currency = pricingOption.currencyId === 2 ? 'PEN' : 'USD';

    const bookingParams = new URLSearchParams({
      packageId: packageId,
      packageName: packageData.name,
      pricingOptionId: String(pricingOption.id),
      pricingName: pricingOption.name,
      pricePerUnit: String(pricePerUnit),
      participants: String(participants),
      totalPrice: String(totalPrice),
      currency: currency,
      perPerson: String(pricingOption.perPerson),
      durationDays: String(packageData.duration ?? 1),
      description: packageData.description || '',
      image: packageData.Media?.[0]?.url ?? '',
      language: packageData.Language?.name || 'Español',
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

    router.push(`/booking/${packageId}?${bookingParams.toString()}`);
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

  const pricingOptions =
    packageData.PricingOption?.filter((opt) => opt.isActive) || [];

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
              {packageData.duration} • {packageData.Language?.name || 'Español'}
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

          {/* Columna derecha: Opciones de precio */}
          <div className="space-y-3">
            {pricingOptions.length > 0 ? (
              pricingOptions.map((option) => {
                const price = parseFloat(option.amount);
                const currency = option.currencyId === 2 ? 'PEN' : 'USD';
                const currencySymbol = currency === 'PEN' ? 'S/' : '$';
                const participants =
                  participantsByOption[option.id] ||
                  option.minParticipants ||
                  1;
                const totalPrice = option.perPerson
                  ? price * participants
                  : price;

                return (
                  <div
                    key={option.id}
                    className="bg-white rounded-lg p-4 shadow-md"
                  >
                    {/* Nombre de la opción */}
                    <div className="mb-3 pb-3 border-b">
                      <h3 className="text-lg font-bold text-gray-900">
                        {option.name}
                      </h3>
                    </div>

                    {/* Precio */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1">
                        {option.perPerson
                          ? 'Precio por persona'
                          : 'Precio total'}
                      </p>
                      <p className="text-2xl font-bold text-red-500">
                        {currencySymbol}
                        {price.toLocaleString('es-PE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    {/* Selector de participantes */}
                    {option.perPerson && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Número de personas
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleParticipantChange(option.id, -1)
                            }
                            disabled={
                              participants <= (option.minParticipants || 1)
                            }
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-gray-900 min-w-[2.5rem] text-center">
                            {participants}
                          </span>
                          <button
                            onClick={() =>
                              handleParticipantChange(option.id, 1)
                            }
                            disabled={
                              option.maxParticipants !== null &&
                              participants >= option.maxParticipants
                            }
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Límites de participantes */}
                        {(option.minParticipants !== null ||
                          option.maxParticipants !== null) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {option.minParticipants !== null &&
                                `Mínimo: ${option.minParticipants}`}
                              {option.minParticipants !== null &&
                                option.maxParticipants !== null &&
                                ' • '}
                              {option.maxParticipants !== null &&
                                `Máximo: ${option.maxParticipants}`}
                            </p>
                          )}
                      </div>
                    )}

                    {/* Precio total */}
                    {option.perPerson && (
                      <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currencySymbol}
                          {totalPrice.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    )}

                    {/* Validez de la oferta */}
                    {(option.validFrom || option.validTo) && (
                      <div className="mb-3 text-xs text-gray-600">
                        <p className="font-medium">Válido:</p>
                        {option.validFrom && (
                          <p>
                            Desde:{' '}
                            {new Date(option.validFrom).toLocaleDateString(
                              'es-PE',
                            )}
                          </p>
                        )}
                        {option.validTo && (
                          <p>
                            Hasta:{' '}
                            {new Date(option.validTo).toLocaleDateString(
                              'es-PE',
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Información del paquete */}
                    <div className="flex items-center justify-between bg-white  rounded-lg p-4 mt-4">
                      {/* Duración */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-700" />
                        <div>
                          <p className="text-[10px] text-gray-600 leading-tight">
                            Duración
                          </p>
                          <p className="text-xs font-bold leading-tight">
                            {packageData.duration ?? 0}
                          </p>
                        </div>
                      </div>

                      {/* Destinos */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-700" />
                        <div>
                          <p className="text-[10px] text-gray-600 leading-tight">
                            Destinos
                          </p>
                          <p className="text-xs font-bold leading-tight">
                            {packageData.destinations?.length ?? 0} lugares
                          </p>
                        </div>
                      </div>

                      {/* Idioma */}
                      <div className="flex items-center gap-2">
                        <Languages className="w-5 h-5 text-gray-700" />
                        <div>
                          <p className="text-[10px] text-gray-600 leading-tight">
                            Idioma
                          </p>
                          <p className="text-xs font-bold leading-tight">
                            {packageData.Language?.name || 'Español'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <button
                      onClick={() => handleReserveWithOption(option)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 text-sm rounded-lg transition-colors mb-2"
                    >
                      Reservar Ahora
                    </button>
                    <button className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-2 text-sm rounded-lg transition-colors">
                      Contactar Empresa
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  No hay opciones de precio disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
