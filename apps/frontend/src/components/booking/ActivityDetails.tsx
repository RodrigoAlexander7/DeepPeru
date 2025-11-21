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
    rating: number;
    reviewCount: number;
    description: string;
    provider: string;
    date: string;
    time: string;
    travelers: number;
    cancellationPolicy: string;
  };
  selectedPricing: {
    minParticipants: number | null;
    maxParticipants: number | null;
    perPerson: boolean;
    pricePerUnit: number;
    currency: string;
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
  selectedPricing,
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
    const updated = [...formData.travelers];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ travelers: updated });
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
            <div className="text-xs text-[var(--primary)] mb-1">
              {packageData.cancellationPolicy}
            </div>
            <h3 className="font-semibold text-gray-900">{packageData.name}</h3>
            <p className="text-sm text-gray-600">{packageData.description}</p>

            <div className="mt-2 text-sm text-gray-600">
              <span>
                {packageData.date || 'Selecciona una fecha'} •{' '}
                {packageData.time || '08:00'}
              </span>
              <span className="ml-4">{packageData.travelers} viajeros</span>
            </div>
          </div>
        </div>

        {/* VIAJEROS */}
        {formData.travelers.map((traveler, index) => (
          <div key={traveler.id} className="mb-6">
            <h3 className="mb-3 font-semibold text-gray-900">
              {index === 0 ? 'Viajero principal' : `Viajero ${index + 1}`}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={traveler.firstName}
                  onChange={(e) =>
                    updateTraveler(index, 'firstName', e.target.value)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={traveler.lastName}
                  onChange={(e) =>
                    updateTraveler(index, 'lastName', e.target.value)
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>
        ))}

        {/* UBICACIÓN DE RECOGIDA */}
        {pickupLocations.length > 0 && (
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ubicación de recogida <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.pickupLocation}
              onChange={(e) => onUpdate({ pickupLocation: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Selecciona una ubicación</option>
              {pickupLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* IDIOMA */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Idioma del tour
          </label>
          <select
            value={formData.tourLanguage}
            onChange={(e) => onUpdate({ tourLanguage: e.target.value })}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-red-500 focus:border-red-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* BOTONES */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Atrás
          </button>

          <button
            type="submit"
            className="rounded-full bg-[var(--primary)] text-white px-8 py-3 font-semibold hover:bg-[var(--primary-hover)]"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}
