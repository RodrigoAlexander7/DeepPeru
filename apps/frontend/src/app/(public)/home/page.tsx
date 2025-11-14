'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroCarousel from '@/components/ui/HeroCarousel';
import PopularPackages from '@/components/ui/PopularPackages';
import ActivePromotions from '@/components/ui/ActivePromotions';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <div className="mx-auto max-w-7xl px-4">
          <PopularPackages />
          <ActivePromotions />
        </div>
      </main>
      <Footer />
    </div>
  );
}
