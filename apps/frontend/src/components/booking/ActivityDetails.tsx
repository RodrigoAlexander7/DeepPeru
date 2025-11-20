import React from 'react';
import { BookingFormData, Traveler } from '@/types/booking';

interface ActivityDetailsProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  packageData: {
    name: string;
    image: string;
    date: string;
    time: string;
    travelers: number;
    cancellationPolicy: string;
  };
  pickupLocations?: string[];
  languages?: string[];
}

export default function ActivityDetails({
  formData,
  onUpdate,
  onNext,
  onBack,
  packageData,
  pickupLocations = ['Plaza San Francisco', 'Plaza de Armas'],
  languages = ['Español - Guía', 'English - Guide'],
}: ActivityDetailsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateTraveler = (
    index: number,
    field: keyof Traveler,
    value: string,
  ) => {
    const newTravelers = [...formData.travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    onUpdate({ travelers: newTravelers });
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      <form onSubmit={handleSubmit}>
        {/* Información del paquete */}
        <div className="mb-6 flex items-center gap-4 rounded-lg border border-gray-200 p-4">
          <img
            src={packageData.image}
            alt={packageData.name}
            className="h-20 w-20 rounded object-cover"
          />
          <div className="flex-1">
            <div className="mb-1 flex items-center text-xs text-[var(--primary)]">
              <svg
                className="mr-1 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {packageData.cancellationPolicy}
            </div>
            <h3 className="font-semibold text-gray-900">{packageData.name}</h3>
            <p className="text-sm text-gray-600">{packageData.name}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <span>
                {packageData.date} • {packageData.time}
              </span>
              <span>{packageData.travelers} adultos</span>
            </div>
          </div>
        </div>

        {/* Viajeros */}
        {formData.travelers.map((traveler, index) => (
          <div key={traveler.id} className="mb-6">
            <h3 className="mb-3 font-semibold text-gray-900">
              {index === 0 ? 'Viajero principal' : `Viajero ${index + 1}`}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={traveler.firstName}
                  onChange={(e) =>
                    updateTraveler(index, 'firstName', e.target.value)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                {index === 0 && traveler.firstName && (
                  <svg
                    className="absolute right-3 top-9 h-5 w-5 text-[var(--primary)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div className="relative">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={traveler.lastName}
                  onChange={(e) =>
                    updateTraveler(index, 'lastName', e.target.value)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                {index === 0 && traveler.lastName && (
                  <svg
                    className="absolute right-3 top-9 h-5 w-5 text-[var(--primary)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Ubicación de recogida */}
        {pickupLocations.length > 0 && (
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ubicación de recogida <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-sm text-gray-600">
              El proveedor ofrece servicio de recogida en ubicaciones selectas.
              Encuentra al proveedor en una de las ubicaciones de la lista.
            </p>
            <select
              required
              value={formData.pickupLocation || ''}
              onChange={(e) => onUpdate({ pickupLocation: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Selecciona una ubicación</option>
              {pickupLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Idioma del tour */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Idioma del tour o de la actividad
          </label>
          <select
            value={formData.tourLanguage}
            onChange={(e) => onUpdate({ tourLanguage: e.target.value })}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="rounded-full bg-[var(--primary)] px-8 py-3 font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}
