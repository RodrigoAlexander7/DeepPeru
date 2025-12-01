'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreateTouristPackageDto,
  PackageType,
  DifficultyLevel,
} from '@/types/package';
import { createTouristPackage } from '@/features/travel-packages/services/packageService';
import BasicInfoForm, { BasicInfoData } from './BasicInfoForm';
import OperationalDetailsForm, {
  OperationalDetailsData,
} from './OperationalDetailsForm';
import RequirementsForm, { RequirementsData } from './RequirementsForm';
import PricingForm, { PricingData } from './PricingForm';
import ActivitiesForm, { ActivitiesData } from './ActivitiesForm';
import BenefitsPickupForm, { BenefitsPickupData } from './BenefitsPickupForm';
import ReviewForm from './ReviewForm';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'success';

const steps = [
  { number: 1, title: 'Información Básica' },
  { number: 2, title: 'Detalles Operacionales' },
  { number: 3, title: 'Requisitos y Seguridad' },
  { number: 4, title: 'Precios' },
  { number: 5, title: 'Actividades' },
  { number: 6, title: 'Beneficios y Recojo' },
  { number: 7, title: 'Revisión Final' },
];

interface PackageData {
  basicInfo: BasicInfoData;
  operationalDetails: OperationalDetailsData;
  requirements: RequirementsData;
  pricing: PricingData;
  activities: ActivitiesData;
  benefitsPickup: BenefitsPickupData;
}

