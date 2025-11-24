'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PaymentFormProps {
  totalAmount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentForm({
  totalAmount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [identificationType, setIdentificationType] = useState('DNI');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [installments, setInstallments] = useState(1);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [issuerId, setIssuerId] = useState('');

  const [identificationTypes, setIdentificationTypes] = useState<any[]>([
    { id: 'DNI', name: 'DNI' },
    { id: 'CE', name: 'Carnet de Extranjería' },
    { id: 'RUC', name: 'RUC' },
  ]);
  const [mpInstance, setMpInstance] = useState<any>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

    if (!publicKey) {
      console.error('MercadoPago public key not configured');
      onPaymentError('Configuración de pago no disponible');
      return;
    }

    // Cargar SDK de forma oculta
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;

    script.onload = () => {
      const mp = new window.MercadoPago(publicKey);
      setMpInstance(mp);
      setSdkLoaded(true);

      // Obtener tipos de identificación de MercadoPago
      mp.getIdentificationTypes()
        .then((response: any) => {
          if (response && response.length > 0) {
            setIdentificationTypes(response);
            setIdentificationType(response[0].id);
          }
        })
        .catch(() => {
          // Si falla, usar los tipos por defecto
          console.log('Using default identification types');
        });
    };

    script.onerror = () => {
      console.error('Failed to load payment processor');
      onPaymentError('Error al cargar el procesador de pagos');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onPaymentError]);

  const handleCardNumberChange = async (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    setCardNumber(cleanValue);

    if (cleanValue.length >= 6 && mpInstance) {
      try {
        const bin = cleanValue.substring(0, 6);
        const paymentMethod = await mpInstance.getPaymentMethods({ bin });

        if (paymentMethod.results && paymentMethod.results.length > 0) {
          const method = paymentMethod.results[0];
          setPaymentMethodId(method.id);
          setIssuerId(method.issuer?.id || '');
        }
      } catch (error) {
        console.error('Error detecting card type:', error);
      }
    }
  };

  const createCardToken = async () => {
    if (!mpInstance) {
      throw new Error('Payment processor not ready');
    }

    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardholderName,
      cardExpirationMonth: expirationMonth,
      cardExpirationYear: expirationYear,
      securityCode,
      identificationType,
      identificationNumber,
    };

    try {
      const response = await mpInstance.createCardToken(cardData);
      return response.id;
    } catch (error) {
      console.error('Error tokenizing card:', error);
      throw new Error('Error al procesar la tarjeta');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!sdkLoaded || !mpInstance) {
        throw new Error(
          'El sistema de pago no está listo. Por favor intenta nuevamente.',
        );
      }

      const token = await createCardToken();

      const paymentData = {
        token,
        paymentMethodId,
        installments,
        issuerId,
        payer: {
          email,
          identification: {
            type: identificationType,
            number: identificationNumber,
          },
        },
      };

      onPaymentSuccess(paymentData);
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(
        error instanceof Error
          ? error.message
          : 'Error al procesar el pago. Por favor verifica los datos e intenta de nuevo.',
      );
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return (
      value
        .replace(/\s/g, '')
        .match(/.{1,4}/g)
        ?.join(' ') || value
    );
  };

  const getCardIcon = () => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return '💳 Visa';
    if (firstDigit === '5') return '💳 Mastercard';
    if (firstDigit === '3') return '💳 American Express';
    return '💳';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Información de pago
        </h3>

        {/* Número de tarjeta */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Número de tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatCardNumber(cardNumber)}
              onChange={(e) =>
                handleCardNumberChange(e.target.value.replace(/\s/g, ''))
              }
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {cardNumber.length > 0 && (
              <span className="absolute right-3 top-2.5 text-sm">
                {getCardIcon()}
              </span>
            )}
          </div>
        </div>

        {/* Nombre del titular */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre del titular
          </label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            placeholder="COMO APARECE EN LA TARJETA"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Fecha de vencimiento y CVV */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mes
            </label>
            <input
              type="text"
              value={expirationMonth}
              onChange={(e) =>
                setExpirationMonth(e.target.value.replace(/\D/g, ''))
              }
              placeholder="MM"
              maxLength={2}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Año
            </label>
            <input
              type="text"
              value={expirationYear}
              onChange={(e) =>
                setExpirationYear(e.target.value.replace(/\D/g, ''))
              }
              placeholder="YY"
              maxLength={2}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="password"
              value={securityCode}
              onChange={(e) =>
                setSecurityCode(e.target.value.replace(/\D/g, ''))
              }
              placeholder="123"
              maxLength={4}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ejemplo.com"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Tipo y número de documento */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tipo de documento
            </label>
            <select
              value={identificationType}
              onChange={(e) => setIdentificationType(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {identificationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Número de documento
            </label>
            <input
              type="text"
              value={identificationNumber}
              onChange={(e) =>
                setIdentificationNumber(e.target.value.replace(/\D/g, ''))
              }
              placeholder="12345678"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Cuotas */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Cuotas
          </label>
          <select
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value={1}>
              1 cuota - {currency} {totalAmount.toFixed(2)}
            </option>
            <option value={3}>
              3 cuotas - {currency} {(totalAmount / 3).toFixed(2)} c/u
            </option>
            <option value={6}>
              6 cuotas - {currency} {(totalAmount / 6).toFixed(2)} c/u
            </option>
            <option value={12}>
              12 cuotas - {currency} {(totalAmount / 12).toFixed(2)} c/u
            </option>
          </select>
        </div>

        {/* Total */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total a pagar:</span>
            <span className="text-2xl font-bold text-red-500">
              {currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !sdkLoaded}
        className="w-full rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-hover)] disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Procesando pago...
          </span>
        ) : !sdkLoaded ? (
          'Cargando...'
        ) : (
          `Pagar ${currency} ${totalAmount.toFixed(2)}`
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <span>🔒</span>
          <span>Pago seguro y encriptado</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Tus datos están protegidos</p>
      </div>
    </form>
  );
}
