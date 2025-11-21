import React from 'react';
import { BookingFormData } from '@/types/booking';

interface ContactFormProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  userEmail?: string;
  userName?: string;
}

export default function ContactForm({
  formData,
  onUpdate,
  onNext,
  userEmail,
  userName,
}: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      <p className="mb-6 text-gray-600">
        Usaremos esta información para enviarte la confirmación y
        actualizaciones sobre tu reservación.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Correo electrónico */}
        <div className="mt-4">
          <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
            Correo electrónico <span className="text-red-500 ml-1">*</span>
            <svg
              className="ml-1 h-4 w-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <input
            type="email"
            required
            value={formData.email || userEmail || ''}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Número de teléfono */}
        <div className="mt-4">
          <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
            Número de teléfono <span className="text-red-500 ml-1">*</span>
            <svg
              className="ml-1 h-4 w-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <div className="flex">
            <select
              value={formData.countryCode}
              onChange={(e) => onUpdate({ countryCode: e.target.value })}
              className="rounded-l border border-r-0 border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="+51">+51</option>
              <option value="+1">+1</option>
              <option value="+52">+52</option>
            </select>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              className="w-full rounded-r border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-4 space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.receiveTextUpdates}
              onChange={(e) =>
                onUpdate({ receiveTextUpdates: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Recibe actualizaciones por mensaje de texto sobre tu reservación.
              Es posible que se apliquen cargos por los mensajes.
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.receiveEmailOffers}
              onChange={(e) =>
                onUpdate({ receiveEmailOffers: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Recibe correos electrónicos de Tripadvisor con ofertas e
              información sobre sus servicios de viaje. Puedes retirar tu
              consentimiento en cualquier momento.
            </span>
          </label>
        </div>

        {/* Botón siguiente */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-[var(--primary)] px-8 py-3 font-semibold text-white hover:bg-[var(--primary-hover)]  transition-colors"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
}
