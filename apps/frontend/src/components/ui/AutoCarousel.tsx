'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { PackageItem } from '@/lib/mockData';

interface AutoCarouselProps {
  items: PackageItem[];
  speed?: number; // ms per slide
  title?: string;
}

export default function AutoCarousel({
  items,
  speed = 4000,
}: AutoCarouselProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => i + 1);
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  // Reset index for infinite illusion
  useEffect(() => {
    if (index >= items.length) {
      setIndex(0);
    }
  }, [index, items.length]);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 260}px)` }}
        >
          {items.concat(items).map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="min-w-[250px] bg-gray-800/70 border border-gray-700 rounded-xl p-3 flex flex-col group hover:border-blue-500/70 hover:bg-gray-800 transition-colors"
            >
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xs font-medium bg-black/40 backdrop-blur px-2 py-1 rounded text-white">
                  {item.destination}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white line-clamp-2">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                {item.days} días • Desde ${item.price}
              </p>
              <button className="mt-3 text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 active:scale-[0.97] transition-all">
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none bg-gradient-to-r from-gray-950 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none bg-gradient-to-l from-gray-950 to-transparent" />
    </div>
  );
}
