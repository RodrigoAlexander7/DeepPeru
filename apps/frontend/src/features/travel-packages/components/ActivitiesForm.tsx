'use client';

import { useState, useEffect } from 'react';
import {
  CreateActivityDto,
  CreateScheduleDto,
  CreateFeatureDto,
  Activity,
  City,
  DayOfWeek,
} from '@/types/package';
import {
  getActivities,
  getCities,
} from '@/features/travel-packages/services/packageService';

export interface ActivitiesData {
  representativeCityId?: number;
  activities: CreateActivityDto[];
}

interface ActivitiesFormProps {
  initialData: ActivitiesData;
  onNext: (data: ActivitiesData) => void;
  onBack: () => void;
}

const daysOfWeek = [
  { value: DayOfWeek.SUN, label: 'Domingo' },
  { value: DayOfWeek.MON, label: 'Lunes' },
  { value: DayOfWeek.TUE, label: 'Martes' },
  { value: DayOfWeek.WED, label: 'Miércoles' },
  { value: DayOfWeek.THU, label: 'Jueves' },
  { value: DayOfWeek.FRI, label: 'Viernes' },
  { value: DayOfWeek.SAT, label: 'Sábado' },
];

export default function ActivitiesForm({
  initialData,
  onNext,
  onBack,
}: ActivitiesFormProps) {
  const [formData, setFormData] = useState<ActivitiesData>(initialData);
  const [cities, setCities] = useState<City[]>([]);
  const [existingActivities, setExistingActivities] = useState<Activity[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityType, setActivityType] = useState<'existing' | 'new'>(
    'existing',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [currentActivity, setCurrentActivity] = useState<CreateActivityDto>({
    activityId: undefined,
    name: '',
    description: '',
    destinationCityId: undefined,
    startDate: '',
    endDate: '',
    schedules: [],
    features: [],
  });

  const [currentSchedule, setCurrentSchedule] = useState<CreateScheduleDto>({
    timezone: 'America/Lima',
    daysOfWeek: [],
    startTime: '',
    endTime: '',
    notes: '',
  });

  const [currentFeature, setCurrentFeature] = useState<CreateFeatureDto>({
    category: '',
    iconUrl: '',
    name: '',
    description: '',
    order: 0,
  });

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showFeatureForm, setShowFeatureForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, activitiesData] = await Promise.all([
          getCities(),
          getActivities(),
        ]);
        setCities(citiesData);
        setExistingActivities(activitiesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  const validateActivity = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (activityType === 'existing' && !currentActivity.activityId) {
      newErrors.activityId = 'Seleccione una actividad';
    }

    if (activityType === 'new' && !currentActivity.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!currentActivity.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!currentActivity.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }

    if (
      currentActivity.startDate &&
      currentActivity.endDate &&
      new Date(currentActivity.startDate) > new Date(currentActivity.endDate)
    ) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addActivity = () => {
    if (validateActivity()) {
      setFormData((prev) => ({
        ...prev,
        activities: [...prev.activities, currentActivity],
      }));
      resetActivityForm();
      setShowActivityForm(false);
      setErrors({});
    }
  };

  const removeActivity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  const resetActivityForm = () => {
    setCurrentActivity({
      activityId: undefined,
      name: '',
      description: '',
      destinationCityId: undefined,
      startDate: '',
      endDate: '',
      schedules: [],
      features: [],
    });
    setActivityType('existing');
  };

  const addSchedule = () => {
    if (!currentSchedule.startTime) {
      alert('La hora de inicio es requerida');
      return;
    }
    if (currentSchedule.daysOfWeek.length === 0) {
      alert('Seleccione al menos un día');
      return;
    }

    setCurrentActivity((prev) => ({
      ...prev,
      schedules: [...(prev.schedules || []), currentSchedule],
    }));
    setCurrentSchedule({
      timezone: 'America/Lima',
      daysOfWeek: [],
      startTime: '',
      endTime: '',
      notes: '',
    });
    setShowScheduleForm(false);
  };

  const removeSchedule = (index: number) => {
    setCurrentActivity((prev) => ({
      ...prev,
      schedules: prev.schedules?.filter((_, i) => i !== index) || [],
    }));
  };

  const addFeature = () => {
    if (!currentFeature.name.trim()) {
      alert('El nombre de la característica es requerido');
      return;
    }

    setCurrentActivity((prev) => ({
      ...prev,
      features: [...(prev.features || []), currentFeature],
    }));
    setCurrentFeature({
      category: '',
      iconUrl: '',
      name: '',
      description: '',
      order: 0,
    });
    setShowFeatureForm(false);
  };

  const removeFeature = (index: number) => {
    setCurrentActivity((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const toggleDay = (day: DayOfWeek) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.activities.length === 0) {
      alert('Debe agregar al menos una actividad');
      return;
    }
    onNext(formData);
  };

  const getActivityName = (activity: CreateActivityDto): string => {
    if (activity.activityId) {
      const existing = existingActivities.find(
        (a) => a.id === activity.activityId,
      );
      return existing?.name || 'Actividad';
    }
    return activity.name || 'Nueva Actividad';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Actividades del Paquete</h3>

        {/* Ciudad Representativa */}
        <div className="mb-6">
          <label
            htmlFor="representativeCityId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ciudad Representativa del Paquete
          </label>
          <select
            id="representativeCityId"
            value={formData.representativeCityId || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                representativeCityId: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar ciudad...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de actividades agregadas */}
        {formData.activities.length > 0 && (
          <div className="mb-6 space-y-3">
            {formData.activities.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {getActivityName(activity)}
                    </h4>
                    {activity.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Fechas:</span>{' '}
                      {activity.startDate} → {activity.endDate}
                    </div>
                    {activity.schedules && activity.schedules.length > 0 && (
                      <div className="mt-1 text-sm text-gray-600">
                        {activity.schedules.length} horario(s) configurado(s)
                      </div>
                    )}
                    {activity.features && activity.features.length > 0 && (
                      <div className="mt-1 text-sm text-gray-600">
                        {activity.features.length} característica(s)
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeActivity(index)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para agregar actividad */}
        {!showActivityForm && (
          <button
            type="button"
            onClick={() => setShowActivityForm(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition"
          >
            + Agregar Actividad
          </button>
        )}

        {/* Formulario de actividad */}
        {showActivityForm && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-4">
            <h4 className="font-medium text-gray-900">Nueva Actividad</h4>

            {/* Tipo de actividad */}
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={activityType === 'existing'}
                  onChange={() => setActivityType('existing')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Seleccionar Existente
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={activityType === 'new'}
                  onChange={() => setActivityType('new')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Crear Nueva</span>
              </label>
            </div>

            {activityType === 'existing' && (
              <div>
                <label
                  htmlFor="activityId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Actividad <span className="text-red-500">*</span>
                </label>
                <select
                  id="activityId"
                  value={currentActivity.activityId || ''}
                  onChange={(e) =>
                    setCurrentActivity((prev) => ({
                      ...prev,
                      activityId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.activityId ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Seleccionar actividad...</option>
                  {existingActivities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
                {errors.activityId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.activityId}
                  </p>
                )}
              </div>
            )}

            {activityType === 'new' && (
              <>
                <div>
                  <label
                    htmlFor="activityName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="activityName"
                    value={currentActivity.name || ''}
                    onChange={(e) =>
                      setCurrentActivity((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Nombre de la actividad"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="activityDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="activityDescription"
                    value={currentActivity.description || ''}
                    onChange={(e) =>
                      setCurrentActivity((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción de la actividad"
                  />
                </div>

                <div>
                  <label
                    htmlFor="destinationCityId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ciudad de Destino
                  </label>
                  <select
                    id="destinationCityId"
                    value={currentActivity.destinationCityId || ''}
                    onChange={(e) =>
                      setCurrentActivity((prev) => ({
                        ...prev,
                        destinationCityId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar ciudad...</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={currentActivity.startDate}
                  onChange={(e) =>
                    setCurrentActivity((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={currentActivity.endDate}
                  onChange={(e) =>
                    setCurrentActivity((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Horarios */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Horarios
                </label>
                {!showScheduleForm && (
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Agregar horario
                  </button>
                )}
              </div>

              {currentActivity.schedules &&
                currentActivity.schedules.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {currentActivity.schedules.map((schedule, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded border text-sm flex justify-between items-start"
                      >
                        <div>
                          <div>
                            <strong>Días:</strong>{' '}
                            {schedule.daysOfWeek.join(', ')}
                          </div>
                          <div>
                            <strong>Hora:</strong> {schedule.startTime} -{' '}
                            {schedule.endTime || 'N/A'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSchedule(idx)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              {showScheduleForm && (
                <div className="bg-white p-3 rounded border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700">
                        Hora inicio
                      </label>
                      <input
                        type="time"
                        value={currentSchedule.startTime}
                        onChange={(e) =>
                          setCurrentSchedule((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">
                        Hora fin
                      </label>
                      <input
                        type="time"
                        value={currentSchedule.endTime || ''}
                        onChange={(e) =>
                          setCurrentSchedule((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Días
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`px-2 py-1 text-xs rounded ${currentSchedule.daysOfWeek.includes(day.value)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowScheduleForm(false)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={addSchedule}
                      className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Características */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Características
                </label>
                {!showFeatureForm && (
                  <button
                    type="button"
                    onClick={() => setShowFeatureForm(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Agregar característica
                  </button>
                )}
              </div>

              {currentActivity.features &&
                currentActivity.features.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {currentActivity.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded border text-sm flex justify-between items-start"
                      >
                        <div>
                          <strong>{feature.name}</strong>
                          {feature.description && (
                            <div className="text-xs text-gray-600">
                              {feature.description}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              {showFeatureForm && (
                <div className="bg-white p-3 rounded border space-y-2">
                  <input
                    type="text"
                    value={currentFeature.name}
                    onChange={(e) =>
                      setCurrentFeature((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Nombre de la característica"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={currentFeature.description || ''}
                    onChange={(e) =>
                      setCurrentFeature((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Descripción"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFeatureForm(false)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowActivityForm(false);
                  resetActivityForm();
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addActivity}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Agregar Actividad
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
