'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=60',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[75vh] overflow-hidden">
      {/* Background decorative gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse slow" />
        <div className="absolute top-10 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-300 slow" />
      </div>
      <AnimatePresence>
        {slides.map(
          (s, i) =>
            i === index && (
              <motion.div
                key={s.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 5.5, ease: 'linear' }}
                >
                  <Image
                    src={s.image}
                    alt="Hero slide"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80" />
                </motion.div>
              </motion.div>
            ),
        )}
      </AnimatePresence>
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-6 md:px-12 max-w-3xl">
        <motion.h2
          key={index + '-title'}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.65)]"
        >
          Explore the world
        </motion.h2>
        <motion.p
          key={index + '-text'}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: 'easeOut' }}
          className="mt-4 text-lg sm:text-xl text-gray-200/90 max-w-xl leading-relaxed backdrop-blur-sm bg-black/10 p-3 rounded-lg"
        >
          Find incredible destinations and live experiencies unforgettables.
          Your next adventure starts here.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/search')}
          className="mt-8 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-[0_8px_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_10px_40px_-5px_rgba(147,51,234,0.55)] hover:from-blue-500 hover:to-purple-500 transition-all"
        >
          Buscar paquete
        </motion.button>
        <div className="absolute bottom-6 left-6 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-10 rounded-full transition-all duration-300 ${
                i === index
                  ? 'bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.35)]'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        {/* Optional manual controls */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button
            onClick={() =>
              setIndex((prev) => (prev - 1 + slides.length) % slides.length)
            }
            aria-label="Previous slide"
            className="px-3 py-2 text-xs font-medium rounded-md bg-white/15 backdrop-blur hover:bg-white/25 text-white transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
            aria-label="Next slide"
            className="px-3 py-2 text-xs font-medium rounded-md bg-white/15 backdrop-blur hover:bg-white/25 text-white transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
