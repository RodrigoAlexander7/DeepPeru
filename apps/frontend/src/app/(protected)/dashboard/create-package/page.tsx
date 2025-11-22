import { redirect } from 'next/navigation';
import { getUserCompanies } from '@/features/companies/services/companyService';
import CreatePackageStepper from '@/features/packages/components/CreatePackageStepper';

export default async function CreatePackagePage() {
  let companies;

  try {
    companies = await getUserCompanies();
  } catch (error) {
    console.error('Error al obtener empresa:', error);
    redirect('/dashboard');
  }

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
