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

  const userEmail = search.get('email') || undefined;
  const userName = search.get('name') || undefined;

  // Trackea el paso actual
  const [step, setStep] = useState(1);

  const [packageData, setPackageData] = useState<any>(null);

  useEffect(() => {
    if (!packageId) return;

    const loadPackage = async () => {
      try {
        const data = await travelService.getPackageById(Number(packageId));

        const price =
          data.PricingOption?.length > 0
            ? Number(data.PricingOption[0].amount)
            : 0;

        setPackageData({
          id: data.id,
          name: data.name,
          description: data.description,
          price,
          currency: data.PricingOption?.[0]?.currencyId === 2 ? 'PEN' : 'USD',
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
        });
      } catch (error) {
        console.error('Error loading package:', error);
      }
    };

    loadPackage();
  }, [packageId]);

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
    travelers: [
      { id: '1', firstName: '', lastName: '' },
      { id: '2', firstName: '', lastName: '' },
    ],
    pickupLocation: '',
    tourLanguage: 'Español - Guía',

    date: '',
    time: '',

    // Paso 3
    paymentOption: 'now',
    promoCode: '',
  });

  const totalPrice = packageData
    ? packageData.price * formData.travelers.length
    : 0;

  const updateForm = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    console.log('Datos de reserva:', {
      packageData,
      formData,
      totalPrice,
    });
    alert('Reserva completada (Aquí enviarías la data al backend)');
  };

  if (!packageData) {
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
                    Total a pagar: {packageData.currency} {totalPrice}
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
                totalPrice={totalPrice}
                cancellationPolicy={packageData.cancellationPolicy}
                packageName={packageData.name}
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
                price: totalPrice,
                currency: packageData.currency,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
