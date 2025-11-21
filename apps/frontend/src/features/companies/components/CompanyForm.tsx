'use client';

import { useState } from 'react';
import {
  validateEmail,
  validatePeruvianPhone,
  validateRUC,
  validateURL,
} from '@/lib/validations';

interface CompanyFormData {
  name: string;
  legalName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  websiteUrl: string;
  logoUrl: string;
  registerDate: string;
}

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function CompanyForm({
  onSubmit,
  onBack,
  isSubmitting = false,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    legalName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    websiteUrl: '',
    logoUrl: '',
    registerDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CompanyFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name as keyof CompanyFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre comercial es requerido';
    }

    if (!formData.legalName.trim()) {
      newErrors.legalName = 'La razón social es requerida';
    }

    if (!formData.registrationNumber) {
      newErrors.registrationNumber = 'El RUC es requerido';
    } else if (!validateRUC(formData.registrationNumber)) {
      newErrors.registrationNumber = 'RUC inválido (debe ser 11 dígitos)';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validatePeruvianPhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido (debe ser 9 dígitos)';
    }

    if (formData.websiteUrl && !validateURL(formData.websiteUrl)) {
      newErrors.websiteUrl = 'URL inválida';
    }

    if (formData.logoUrl && !validateURL(formData.logoUrl)) {
      newErrors.logoUrl = 'URL inválida';
    }

    if (!formData.registerDate) {
      newErrors.registerDate = 'La fecha de registro es requerida';
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
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-green-500"
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
            <p className="text-sm text-green-700">
              Completa la información de tu empresa turística. Esta será la
              información visible para los clientes.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Información Básica */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre Comercial <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Andean Adventures"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="legalName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="legalName"
                name="legalName"
                value={formData.legalName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.legalName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Andean Adventures S.A.C."
              />
              {errors.legalName && (
                <p className="mt-1 text-sm text-red-600">{errors.legalName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="registrationNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                RUC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                maxLength={11}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.registrationNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="20123456789"
              />
              {errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.registrationNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="registerDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha de Registro <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="registerDate"
                name="registerDate"
                value={formData.registerDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.registerDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.registerDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.registerDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email de Contacto <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@andeanadventures.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
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
          </div>
        </div>

        {/* Información Adicional (Opcional) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información Adicional (Opcional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="websiteUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sitio Web
              </label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.websiteUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://andeanadventures.com"
              />
              {errors.websiteUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="logoUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL del Logo
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.logoUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://cdn.example.com/logos/andean.png"
              />
              {errors.logoUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.logoUrl}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creando...
            </>
          ) : (
            'Crear Empresa'
          )}
        </button>
      </div>
    </form>
  );
}
