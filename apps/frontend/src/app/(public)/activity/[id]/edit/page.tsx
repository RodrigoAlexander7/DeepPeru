'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';
import { activityService } from '@/features/activity/activityService';
import type { Activity, UpdateActivityDto } from '@/types/Activity';

const DAYS_OF_WEEK = [
  { value: 'MON', label: 'Lunes' },
  { value: 'TUE', label: 'Martes' },
  { value: 'WED', label: 'Miércoles' },
  { value: 'THU', label: 'Jueves' },
  { value: 'FRI', label: 'Viernes' },
  { value: 'SAT', label: 'Sábado' },
  { value: 'SUN', label: 'Domingo' },
];

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destinationCityId: '',
  });

  const [schedules, setSchedules] = useState([
    {
      timezone: 'America/Lima',
      daysOfWeek: [] as string[],
      startTime: '',
      endTime: '',
      notes: '',
    },
  ]);

  const [features, setFeatures] = useState([
    {
      category: '',
      iconUrl: '',
      name: '',
      description: '',
    },
  ]);

  useEffect(() => {
    if (activityId) {
      loadActivity();
    }
  }, [activityId]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activity = await activityService.getActivityById(activityId);

      setFormData({
        name: activity.name,
        description: activity.description || '',
        destinationCityId: String(activity.destinationCityId),
      });

      if (activity.schedules && activity.schedules.length > 0) {
        setSchedules(
          activity.schedules.map((s) => ({
            timezone: s.timezone,
            daysOfWeek: s.daysOfWeek,
            startTime: s.startTime,
            endTime: s.endTime || '',
            notes: s.notes || '',
          })),
        );
      }

      if (activity.features && activity.features.length > 0) {
        setFeatures(
          activity.features.map((f) => ({
            category: f.category || '',
            iconUrl: f.iconUrl || '',
            name: f.name,
            description: f.description || '',
          })),
        );
      }
    } catch (err) {
      setError('Error al cargar la actividad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleChange = (index: number, field: string, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  const handleDayToggle = (index: number, day: string) => {
    const newSchedules = [...schedules];
    const currentDays = newSchedules[index].daysOfWeek;
    if (currentDays.includes(day)) {
      newSchedules[index].daysOfWeek = currentDays.filter((d) => d !== day);
    } else {
      newSchedules[index].daysOfWeek = [...currentDays, day];
    }
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        timezone: 'America/Lima',
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        notes: '',
      },
    ]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        category: '',
        iconUrl: '',
        name: '',
        description: '',
      },
    ]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.destinationCityId) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setSaving(true);

      const dto: UpdateActivityDto = {
        name: formData.name,
        description: formData.description || undefined,
        destinationCityId: Number(formData.destinationCityId),
        schedules: schedules
          .filter((s) => s.daysOfWeek.length > 0 && s.startTime)
          .map((s) => ({
            timezone: s.timezone,
            daysOfWeek: s.daysOfWeek as any[],
            startTime: s.startTime,
            endTime: s.endTime || undefined,
            notes: s.notes || undefined,
          })),
        features: features
          .filter((f) => f.name)
          .map((f) => ({
            category: f.category || undefined,
            iconUrl: f.iconUrl || undefined,
            name: f.name,
            description: f.description || undefined,
          })),
      };

      await activityService.updateActivity(activityId, dto);
      router.push(`/activity/${activityId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al actualizar la actividad',
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Editar Actividad</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información Básica
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Actividad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID de Ciudad de Destino *
                  </label>
                  <input
                    type="number"
                    name="destinationCityId"
                    value={formData.destinationCityId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Horarios</h2>
                <button
                  type="button"
                  onClick={addSchedule}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Agregar Horario
                </button>
              </div>

              <div className="space-y-4">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">
                        Horario {index + 1}
                      </h3>
                      {schedules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSchedule(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Días de la semana
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DAYS_OF_WEEK.map((day) => (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => handleDayToggle(index, day.value)}
                              className={`px-3 py-1 rounded-lg text-sm ${
                                schedule.daysOfWeek.includes(day.value)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora inicio
                          </label>
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'startTime',
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora fin
                          </label>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'endTime',
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas
                        </label>
                        <input
                          type="text"
                          value={schedule.notes}
                          onChange={(e) =>
                            handleScheduleChange(index, 'notes', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Características */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Características
                </h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Agregar Característica
                </button>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">
                        Característica {index + 1}
                      </h3>
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={feature.name}
                          onChange={(e) =>
                            handleFeatureChange(index, 'name', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <input
                          type="text"
                          value={feature.category}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              'category',
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link
                href={`/activity/${activityId}`}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg text-center transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
