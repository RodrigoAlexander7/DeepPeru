'use client';

import { useState } from 'react';
import { CreateBenefitDto, CreatePickupDetailDto } from '@/types/package';

export interface BenefitsPickupData {
  benefits: CreateBenefitDto[];
  pickupDetail?: CreatePickupDetailDto;
}

interface BenefitsPickupFormProps {
  initialData: BenefitsPickupData;
  onNext: (data: BenefitsPickupData) => void;
  onBack: () => void;
}

export default function BenefitsPickupForm({
  initialData,
  onNext,
  onBack,
}: BenefitsPickupFormProps) {
  const [formData, setFormData] = useState<BenefitsPickupData>(initialData);
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState<CreateBenefitDto>({
    iconUrl: '',
    title: '',
    text: '',
    order: 0,
  });
  const [benefitError, setBenefitError] = useState('');

  const addBenefit = () => {
    if (!currentBenefit.title.trim()) {
      setBenefitError('El título es requerido');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        { ...currentBenefit, order: prev.benefits.length },
      ],
    }));
    setCurrentBenefit({
      iconUrl: '',
      title: '',
      text: '',
      order: 0,
    });
    setShowBenefitForm(false);
    setBenefitError('');
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handlePickupChange = (
    field: keyof CreatePickupDetailDto,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pickupDetail: {
        ...prev.pickupDetail,
        [field]: value,
      } as CreatePickupDetailDto,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Beneficios y Recojo</h3>

        {/* Beneficios */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Beneficios del Paquete
          </h4>

          {formData.benefits.length > 0 && (
            <div className="space-y-2 mb-4">
              {formData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {benefit.iconUrl && (
                        <img
                          src={benefit.iconUrl}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <strong className="text-gray-900">{benefit.title}</strong>
                    </div>
                    {benefit.text && (
                      <p className="text-sm text-gray-600 mt-1">
                        {benefit.text}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          {!showBenefitForm && (
            <button
              type="button"
              onClick={() => setShowBenefitForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition"
            >
              + Agregar Beneficio
            </button>
          )}

          {showBenefitForm && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
              <div>
                <label
                  htmlFor="benefitTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="benefitTitle"
                  value={currentBenefit.title}
                  onChange={(e) =>
                    setCurrentBenefit((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    benefitError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Transporte incluido"
                />
                {benefitError && (
                  <p className="mt-1 text-sm text-red-500">{benefitError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="benefitText"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción
                </label>
                <textarea
                  id="benefitText"
                  value={currentBenefit.text || ''}
                  onChange={(e) =>
                    setCurrentBenefit((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción del beneficio..."
                />
              </div>

              <div>
                <label
                  htmlFor="benefitIcon"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL del Ícono (opcional)
                </label>
                <input
                  type="text"
                  id="benefitIcon"
                  value={currentBenefit.iconUrl || ''}
                  onChange={(e) =>
                    setCurrentBenefit((prev) => ({
                      ...prev,
                      iconUrl: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://ejemplo.com/icono.png"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBenefitForm(false);
                    setBenefitError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={addBenefit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detalles de Recojo */}
        <div className="mb-6 border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Detalles de Recojo en Hotel
          </h4>

          <div className="space-y-4">
            {/* ¿Recojo disponible? */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.pickupDetail?.isHotelPickupAvailable || false
                  }
                  onChange={(e) =>
                    handlePickupChange(
                      'isHotelPickupAvailable',
                      e.target.checked,
                    )
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Recojo en hotel disponible
                </span>
              </label>
            </div>

            {formData.pickupDetail?.isHotelPickupAvailable && (
              <>
                {/* Radio de recojo */}
                <div>
                  <label
                    htmlFor="pickupRadius"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Radio de Recojo (km)
                  </label>
                  <input
                    type="number"
                    id="pickupRadius"
                    value={formData.pickupDetail?.pickupRadiusKm ?? ''}
                    onChange={(e) =>
                      handlePickupChange(
                        'pickupRadiusKm',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 5"
                  />
                </div>

                {/* Horario de recojo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="pickupStartTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hora Inicio de Recojo
                    </label>
                    <input
                      type="time"
                      id="pickupStartTime"
                      value={formData.pickupDetail?.pickupStartTime || ''}
                      onChange={(e) =>
                        handlePickupChange(
                          'pickupStartTime',
                          e.target.value || undefined,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pickupEndTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hora Fin de Recojo
                    </label>
                    <input
                      type="time"
                      id="pickupEndTime"
                      value={formData.pickupDetail?.pickupEndTime || ''}
                      onChange={(e) =>
                        handlePickupChange(
                          'pickupEndTime',
                          e.target.value || undefined,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Instrucciones */}
                <div>
                  <label
                    htmlFor="pickupInstructions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Instrucciones de Recojo
                  </label>
                  <textarea
                    id="pickupInstructions"
                    value={formData.pickupDetail?.instructions || ''}
                    onChange={(e) =>
                      handlePickupChange(
                        'instructions',
                        e.target.value || undefined,
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Por favor esperar en la recepción del hotel 10 minutos antes de la hora de recojo..."
                  />
                </div>
              </>
            )}
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
