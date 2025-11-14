import AutoCarousel from '@/components/ui/AutoCarousel';
import { popularPackages } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function PopularPackages() {
  return (
    <section className="mt-16 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            Popular Packages
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Explore experiences preferred by other travelers.
          </p>
        </div>
        <a
          href="/packages"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-4"
        >
          View all
        </a>
      </motion.div>
      <AutoCarousel items={popularPackages} />
    </section>
  );
}
