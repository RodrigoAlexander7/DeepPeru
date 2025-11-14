'use client';
import { useEffect, useState } from 'react';
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
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={s.image}
            alt="Hero slide"
            fill
            priority={i === index}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />
        </div>
      ))}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-6 md:px-12 max-w-3xl">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          Explore the world
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-200 max-w-xl leading-relaxed">
          Find incredible destinations and live experiencies unforgettables.
          Your next adventure starts here.
        </p>
        <button
          onClick={() => router.push('/search')}
          className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:from-blue-500 hover:to-purple-500 active:scale-[0.97] transition-all"
        >
          Buscar paquete
        </button>
        <div className="absolute bottom-6 left-6 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-10 rounded-full transition-all ${
                i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
