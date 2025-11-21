'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/booking/ContactForm';
import ActivityDetails from '@/components/booking/ActivityDetails';
import PaymentDetails from '@/components/booking/PaymentDetails';
import { BookingFormData } from '@/types/booking';
import { useParams, useSearchParams } from 'next/navigation';
import StepSection from '@/components/booking/StepSection';
import BookingSummary from '@/components/booking/BookingSummary';
import { travelService } from '@/features/travel/travelService';

export default function BookingPage() {
  const params = useParams();
  const search = useSearchParams();

  const packageId = params.id;

  // Obtener parámetros de la opción de precio seleccionada
  const pricingOptionId = search.get('pricingOptionId');
  const pricingName = search.get('pricingName') || 'Opción estándar';
  const pricePerUnit = search.get('pricePerUnit');
  const participants = search.get('participants');
  const totalPrice = search.get('totalPrice');
  const currency = search.get('currency') || 'USD';
  const perPerson = search.get('perPerson') === 'true';

  const userEmail = search.get('email') || undefined;
  const userName = search.get('name') || undefined;

  // Trackea el paso actual
  const [step, setStep] = useState(1);

  const [packageData, setPackageData] = useState<any>(null);
  const [selectedPricing, setSelectedPricing] = useState<any>(null);

  useEffect(() => {
    if (!packageId) return;

    const loadPackage = async () => {
      try {
        const data = await travelService.getPackageById(Number(packageId));

        // Encontrar la opción de precio seleccionada
        let pricingOption = null;
        if (pricingOptionId && data.PricingOption) {
          pricingOption = data.PricingOption.find(
            (opt: any) => opt.id === Number(pricingOptionId),
          );
        }

        // Si no se encontró o no se especificó, usar la primera disponible
        if (!pricingOption && data.PricingOption?.length > 0) {
          pricingOption = data.PricingOption[0];
        }

        // Si se pasaron parámetros de precio en la URL, usarlos
        if (pricePerUnit && totalPrice) {
          setSelectedPricing({
            id: pricingOptionId ? Number(pricingOptionId) : null,
            name: pricingName,
            pricePerUnit: Number(pricePerUnit),
            totalPrice: Number(totalPrice),
            currency: currency,
            perPerson: perPerson,
            participants: participants ? Number(participants) : 1,
            minParticipants: pricingOption?.minParticipants || null,
            maxParticipants: pricingOption?.maxParticipants || null,
          });
        } else if (pricingOption) {
          // Usar la opción de precio del backend
          const baseParticipants = pricingOption.minParticipants || 1;
          const basePrice = Number(pricingOption.amount);
          const calculatedTotal = pricingOption.perPerson
            ? basePrice * baseParticipants
            : basePrice;

          setSelectedPricing({
            id: pricingOption.id,
            name: pricingOption.name,
            pricePerUnit: basePrice,
            totalPrice: calculatedTotal,
            currency: pricingOption.currencyId === 2 ? 'PEN' : 'USD',
            perPerson: pricingOption.perPerson,
            participants: baseParticipants,
            minParticipants: pricingOption.minParticipants || null,
            maxParticipants: pricingOption.maxParticipants || null,
          });
        }

        setPackageData({
          id: data.id,
          name: data.name,
          description: data.description,
          durationDays: data.durationDays || 1,
          image: data.Media?.[0]?.url || '',
          activities: data.activities || [],
          includedItems: data.includedItems || [],
          excludedItems: data.excludedItems || [],
          cancellationPolicy:
            data.cancellationPolicy ||
            'Cancelación gratuita hasta 24 horas antes',
          rating: data.rating || 4.9,
          reviewCount: data.reviews?.length || 0,
          TourismCompany: data.TourismCompany,
          PricingOption: data.PricingOption,
        });
      } catch (error) {
        console.error('Error loading package:', error);
      }
    };

    loadPackage();
  }, [
    packageId,
    pricingOptionId,
    pricePerUnit,
    totalPrice,
    currency,
    perPerson,
    participants,
    pricingName,
  ]);

  const [formData, setFormData] = useState<BookingFormData>({
    // Paso 1
    firstName: userName || '',
    lastName: '',
    email: userEmail || '',
    countryCode: '+51',
    phone: '',
    receiveTextUpdates: false,
    receiveEmailOffers: false,

    // Paso 2
    travelers: [],
    pickupLocation: '',
    tourLanguage: 'Español - Guía',

    date: '',
    time: '',

    // Paso 3
    paymentOption: 'now',
    promoCode: '',
  });

  // Inicializar travelers basado en los participantes de la opción de precio
  useEffect(() => {
    if (selectedPricing && formData.travelers.length === 0) {
      const initialTravelers = Array.from(
        { length: selectedPricing.participants },
        (_, i) => ({
          id: String(i + 1),
          firstName: '',
          lastName: '',
        }),
      );
      setFormData((prev) => ({ ...prev, travelers: initialTravelers }));
    }
  }, [selectedPricing, formData.travelers.length]);

  // Recalcular precio cuando cambie el número de viajeros
  const calculateTotalPrice = () => {
    if (!selectedPricing) return 0;

    if (selectedPricing.perPerson) {
      return selectedPricing.pricePerUnit * formData.travelers.length;
    }
    return selectedPricing.pricePerUnit;
  };

  const currentTotalPrice = calculateTotalPrice();

  const updateForm = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    console.log('Datos de reserva:', {
      packageData,
      selectedPricing,
      formData,
      totalPrice: currentTotalPrice,
    });
    alert('Reserva completada (Aquí enviarías la data al backend)');
  };

  if (!packageData || !selectedPricing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Columna izquierda (Formulario) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header con información de la opción seleccionada */}
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Opción seleccionada: {selectedPricing.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedPricing.perPerson
                      ? `${selectedPricing.currency === 'PEN' ? 'S/' : '$'}${selectedPricing.pricePerUnit.toFixed(2)} por persona`
                      : `${selectedPricing.currency === 'PEN' ? 'S/' : '$'}${selectedPricing.pricePerUnit.toFixed(2)} precio total`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-red-500">
                    {selectedPricing.currency === 'PEN' ? 'S/' : '$'}
                    {currentTotalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* -------- PASO 1 -------- */}
            <StepSection
              stepNumber={1}
              title="Datos de contacto"
              isEditing={step === 1}
              onEdit={() => setStep(1)}
              summary={
                <div>
                  <div className="font-semibold">
                    {formData.firstName} {formData.lastName}
                  </div>
                  <div>Correo: {formData.email}</div>
                  <div>Teléfono: {formData.phone}</div>
                </div>
              }
            >
              <ContactForm
                formData={formData}
                onUpdate={updateForm}
                onNext={() => setStep(2)}
                userEmail={userEmail}
                userName={userName}
              />
            </StepSection>

            {/* -------- PASO 2 -------- */}
            <StepSection
              stepNumber={2}
              title="Detalles de la actividad"
              isEditing={step === 2}
              onEdit={() => setStep(2)}
              summary={
                <div>
                  <div className="font-semibold">{packageData.name}</div>
                  <div>Fecha: {formData.date || '—'}</div>
                  <div>Personas: {formData.travelers.length}</div>
                </div>
              }
            >
              <ActivityDetails
                formData={formData}
                onUpdate={updateForm}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                packageData={packageData}
                selectedPricing={selectedPricing}
              />
            </StepSection>

            {/* -------- PASO 3 -------- */}
            <StepSection
              stepNumber={3}
              title="Pago"
              isEditing={step === 3}
              onEdit={() => setStep(3)}
              summary={
                <div>
                  <div>
                    Total a pagar: {selectedPricing.currency}{' '}
                    {currentTotalPrice.toFixed(2)}
                  </div>
                  <div>Opción: {formData.paymentOption}</div>
                </div>
              }
            >
              <PaymentDetails
                formData={formData}
                onUpdate={updateForm}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                totalPrice={currentTotalPrice}
                cancellationPolicy={packageData.cancellationPolicy}
                packageName={packageData.name}
                currency={selectedPricing.currency}
              />
            </StepSection>
          </div>

          {/* -------- COLUMNA DERECHA - RESUMEN -------- */}
          <div className="lg:col-span-1">
            <BookingSummary
              packageData={{
                name: packageData.name,
                image: packageData.image,
                rating: packageData.rating,
                reviewCount: packageData.reviewCount,
                provider:
                  packageData.TourismCompany?.name || 'Proveedor desconocido',
                description: packageData.description,
                date: formData.date || 'Selecciona una fecha',
                time: formData.time || '08:00',
                travelers: formData.travelers.length,
                cancellationPolicy: packageData.cancellationPolicy,
                price: currentTotalPrice,
                currency: selectedPricing.currency,
                pricingOption: selectedPricing.name,
                pricePerUnit: selectedPricing.pricePerUnit,
                perPerson: selectedPricing.perPerson,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
