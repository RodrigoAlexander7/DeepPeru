import React from 'react';
import { BookingStep } from '@/types/booking';

interface BookingStepsProps {
  currentStep: BookingStep;
}

const steps = [
  { number: 1, title: 'Datos de contacto' },
  { number: 2, title: 'Detalles del paquete' },
  { number: 3, title: 'Detalles del pago' },
];

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                step.number <= currentStep
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <span
              className={`ml-3 text-sm font-medium ${
                step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="mx-4 h-0.5 flex-1 bg-gray-300"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
