'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroCarousel from '@/components/ui/HeroCarousel';
import PopularPackages from '@/components/ui/PopularPackages';
import ActivePromotions from '@/components/ui/ActivePromotions';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 relative selection:bg-purple-500/40">
      {/* Decorative global background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[35%] -left-24 w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-purple-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-[460px] h-[460px] bg-gradient-to-tr from-indigo-600/20 to-fuchsia-600/25 rounded-full blur-3xl animate-pulse delay-300" />
      </div>
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <div className="mx-auto max-w-7xl px-4 pb-24">
          <motion.hr
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="origin-left h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4 border-0"
          />
          <PopularPackages />
          <ActivePromotions />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-24 text-center"
          >
            <h3 className="text-xl font-semibold text-white">
              ¿Listo para tu próxima aventura?
            </h3>
            <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
              Estamos expandiendo nuestra plataforma para ofrecerte más
              destinos, actividades y experiencias inolvidables.
            </p>
            <a
              href="/packages"
              className="inline-block mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-[0_6px_28px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_8px_36px_-6px_rgba(79,70,229,0.6)] hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Explorar paquetes
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
