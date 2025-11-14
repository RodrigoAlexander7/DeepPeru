import AutoCarousel from '@/components/ui/AutoCarousel';
import { activePromotions } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function ActivePromotions() {
  return (
    <section className="mt-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 animate-pulse" />
            Active Promotions
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Take advantage of limited offers and special discounts.
          </p>
        </div>
        <a
          href="/promotions"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-4"
        >
          View all
        </a>
      </motion.div>
      <AutoCarousel items={activePromotions} />
    </section>
  );
}
