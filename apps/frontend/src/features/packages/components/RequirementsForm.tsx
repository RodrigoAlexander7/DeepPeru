'use client';

import { useState } from 'react';
import { AccessibilityFeature } from '@/types/package';

export interface RequirementsData {
  requirements: string[];
  safetyInfo?: string;
  additionalInfo?: string;
  includedItems: string[];
  excludedItems: string[];
  accessibilityOptions: AccessibilityFeature[];
}

interface RequirementsFormProps {
  initialData: RequirementsData;
  onNext: (data: RequirementsData) => void;
  onBack: () => void;
}

const accessibilityFeatures = [
  {
    value: AccessibilityFeature.WHEELCHAIR_ACCESSIBLE,
    label: 'Accesible en silla de ruedas',
  },
  {
    value: AccessibilityFeature.STROLLER_ACCESSIBLE,
    label: 'Accesible con cochecito',
  },
  {
    value: AccessibilityFeature.SERVICE_ANIMALS_ALLOWED,
    label: 'Se permiten animales de servicio',
  },
  {
    value: AccessibilityFeature.AUDIO_GUIDE_AVAILABLE,
    label: 'Audioguía disponible',
  },
  {
    value: AccessibilityFeature.SIGN_LANGUAGE_AVAILABLE,
    label: 'Lengua de señas disponible',
  },
  {
    value: AccessibilityFeature.LARGE_PRINT_MATERIAL,
    label: 'Material en letra grande',
  },
  {
    value: AccessibilityFeature.ASSISTIVE_LISTENING_SYSTEM,
    label: 'Sistema de escucha asistida',
  },
  {
    value: AccessibilityFeature.BRAILLE_MATERIAL,
    label: 'Material en Braille',
  },
  {
    value: AccessibilityFeature.STEP_FREE_ACCESS,
    label: 'Acceso sin escalones',
  },
  {
    value: AccessibilityFeature.ELEVATOR_AVAILABLE,
    label: 'Ascensor disponible',
  },
  { value: AccessibilityFeature.ACCESSIBLE_TOILET, label: 'Baño accesible' },
];

export default function RequirementsForm({
  initialData,
  onNext,
  onBack,
}: RequirementsFormProps) {
  const [formData, setFormData] = useState<RequirementsData>(initialData);
  const [requirementInput, setRequirementInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [excludedInput, setExcludedInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addIncluded = () => {
    if (includedInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        includedItems: [...prev.includedItems, includedInput.trim()],
      }));
      setIncludedInput('');
    }
  };

  const removeIncluded = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      includedItems: prev.includedItems.filter((_, i) => i !== index),
    }));
  };

  const addExcluded = () => {
    if (excludedInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        excludedItems: [...prev.excludedItems, excludedInput.trim()],
      }));
      setExcludedInput('');
    }
  };

  const removeExcluded = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      excludedItems: prev.excludedItems.filter((_, i) => i !== index),
    }));
  };

  const toggleAccessibility = (feature: AccessibilityFeature) => {
    setFormData((prev) => ({
      ...prev,
      accessibilityOptions: prev.accessibilityOptions.includes(feature)
        ? prev.accessibilityOptions.filter((f) => f !== feature)
        : [...prev.accessibilityOptions, feature],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Requisitos y Seguridad</h3>

        {/* Requisitos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requisitos para Participar
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addRequirement())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Llevar documentos de identidad"
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Agregar
            </button>
          </div>
          {formData.requirements.length > 0 && (
            <ul className="space-y-2">
              {formData.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                >
                  <span className="text-sm">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Información de Seguridad */}
        <div className="mb-6">
          <label
            htmlFor="safetyInfo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Información de Seguridad
          </label>
          <textarea
            id="safetyInfo"
            name="safetyInfo"
            value={formData.safetyInfo || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, safetyInfo: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Información importante sobre seguridad del tour..."
          />
        </div>

        {/* Información Adicional */}
        <div className="mb-6">
          <label
            htmlFor="additionalInfo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Información Adicional
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                additionalInfo: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Otra información relevante para los turistas..."
          />
        </div>

        {/* Incluido */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qué está Incluido
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={includedInput}
              onChange={(e) => setIncludedInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addIncluded())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Transporte, Guía turístico, Almuerzo"
            />
            <button
              type="button"
              onClick={addIncluded}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Agregar
            </button>
          </div>
          {formData.includedItems.length > 0 && (
            <ul className="space-y-2">
              {formData.includedItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-green-50 px-3 py-2 rounded"
                >
                  <span className="text-sm">✓ {item}</span>
                  <button
                    type="button"
                    onClick={() => removeIncluded(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Excluido */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qué NO está Incluido
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={excludedInput}
              onChange={(e) => setExcludedInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addExcluded())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Propinas, Bebidas alcohólicas"
            />
            <button
              type="button"
              onClick={addExcluded}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Agregar
            </button>
          </div>
          {formData.excludedItems.length > 0 && (
            <ul className="space-y-2">
              {formData.excludedItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-red-50 px-3 py-2 rounded"
                >
                  <span className="text-sm">✗ {item}</span>
                  <button
                    type="button"
                    onClick={() => removeExcluded(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Accesibilidad */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opciones de Accesibilidad
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessibilityFeatures.map((feature) => (
              <label
                key={feature.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.accessibilityOptions.includes(
                    feature.value,
                  )}
                  onChange={() => toggleAccessibility(feature.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
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
