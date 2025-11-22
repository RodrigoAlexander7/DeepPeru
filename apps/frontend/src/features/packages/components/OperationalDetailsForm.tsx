'use client';

import { useState } from 'react';

export interface OperationalDetailsData {
  minAge?: number;
  maxAge?: number;
  minParticipants?: number;
  maxParticipants?: number;
  meetingPoint?: string;
  meetingLatitude?: number;
  meetingLongitude?: number;
  endPoint?: string;
  endLatitude?: number;
  endLongitude?: number;
  timezone?: string;
  bookingCutoff?: string;
  cancellationPolicy?: string;
}

interface OperationalDetailsFormProps {
  initialData: OperationalDetailsData;
  onNext: (data: OperationalDetailsData) => void;
  onBack: () => void;
}

export default function OperationalDetailsForm({
  initialData,
  onNext,
  onBack,
}: OperationalDetailsFormProps) {
  const [formData, setFormData] = useState<OperationalDetailsData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.minAge !== undefined && formData.minAge < 0) {
      newErrors.minAge = 'La edad mínima no puede ser negativa';
    }

    if (formData.maxAge !== undefined && formData.maxAge < 0) {
      newErrors.maxAge = 'La edad máxima no puede ser negativa';
    }

    if (
      formData.minAge !== undefined &&
      formData.maxAge !== undefined &&
      formData.minAge > formData.maxAge
    ) {
      newErrors.maxAge = 'La edad máxima debe ser mayor que la edad mínima';
    }

    if (
      formData.minParticipants !== undefined &&
      formData.minParticipants < 1
    ) {
      newErrors.minParticipants = 'Debe haber al menos 1 participante mínimo';
    }

    if (
      formData.maxParticipants !== undefined &&
      formData.maxParticipants < 1
    ) {
      newErrors.maxParticipants = 'Debe haber al menos 1 participante máximo';
    }

    if (
      formData.minParticipants !== undefined &&
      formData.maxParticipants !== undefined &&
      formData.minParticipants > formData.maxParticipants
    ) {
      newErrors.maxParticipants =
        'El máximo de participantes debe ser mayor que el mínimo';
    }

    if (
      formData.meetingLatitude !== undefined &&
      (formData.meetingLatitude < -90 || formData.meetingLatitude > 90)
    ) {
      newErrors.meetingLatitude = 'La latitud debe estar entre -90 y 90';
    }

    if (
      formData.meetingLongitude !== undefined &&
      (formData.meetingLongitude < -180 || formData.meetingLongitude > 180)
    ) {
      newErrors.meetingLongitude = 'La longitud debe estar entre -180 y 180';
    }

    if (
      formData.endLatitude !== undefined &&
      (formData.endLatitude < -90 || formData.endLatitude > 90)
    ) {
      newErrors.endLatitude = 'La latitud debe estar entre -90 y 90';
    }

    if (
      formData.endLongitude !== undefined &&
      (formData.endLongitude < -180 || formData.endLongitude > 180)
    ) {
      newErrors.endLongitude = 'La longitud debe estar entre -180 y 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number | undefined = value;

    if (
      [
        'minAge',
        'maxAge',
        'minParticipants',
        'maxParticipants',
        'meetingLatitude',
        'meetingLongitude',
        'endLatitude',
        'endLongitude',
      ].includes(name)
    ) {
      parsedValue = value === '' ? undefined : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Detalles Operacionales</h3>

        {/* Capacidad */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Capacidad</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minParticipants"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Participantes Mínimo
              </label>
              <input
                type="number"
                id="minParticipants"
                name="minParticipants"
                value={formData.minParticipants ?? ''}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minParticipants ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.minParticipants && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.minParticipants}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="maxParticipants"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Participantes Máximo
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants ?? ''}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.maxParticipants}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edad */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Rango de Edad</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minAge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Edad Mínima
              </label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                value={formData.minAge ?? ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minAge ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.minAge && (
                <p className="mt-1 text-sm text-red-500">{errors.minAge}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="maxAge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Edad Máxima
              </label>
              <input
                type="number"
                id="maxAge"
                name="maxAge"
                value={formData.maxAge ?? ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxAge ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maxAge && (
                <p className="mt-1 text-sm text-red-500">{errors.maxAge}</p>
              )}
            </div>
          </div>
        </div>

        {/* Punto de Encuentro */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Punto de Encuentro</h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="meetingPoint"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dirección
              </label>
              <input
                type="text"
                id="meetingPoint"
                name="meetingPoint"
                value={formData.meetingPoint || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Plaza de Armas, Cusco"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="meetingLatitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Latitud
                </label>
                <input
                  type="number"
                  id="meetingLatitude"
                  name="meetingLatitude"
                  value={formData.meetingLatitude ?? ''}
                  onChange={handleChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.meetingLatitude
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="-13.5319"
                />
                {errors.meetingLatitude && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.meetingLatitude}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="meetingLongitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Longitud
                </label>
                <input
                  type="number"
                  id="meetingLongitude"
                  name="meetingLongitude"
                  value={formData.meetingLongitude ?? ''}
                  onChange={handleChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.meetingLongitude
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="-71.9675"
                />
                {errors.meetingLongitude && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.meetingLongitude}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Punto de Finalización */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Punto de Finalización
          </h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="endPoint"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dirección
              </label>
              <input
                type="text"
                id="endPoint"
                name="endPoint"
                value={formData.endPoint || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Hotel en Cusco"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="endLatitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Latitud
                </label>
                <input
                  type="number"
                  id="endLatitude"
                  name="endLatitude"
                  value={formData.endLatitude ?? ''}
                  onChange={handleChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endLatitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="-13.5319"
                />
                {errors.endLatitude && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.endLatitude}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="endLongitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Longitud
                </label>
                <input
                  type="number"
                  id="endLongitude"
                  name="endLongitude"
                  value={formData.endLongitude ?? ''}
                  onChange={handleChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endLongitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="-71.9675"
                />
                {errors.endLongitude && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.endLongitude}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zona Horaria */}
        <div className="mb-6">
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Zona Horaria
          </label>
          <input
            type="text"
            id="timezone"
            name="timezone"
            value={formData.timezone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: America/Lima"
          />
        </div>

        {/* Tiempo de Reserva */}
        <div className="mb-6">
          <label
            htmlFor="bookingCutoff"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tiempo Límite de Reserva
          </label>
          <input
            type="text"
            id="bookingCutoff"
            name="bookingCutoff"
            value={formData.bookingCutoff || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 24 horas antes, 2 días antes"
          />
        </div>

        {/* Política de Cancelación */}
        <div className="mb-4">
          <label
            htmlFor="cancellationPolicy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Política de Cancelación
          </label>
          <textarea
            id="cancellationPolicy"
            name="cancellationPolicy"
            value={formData.cancellationPolicy || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe las políticas de cancelación y reembolso..."
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}
