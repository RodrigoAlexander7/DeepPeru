import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions/auth';
import BecomeOperatorStepper from '@/features/companies/components/BecomeOperatorStepper';

export default async function BecomeOperatorPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conviértete en Operador Turístico
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Completa el registro para crear tu empresa turística y comenzar a
            ofrecer paquetes turísticos a miles de viajeros.
          </p>
        </div>

        {/* Stepper Component */}
        <BecomeOperatorStepper userEmail={user.email} />

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Qué obtendrás como operador?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
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
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Panel de Gestión
                </h4>
                <p className="text-sm text-gray-600">
                  Administra tus paquetes turísticos desde un dashboard
                  intuitivo
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
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
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Visibilidad
                </h4>
                <p className="text-sm text-gray-600">
                  Tu empresa será visible para miles de potenciales clientes
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
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
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Gestión de Equipo
                </h4>
                <p className="text-sm text-gray-600">
                  Agrega trabajadores y asigna permisos según sus roles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
