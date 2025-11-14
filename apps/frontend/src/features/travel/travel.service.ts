import { TouristPackage, PackageCard, SearchParams } from '@/types';

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
