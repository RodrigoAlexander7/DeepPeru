import { TouristPackage, PackageCard, SearchParams } from '@/types';

const MOCK_PACKAGES: TouristPackage[] = [
  // CUSCO - Paquetes variados
  {
    TouristPackage_ID: '1',
    Name: 'Machu Picchu Explorer',
    Description: 'Visit the ancient Inca citadel with expert guides',
    Company_ID: 'comp1',
    Price: 1500,
    StartDate: '2025-01-15',
    EndDate: '2025-01-20',
    MinPeople: 2,
    MaxPeople: 15,
    YearMax: 70,
    YearMin: 18,
    Company: {
      Company_ID: 'comp1',
      Company_name: 'Peru Adventures',
      RUC: '20123456789',
      Website_url: 'www.peruadventures.com',
    },
    Location: {
      Location_ID: 'loc1',
      Street: 'Plaza de Armas',
      Postal_code: '08000',
      City: 'Cusco',
      State: 'Cusco',
      Country: 'Peru',
      Latitude: -13.5319,
      Longitude: -71.9675,
    },
  },
  {
    TouristPackage_ID: '7',
    Name: 'Sacred Valley & Ollantaytambo',
    Description: 'Explore the stunning Sacred Valley of the Incas',
    Company_ID: 'comp1',
    Price: 1350,
    StartDate: '2025-12-10',
    EndDate: '2025-12-15',
    MinPeople: 2,
    MaxPeople: 12,
    YearMax: 65,
    YearMin: 16,
    Company: {
      Company_ID: 'comp1',
      Company_name: 'Peru Adventures',
      RUC: '20123456789',
      Website_url: 'www.peruadventures.com',
    },
    Location: {
      Location_ID: 'loc1',
      Street: 'Plaza de Armas',
      Postal_code: '08000',
      City: 'Cusco',
      State: 'Cusco',
      Country: 'Peru',
      Latitude: -13.5319,
      Longitude: -71.9675,
    },
  },
  {
    TouristPackage_ID: '8',
    Name: 'Rainbow Mountain Trek',
    Description: 'Hike to the colorful Vinicunca mountain',
    Company_ID: 'comp3',
    Price: 890,
    StartDate: '2026-02-05',
    EndDate: '2026-02-08',
    MinPeople: 4,
    MaxPeople: 20,
    YearMax: 60,
    YearMin: 18,
    Company: {
      Company_ID: 'comp3',
      Company_name: 'Andean Explorers',
      RUC: '20456789123',
      Website_url: 'www.andeanexplorers.com',
    },
    Location: {
      Location_ID: 'loc1',
      Street: 'Plaza de Armas',
      Postal_code: '08000',
      City: 'Cusco',
      State: 'Cusco',
      Country: 'Peru',
      Latitude: -13.5319,
      Longitude: -71.9675,
    },
  },

  // LIMA
  {
    TouristPackage_ID: '2',
    Name: 'Lima Gastronomic Experience',
    Description: "Culinary tour through Peru's capital",
    Company_ID: 'comp2',
    Price: 800,
    StartDate: '2025-02-01',
    EndDate: '2025-02-03',
    MinPeople: 1,
    MaxPeople: 10,
    YearMax: 65,
    YearMin: 21,
    Company: {
      Company_ID: 'comp2',
      Company_name: 'Lima Food Tours',
      RUC: '20987654321',
      Website_url: 'www.limafoodtours.com',
    },
    Location: {
      Location_ID: 'loc2',
      Street: 'Av. Larco',
      Postal_code: '15074',
      City: 'Lima',
      State: 'Lima',
      Country: 'Peru',
      Latitude: -12.1203,
      Longitude: -77.0298,
    },
  },
  {
    TouristPackage_ID: '11',
    Name: 'Lima Colonial & Modern',
    Description: "Discover Lima's historic center and contemporary districts",
    Company_ID: 'comp2',
    Price: 650,
    StartDate: '2025-11-15',
    EndDate: '2025-11-17',
    MinPeople: 1,
    MaxPeople: 8,
    YearMax: 75,
    YearMin: 12,
    Company: {
      Company_ID: 'comp2',
      Company_name: 'Lima Food Tours',
      RUC: '20987654321',
      Website_url: 'www.limafoodtours.com',
    },
    Location: {
      Location_ID: 'loc2',
      Street: 'Av. Larco',
      Postal_code: '15074',
      City: 'Lima',
      State: 'Lima',
      Country: 'Peru',
      Latitude: -12.1203,
      Longitude: -77.0298,
    },
  },

  // AREQUIPA
  {
    TouristPackage_ID: '3',
    Name: 'Arequipa & Colca Canyon',
    Description: 'White city and condor watching adventure',
    Company_ID: 'comp3',
    Price: 950,
    StartDate: '2025-03-10',
    EndDate: '2025-03-15',
    MinPeople: 2,
    MaxPeople: 12,
    YearMax: 60,
    YearMin: 16,
    Company: {
      Company_ID: 'comp3',
      Company_name: 'Andean Explorers',
      RUC: '20456789123',
      Website_url: 'www.andeanexplorers.com',
    },
    Location: {
      Location_ID: 'loc3',
      Street: 'Plaza de Armas',
      Postal_code: '04001',
      City: 'Arequipa',
      State: 'Arequipa',
      Country: 'Peru',
      Latitude: -16.409,
      Longitude: -71.5375,
    },
  },
  {
    TouristPackage_ID: '12',
    Name: 'Colca Canyon Deep Trek',
    Description: "Multi-day trekking in one of the world's deepest canyons",
    Company_ID: 'comp3',
    Price: 1100,
    StartDate: '2026-03-15',
    EndDate: '2026-03-20',
    MinPeople: 4,
    MaxPeople: 10,
    YearMax: 55,
    YearMin: 18,
    Company: {
      Company_ID: 'comp3',
      Company_name: 'Andean Explorers',
      RUC: '20456789123',
      Website_url: 'www.andeanexplorers.com',
    },
    Location: {
      Location_ID: 'loc3',
      Street: 'Plaza de Armas',
      Postal_code: '04001',
      City: 'Arequipa',
      State: 'Arequipa',
      Country: 'Peru',
      Latitude: -16.409,
      Longitude: -71.5375,
    },
  },

  // IQUITOS - AMAZON
  {
    TouristPackage_ID: '4',
    Name: 'Amazon Rainforest Adventure',
    Description: 'Deep jungle exploration in the Peruvian Amazon',
    Company_ID: 'comp4',
    Price: 1200,
    StartDate: '2025-04-05',
    EndDate: '2025-04-10',
    MinPeople: 4,
    MaxPeople: 8,
    YearMax: 55,
    YearMin: 18,
    Company: {
      Company_ID: 'comp4',
      Company_name: 'Jungle Expeditions',
      RUC: '20789456123',
      Website_url: 'www.jungleexpeditions.com',
    },
    Location: {
      Location_ID: 'loc4',
      Street: 'Av. Abelardo Quiñones',
      Postal_code: '16001',
      City: 'Iquitos',
      State: 'Loreto',
      Country: 'Peru',
      Latitude: -3.7437,
      Longitude: -73.2516,
    },
  },
  {
    TouristPackage_ID: '13',
    Name: 'Amazon Wildlife Safari',
    Description: 'Wildlife watching and river cruise in the Amazon',
    Company_ID: 'comp4',
    Price: 1450,
    StartDate: '2026-03-15',
    EndDate: '2026-03-20',
    MinPeople: 2,
    MaxPeople: 10,
    YearMax: 70,
    YearMin: 15,
    Company: {
      Company_ID: 'comp4',
      Company_name: 'Jungle Expeditions',
      RUC: '20789456123',
      Website_url: 'www.jungleexpeditions.com',
    },
    Location: {
      Location_ID: 'loc4',
      Street: 'Av. Abelardo Quiñones',
      Postal_code: '16001',
      City: 'Iquitos',
      State: 'Loreto',
      Country: 'Peru',
      Latitude: -3.7437,
      Longitude: -73.2516,
    },
  },

  // NAZCA
  {
    TouristPackage_ID: '5',
    Name: 'Nazca Lines Flyover',
    Description: 'Aerial view of the mysterious Nazca Lines',
    Company_ID: 'comp5',
    Price: 600,
    StartDate: '2025-05-01',
    EndDate: '2025-05-02',
    MinPeople: 1,
    MaxPeople: 6,
    YearMax: 75,
    YearMin: 12,
    Company: {
      Company_ID: 'comp5',
      Company_name: 'Nazca Air Tours',
      RUC: '20147258369',
      Website_url: 'www.nazcaairtours.com',
    },
    Location: {
      Location_ID: 'loc5',
      Street: 'Aeropuerto María Reiche',
      Postal_code: '11401',
      City: 'Nazca',
      State: 'Ica',
      Country: 'Peru',
      Latitude: -14.834,
      Longitude: -74.945,
    },
  },

  // PUNO
  {
    TouristPackage_ID: '6',
    Name: 'Lake Titicaca Cultural Tour',
    Description: 'Explore floating islands and local culture',
    Company_ID: 'comp1',
    Price: 850,
    StartDate: '2025-06-15',
    EndDate: '2025-06-18',
    MinPeople: 2,
    MaxPeople: 10,
    YearMax: 70,
    YearMin: 15,
    Company: {
      Company_ID: 'comp1',
      Company_name: 'Peru Adventures',
      RUC: '20123456789',
      Website_url: 'www.peruadventures.com',
    },
    Location: {
      Location_ID: 'loc6',
      Street: 'Jr. Lima',
      Postal_code: '21001',
      City: 'Puno',
      State: 'Puno',
      Country: 'Peru',
      Latitude: -15.8402,
      Longitude: -70.0219,
    },
  },
  {
    TouristPackage_ID: '14',
    Name: 'Titicaca Island Homestay',
    Description:
      'Authentic experience living with local families on the islands',
    Company_ID: 'comp1',
    Price: 750,
    StartDate: '2025-07-20',
    EndDate: '2025-07-24',
    MinPeople: 1,
    MaxPeople: 6,
    YearMax: 65,
    YearMin: 18,
    Company: {
      Company_ID: 'comp1',
      Company_name: 'Peru Adventures',
      RUC: '20123456789',
      Website_url: 'www.peruadventures.com',
    },
    Location: {
      Location_ID: 'loc6',
      Street: 'Jr. Lima',
      Postal_code: '21001',
      City: 'Puno',
      State: 'Puno',
      Country: 'Peru',
      Latitude: -15.8402,
      Longitude: -70.0219,
    },
  },

  // PARACAS
  {
    TouristPackage_ID: '15',
    Name: 'Paracas & Ballestas Islands',
    Description: 'Coastal wildlife and desert oasis adventure',
    Company_ID: 'comp6',
    Price: 950,
    StartDate: '2026-03-15',
    EndDate: '2026-03-20',
    MinPeople: 2,
    MaxPeople: 15,
    YearMax: 70,
    YearMin: 12,
    Company: {
      Company_ID: 'comp6',
      Company_name: 'Coastal Adventures',
      RUC: '20369258147',
      Website_url: 'www.coastaladventures.com',
    },
    Location: {
      Location_ID: 'loc7',
      Street: 'Av. Paracas',
      Postal_code: '11550',
      City: 'Paracas',
      State: 'Ica',
      Country: 'Peru',
      Latitude: -13.8343,
      Longitude: -76.2524,
    },
  },

  // HUACACHINA
  {
    TouristPackage_ID: '16',
    Name: 'Huacachina Desert Oasis',
    Description: 'Sandboarding and dune buggy adventures',
    Company_ID: 'comp7',
    Price: 580,
    StartDate: '2025-08-10',
    EndDate: '2025-08-12',
    MinPeople: 2,
    MaxPeople: 12,
    YearMax: 55,
    YearMin: 16,
    Company: {
      Company_ID: 'comp7',
      Company_name: 'Desert Thrills',
      RUC: '20852963741',
      Website_url: 'www.desertthrills.com',
    },
    Location: {
      Location_ID: 'loc8',
      Street: 'Av. Perotti',
      Postal_code: '11000',
      City: 'Ica',
      State: 'Ica',
      Country: 'Peru',
      Latitude: -14.0877,
      Longitude: -75.7627,
    },
  },
];

