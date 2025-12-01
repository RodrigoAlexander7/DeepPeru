'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
// @ts-ignore
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { travelService } from '@/features/travel/travelService';
import { SearchParams } from '@/types';
import { useSearchParams } from 'next/navigation';

function SearchBarContent() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelersPicker, setShowTravelersPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'exact' | 'month'>('exact');
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [hasSelectedDates, setHasSelectedDates] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const travelersRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        travelersRef.current &&
        !travelersRef.current.contains(event.target as Node)
      ) {
        setShowTravelersPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar valores desde la URL para que no se borren después de buscar
  useEffect(() => {
    const dest = searchParams.get('destination');
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    const trav = searchParams.get('travelers');

    if (dest) setDestination(dest);

    if (start && end) {
      setDateRange([
        {
          startDate: new Date(start),
          endDate: new Date(end),
          key: 'selection',
        },
      ]);
      setHasSelectedDates(true);
    }

    if (trav) setTravelers(parseInt(trav));
  }, [searchParams]);

  const handleSearch = () => {
    const filters: SearchParams = {
      destination,
      travelers,
    };

    if (activeTab === 'exact') {
      filters.startDate = format(dateRange[0].startDate, 'yyyy-MM-dd');
      filters.endDate = format(dateRange[0].endDate, 'yyyy-MM-dd');
    } else if (selectedMonth) {
      const startOfMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1,
        0,
      );
      filters.startDate = format(startOfMonth, 'yyyy-MM-dd');
      filters.endDate = format(endOfMonth, 'yyyy-MM-dd');
    }

    /*Aquí llamas a tu servicio
    travelService
      .searchPackages(filters)
      .then((data) => {
        // manejar resultados
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });*/

    const query = new URLSearchParams({
      ...(filters.destination && { destination: filters.destination }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      travelers: String(filters.travelers),
    }).toString();

    // redirigir a la página de resultados
    router.push(`/search?${query}`);
  };

  const handleClearDates = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
    setSelectedMonth(null);
    setHasSelectedDates(false);
  };

  const handleApplyDates = () => {
    setHasSelectedDates(true);
    setShowDatePicker(false);
  };

  const formatDateRange = () => {
    // Si no ha seleccionado fechas aún, mostrar placeholder
    if (!hasSelectedDates) {
      return 'Fecha de entrada — Fecha de salida';
    }

    if (activeTab === 'exact') {
      const start = format(dateRange[0].startDate, 'dd MMM', { locale: es });
      const end = format(dateRange[0].endDate, 'dd MMM yyyy', { locale: es });
      return `${start} - ${end}`;
    } else if (selectedMonth) {
      return format(selectedMonth, 'MMMM yyyy', { locale: es });
    }
    return 'Fecha de entrada — Fecha de salida';
  };

  return (
    <div className="bg-white rounded-full p-2 flex items-center gap-2 flex-wrap md:flex-nowrap max-w-4xl mx-auto shadow-lg">
      {/* Destination */}
      <div
        className="flex items-center gap-2 px-2 flex-1 
                min-w-[120px] md:min-w-[200px] flex-shrink group"
      >
        <svg
          className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
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

        <input
          type="text"
          placeholder="Destino"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 outline-none bg-transparent 
                    text-black placeholder-gray-500
                    group-hover:text-red-500 
                    group-hover:placeholder-red-500
                    transition-colors"
        />
      </div>

      {/* Date Range Picker */}
      <div
        className="relative flex-1 flex-shrink 
                min-w-[200px] md:min-w-[350px] border-l border-gray-200"
        ref={datePickerRef}
      >
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-2 px-4 w-full text-left text-black hover:text-red-500 transition-colors group"
        >
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
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
          <span className="text-sm truncate">{formatDateRange()}</span>
        </button>

        {showDatePicker && (
          <div className="absolute top-full left-0 mt-6 bg-white rounded-2xl shadow-2xl z-500 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('exact')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'exact'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Fechas exactas
              </button>

              <button
                onClick={() => setActiveTab('month')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'month'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Selección por mes
              </button>
            </div>

            {/* Exact dates */}
            <div className="p-0">
              {activeTab === 'exact' ? (
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(item: any) => setDateRange([item.selection])}
                  months={2}
                  direction="horizontal"
                  locale={es}
                  rangeColors={['#ef4444']}
                  showDateDisplay={false}
                  minDate={new Date()}
                  staticRanges={[]}
                  inputRanges={[]}
                  className="!m-0 !p-0 
                    [&_.rdrDefinedRangesWrapper]:hidden 
                    [&_.rdrCalendarWrapper]:!m-0 
                    [&_.rdrCalendarWrapper]:!p-0
                    [&_.rdrMonthPicker]:text-lg 
                    [&_.rdrMonthPicker]:font-bold
                    [&_.rdrMonthPicker]:text-gray-900
                    [&_.rdrYearPicker]:text-lg
                    [&_.rdrYearPicker]:font-bold
                    [&_.rdrYearPicker]:text-gray-900
                    [&_.rdrWeekDay]:font-bold
                    [&_.rdrWeekDay]:text-black

                    "
                />
              ) : (
                <div className="w-[664px] px-4 py-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecciona un mes:
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date(new Date().getFullYear(), i, 1);
                      const isSelected = selectedMonth?.getMonth() === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedMonth(date)}
                          className={`w-full py-4 rounded-lg font-medium text-center transition-colors ${
                            isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {format(date, 'MMMM', { locale: es })}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleClearDates}
                className="px-4 py-2 text-gray-700 hover:text-red-500 font-medium transition-colors"
              >
                Borrar
              </button>

              <button
                onClick={handleApplyDates}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Travelers */}
      <div
        className="relative flex-1 flex-shrink 
                min-w-[100px] md:min-w-[150px] border-l border-gray-200"
        ref={travelersRef}
      >
        <button
          type="button"
          onClick={() => setShowTravelersPicker(!showTravelersPicker)}
          className="flex items-center gap-2 px-4 w-full text-left text-black hover:text-red-500 transition-colors group"
        >
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>

          <span className="text-sm">
            {travelers} {travelers === 1 ? 'persona' : 'personas'}
          </span>
        </button>

        {showTravelersPicker && (
          <div className="absolute top-full left-0 mt-6 bg-white text-black rounded-2xl shadow-2xl z-50 p-4 w-64">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-900">Pasajeros</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Adultos</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  -
                </button>

                <span className="w-8 text-center font-medium">{travelers}</span>

                <button
                  onClick={() => setTravelers(Math.min(20, travelers + 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Buscar
      </button>
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <SearchBarContent />
    </Suspense>
  );
}