export default function CreatePackageStepper({
  companyId,
}: {
  companyId: number;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [packageData, setPackageData] = useState<PackageData>({
    basicInfo: {
      name: '',
      description: '',
      duration: '',
      type: PackageType.GROUP,
      difficulty: DifficultyLevel.MODERATE,
      languageId: undefined,
    },
    operationalDetails: {
      minAge: undefined,
      maxAge: undefined,
      minParticipants: undefined,
      maxParticipants: undefined,
      meetingPoint: undefined,
      meetingLatitude: undefined,
      meetingLongitude: undefined,
      endPoint: undefined,
      endLatitude: undefined,
      endLongitude: undefined,
      timezone: undefined,
      bookingCutoff: undefined,
      cancellationPolicy: undefined,
    },
    requirements: {
      requirements: [],
      safetyInfo: undefined,
      additionalInfo: undefined,
      includedItems: [],
      excludedItems: [],
      accessibilityOptions: [],
    },
    pricing: {
      pricingOptions: [],
    },
    activities: {
      representativeCityId: undefined,
      activities: [],
    },
    benefitsPickup: {
      benefits: [],
      pickupDetail: undefined,
    },
  });

  const handleBasicInfoNext = (data: BasicInfoData) => {
    setPackageData((prev) => ({ ...prev, basicInfo: data }));
    setCurrentStep(2);
  };

  const handleOperationalDetailsNext = (data: OperationalDetailsData) => {
    setPackageData((prev) => ({ ...prev, operationalDetails: data }));
    setCurrentStep(3);
  };

  const handleRequirementsNext = (data: RequirementsData) => {
    setPackageData((prev) => ({ ...prev, requirements: data }));
    setCurrentStep(4);
  };

  const handlePricingNext = (data: PricingData) => {
    setPackageData((prev) => ({ ...prev, pricing: data }));
    setCurrentStep(5);
  };

  const handleActivitiesNext = (data: ActivitiesData) => {
    setPackageData((prev) => ({ ...prev, activities: data }));
    setCurrentStep(6);
  };

  const handleBenefitsPickupNext = (data: BenefitsPickupData) => {
    setPackageData((prev) => ({ ...prev, benefitsPickup: data }));
    setCurrentStep(7);
  };

  const handleFinalSubmit = async () => {
    if (typeof window === 'undefined') return;

    setIsSubmitting(true);
    setError(null);

    try {
      const dto: CreateTouristPackageDto = {
        companyId,
        name: packageData.basicInfo.name,
        description: packageData.basicInfo.description || undefined,
        duration: packageData.basicInfo.duration || undefined,
        type: packageData.basicInfo.type,
        difficulty: packageData.basicInfo.difficulty || undefined,
        languageId: packageData.basicInfo.languageId,
        minAge: packageData.operationalDetails.minAge,
        maxAge: packageData.operationalDetails.maxAge,
        minParticipants: packageData.operationalDetails.minParticipants,
        maxParticipants: packageData.operationalDetails.maxParticipants,
        meetingPoint: packageData.operationalDetails.meetingPoint,
        meetingLatitude: packageData.operationalDetails.meetingLatitude,
        meetingLongitude: packageData.operationalDetails.meetingLongitude,
        endPoint: packageData.operationalDetails.endPoint,
        endLatitude: packageData.operationalDetails.endLatitude,
        endLongitude: packageData.operationalDetails.endLongitude,
        timezone: packageData.operationalDetails.timezone,
        bookingCutoff: packageData.operationalDetails.bookingCutoff,
        cancellationPolicy: packageData.operationalDetails.cancellationPolicy,
        requirements:
          packageData.requirements.requirements.length > 0
            ? packageData.requirements.requirements
            : undefined,
        safetyInfo: packageData.requirements.safetyInfo,
        additionalInfo: packageData.requirements.additionalInfo,
        includedItems:
          packageData.requirements.includedItems.length > 0
            ? packageData.requirements.includedItems
            : undefined,
        excludedItems:
          packageData.requirements.excludedItems.length > 0
            ? packageData.requirements.excludedItems
            : undefined,
        accessibilityOptions:
          packageData.requirements.accessibilityOptions.length > 0
            ? packageData.requirements.accessibilityOptions
            : undefined,
        representativeCityId: packageData.activities.representativeCityId,
        pricingOptions:
          packageData.pricing.pricingOptions.length > 0
            ? packageData.pricing.pricingOptions
            : undefined,
        activities:
          packageData.activities.activities.length > 0
            ? packageData.activities.activities
            : undefined,
        benefits:
          packageData.benefitsPickup.benefits.length > 0
            ? packageData.benefitsPickup.benefits
            : undefined,
        pickupDetail: packageData.benefitsPickup.pickupDetail
          ?.isHotelPickupAvailable
          ? packageData.benefitsPickup.pickupDetail
          : undefined,
      };

      await createTouristPackage(dto);
      setCurrentStep('success');

      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      console.error('Error al crear paquete:', err);
      setError(
        err.response?.data?.message || 'Error al crear el paquete turístico',
      );
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      confirm(
        '¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.',
      )
    ) {
      router.push('/dashboard');
    }
  };

  const combinedData: Partial<CreateTouristPackageDto> = {
    ...packageData.basicInfo,
    ...packageData.operationalDetails,
    ...packageData.requirements,
    ...packageData.pricing,
    ...packageData.activities,
    ...packageData.benefitsPickup,
    companyId,
  };

  if (currentStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            ¡Paquete Creado Exitosamente!
          </h2>
          <p className="text-green-700 mb-4">
            El paquete turístico ha sido creado correctamente.
          </p>
          <p className="text-sm text-gray-600">
            Será redirigido al dashboard en 3 segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stepper visual */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${currentStep === step.number
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.number
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div
                  className={`text-xs mt-2 text-center font-medium ${currentStep === step.number
                      ? 'text-blue-600'
                      : 'text-gray-500'
                    }`}
                >
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  style={{ marginTop: '-40px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Formularios */}
      {currentStep === 1 && (
        <BasicInfoForm
          initialData={packageData.basicInfo}
          onNext={handleBasicInfoNext}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 2 && (
        <OperationalDetailsForm
          initialData={packageData.operationalDetails}
          onNext={handleOperationalDetailsNext}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <RequirementsForm
          initialData={packageData.requirements}
          onNext={handleRequirementsNext}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <PricingForm
          initialData={packageData.pricing}
          onNext={handlePricingNext}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <ActivitiesForm
          initialData={packageData.activities}
          onNext={handleActivitiesNext}
          onBack={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 6 && (
        <BenefitsPickupForm
          initialData={packageData.benefitsPickup}
          onNext={handleBenefitsPickupNext}
          onBack={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 7 && (
        <ReviewForm
          data={combinedData}
          onSubmit={handleFinalSubmit}
          onBack={() => setCurrentStep(6)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
