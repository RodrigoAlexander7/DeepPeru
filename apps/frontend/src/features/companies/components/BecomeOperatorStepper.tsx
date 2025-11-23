'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OperatorForm from './OperatorForm';
import CompanyForm from './CompanyForm';
import MercadoPagoConnect from './MercadoPagoConnect';
import type { CompanyAdminData, CreateCompanyDto } from '@/types/company';
import { createCompany } from '../services/companyService';

interface BecomeOperatorStepperProps {
  userEmail: string;
}

type Step = 1 | 2 | 3 | 4;

export default function BecomeOperatorStepper({
  userEmail,
}: BecomeOperatorStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [operatorData, setOperatorData] = useState<CompanyAdminData | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCompanyId, setCreatedCompanyId] = useState<number | null>(null);

  const handleOperatorSubmit = (data: CompanyAdminData) => {
    setOperatorData(data);
    setCurrentStep(2);
  };

  const handleCompanySubmit = async (companyData: {
    name: string;
    legalName: string;
    registrationNumber: string;
    email: string;
    phone: string;
    websiteUrl: string;
    logoUrl: string;
    registerDate: string;
  }) => {
    if (!operatorData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const createCompanyDto: CreateCompanyDto = {
        name: companyData.name,
        legalName: companyData.legalName.trim() || undefined,
        registrationNumber: companyData.registrationNumber.trim() || undefined,
        email: companyData.email,
        phone: companyData.phone,
        websiteUrl: companyData.websiteUrl.trim() || undefined,
        logoUrl: companyData.logoUrl.trim() || undefined,
        registerDate: new Date(companyData.registerDate).toISOString(),
        languageId: 4, // Español por defecto
        adminData: {
          ...operatorData,
          dateOfBirth: new Date(operatorData.dateOfBirth).toISOString(),
        },
      };

      console.log('Creating company with data:', createCompanyDto);
      const createdCompany = await createCompany(createCompanyDto);

      // Guardar el ID de la empresa creada
      setCreatedCompanyId(createdCompany.id);

      // Ir al paso de conexión de MercadoPago
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Error creating company:', err);
      console.error('Error details:', err.response?.data);
      setError(
        err.response?.data?.message ||
          'Error al crear la empresa. Por favor, verifica los datos e intenta nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipMercadoPago = () => {
    setCurrentStep(4);
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const handleMercadoPagoConnected = () => {
    setCurrentStep(4);
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 1
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {currentStep > 1 ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                '1'
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                Paso 1
              </p>
              <p className="text-xs text-gray-500">Datos del Operador</p>
            </div>
          </div>

          {/* Line */}
          <div
            className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}
          />

          {/* Step 2 */}
          <div className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 2
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {currentStep > 2 ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                '2'
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                Paso 2
              </p>
              <p className="text-xs text-gray-500">Datos de la Empresa</p>
            </div>
          </div>

          {/* Line */}
          <div
            className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}
          />

          {/* Step 3 */}
          <div className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 3
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {currentStep > 3 ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                '3'
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                Paso 3
              </p>
              <p className="text-xs text-gray-500">Configurar Pagos</p>
            </div>
          </div>

          {/* Line */}
          <div
            className={`flex-1 h-1 mx-4 ${currentStep >= 4 ? 'bg-green-600' : 'bg-gray-300'}`}
          />

          {/* Step 4 */}
          <div className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 4
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {currentStep >= 4 ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                '4'
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${currentStep >= 4 ? 'text-green-600' : 'text-gray-500'}`}
              >
                Paso 4
              </p>
              <p className="text-xs text-gray-500">Completado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {currentStep === 1 && (
          <OperatorForm
            onSubmit={handleOperatorSubmit}
            initialData={operatorData || undefined}
            userEmail={userEmail}
          />
        )}

        {currentStep === 2 && (
          <CompanyForm
            onSubmit={handleCompanySubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 3 && createdCompanyId && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Empresa Creada!
              </h2>
              <p className="text-gray-600">
                Ahora configura tu método de pago para recibir transferencias
              </p>
            </div>

            <MercadoPagoConnect
              companyId={createdCompanyId}
              onConnectionChange={handleMercadoPagoConnected}
            />

            <div className="flex justify-between pt-6 border-t">
              <button
                type="button"
                onClick={handleSkipMercadoPago}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Omitir por ahora
              </button>
              <p className="text-sm text-gray-500 self-center">
                Podrás configurar esto más tarde en la configuración de la
                empresa
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Todo Listo!
            </h2>
            <p className="text-gray-600 mb-2">
              Tu empresa ha sido registrada correctamente.
            </p>
            <p className="text-gray-600 mb-8">
              Ahora eres un operador turístico verificado.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg
                className="animate-spin h-5 w-5"
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
              <span>Redirigiendo al dashboard...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
