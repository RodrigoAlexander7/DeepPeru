'use client';

import { useState } from 'react';
import type { BookingRequest } from '@/features/packageDetail/packageService';
import { packageService } from '@/features/packageDetail/packageService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  packagePrice: number;
  durationDays?: number;
  itinerary?: any[];
  inclusions?: string[];
}

export default function BookingModal({
  isOpen,
  onClose,
  packageId,
  packageName,
  packagePrice,
  durationDays = 1,
  itinerary = [],
  inclusions = [],
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    guests: 1,
    startDate: new Date().toISOString().split('T')[0],
    selectedActivities: [] as string[],
    agency: '',
    contactEmail: '',
    contactPhone: '',
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const allActivities = itinerary.flatMap((day) => day.activities || []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value,
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activity)
        ? prev.selectedActivities.filter((a) => a !== activity)
        : [...prev.selectedActivities, activity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.guests || formData.guests < 1) {
        throw new Error('Cantidad de personas inválida');
      }
      if (!formData.startDate) {
        throw new Error('Selecciona una fecha de inicio');
      }
      if (!formData.contactEmail || !formData.contactPhone) {
        throw new Error('Email y teléfono son requeridos');
      }
      if (!formData.agency) {
        throw new Error('Selecciona una agencia');
      }

      const bookingPayload: BookingRequest = {
        userId: 'current-user-id',
        guests: formData.guests,
        startDate: formData.startDate,
        endDate: new Date(
          new Date(formData.startDate).getTime() +
            durationDays * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0],
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        extras: formData.selectedActivities,
        note: `Agencia: ${formData.agency}. ${formData.note}`,
        paymentMethodId: undefined,
      };

      await packageService.bookPackage(packageId, bookingPayload);
      setSuccess(true);

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          guests: 1,
          startDate: new Date().toISOString().split('T')[0],
          selectedActivities: [],
          agency: '',
          contactEmail: '',
          contactPhone: '',
          note: '',
        });
      }, 10000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reservar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Reservar: {packageName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        {success ? (
          <div className="p-8 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Reserva Confirmada!
            </h3>
            <p className="text-gray-600">
              Te enviaremos un email de confirmación pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Resumen del paquete */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Precio por persona
                  </p>
                  <p className="text-2xl font-bold text-red-500 mt-1">
                    ${packagePrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Duración
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {durationDays} días
                  </p>
                </div>
              </div>
            </div>

            {/* Cantidad de personas */}
            <div>
              <label
                htmlFor="guests"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Cantidad de personas <span className="text-red-500">*</span>
              </label>
              <input
                id="guests"
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                max="50"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-2">
                Total estimado:{' '}
                <span className="font-bold text-gray-900">
                  ${(packagePrice * formData.guests).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Fecha de inicio */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Fecha de inicio <span className="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Agencia */}
            <div>
              <label
                htmlFor="agency"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Seleccionar Agencia <span className="text-red-500">*</span>
              </label>
              <select
                id="agency"
                name="agency"
                value={formData.agency}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="" className="text-gray-500">
                  -- Selecciona una agencia --
                </option>
                <option value="agency-1" className="text-gray-900">
                  Agencia Viajes Perú
                </option>
                <option value="agency-2" className="text-gray-900">
                  Tours Andinos
                </option>
                <option value="agency-3" className="text-gray-900">
                  Deep Peru Adventures
                </option>
                <option value="agency-4" className="text-gray-900">
                  Machu Picchu Express
                </option>
              </select>
            </div>

            {/* Actividades adicionales */}
            {allActivities.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Actividades Adicionales
                </label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto border border-gray-200">
                  {Array.from(new Set(allActivities)).map((activity, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedActivities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="w-4 h-4 text-red-500 rounded cursor-pointer accent-red-500"
                      />
                      <span className="text-sm text-gray-900 font-medium">
                        {activity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>

            {/* Notas adicionales */}
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Notas Adicionales
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Cuéntanos si tienes alguna solicitud especial..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Reservando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
