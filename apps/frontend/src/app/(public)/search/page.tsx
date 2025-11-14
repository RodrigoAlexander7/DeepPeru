'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import ResultCard from '@/components/travel/ResultCard';
import { PackageCard } from '@/types';
import { travelService } from '@/features/travel/travelService';
import { TouristPackage } from '@/types';

import Footer from '@/components/ui/Footer';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<TouristPackage[]>([]);
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
      // Llamar al servicio con los parámetros
      const results = await travelService.searchPackages({
        destination: destination || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        travelers: travelers ? parseInt(travelers) : undefined,
      });
      console.log('RESULTADOS:', results);
      console.log('Paquetes actuales:', packages);
      setPackages(results.data);
      setCurrentPage(1); // Reset a primera página
    } catch (error) {
      console.error('Error al buscar paquetes:', error);
      // En producción, mostrarías un toast o mensaje de error
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
            <span className="text-xl font-bold text-gray-900">TravelEase</span>
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
              Where will you go?
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
            Search Results
          </h2>
          <p className="text-gray-600">
            {loading ? (
              'Searching...'
            ) : packages.length === 0 ? (
              'No results found'
            ) : (
              <>
                Showing {startIndex + 1}-{Math.min(endIndex, packages.length)}{' '}
                of {packages.length} results
                {destination && ` for "${destination}"`}
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
      {!loading && packages.length > 0 && (
        <section className="bg-white py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mismo destino, diferentes fechas */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Same Location, Different Dates
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Cusco & Sacred Valley',
                      dates: 'Dec 10 - Dec 15, 2025',
                      location: 'Cusco, Peru',
                      price: 1350,
                      company: 'Inca Trails Peru',
                    },
                    {
                      title: 'Machu Picchu Express',
                      dates: 'Jan 20 - Jan 25, 2026',
                      location: 'Cusco, Peru',
                      price: 1800,
                      company: 'Peru Adventures',
                    },
                    {
                      title: 'Rainbow Mountain Trek',
                      dates: 'Feb 5 - Feb 8, 2026',
                      location: 'Cusco, Peru',
                      price: 890,
                      company: 'Andean Explorers',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group"
                      onClick={() => console.log('Navigate to:', item.title)}
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.company}
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{item.dates}</span>
                        </div>
                        <span className="text-red-500 font-bold">
                          ${item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Otros destinos, mismas fechas */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Other Locations, Same Dates
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Amazon Jungle Expedition',
                      dates: 'Mar 15 - Mar 20, 2026',
                      location: 'Iquitos, Peru',
                      price: 1450,
                      company: 'Jungle Expeditions',
                    },
                    {
                      title: 'Paracas & Ballestas Islands',
                      dates: 'Mar 15 - Mar 20, 2026',
                      location: 'Paracas, Peru',
                      price: 950,
                      company: 'Coastal Adventures',
                    },
                    {
                      title: 'Colca Canyon Adventure',
                      dates: 'Mar 15 - Mar 20, 2026',
                      location: 'Arequipa, Peru',
                      price: 1100,
                      company: 'Andean Explorers',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group"
                      onClick={() => console.log('Navigate to:', item.title)}
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-cyan-400 to-green-500 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.company}
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
                          <span className="line-clamp-1">{item.location}</span>
                        </div>
                        <span className="text-red-500 font-bold">
                          ${item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
