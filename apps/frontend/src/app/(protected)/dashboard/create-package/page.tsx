import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { api } from '@/lib/apis';
import CreatePackageStepper from '@/features/travel-packages/components/CreatePackageStepper';
import type { Company } from '@/types/company';

async function getUserCompaniesServer(): Promise<Company[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return [];
  }

  try {
    const response = await api.get<Company[]>('/companies', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    return [];
  }
}

export default async function CreatePackagePage() {
  const companies = await getUserCompaniesServer();

  if (!companies || companies.length === 0) {
    redirect('/become-operator');
  }

  const company = companies[0]; // El usuario solo tiene una empresa

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Crear Nuevo Paquete Turístico
          </h1>
          <p className="text-gray-600 mt-2">
            Complete todos los pasos para crear un paquete turístico para{' '}
            {company.name}
          </p>
        </div>

        <CreatePackageStepper companyId={company.id} />
      </div>
    </div>
  );
}
