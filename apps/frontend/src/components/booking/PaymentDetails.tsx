// src/components/booking/PaymentDetails.tsx

import React, { useEffect, useState } from 'react';
import { BookingFormData } from '@/types/booking';

interface PaymentDetailsProps {
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  totalPrice: number;
  cancellationPolicy: string;
  packageName: string;
}

export default function PaymentDetails({
  formData,
  onUpdate,
  onBack,
  onSubmit,
  totalPrice,
  cancellationPolicy,
  packageName,
}: PaymentDetailsProps) {
  const [promoCodeLocal, setPromoCodeLocal] = useState(
    formData.promoCode || '',
  );
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  useEffect(() => {
    // Mantener sincronizado el promo local con lo que venga desde formData
    setPromoCodeLocal(formData.promoCode || '');
  }, [formData.promoCode]);

  const handleApplyPromo = () => {
    // Aquí solo guardamos el código en el state del formulario.
    // Si quieres validarlo contra el backend, reemplaza esta lógica
    // por una llamada a validatePromoCode(...) en bookingService.
    if (!promoCodeLocal.trim()) {
      setPromoMessage('Introduce un código promocional válido.');
      onUpdate({ promoCode: '' });
      return;
    }

    onUpdate({ promoCode: promoCodeLocal.trim() });
    setPromoMessage(`Código "${promoCodeLocal.trim()}" aplicado.`);
  };

  const handleRemovePromo = () => {
    setPromoCodeLocal('');
    onUpdate({ promoCode: '' });
    setPromoMessage('Código eliminado.');
  };

  const handleWhatsAppPayment = () => {
    // Construir mensaje de WhatsApp con los detalles de la reserva
    const message = `
🎫 *NUEVA RESERVA - DeepPeru*

📦 *Paquete:* ${packageName}

👤 *Datos del Cliente:*
- Nombre: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Teléfono: ${formData.countryCode}${formData.phone}

👥 *Viajeros:* ${formData.travelers.length} persona(s)
${formData.travelers.map((t, i) => `  ${i + 1}. ${t.firstName} ${t.lastName}`).join('\n')}

📍 *Punto de recogida:* ${formData.pickupLocation || 'No especificado'}
🗣️ *Idioma del tour:* ${formData.tourLanguage}

💰 *Total a pagar:* S/ ${totalPrice.toFixed(2)}
💳 *Opción de pago:* ${formData.paymentOption === 'now' ? 'Pagar ahora' : 'Pagar después'}

${formData.promoCode ? `🎁 *Código promocional:* ${formData.promoCode}` : ''}
    `.trim();

    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`;
    // Abrir WhatsApp y luego proceder con la acción de submit (guardar/confirmar)
    window.open(whatsappUrl, '_blank');
    onSubmit();
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      {/* Opción de pago */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-gray-900">
          Elegir opción de pago
        </h3>

        <div className="space-y-3">
          {/* Reservar ahora */}
          <label className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-gray-300 p-4 hover:border-red-500">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentOption"
                value="now"
                checked={formData.paymentOption === 'now'}
                onChange={(e) =>
                  onUpdate({ paymentOption: e.target.value as 'now' | 'later' })
                }
                className="h-4 w-4 text-red-500 focus:ring-red-500"
              />
              <span className="ml-3 font-medium text-gray-900">
                Reservar ahora
              </span>
            </div>
            <span className="font-semibold text-gray-900">
              S/ {totalPrice.toFixed(2)}
            </span>
          </label>

          {/* Reservar ahora, pagar después */}
          <label className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-gray-300 p-4 hover:border-red-500">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentOption"
                value="later"
                checked={formData.paymentOption === 'later'}
                onChange={(e) =>
                  onUpdate({ paymentOption: e.target.value as 'now' | 'later' })
                }
                className="h-4 w-4 text-red-500 focus:ring-red-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">
                  Reservar ahora, pagar después
                </div>
                <div className="text-sm text-gray-600">
                  Paga en destino o mediante indicaciones del proveedor.
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-600">Pagar después</span>
          </label>
        </div>
      </div>

      {/* Promo code */}
      <div className="mb-6">
        <h3 className="mb-3 font-semibold text-gray-900">
          ¿Tienes un código promocional?
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCodeLocal}
            onChange={(e) => setPromoCodeLocal(e.target.value)}
            placeholder="Introduce tu código"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="rounded-full bg-[var(--primary)] px-4 py-2 font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            Aplicar
          </button>
          {formData.promoCode && (
            <button
              type="button"
              onClick={handleRemovePromo}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Quitar
            </button>
          )}
        </div>
        {promoMessage && (
          <p className="mt-2 text-sm text-gray-600">{promoMessage}</p>
        )}
      </div>

      {/* Resumen y política */}
      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              S/ {totalPrice.toFixed(2)}
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>{cancellationPolicy}</div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>

        <div className="flex items-center gap-3">
          {/* Pago por WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppPayment}
            className="rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            Pagar por WhatsApp
          </button>

          {/* Finalizar sin pago (solo crear la reserva) */}
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Finalizar reserva
          </button>
        </div>
      </div>
    </div>
  );
}
