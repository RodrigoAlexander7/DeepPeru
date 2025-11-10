'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import ResultCard from '@/components/travel/ResultCard';
import { PackageCard } from '@/types';
import { travelService } from '@/features/travel/travel.service';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<PackageCard[]>([]);
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
  const currentPackages = packages.slice(startIndex, endIndex);

  // Ejecutar búsqueda cuando cambien los parámetros
  useEffect(() => {
    performSearch();
  }, [destination, startDate, endDate, travelers]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Llamar al servicio con los parámetros
      const results = await travelService.searchPackages({
        destination: destination || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        travelers: travelers ? parseInt(travelers) : undefined,
      });

      setPackages(results);
      setCurrentPage(1); // Reset a primera página
    } catch (error) {
      console.error('Error al buscar paquetes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">DeepPeru</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </div>
      </header>

      {/* Hero con barra de búsqueda */}
      <section className="relative h-[300px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600)',
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
                {destination && ` para "${destination}"`}
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
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus criterios de búsqueda o explora paquetes
              populares
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Volver a la página principal
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

      {/* Sugerencias relacionadas  */}
      {!loading && packages.length > 0 && (
        <section className="bg-white py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mismo destino, diferentes fechas */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Mismo lugar, fechas diferentes
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Cusco & Rainbow Mountain',
                      dates: 'Aug 15 - Aug 20',
                      location: 'Cusco, Peru',
                    },
                    {
                      title: 'Cusco City Explorer',
                      dates: 'Sep 5 - Sep 10',
                      location: 'Cusco, Peru',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => console.log('Navigate to:', item.title)}
                    >
                      <div className="flex items-center gap-4 p-4 bg-gray-400 rounded-xl hover:bg-gray-500 cursor-pointer transition-colors" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">{item.dates}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Otros destinos, mismas fechas */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Otras ubicaciones, mismas fechas
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Nazca Lines Flyover',
                      dates: 'Jul 10 - Jul 17',
                      location: 'Nazca, Peru',
                    },
                    {
                      title: 'Huacachina Desert Adventure',
                      dates: 'Jul 10 - Jul 17',
                      location: 'Ica, Peru',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => console.log('Navigate to:', item.title)}
                    >
                      <div className="flex items-center gap-4 p-4 bg-gray-400 rounded-xl hover:bg-gray-500 cursor-pointer transition-colors" />

                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">{item.dates}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
