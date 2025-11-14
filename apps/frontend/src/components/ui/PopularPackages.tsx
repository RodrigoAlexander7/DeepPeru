import AutoCarousel from '@/components/ui/AutoCarousel';
import { popularPackages } from '@/lib/mockData';

export default function PopularPackages() {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Paquetes populares
        </h2>
        <a
          href="/packages"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Ver todos
        </a>
      </div>
      <AutoCarousel items={popularPackages} />
    </section>
  );
}
