export interface TravelPackage {
  id: string;
  title: string;
  company: string;
  price: number;
  rating: number;
  image: string;
  location: string;
  badge?: 'Premium' | 'New';
}

// Datos de ejemplo para los paquetes populares
const mockPackages: TravelPackage[] = [
  {
    id: '1',
    title: 'Enchanting Bali Escape',
    company: 'IslandGetaways',
    price: 1200,
    rating: 4.8,
    image: '/packages/bali.jpg',
    location: 'Bali, Indonesia',
    badge: 'Premium'
  },
  {
    id: '2',
    title: 'Parisian Romance Getaway',
    company: 'EuroScape',
    price: 1500,
    rating: 4.7,
    image: '/packages/paris.jpg',
    location: 'Paris, France',
  },
  {
    id: '3',
    title: 'Andean Trekking Adventure',
    company: 'MountainHunters',
    price: 900,
    rating: 4.9,
    image: '/packages/andes.jpg',
    location: 'Andes, Peru',
  },
  {
    id: '4',
    title: 'Coastal Bliss in Algarve',
    company: 'SunSeekers Escapes',
    price: 1100,
    rating: 4.6,
    image: '/packages/algarve.jpg',
    location: 'Algarve, Portugal',
    badge: 'New'
  }
];

export const travelService = {
  // Solo necesitamos esto por ahora
  getPopularPackages: async (): Promise<TravelPackage[]> => {
    // Simula latencia de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPackages;
  }
};