//Conviersion TouristPackage a PackageCard

function toPackageCard(pkg: TouristPackage): PackageCard {
  return {
    id: pkg.TouristPackage_ID,
    title: pkg.Name,
    company: pkg.Company?.Company_name || 'Unknown Company',
    price: pkg.Price,
    location:
      `${pkg.Location?.City}, ${pkg.Location?.Country}` || 'Unknown Location',
    description: pkg.Description,
    startDate: pkg.StartDate,
    endDate: pkg.EndDate,

    badge: pkg.Price > 1000 ? 'Premium' : undefined,
  };
}

export const travelService = {
  //No esta conectado al backend
  getPopularPackages: async (): Promise<PackageCard[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const packages = MOCK_PACKAGES.slice(0, 4);
    return packages.map(toPackageCard);
  },

  //No esta conectado al backend
  searchPackages: async (params: SearchParams): Promise<PackageCard[]> => {
    // Simula latencia de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    let results = [...MOCK_PACKAGES];

    // Filtrar por destino (Location)
    if (params.destination && params.destination.trim() !== '') {
      const searchTerm = params.destination.toLowerCase();
      results = results.filter((pkg) => {
        const cityMatch = pkg.Location?.City.toLowerCase().includes(searchTerm);
        const stateMatch =
          pkg.Location?.State.toLowerCase().includes(searchTerm);
        const countryMatch =
          pkg.Location?.Country.toLowerCase().includes(searchTerm);
        const nameMatch = pkg.Name.toLowerCase().includes(searchTerm);

        return cityMatch || stateMatch || countryMatch || nameMatch;
      });

      console.log(
        `Filtro por destino (“${params.destination}”) → resultados:`,
        results.length,
      );
      console.log(
        'Paquetes encontrados por destino:',
        results.map((r) => r.Name),
      );
    }

    // Filtrar por fecha de inicio
    if (params.startDate) {
      const before = results.length;
      results = results.filter(
        (pkg) => new Date(pkg.StartDate) >= new Date(params.startDate!),
      );
      console.log(
        `Filtro por fecha de inicio (>= ${params.startDate}) → ${before} → ${results.length}`,
      );
      console.log(
        'Paquetes después del filtro de inicio:',
        results.map((r) => r.Name),
      );
    }

    // Filtrar por fecha de fin
    if (params.endDate) {
      const before = results.length;
      results = results.filter(
        (pkg) => new Date(pkg.EndDate) <= new Date(params.endDate!),
      );
      console.log(
        `Filtro por fecha de fin (<= ${params.endDate}) → ${before} → ${results.length}`,
      );
      console.log(
        'Paquetes después del filtro de fin:',
        results.map((r) => r.Name),
      );
    }

    // Filtrar por número de viajeros
    if (params.travelers) {
      const before = results.length;
      results = results.filter(
        (pkg) =>
          params.travelers! >= pkg.MinPeople &&
          params.travelers! <= pkg.MaxPeople,
      );
      console.log(
        `Filtro por viajeros (${params.travelers}) → ${before} → ${results.length}`,
      );
      console.log(
        'Paquetes después del filtro de viajeros:',
        results.map((r) => r.Name),
      );
    }

    console.log('Total final de resultados:', results.length);
    console.log(
      'Resultados finales:',
      results.map((r) => r.Name),
    );

    return results.map(toPackageCard);
  },
};
