'use client';

import { useState } from 'react';
import { useCancelBooking } from '@/features/user-dashboard/hooks/useCancelBooking';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  cancellationPolicy: string;
  onSuccess: () => void;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  cancellationPolicy,
  onSuccess,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState('');
  const { cancelBooking, loading, error } = useCancelBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await cancelBooking(bookingId, reason ? { reason } : undefined);
      onSuccess();
      onClose();
      setReason('');
    } catch (err) {
      // Error ya está manejado por el hook
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Cancelar Reserva</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Advertencia */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Política de Cancelación
              </p>
              <p className="text-sm text-yellow-700">{cancellationPolicy}</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Motivo de cancelación (opcional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              rows={4}
              maxLength={500}
              placeholder="Cuéntanos por qué cancelas tu reserva..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/500 caracteres
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Cancelando...</span>
                </>
              ) : (
                'Confirmar Cancelación'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
