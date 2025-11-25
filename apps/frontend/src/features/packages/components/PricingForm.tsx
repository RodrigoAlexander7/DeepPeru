'use client';

import { useState, useEffect } from 'react';
import { CreatePricingOptionDto, Currency } from '@/types/package';
import { getCurrencies } from '@/features/packages/services/packageService';

export interface PricingData {
  pricingOptions: CreatePricingOptionDto[];
}

interface PricingFormProps {
  initialData: PricingData;
  onNext: (data: PricingData) => void;
  onBack: () => void;
}

export default function PricingForm({
  initialData,
  onNext,
  onBack,
}: PricingFormProps) {
  const [formData, setFormData] = useState<PricingData>(initialData);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentOption, setCurrentOption] = useState<CreatePricingOptionDto>({
    name: '',
    description: '',
    currencyId: 1,
    amount: 0,
    perPerson: true,
    minParticipants: undefined,
    maxParticipants: undefined,
    validFrom: undefined,
    validTo: undefined,
  });

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setCurrencies(data);
        if (data.length > 0 && !currentOption.currencyId) {
          setCurrentOption((prev) => ({ ...prev, currencyId: data[0].id }));
        }
      } catch (error) {
        console.error('Error al cargar monedas:', error);
      }
    };
    fetchCurrencies();
  }, []);

  const validateOption = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentOption.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (currentOption.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (
      currentOption.minParticipants !== undefined &&
      currentOption.minParticipants < 1
    ) {
      newErrors.minParticipants = 'Debe ser al menos 1';
    }

    if (
      currentOption.maxParticipants !== undefined &&
      currentOption.maxParticipants < 1
    ) {
      newErrors.maxParticipants = 'Debe ser al menos 1';
    }

    if (
      currentOption.minParticipants !== undefined &&
      currentOption.maxParticipants !== undefined &&
      currentOption.minParticipants > currentOption.maxParticipants
    ) {
      newErrors.maxParticipants = 'Debe ser mayor que el mínimo';
    }

    if (
      currentOption.validFrom &&
      currentOption.validTo &&
      new Date(currentOption.validFrom) > new Date(currentOption.validTo)
    ) {
      newErrors.validTo = 'La fecha final debe ser posterior a la inicial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOption = () => {
    if (validateOption()) {
      setFormData((prev) => ({
        pricingOptions: [...prev.pricingOptions, currentOption],
      }));
      setCurrentOption({
        name: '',
        description: '',
        currencyId: currencies[0]?.id || 1,
        amount: 0,
        perPerson: true,
        minParticipants: undefined,
        maxParticipants: undefined,
        validFrom: undefined,
        validTo: undefined,
      });
      setShowForm(false);
      setErrors({});
    }
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      pricingOptions: prev.pricingOptions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pricingOptions.length === 0) {
      alert('Debe agregar al menos una opción de precio');
      return;
    }
    onNext(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === 'number') {
      parsedValue = value === '' ? undefined : Number(value);
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'date') {
      parsedValue = value || undefined;
    }

    setCurrentOption((prev) => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const getCurrencySymbol = (currencyId: number): string => {
    const currency = currencies.find((c) => c.id === currencyId);
    return currency?.symbol || currency?.code || '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Opciones de Precios</h3>

        {/* Lista de opciones existentes */}
        {formData.pricingOptions.length > 0 && (
          <div className="mb-6 space-y-3">
            {formData.pricingOptions.map((option, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {option.name}
                    </h4>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
                      <span className="font-semibold text-blue-600">
                        {getCurrencySymbol(option.currencyId)}{' '}
                        {option.amount.toFixed(2)}
                      </span>
                      <span>
                        {option.perPerson ? 'Por persona' : 'Por grupo'}
                      </span>
                      {option.minParticipants && (
                        <span>Min: {option.minParticipants} pax</span>
                      )}
                      {option.maxParticipants && (
                        <span>Max: {option.maxParticipants} pax</span>
                      )}
                    </div>
                    {(option.validFrom || option.validTo) && (
                      <div className="mt-1 text-xs text-gray-500">
                        Válido: {option.validFrom || '...'} →{' '}
                        {option.validTo || '...'}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para agregar nueva opción */}
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition"
          >
            + Agregar Opción de Precio
          </button>
        )}

        {/* Formulario para nueva opción */}
        {showForm && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
            <h4 className="font-medium text-gray-900">
              Nueva Opción de Precio
            </h4>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentOption.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Precio Regular, Precio de Temporada"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={currentOption.description || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción de esta opción..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="currencyId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Moneda <span className="text-red-500">*</span>
                </label>
                <select
                  id="currencyId"
                  name="currencyId"
                  value={currentOption.currencyId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monto <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={currentOption.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="perPerson"
                    checked={currentOption.perPerson}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Por persona</span>
                </label>
              </div>
            </div>

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
                  value={currentOption.minParticipants ?? ''}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.minParticipants
                      ? 'border-red-500'
                      : 'border-gray-300'
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
                  value={currentOption.maxParticipants ?? ''}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.maxParticipants
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.maxParticipants && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.maxParticipants}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="validFrom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Válido Desde
                </label>
                <input
                  type="date"
                  id="validFrom"
                  name="validFrom"
                  value={currentOption.validFrom || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="validTo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Válido Hasta
                </label>
                <input
                  type="date"
                  id="validTo"
                  name="validTo"
                  value={currentOption.validTo || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.validTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.validTo && (
                  <p className="mt-1 text-sm text-red-500">{errors.validTo}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addOption}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Agregar
              </button>
            </div>
          </div>
        )}
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
