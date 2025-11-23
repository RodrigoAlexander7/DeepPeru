'use client';

import { DashboardSidebar } from '@/components/dashboard';
import { useProfile } from '@/features/user-profile/hooks/useProfile';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useProfile();

  const userName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
      profile.email
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar userName={userName} />
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
