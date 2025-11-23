'use client';

import { BookingFilters as BookingFiltersType } from '@/types/booking-list';

interface BookingFiltersProps {
  currentFilters: BookingFiltersType;
  onChange: (filters: BookingFiltersType) => void;
}

export default function BookingFilters({
  currentFilters,
  onChange,
}: BookingFiltersProps) {
  const timeFilters = [
    { label: 'Todas', value: 'all' },
    { label: 'Próximas', value: 'upcoming' },
    { label: 'Pasadas', value: 'past' },
  ];

  const statusFilters = [
    { label: 'Todos los estados', value: 'all' },
    { label: 'Confirmadas', value: 'CONFIRMED' },
    { label: 'Pendientes', value: 'PENDING' },
    { label: 'Canceladas', value: 'CANCELLED' },
    { label: 'Completadas', value: 'COMPLETED' },
  ];

  const getCurrentTimeFilter = () => {
    if (currentFilters.upcoming) return 'upcoming';
    if (currentFilters.past) return 'past';
    return 'all';
  };

  const handleTimeFilterChange = (value: string) => {
    const newFilters = { ...currentFilters };
    delete newFilters.upcoming;
    delete newFilters.past;

    if (value === 'upcoming') {
      newFilters.upcoming = true;
    } else if (value === 'past') {
      newFilters.past = true;
    }

    onChange(newFilters);
  };

  const handleStatusFilterChange = (value: string) => {
    const newFilters = { ...currentFilters };

    if (value === 'all') {
      delete newFilters.status;
    } else {
      newFilters.status = value as any;
    }

    onChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filtros de tiempo (Pills) */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Periodo
          </label>
          <div className="flex gap-2 flex-wrap">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleTimeFilterChange(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  getCurrentTimeFilter() === filter.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro de estado (Dropdown) */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={currentFilters.status || 'all'}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
