'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroCarousel from '@/components/ui/HeroCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
      </main>
      <Footer />
    </div>
  );
}
