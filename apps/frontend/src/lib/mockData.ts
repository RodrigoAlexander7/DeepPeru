export interface PackageItem {
  id: string;
  title: string;
  destination: string;
  image: string;
  price: number;
  days: number;
}

export const popularPackages: PackageItem[] = [
  {
    id: 'pk1',
    title: 'Adventure in Cusco',
    destination: 'Cusco',
    image:
      'https://images.unsplash.com/photo-1543246737-023b6e4b9cba?auto=format&fit=crop&w=800&q=60',
    price: 499,
    days: 5,
  },
  {
    id: 'pk2',
    title: 'Amazon Magic',
    destination: 'Iquitos',
    image:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=60',
    price: 699,
    days: 6,
  },
  {
    id: 'pk3',
    title: 'Southern Route',
    destination: 'Arequipa',
    image:
      'https://images.unsplash.com/photo-1502404768591-f24b0b86db3c?auto=format&fit=crop&w=800&q=60',
    price: 459,
    days: 4,
  },
  {
    id: 'pk4',
    title: 'Lakes & Culture',
    destination: 'Puno',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
    price: 549,
    days: 5,
  },
  {
    id: 'pk5',
    title: 'Vibrant Coast',
    destination: 'Lima',
    image:
      'https://images.unsplash.com/photo-1552072092-2e85d0ef8016?auto=format&fit=crop&w=800&q=60',
    price: 399,
    days: 3,
  },
];

export const activePromotions: PackageItem[] = [
  {
    id: 'pr1',
    title: '20% Off Machu Picchu',
    destination: 'Cusco',
    image:
      'https://images.unsplash.com/photo-1600785439283-3c1b84a2519c?auto=format&fit=crop&w=800&q=60',
    price: 399,
    days: 2,
  },
  {
    id: 'pr2',
    title: '2x1 Amazon Rainforest',
    destination: 'Amazonas',
    image:
      'https://images.unsplash.com/photo-1526481280698-8fcc1a2e8390?auto=format&fit=crop&w=800&q=60',
    price: 749,
    days: 7,
  },
  {
    id: 'pr3',
    title: 'Weekend Deal Lima',
    destination: 'Lima',
    image:
      'https://images.unsplash.com/photo-1585338109443-9af6fb1877a0?auto=format&fit=crop&w=800&q=60',
    price: 199,
    days: 2,
  },
  {
    id: 'pr4',
    title: 'Arequipa Cultural -15%',
    destination: 'Arequipa',
    image:
      'https://images.unsplash.com/photo-1431274177148-8af2a61d652e?auto=format&fit=crop&w=800&q=60',
    price: 320,
    days: 3,
  },
];
