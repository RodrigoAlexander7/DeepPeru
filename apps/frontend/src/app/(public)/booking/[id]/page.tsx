'use client';

import { useState, useEffect, Suspense } from 'react';
import ContactForm from '@/components/booking/ContactForm';
import ActivityDetails from '@/components/booking/ActivityDetails';
import PaymentDetails from '@/components/booking/PaymentDetails';
import { BookingFormData } from '@/types/booking';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import StepSection from '@/components/booking/StepSection';
import BookingSummary from '@/components/booking/BookingSummary';
import { travelService } from '@/features/travel/travelService';
import { bookingService } from '@/features/user-dashboard/services/bookingService';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
}

function BookingPageContent() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();

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

  // Estado del usuario actual
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Trackea el paso actual
  const [step, setStep] = useState(1);

  const [packageData, setPackageData] = useState<any>(null);
  const [selectedPricing, setSelectedPricing] = useState<any>(null);
  const [currencyMap, setCurrencyMap] = useState<Record<string, number>>({});

  // Cargar mapa de currencies
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies');
        if (response.ok) {
          const map = await response.json();
          setCurrencyMap(map);
        }
      } catch (error) {
        console.error('Error loading currencies:', error);
        // Usar valores fallback si falla
        setCurrencyMap({ USD: 6, PEN: 7, BRL: 8, ARS: 9, CLP: 10 });
      }
    };

    loadCurrencies();
  }, []);

  // Cargar usuario actual
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          // Usuario no autenticado - redirigir a login
          router.push(
            `/login?redirect=/booking/${packageId}?${search.toString()}`,
          );
        }
      } catch (error) {
        console.error('Error loading user:', error);
        router.push(
          `/login?redirect=/booking/${packageId}?${search.toString()}`,
        );
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [packageId, search, router]);

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
          const currId =
            pricingOption?.currencyId || (currency === 'PEN' ? 7 : 6);
          setSelectedPricing({
            id: pricingOption?.id || null, // Usar el ID validado del paquete, no el de la URL
            name: pricingName,
            pricePerUnit: Number(pricePerUnit),
            totalPrice: Number(totalPrice),
            currency: currency,
            currencyId: currId,
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
            currency: pricingOption.currencyId === 7 ? 'PEN' : 'USD',
            currencyId: pricingOption.currencyId,
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
    firstName: '',
    lastName: '',
    email: '',
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

  // Llenar datos del formulario con info del usuario autenticado
  useEffect(() => {
    if (currentUser && !loadingUser) {
      const nameParts = currentUser.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        firstName: userName || firstName,
        lastName: lastName,
        email: userEmail || currentUser.email,
        phone: currentUser.phone || prev.phone,
      }));
    }
  }, [currentUser, loadingUser, userName, userEmail]);

  // Inicializar travelers basado en los participantes de la opción de precio
  useEffect(() => {
    if (selectedPricing && formData.travelers.length === 0 && currentUser) {
      const nameParts = currentUser.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const initialTravelers = Array.from(
        { length: selectedPricing.participants },
        (_, i) => ({
          id: String(i + 1),
          // El primer viajero (índice 0) se llena con datos del usuario
          firstName: i === 0 ? userName || firstName : '',
          lastName: i === 0 ? lastName : '',
        }),
      );
      setFormData((prev) => ({ ...prev, travelers: initialTravelers }));
    }
  }, [selectedPricing, formData.travelers.length, currentUser, userName]);

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

  const handleSubmit = async (paymentData?: any) => {
    if (!currentUser || !packageData || !selectedPricing) {
      alert('Falta información necesaria para completar la reserva');
      return;
    }

    // Validar que haya fecha seleccionada
    if (!formData.date) {
      alert('Por favor selecciona una fecha para el tour');
      setStep(2);
      return;
    }

    try {
      // Preparar fecha en formato ISO 8601
      const travelDate = new Date(formData.date).toISOString();

      // Preparar travelers sin el campo id
      const cleanTravelers = formData.travelers.map(
        ({ firstName, lastName }) => ({
          firstName,
          lastName,
        }),
      );

      // Crear el booking primero
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: packageData.id,
          pricingOptionId: selectedPricing.id,
          travelDate: travelDate,
          numberOfParticipants: formData.travelers.length,
          currencyId:
            selectedPricing.currencyId ||
            (selectedPricing.currency === 'PEN' ? 7 : 6),
          contactInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            countryCode: formData.countryCode,
          },
          activityDetails: {
            date: formData.date,
            time: formData.time || '08:00',
            travelers: cleanTravelers,
            pickupLocation: formData.pickupLocation || '',
            tourLanguage: formData.tourLanguage || 'Español',
          },
        }),
      });

      if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        throw new Error(error.message || 'Error al crear la reserva');
      }

      const bookingResult = await bookingResponse.json();
      const bookingId = bookingResult.bookingId || bookingResult.booking?.id;

      if (!bookingId) {
        throw new Error('No se pudo obtener el ID de la reserva');
      }

      // Si hay datos de pago, procesar el pago
      if (paymentData && formData.paymentOption === 'now') {
        const paymentResponse = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            ...paymentData,
          }),
        });

        if (!paymentResponse.ok) {
          const error = await paymentResponse.json();
          throw new Error(error.message || 'Error al procesar el pago');
        }

        const paymentResult = await paymentResponse.json();

        if (paymentResult.status === 'success') {
          alert('¡Pago completado exitosamente!');
          router.push(`/booking/confirmation/${bookingId}`);
        } else {
          alert(
            `El pago fue ${paymentResult.status}. Por favor verifica con el soporte.`,
          );
          router.push(`/booking/status/${bookingId}`);
        }
      } else {
        // Sin pago inmediato
        alert('¡Reserva creada exitosamente!');
        router.push(`/booking/confirmation/${bookingId}`);
      }
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Hubo un error al procesar tu reserva. Por favor intenta de nuevo.',
      );
    }
  };

  // Mostrar loading mientras carga el usuario
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

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
        {/* Mensaje de bienvenida del usuario */}
        {currentUser && (
          <div className="max-w-7xl mx-auto mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-600">Reservando como:</p>
                <p className="font-semibold text-gray-900">
                  {currentUser.name}
                </p>
              </div>
            </div>
          </div>
        )}

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
                userEmail={formData.email}
                userName={formData.firstName}
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

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
