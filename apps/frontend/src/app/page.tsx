'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/search/SearchBar';
import PackageCard from '@/components/travel/PackageCard';
import { PackageCard as PackageCardType } from '@/types';
import { travelService } from '@/features/travel/travelService';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

export default function Home() {
  const [packages, setPackages] = useState<PackageCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPopularPackages();
  }, []);

  const loadPopularPackages = async () => {
    try {
      const paquetes = await travelService.getAllPackages({
        page: 1,
        limit: 8,
      });
      setPackages(
        paquetes.data.map((p: any) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          image: p.Media?.[0]?.url ?? '',
          company: p.TourismCompany?.name ?? 'Sin compañía',
          companyLogo: p.TourismCompany?.logoUrl ?? '',
          location: `${p.representativeCity?.name ?? 'Sin ciudad'}, ${p.representativeCity?.region?.name ?? 'Sin región'}`,
          price: Number(p.PricingOption?.[0]?.amount ?? 0),
          perPerson: p.PricingOption?.[0]?.perPerson ?? false,
          rating: p.rating ?? 0,
        })),
      );
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('POPULAR PACKAGES RESPONSE:', packages);
  }, [packages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <Header variant="transparent" />

        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.05)), url('/images/search_background.jpg')",
            }}
          />

          {/* Content */}
          <div className="relative z-10 w-full px-4">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
                ¿Adónde irás?
              </h1>
              <SearchBar />
            </div>
          </div>
        </section>
      </div>

      {/* Popular Packages */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Paquetes populares
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
