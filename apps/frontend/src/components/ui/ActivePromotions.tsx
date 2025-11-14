import AutoCarousel from '@/components/ui/AutoCarousel';
import { activePromotions } from '@/lib/mockData';

export default function ActivePromotions() {
  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Promociones activas
        </h2>
        <a
          href="/promotions"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Ver todas
        </a>
      </div>
      <AutoCarousel items={activePromotions} />
    </section>
  );
}
