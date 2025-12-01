'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import ResultCard from '@/components/travel/ResultCard';
import { PackageCard } from '@/types';
import { travelService } from '@/features/travel/travelService';
import { TouristPackage } from '@/types';
import { Header, Footer } from '@/components/layout';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<TouristPackage[]>([]);
  const [sameLocationPackages, setSameLocationPackages] = useState<
    TouristPackage[]
  >([]);
  const [sameDatePackages, setSameDatePackages] = useState<TouristPackage[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener parámetros de búsqueda de la URL
  const destination = searchParams.get('destination') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const travelers = searchParams.get('travelers') || '1';

  // Configuración de paginación
  const itemsPerPage = 6;
  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const arrayPackages = Array.isArray(packages) ? packages : [];
  const currentPackages = arrayPackages.slice(startIndex, endIndex);

  // Ejecutar búsqueda cuando cambien los parámetros
  useEffect(() => {
    performSearch();
  }, [destination, startDate, endDate, travelers]);

  useEffect(() => {
    console.log('Página actual:', currentPage);
    console.log('startIndex:', startIndex);
    console.log('endIndex:', endIndex);
  }, [currentPage, packages]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Búsqueda principal
      const results = await travelService.searchPackages({
        destination: destination || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        travelers: travelers ? parseInt(travelers) : undefined,
      });
      console.log('RESULTADOS:', results);
      setPackages(results.data);
      setCurrentPage(1);

      // Búsquedas de sugerencias en paralelo
      if (destination || startDate) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error('Error al buscar paquetes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      // Misma ubicación, diferentes fechas (solo si hay destination)
      if (destination) {
        const sameLocationResults = await travelService.searchPackages({
          destination: destination,
          // No enviamos startDate ni endDate para obtener todas las fechas
        });
        // Filtrar para excluir los paquetes ya mostrados y limitar a 5
        const filtered = sameLocationResults.data
          .filter((pkg: TouristPackage) => {
            // Excluir si tiene las mismas fechas que la búsqueda original
            if (startDate && endDate) {
              const pkgDates = getPackageDates(pkg);
              if (pkgDates) {
                return (
                  pkgDates.startDate !== startDate ||
                  pkgDates.endDate !== endDate
                );
              }
            }
            return true;
          })
          .slice(0, 5);
        setSameLocationPackages(filtered);
      }

      // Mismas fechas, diferentes ubicaciones (solo si hay fechas)
      if (startDate && endDate) {
        const sameDateResults = await travelService.searchPackages({
          startDate: startDate,
          endDate: endDate,
          // No enviamos destination para obtener todas las ubicaciones
        });
        // Filtrar para excluir los paquetes ya mostrados y limitar a 5
        const filtered = sameDateResults.data
          .filter((pkg: TouristPackage) => {
            // Excluir si tiene el mismo destino que la búsqueda original
            if (destination) {
              const pkgLocation = getPackageLocation(pkg);
              return !pkgLocation
                .toLowerCase()
                .includes(destination.toLowerCase());
            }
            return true;
          })
          .slice(0, 5);
        setSameDatePackages(filtered);
      }
    } catch (error) {
      console.error('Error al buscar sugerencias:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPackageImage = (pkg: TouristPackage) => {
    const primaryMedia = pkg.Media?.find((m) => m.isPrimary);
    return primaryMedia?.url || pkg.Media?.[0]?.url;
  };

  const getPackagePrice = (pkg: TouristPackage) => {
    const pricing = pkg.PricingOption?.[0];
    return pricing ? parseFloat(pricing.amount) : 0;
  };

  const getPackageLocation = (pkg: TouristPackage) => {
    return `${pkg.representativeCity?.name || ''}, ${pkg.representativeCity?.region?.name || ''}`.trim();
  };

  const getPackageDates = (pkg: TouristPackage) => {
    const schedule = pkg.Schedule?.[0];
    if (schedule) {
      return {
        startDate: schedule.startDate,
        endDate: schedule.endDate,
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative">
        <Header variant="transparent" />

        {/* Hero con barra de búsqueda */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.05)), url('/images/search_background.jpg')",
            }}
          />

          <div className="relative z-10 w-full px-4">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
                ¿Adónde irás?
              </h1>
              <SearchBar />
            </div>
          </div>
        </section>
      </div>

      {/* Resultados de búsqueda */}
      <section className="container mx-auto px-4 py-12">
        {/* Encabezado de resultados */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Resultados de la búsqueda
          </h2>
          <p className="text-gray-600">
            {loading ? (
              'Searching...'
            ) : packages.length === 0 ? (
              'No results found'
            ) : (
              <>
                Mostrando {startIndex + 1}-{Math.min(endIndex, packages.length)}{' '}
                de {packages.length} resultados
                {destination && ` de "${destination}"`}
              </>
            )}
          </p>
        </div>

        {/* Estados: Loading, Sin resultados, Con resultados */}
        {loading ? (
          // Estado de carga
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : packages.length === 0 ? (
          // Sin resultados
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or explore popular packages
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            {/* Grid de resultados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentPackages.map((pkg) => (
                <ResultCard key={pkg.id} package={pkg} />
              ))}
            </div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {/* Botón anterior */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Números de página */}
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-10 h-10 rounded-lg font-medium transition-colors
                      ${
                        currentPage === page
                          ? 'bg-red-500 text-white'
                          : 'hover:bg-gray-200 text-gray-700'
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                {/* Mostrar última página si hay muchas */}
                {totalPages > 5 && (
                  <>
                    <span className="px-3 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`
                        w-10 h-10 rounded-lg font-medium transition-colors
                        ${
                          currentPage === totalPages
                            ? 'bg-red-500 text-white'
                            : 'hover:bg-gray-200 text-gray-700'
                        }
                      `}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Botón siguiente */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Sugerencias relacionadas (solo si hay resultados) */}
      {!loading &&
        packages.length > 0 &&
        (sameLocationPackages.length > 0 || sameDatePackages.length > 0) && (
          <section className="bg-white py-12 border-t">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Mismo destino, diferentes fechas */}
                {sameLocationPackages.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Mismo lugar, diferentes fechas
                    </h3>
                    <div className="space-y-4">
                      {sameLocationPackages.map((pkg: TouristPackage) => {
                        const dates = getPackageDates(pkg);
                        return (
                          <div
                            key={pkg.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group"
                            onClick={() => router.push(`/package/${pkg.id}`)}
                          >
                            <div
                              className="w-24 h-24 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform bg-cover bg-center"
                              style={{
                                backgroundImage: getPackageImage(pkg)
                                  ? `url(${getPackageImage(pkg)})`
                                  : undefined,
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                {pkg.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">
                                {pkg.TourismCompany?.name || 'Travel Agency'}
                              </p>
                              {dates && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                  <svg
                                    className="w-3 h-3"
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
                                    {formatDate(dates.startDate)} -{' '}
                                    {formatDate(dates.endDate)}
                                  </span>
                                </div>
                              )}
                              <span className="text-red-500 font-bold">
                                ${getPackagePrice(pkg).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Otros destinos, mismas fechas */}
                {sameDatePackages.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Otros lugares, mismas fechas
                    </h3>
                    <div className="space-y-4">
                      {sameDatePackages.map((pkg: TouristPackage) => (
                        <div
                          key={pkg.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group"
                          onClick={() => router.push(`/package/${pkg.id}`)}
                        >
                          <div
                            className="w-24 h-24 bg-gradient-to-br from-blue-400 via-cyan-400 to-green-500 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform bg-cover bg-center"
                            style={{
                              backgroundImage: getPackageImage(pkg)
                                ? `url(${getPackageImage(pkg)})`
                                : undefined,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                              {pkg.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {pkg.TourismCompany?.name || 'Travel Agency'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <svg
                                className="w-3 h-3"
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
                              <span className="line-clamp-1">
                                {getPackageLocation(pkg)}
                              </span>
                            </div>
                            <span className="text-red-500 font-bold">
                              ${getPackagePrice(pkg).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
