'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
            Bienvenido a DeepPeru
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Descubre experiencias únicas y paquetes diseñados para tu próxima
            aventura. Estamos construyendo tu portal de viajes.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
