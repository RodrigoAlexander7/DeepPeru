'use client';

import { useState } from 'react';
import { CreateTouristPackageDto } from '@/types/package';

interface ReviewFormProps {
  data: Partial<CreateTouristPackageDto>;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ReviewForm({
  data,
  onSubmit,
  onBack,
  isSubmitting,
}: ReviewFormProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      alert('Por favor confirme que los datos son correctos');
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revisión Final</h3>
        <p className="text-gray-600 mb-6">
          Revise cuidadosamente todos los datos antes de crear el paquete
          turístico.
        </p>

        {/* Información Básica */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-semibold text-gray-900 mb-3">
            📋 Información Básica
          </h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="font-medium text-gray-700">Nombre:</dt>
              <dd className="text-gray-900">{data.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Tipo:</dt>
              <dd className="text-gray-900">{data.type}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Dificultad:</dt>
              <dd className="text-gray-900">{data.difficulty}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Duración:</dt>
              <dd className="text-gray-900">{data.duration}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-medium text-gray-700">Descripción:</dt>
              <dd className="text-gray-900 mt-1">{data.description}</dd>
            </div>
          </dl>
        </div>

        {/* Detalles Operacionales */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-semibold text-gray-900 mb-3">
            ⚙️ Detalles Operacionales
          </h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {data.minParticipants && (
              <div>
                <dt className="font-medium text-gray-700">
                  Participantes Mínimo:
                </dt>
                <dd className="text-gray-900">{data.minParticipants}</dd>
              </div>
            )}
            {data.maxParticipants && (
              <div>
                <dt className="font-medium text-gray-700">
                  Participantes Máximo:
                </dt>
                <dd className="text-gray-900">{data.maxParticipants}</dd>
              </div>
            )}
            {data.minAge && (
              <div>
                <dt className="font-medium text-gray-700">Edad Mínima:</dt>
                <dd className="text-gray-900">{data.minAge} años</dd>
              </div>
            )}
            {data.maxAge && (
              <div>
                <dt className="font-medium text-gray-700">Edad Máxima:</dt>
                <dd className="text-gray-900">{data.maxAge} años</dd>
              </div>
            )}
            {data.meetingPoint && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-700">
                  Punto de Encuentro:
                </dt>
                <dd className="text-gray-900">{data.meetingPoint}</dd>
              </div>
            )}
            {data.endPoint && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-700">
                  Punto de Finalización:
                </dt>
                <dd className="text-gray-900">{data.endPoint}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Requisitos */}
        {data.requirements && data.requirements.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">✅ Requisitos</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
              {data.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Incluido/Excluido */}
        {((data.includedItems && data.includedItems.length > 0) ||
          (data.excludedItems && data.excludedItems.length > 0)) && (
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">
              📦 Incluido / Excluido
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.includedItems && data.includedItems.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-green-700 mb-2">
                    ✓ Incluido:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
                    {data.includedItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.excludedItems && data.excludedItems.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-red-700 mb-2">
                    ✗ No Incluido:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
                    {data.excludedItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Precios */}
        {data.pricingOptions && data.pricingOptions.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">
              💰 Opciones de Precio
            </h4>
            <div className="space-y-2">
              {data.pricingOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 p-3 rounded border border-blue-200 text-sm"
                >
                  <div className="font-medium text-gray-900">{option.name}</div>
                  <div className="text-gray-700 mt-1">
                    Monto: {option.amount} |{' '}
                    {option.perPerson ? 'Por persona' : 'Por grupo'}
                  </div>
                  {option.description && (
                    <div className="text-gray-600 text-xs mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actividades */}
        {data.activities && data.activities.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">🎯 Actividades</h4>
            <div className="space-y-2">
              {data.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 p-3 rounded border border-green-200 text-sm"
                >
                  <div className="font-medium text-gray-900">
                    {activity.name || `Actividad ${idx + 1}`}
                  </div>
                  <div className="text-gray-700 text-xs mt-1">
                    Fechas: {activity.startDate} → {activity.endDate}
                  </div>
                  {activity.schedules && activity.schedules.length > 0 && (
                    <div className="text-gray-600 text-xs mt-1">
                      {activity.schedules.length} horario(s) configurado(s)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beneficios */}
        {data.benefits && data.benefits.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">🎁 Beneficios</h4>
            <div className="space-y-2">
              {data.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {benefit.title}
                    </div>
                    {benefit.text && (
                      <div className="text-gray-600 text-xs">
                        {benefit.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recojo */}
        {data.pickupDetail?.isHotelPickupAvailable && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              🚗 Recojo en Hotel
            </h4>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm">
              <div className="text-gray-900">✓ Recojo en hotel disponible</div>
              {data.pickupDetail.pickupRadiusKm && (
                <div className="text-gray-700 text-xs mt-1">
                  Radio: {data.pickupDetail.pickupRadiusKm} km
                </div>
              )}
              {(data.pickupDetail.pickupStartTime ||
                data.pickupDetail.pickupEndTime) && (
                <div className="text-gray-700 text-xs mt-1">
                  Horario: {data.pickupDetail.pickupStartTime || '...'} -{' '}
                  {data.pickupDetail.pickupEndTime || '...'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmación */}
        <div className="mt-6 pt-6 border-t">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Confirmo que he revisado todos los datos y son correctos. Entiendo
              que una vez creado el paquete, podré editarlo posteriormente si es
              necesario.
            </span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !confirmed}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creando...' : 'Crear Paquete'}
        </button>
      </div>
    </form>
  );
}
