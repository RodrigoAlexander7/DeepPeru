'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileDto } from '@/types/user';

interface ProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: UpdateProfileDto) => Promise<void>;
  loading?: boolean;
}

export default function ProfileForm({
  initialData,
  onSubmit,
  loading = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileDto>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender,
    phoneNumber: initialData.phone?.phoneNumber || '',
    countryCode: initialData.phone?.countryCode || '+51',
    picture: initialData.picture || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (formData.phoneNumber && formData.phoneNumber.length < 6) {
      newErrors.phoneNumber = 'Número de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Limpiar campos vacíos antes de enviar
    const cleanData: UpdateProfileDto = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        cleanData[key as keyof UpdateProfileDto] = value as any;
      }
    });

    await onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Información Personal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apellido <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Género */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Género
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100"
          >
            <option value="">Seleccionar...</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </div>

        {/* Código de País */}
        <div>
          <label
            htmlFor="countryCode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Código de País
          </label>
          <input
            type="text"
            id="countryCode"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            disabled={loading}
            placeholder="+51"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Teléfono
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={loading}
            placeholder="987654321"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* URL de Foto */}
        <div className="md:col-span-2">
          <label
            htmlFor="picture"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            URL de Foto de Perfil
          </label>
          <input
            type="url"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Botón Submit */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[var(--primary)] hover:bg-red-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </form>
  );
}
