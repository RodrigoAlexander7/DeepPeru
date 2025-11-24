'use client';

import { useState, useEffect } from 'react';
import type { CompanyAdminData } from '@/types/company';
import {
  validateDNI,
  validatePeruvianPhone,
  validateEmail,
  validateAge,
} from '@/lib/validations';

interface OperatorFormProps {
  onSubmit: (data: CompanyAdminData) => void;
  onBack?: () => void;
  initialData?: Partial<CompanyAdminData>;
  userEmail: string;
}

export default function OperatorForm({
  onSubmit,
  onBack,
  initialData,
  userEmail,
}: OperatorFormProps) {
  const [formData, setFormData] = useState<CompanyAdminData>({
    email: userEmail,
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationalityId: 6, // Peru por defecto (id 6 en la BD)
    documentNumber: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CompanyAdminData, string>>
  >({});
  const [countries, setCountries] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    // Por ahora usar países hardcoded con IDs reales de la BD
    // TODO: Crear endpoint GET /countries en el backend
    const countriesData = [
      { id: 6, name: 'Perú', code: 'PE' },
      { id: 7, name: 'United States', code: 'US' },
      { id: 8, name: 'Brazil', code: 'BR' },
      { id: 9, name: 'Argentina', code: 'AR' },
      { id: 10, name: 'Chile', code: 'CL' },
    ];

    setCountries(countriesData);

    // Si no hay initialData.nationalityId, establecer Peru como default
    if (!initialData?.nationalityId) {
      const peru = countriesData.find((c) => c.code === 'PE');
      if (peru) {
        setFormData((prev) => ({ ...prev, nationalityId: peru.id }));
      }
    }

    setLoadingCountries(false);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nationalityId' ? parseInt(value) : value,
    }));
    // Limpiar error del campo al escribir
    if (errors[name as keyof CompanyAdminData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyAdminData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validatePeruvianPhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido (debe ser 9 dígitos, ej: 987654321)';
    }

    if (!validateDNI(formData.documentNumber)) {
      newErrors.documentNumber = 'DNI inválido (debe ser 8 dígitos)';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    } else if (!validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Debes ser mayor de 18 años';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Completa tu información personal para registrarte como operador
              turístico. Esta información será utilizada para identificarte como
              administrador de tu empresa.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombres <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Juan Carlos"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="García López"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="documentNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            DNI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="documentNumber"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleChange}
            maxLength={8}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.documentNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="12345678"
          />
          {errors.documentNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Nacimiento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString()
                .split('T')[0]
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            title="Este es tu email de usuario registrado"
          />
          <p className="mt-1 text-xs text-gray-500">
            Este es tu email de cuenta
          </p>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength={9}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="987654321"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="nationalityId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nacionalidad <span className="text-red-500">*</span>
          </label>
          <select
            id="nationalityId"
            name="nationalityId"
            value={formData.nationalityId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Atrás
          </button>
        )}
        <button
          type="submit"
          className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}
