// src/components/booking/StepSection.tsx
import React from 'react';

interface StepSectionProps {
  stepNumber: number;
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  summary?: React.ReactNode;
  children: React.ReactNode;
}

export default function StepSection({
  stepNumber,
  title,
  isEditing,
  onEdit,
  summary,
  children,
}: StepSectionProps) {
  return (
    <div className="border rounded-xl p-6 mb-6 bg-white">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)] text-white font-bold">
            {stepNumber}
          </div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>

        {!isEditing && (
          <button
            className="text-[var(--primary)] font-semibold hover:underline"
            onClick={onEdit}
          >
            Editar
          </button>
        )}
      </div>

      {/* CONTENT */}
      {isEditing ? (
        <div>{children}</div>
      ) : (
        <div className="text-gray-800">{summary}</div>
      )}
    </div>
  );
}
