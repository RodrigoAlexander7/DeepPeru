'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  const [paused, setPaused] = useState(false);
  const itemWidth = 260; // px (approx card width + gap)

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setIndex((i) => i + 1), speed);
    return () => clearInterval(interval);
  }, [speed, paused]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [index, items.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: -index * itemWidth }}
          transition={{
            type: 'tween',
            duration: 0.75,
            ease: [0.16, 0.84, 0.44, 1],
          }}
        >
          {items.concat(items).map((item, i) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={`${item.id}-${i}`}
              className="min-w-[250px] bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/70 backdrop-blur-sm rounded-xl p-3 flex flex-col group hover:border-blue-500/70 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.03 }}
            >
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xs font-medium bg-black/40 backdrop-blur px-2 py-1 rounded text-white/90 border border-white/10">
                  {item.destination}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white/95 line-clamp-2">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                {item.days} días • Desde ${item.price}
              </p>
              <button className="mt-3 text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 active:scale-[0.96] transition-all shadow-[0_4px_18px_-4px_rgba(59,130,246,0.45)]">
                Ver detalle
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none bg-gradient-to-r from-gray-950 via-gray-950/40 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none bg-gradient-to-l from-gray-950 via-gray-950/40 to-transparent" />
      {paused && (
        <div className="absolute top-2 right-3 text-[10px] px-2 py-1 rounded bg-black/40 backdrop-blur border border-white/10 text-gray-300">
          Pausado
        </div>
      )}
    </div>
  );
}
