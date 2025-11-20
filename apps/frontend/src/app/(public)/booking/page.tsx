'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/booking/ContactForm';
import ActivityDetails from '@/components/booking/ActivityDetails';
import PaymentDetails from '@/components/booking/PaymentDetails';
import { BookingFormData } from '@/types/booking';
import { useSearchParams } from 'next/navigation';
import StepSection from '@/components/booking/StepSection';
import BookingSummary from '@/components/booking/BookingSummary';

export default function BookingPage() {
  const params = useSearchParams();

  // Recibir email del usuario logueado (si existe en la URL)
  const userEmail = params.get('email') || undefined;
  const userName = params.get('name') || undefined;

  // Trackea el paso actual
  const [step, setStep] = useState(1);

  // Construir packageData desde los params
  const [packageData, setPackageData] = useState<any>(null);

  useEffect(() => {
    // Extraer datos del paquete desde la URL
    const packageId = params.get('packageId');
    const packageName = params.get('packageName');
    const price = parseFloat(params.get('price') || '0');
    const currency = params.get('currency') || 'USD';
    const durationDays = parseInt(params.get('durationDays') || '1');
    const description = params.get('description') || '';
    const image = params.get('image') || '';

    // Parsear arrays JSON
    const destinations = params.get('destinations')
      ? JSON.parse(params.get('destinations')!)
      : [];
    const activities = params.get('activities')
      ? JSON.parse(params.get('activities')!)
      : [];
    const includedItems = params.get('includedItems')
      ? JSON.parse(params.get('includedItems')!)
      : [];
    const excludedItems = params.get('excludedItems')
      ? JSON.parse(params.get('excludedItems')!)
      : [];

    // Construir objeto del paquete
    if (packageId && packageName) {
      setPackageData({
        id: packageId,
        name: packageName,
        price,
        currency,
        durationDays,
        description,
        image,
        destinations,
        activities,
        includedItems,
        excludedItems,
        date: 'Por confirmar', // Esto se puede seleccionar luego
        cancellationPolicy: 'Cancelación gratuita hasta 24 horas antes',
      });
    }
  }, [params]);

  // Estado global del booking
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: userName || '',
    lastName: '',
    email: userEmail || '',
    countryCode: '+51',
    phone: '',
    receiveTextUpdates: false,
    receiveEmailOffers: false,
    travelers: [
      { id: '1', firstName: '', lastName: '' },
      { id: '2', firstName: '', lastName: '' },
    ],
    pickupLocation: '',
    tourLanguage: 'Español - Guía',
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
    alert('Reserva completada 🎉 (Aquí enviarías la data al backend)');
  };

  // Loading state mientras se cargan los datos del paquete
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
          {/* Columna izquierda - Formularios (2/3) */}
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
                  <div>Fecha: {packageData.date}</div>
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
                  <div>Total a pagar: ${totalPrice}</div>
                  <div>Opción de pago: {formData.paymentOption}</div>
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

          {/* Columna derecha - Resumen del paquete (1/3) */}
          <div className="lg:col-span-1">
            <BookingSummary
              packageData={{
                name: packageData.name,
                image: packageData.image,
                rating: 4.9,
                reviewCount: 438,
                provider: 'Cusipota Viajes y Turismo',
                description: packageData.description,
                date: 'sábado, 22 de noviembre de 2025',
                time: '08:00',
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
