'use client';

import { useState, useEffect } from 'react';
import { PackageType, DifficultyLevel } from '@/types/package';

export interface BasicInfoData {
  name: string;
  description: string;
  duration: string;
  type: PackageType;
  difficulty: DifficultyLevel;
  languageId?: number;
}

interface BasicInfoFormProps {
  initialData: BasicInfoData;
  onNext: (data: BasicInfoData) => void;
  onCancel: () => void;
}

export default function BasicInfoForm({
  initialData,
  onNext,
  onCancel,
}: BasicInfoFormProps) {
  const [formData, setFormData] = useState<BasicInfoData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [languages, setLanguages] = useState<{ id: number; name: string }[]>(
    [],
  );

  useEffect(() => {
    // Cargar idiomas disponibles
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setLanguages(data);
        }
      } catch (error) {
        console.error('Error al cargar idiomas:', error);
      }
    };
    fetchLanguages();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no debe exceder 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description =
        'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'La duración es requerida';
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Información Básica del Paquete
        </h3>

        {/* Nombre */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del Paquete <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Ej: Tour Machupicchu Full Day"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Describe el paquete turístico en detalle..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Duración */}
        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Duración <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Ej: 1 día, 3 días / 2 noches"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
          )}
        </div>

        {/* Tipo */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Paquete <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={PackageType.GROUP}>Grupal</option>
            <option value={PackageType.PRIVATE}>Privado</option>
            <option value={PackageType.SELF_GUIDED}>Auto-guiado</option>
          </select>
        </div>

        {/* Dificultad */}
        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nivel de Dificultad <span className="text-red-500">*</span>
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={DifficultyLevel.EASY}>Fácil</option>
            <option value={DifficultyLevel.MODERATE}>Moderado</option>
            <option value={DifficultyLevel.CHALLENGING}>Desafiante</option>
            <option value={DifficultyLevel.HARD}>Difícil</option>
          </select>
        </div>

        {/* Idioma */}
        <div className="mb-4">
          <label
            htmlFor="languageId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Idioma del Tour (Opcional)
          </label>
          <select
            id="languageId"
            name="languageId"
            value={formData.languageId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar idioma...</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        >
          Cancelar
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
