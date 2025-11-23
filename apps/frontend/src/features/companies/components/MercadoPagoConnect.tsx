'use client';

import { useState, useEffect } from 'react';

interface MercadoPagoConnectProps {
  companyId?: number;
  onConnectionChange?: (connected: boolean) => void;
}

export default function MercadoPagoConnect({
  companyId,
  onConnectionChange,
}: MercadoPagoConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mpStatus = urlParams.get('mp_status');
    const mpError = urlParams.get('mp_error');

    if (mpStatus === 'success') {
      setIsConnected(true);
      onConnectionChange?.(true);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (mpStatus === 'error') {
      alert(`Error al conectar MercadoPago: ${mpError || 'Desconocido'}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [onConnectionChange]);

  const handleConnect = () => {
    if (!companyId) {
      alert('Primero debes crear la empresa antes de conectar MercadoPago');
      return;
    }

    setIsLoading(true);
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3000';
    window.location.href = `${backendUrl}/auth/mercadopago/connect?companyId=${companyId}`;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start">
        <div className="shrink-0">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Conexión con MercadoPago
          </h4>
          <p className="text-sm text-blue-800 mb-4">
            Conecta tu cuenta de MercadoPago para recibir pagos con marcado
            (comisión de plataforma). Esto permite que DeepPeru procese pagos y
            te transfiera automáticamente tu parte.
          </p>

          {isConnected ? (
            <div className="flex items-center text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                Cuenta conectada exitosamente
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isLoading || !companyId}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Conectando...
                </>
              ) : (
                <>
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Conectar MercadoPago
                </>
              )}
            </button>
          )}

          {!companyId && (
            <p className="mt-2 text-xs text-blue-600">
              💡 Podrás conectar MercadoPago después de crear la empresa
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
