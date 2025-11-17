import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensurePhone(number: string, countryId: number) {
  const existing = await prisma.phone.findFirst({
    where: { number, countryId },
  });
  if (existing) return existing;
  const last = await prisma.phone.findFirst({
    select: { id: true },
    orderBy: { id: 'desc' },
  });
  const nextId = (last?.id ?? 0) + 1;
  return prisma.phone.create({ data: { id: nextId, number, countryId } });
}

// New helpers: ensure region/city and basic package seeding
async function ensureRegion(countryId: number, name: string, code?: string) {
  const existing = await prisma.region.findFirst({
    where: { name, countryId },
  });
  return existing ?? prisma.region.create({ data: { name, code, countryId } });
}

async function ensureCity(regionId: number, name: string) {
  const existing = await prisma.city.findFirst({ where: { name, regionId } });
  return existing ?? prisma.city.create({ data: { name, regionId } });
}

async function createData() {
  // Languages
  const [en, es] = await prisma.$transaction([
    prisma.language.upsert({
      where: { code: 'en' },
      update: {},
      create: { code: 'en', name: 'English' },
    }),
    prisma.language.upsert({
      where: { code: 'es' },
      update: {},
      create: { code: 'es', name: 'Español' },
    }),
  ]);

  // Currencies
  const usd =
    (await prisma.currency.findFirst({ where: { code: 'USD' } })) ??
    (await prisma.currency.create({
      data: { code: 'USD', name: 'US Dollar', symbol: '$' },
    }));
  const pen =
    (await prisma.currency.findFirst({ where: { code: 'PEN' } })) ??
    (await prisma.currency.create({
      data: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
    }));

  // New currencies
  const brl =
    (await prisma.currency.findFirst({ where: { code: 'BRL' } })) ??
    (await prisma.currency.create({
      data: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    }));
  const ars =
    (await prisma.currency.findFirst({ where: { code: 'ARS' } })) ??
    (await prisma.currency.create({
      data: { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    }));
  const clp =
    (await prisma.currency.findFirst({ where: { code: 'CLP' } })) ??
    (await prisma.currency.create({
      data: { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    }));

  // Countries
  const peru = await prisma.country.upsert({
    where: { code: 'PE' },
    update: {},
    create: {
      code: 'PE',
      name: 'Peru',
      phoneCode: '+51',
      currency: { connect: { id: pen.id } },
    },
  });
  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      code: 'US',
      name: 'United States',
      phoneCode: '+1',
      currency: { connect: { id: usd.id } },
    },
  });

  // New countries
  const brazil = await prisma.country.upsert({
    where: { code: 'BR' },
    update: {},
    create: {
      code: 'BR',
      name: 'Brazil',
      phoneCode: '+55',
      currency: { connect: { id: brl.id } },
    },
  });
  const argentina = await prisma.country.upsert({
    where: { code: 'AR' },
    update: {},
    create: {
      code: 'AR',
      name: 'Argentina',
      phoneCode: '+54',
      currency: { connect: { id: ars.id } },
    },
  });
  const chile = await prisma.country.upsert({
    where: { code: 'CL' },
    update: {},
    create: {
      code: 'CL',
      name: 'Chile',
      phoneCode: '+56',
      currency: { connect: { id: clp.id } },
    },
  });

  // Country Translations
  await prisma.$transaction([
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: peru.id, languageId: en.id },
      },
      update: { name: 'Peru' },
      create: { countryId: peru.id, languageId: en.id, name: 'Peru' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: peru.id, languageId: es.id },
      },
      update: { name: 'Perú' },
      create: { countryId: peru.id, languageId: es.id, name: 'Perú' },
    }),
    prisma.countryTranslation.upsert({
      where: { countryId_languageId: { countryId: usa.id, languageId: en.id } },
      update: { name: 'United States' },
      create: { countryId: usa.id, languageId: en.id, name: 'United States' },
    }),
    prisma.countryTranslation.upsert({
      where: { countryId_languageId: { countryId: usa.id, languageId: es.id } },
      update: { name: 'Estados Unidos' },
      create: { countryId: usa.id, languageId: es.id, name: 'Estados Unidos' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: brazil.id, languageId: en.id },
      },
      update: { name: 'Brazil' },
      create: { countryId: brazil.id, languageId: en.id, name: 'Brazil' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: brazil.id, languageId: es.id },
      },
      update: { name: 'Brasil' },
      create: { countryId: brazil.id, languageId: es.id, name: 'Brasil' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: argentina.id, languageId: en.id },
      },
      update: { name: 'Argentina' },
      create: { countryId: argentina.id, languageId: en.id, name: 'Argentina' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: argentina.id, languageId: es.id },
      },
      update: { name: 'Argentina' },
      create: { countryId: argentina.id, languageId: es.id, name: 'Argentina' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: chile.id, languageId: en.id },
      },
      update: { name: 'Chile' },
      create: { countryId: chile.id, languageId: en.id, name: 'Chile' },
    }),
    prisma.countryTranslation.upsert({
      where: {
        countryId_languageId: { countryId: chile.id, languageId: es.id },
      },
      update: { name: 'Chile' },
      create: { countryId: chile.id, languageId: es.id, name: 'Chile' },
    }),
  ]);

  // Regions (Peru) - find-or-create by name and country
  const limaRegion =
    (await prisma.region.findFirst({
      where: { name: 'Lima', countryId: peru.id },
    })) ??
    (await prisma.region.create({
      data: { name: 'Lima', code: 'LIM', countryId: peru.id },
    }));
  const cuscoRegion =
    (await prisma.region.findFirst({
      where: { name: 'Cusco', countryId: peru.id },
    })) ??
    (await prisma.region.create({
      data: { name: 'Cusco', code: 'CUS', countryId: peru.id },
    }));

  // New regions
  const rioRegion = await ensureRegion(brazil.id, 'Rio de Janeiro', 'RJ');
  const saoPauloRegion = await ensureRegion(brazil.id, 'São Paulo', 'SP');
  const buenosAiresRegion = await ensureRegion(
    argentina.id,
    'Buenos Aires',
    'BA',
  );
  const santiagoRegion = await ensureRegion(
    chile.id,
    'Santiago Metropolitan',
    'RM',
  );

  // Region Translations
  await prisma.$transaction([
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: limaRegion.id, languageId: en.id },
      },
      update: { name: 'Lima' },
      create: { regionId: limaRegion.id, languageId: en.id, name: 'Lima' },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: limaRegion.id, languageId: es.id },
      },
      update: { name: 'Lima' },
      create: { regionId: limaRegion.id, languageId: es.id, name: 'Lima' },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: cuscoRegion.id, languageId: en.id },
      },
      update: { name: 'Cusco' },
      create: { regionId: cuscoRegion.id, languageId: en.id, name: 'Cusco' },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: cuscoRegion.id, languageId: es.id },
      },
      update: { name: 'Cusco' },
      create: { regionId: cuscoRegion.id, languageId: es.id, name: 'Cusco' },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: rioRegion.id, languageId: en.id },
      },
      update: { name: 'Rio de Janeiro' },
      create: {
        regionId: rioRegion.id,
        languageId: en.id,
        name: 'Rio de Janeiro',
      },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: rioRegion.id, languageId: es.id },
      },
      update: { name: 'Río de Janeiro' },
      create: {
        regionId: rioRegion.id,
        languageId: es.id,
        name: 'Río de Janeiro',
      },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: santiagoRegion.id, languageId: en.id },
      },
      update: { name: 'Santiago Metropolitan' },
      create: {
        regionId: santiagoRegion.id,
        languageId: en.id,
        name: 'Santiago Metropolitan',
      },
    }),
    prisma.regionTranslation.upsert({
      where: {
        regionId_languageId: { regionId: santiagoRegion.id, languageId: es.id },
      },
      update: { name: 'Región Metropolitana de Santiago' },
      create: {
        regionId: santiagoRegion.id,
        languageId: es.id,
        name: 'Región Metropolitana de Santiago',
      },
    }),
  ]);

  // Cities
  const limaCity =
    (await prisma.city.findFirst({
      where: { name: 'Lima', regionId: limaRegion.id },
    })) ??
    (await prisma.city.create({
      data: { name: 'Lima', regionId: limaRegion.id },
    }));
  const cuscoCity =
    (await prisma.city.findFirst({
      where: { name: 'Cusco', regionId: cuscoRegion.id },
    })) ??
    (await prisma.city.create({
      data: { name: 'Cusco', regionId: cuscoRegion.id },
    }));

  // New cities
  const mirafloresCity = await ensureCity(limaRegion.id, 'Miraflores');
  const barrancoCity = await ensureCity(limaRegion.id, 'Barranco');
  const pisacCity = await ensureCity(cuscoRegion.id, 'Pisac');
  const rioCity = await ensureCity(rioRegion.id, 'Rio de Janeiro');
  const saoPauloCity = await ensureCity(saoPauloRegion.id, 'São Paulo');
  const buenosAiresCity = await ensureCity(
    buenosAiresRegion.id,
    'Buenos Aires',
  );
  const santiagoCity = await ensureCity(santiagoRegion.id, 'Santiago');

  // City Translations (idempotent)
  await prisma.$transaction([
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: limaCity.id, languageId: en.id } },
      update: { name: 'Lima' },
      create: { cityId: limaCity.id, languageId: en.id, name: 'Lima' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: limaCity.id, languageId: es.id } },
      update: { name: 'Lima' },
      create: { cityId: limaCity.id, languageId: es.id, name: 'Lima' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: cuscoCity.id, languageId: en.id } },
      update: { name: 'Cusco' },
      create: { cityId: cuscoCity.id, languageId: en.id, name: 'Cusco' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: cuscoCity.id, languageId: es.id } },
      update: { name: 'Cusco' },
      create: { cityId: cuscoCity.id, languageId: es.id, name: 'Cusco' },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: mirafloresCity.id, languageId: en.id },
      },
      update: { name: 'Miraflores' },
      create: {
        cityId: mirafloresCity.id,
        languageId: en.id,
        name: 'Miraflores',
      },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: mirafloresCity.id, languageId: es.id },
      },
      update: { name: 'Miraflores' },
      create: {
        cityId: mirafloresCity.id,
        languageId: es.id,
        name: 'Miraflores',
      },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: barrancoCity.id, languageId: en.id },
      },
      update: { name: 'Barranco' },
      create: { cityId: barrancoCity.id, languageId: en.id, name: 'Barranco' },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: barrancoCity.id, languageId: es.id },
      },
      update: { name: 'Barranco' },
      create: { cityId: barrancoCity.id, languageId: es.id, name: 'Barranco' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: pisacCity.id, languageId: en.id } },
      update: { name: 'Pisac' },
      create: { cityId: pisacCity.id, languageId: en.id, name: 'Pisac' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: pisacCity.id, languageId: es.id } },
      update: { name: 'Pisac' },
      create: { cityId: pisacCity.id, languageId: es.id, name: 'Pisac' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: rioCity.id, languageId: en.id } },
      update: { name: 'Rio de Janeiro' },
      create: { cityId: rioCity.id, languageId: en.id, name: 'Rio de Janeiro' },
    }),
    prisma.cityTranslation.upsert({
      where: { cityId_languageId: { cityId: rioCity.id, languageId: es.id } },
      update: { name: 'Río de Janeiro' },
      create: { cityId: rioCity.id, languageId: es.id, name: 'Río de Janeiro' },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: saoPauloCity.id, languageId: en.id },
      },
      update: { name: 'São Paulo' },
      create: { cityId: saoPauloCity.id, languageId: en.id, name: 'São Paulo' },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: saoPauloCity.id, languageId: es.id },
      },
      update: { name: 'São Paulo' },
      create: { cityId: saoPauloCity.id, languageId: es.id, name: 'São Paulo' },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: buenosAiresCity.id, languageId: en.id },
      },
      update: { name: 'Buenos Aires' },
      create: {
        cityId: buenosAiresCity.id,
        languageId: en.id,
        name: 'Buenos Aires',
      },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: buenosAiresCity.id, languageId: es.id },
      },
      update: { name: 'Buenos Aires' },
      create: {
        cityId: buenosAiresCity.id,
        languageId: es.id,
        name: 'Buenos Aires',
      },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: santiagoCity.id, languageId: en.id },
      },
      update: { name: 'Santiago' },
      create: { cityId: santiagoCity.id, languageId: en.id, name: 'Santiago' },
    }),
    prisma.cityTranslation.upsert({
      where: {
        cityId_languageId: { cityId: santiagoCity.id, languageId: es.id },
      },
      update: { name: 'Santiago' },
      create: { cityId: santiagoCity.id, languageId: es.id, name: 'Santiago' },
    }),
  ]);

  // Postal Code (find-or-create)
  const limaPostal =
    (await prisma.postalCode.findFirst({
      where: { code: '15000', cityId: limaCity.id },
    })) ??
    (await prisma.postalCode.create({
      data: { code: '15000', cityId: limaCity.id },
    }));

  // Phones (ensure unique IDs without collisions)
  const userPhone = await ensurePhone('+51 999-111-222', peru.id);
  const emergencyPhone = await ensurePhone('+1 555-222-3333', usa.id);

  // Users (idempotent via unique email)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      isActive: true,
      nationalityId: peru.id,
      phoneId: userPhone.id,
    },
  });

  const workerUser = await prisma.user.upsert({
    where: { email: 'worker@example.com' },
    update: {},
    create: {
      email: 'worker@example.com',
      name: 'Worker User',
      isActive: true,
      nationalityId: peru.id,
    },
  });

  const touristUser = await prisma.user.upsert({
    where: { email: 'tourist@example.com' },
    update: {},
    create: {
      email: 'tourist@example.com',
      name: 'Tourist User',
      isActive: true,
      nationalityId: usa.id,
      passportCountryId: usa.id,
    },
  });

  // System Admin (idempotent)
  await prisma.systemAdmin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id },
  });

  // Company Admin (idempotent). Set tourismCompanyId temporary, updated later
  const companyAdmin = await prisma.companyAdmin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id, tourismCompanyId: 0 },
  });

  // Tourism Company (find-or-create by name)
  let company = await prisma.tourismCompany.findFirst({
    where: { name: 'Andes Travel' },
  });
  if (!company) {
    company = await prisma.tourismCompany.create({
      data: {
        name: 'Andes Travel',
        legalName: 'Andes Travel S.A.C.',
        registrationNumber: 'RUC-12345678901',
        email: 'contact@andestravel.com',
        phone: '+51 01 5555555',
        websiteUrl: 'https://andestravel.example',
        logoUrl: 'https://picsum.photos/200/200',
        registerDate: new Date('2024-01-15T00:00:00.000Z'),
        isActive: true,
        rating: 4.7,
        languageId: en.id,
        adminId: companyAdmin.id,
      },
    });
  }

  // Update CompanyAdmin tourismCompanyId
  await prisma.companyAdmin.update({
    where: { id: companyAdmin.id },
    data: { tourismCompanyId: company.id },
  });

  // Company Translations (idempotent)
  await prisma.tourismCompanyTranslation.upsert({
    where: {
      companyId_languageId: { companyId: company.id, languageId: en.id },
    },
    update: {
      description: 'Adventure and cultural tours across the Andes',
      tagline: 'Explore the heights',
    },
    create: {
      companyId: company.id,
      languageId: en.id,
      description: 'Adventure and cultural tours across the Andes',
      tagline: 'Explore the heights',
    },
  });
  await prisma.tourismCompanyTranslation.upsert({
    where: {
      companyId_languageId: { companyId: company.id, languageId: es.id },
    },
    update: {
      description: 'Tours de aventura y cultura por los Andes',
      tagline: 'Explora las alturas',
    },
    create: {
      companyId: company.id,
      languageId: es.id,
      description: 'Tours de aventura y cultura por los Andes',
      tagline: 'Explora las alturas',
    },
  });

  // New companies
  let incaTrails = await prisma.tourismCompany.findFirst({
    where: { name: 'Inca Trails' },
  });
  if (!incaTrails) {
    incaTrails = await prisma.tourismCompany.create({
      data: {
        name: 'Inca Trails',
        legalName: 'Inca Trails S.A.C.',
        registrationNumber: 'RUC-20123456789',
        email: 'info@incatrails.example',
        phone: '+51 01 4444444',
        websiteUrl: 'https://incatrails.example',
        logoUrl: 'https://picsum.photos/seed/inca/200/200',
        registerDate: new Date('2024-02-10T00:00:00.000Z'),
        isActive: true,
        rating: 4.6,
        languageId: en.id,
        adminId: companyAdmin.id,
      },
    });
  }
  await prisma.tourismCompanyTranslation.upsert({
    where: {
      companyId_languageId: { companyId: incaTrails.id, languageId: en.id },
    },
    update: {
      description: 'Hiking and cultural experiences in the Andes',
      tagline: 'Walk the ancient paths',
    },
    create: {
      companyId: incaTrails.id,
      languageId: en.id,
      description: 'Hiking and cultural experiences in the Andes',
      tagline: 'Walk the ancient paths',
    },
  });
  await prisma.tourismCompanyTranslation.upsert({
    where: {
      companyId_languageId: { companyId: incaTrails.id, languageId: es.id },
    },
    update: {
      description: 'Caminatas y experiencias culturales en los Andes',
      tagline: 'Camina por rutas ancestrales',
    },
    create: {
      companyId: incaTrails.id,
      languageId: es.id,
      description: 'Caminatas y experiencias culturales en los Andes',
      tagline: 'Camina por rutas ancestrales',
    },
  });

  let pacificAdventures = await prisma.tourismCompany.findFirst({
    where: { name: 'Pacific Adventures' },
  });
  if (!pacificAdventures) {
    pacificAdventures = await prisma.tourismCompany.create({
      data: {
        name: 'Pacific Adventures',
        legalName: 'Pacific Adventures S.A.',
        registrationNumber: 'RUC-20999888777',
        email: 'hello@pacific.example',
        phone: '+51 01 3333333',
        websiteUrl: 'https://pacific.example',
        logoUrl: 'https://picsum.photos/seed/pacific/200/200',
        registerDate: new Date('2024-03-01T00:00:00.000Z'),
        isActive: true,
        rating: 4.5,
        languageId: en.id,
        adminId: companyAdmin.id,
      },
    });
  }
  await prisma.tourismCompanyTranslation.upsert({
    where: {
      companyId_languageId: {
        companyId: pacificAdventures.id,
        languageId: en.id,
      },
    },
    update: {
      description: 'Urban and coastal tours along the Pacific',
      tagline: 'City lights and ocean breeze',
    },
    create: {
      companyId: pacificAdventures.id,
      languageId: en.id,
      description: 'Urban and coastal tours along the Pacific',
      tagline: 'City lights and ocean breeze',
    },
  });
  await prisma.tourismCompanyTranslation.upsert({
    where: {
      companyId_languageId: {
        companyId: pacificAdventures.id,
        languageId: es.id,
      },
    },
    update: {
      description: 'Tours urbanos y costeros por el Pacífico',
      tagline: 'Luces de la ciudad y brisa marina',
    },
    create: {
      companyId: pacificAdventures.id,
      languageId: es.id,
      description: 'Tours urbanos y costeros por el Pacífico',
      tagline: 'Luces de la ciudad y brisa marina',
    },
  });

  // Company Installation (Andes Travel)
  const mainOffice =
    (await prisma.companyInstallation.findFirst({
      where: { name: 'Main Office', companyId: company.id },
    })) ??
    (await prisma.companyInstallation.create({
      data: {
        name: 'Main Office',
        address: 'Av. Arequipa 1200, Miraflores',
        latitude: -12.1122,
        longitude: -77.0311,
        postalCodeId: limaPostal.id,
        companyId: company.id,
      },
    }));

  // Permissions
  const [permPackages, permWorkers] = await prisma.$transaction([
    prisma.permission.upsert({
      where: { name: 'MANAGE_PACKAGES' },
      update: {},
      create: { name: 'MANAGE_PACKAGES' },
    }),
    prisma.permission.upsert({
      where: { name: 'MANAGE_WORKERS' },
      update: {},
      create: { name: 'MANAGE_WORKERS' },
    }),
  ]);

  // Company Worker for Andes Travel
  const worker = await prisma.companyWorker.upsert({
    where: {
      userId_companyId: { userId: workerUser.id, companyId: company.id },
    },
    update: {
      role: 'Guide Manager',
      isActive: true,
      Permission: { set: [{ id: permPackages.id }, { id: permWorkers.id }] },
    },
    create: {
      userId: workerUser.id,
      companyId: company.id,
      role: 'Guide Manager',
      isActive: true,
      Permission: {
        connect: [{ id: permPackages.id }, { id: permWorkers.id }],
      },
    },
    include: { Permission: true },
  });

  // Assign same worker to the new companies
  await prisma.companyWorker.upsert({
    where: {
      userId_companyId: { userId: workerUser.id, companyId: incaTrails.id },
    },
    update: {
      role: 'Guide',
      isActive: true,
      Permission: { set: [{ id: permPackages.id }, { id: permWorkers.id }] },
    },
    create: {
      userId: workerUser.id,
      companyId: incaTrails.id,
      role: 'Guide',
      isActive: true,
      Permission: {
        connect: [{ id: permPackages.id }, { id: permWorkers.id }],
      },
    },
  });
  await prisma.companyWorker.upsert({
    where: {
      userId_companyId: {
        userId: workerUser.id,
        companyId: pacificAdventures.id,
      },
    },
    update: {
      role: 'Coordinator',
      isActive: true,
      Permission: { set: [{ id: permPackages.id }, { id: permWorkers.id }] },
    },
    create: {
      userId: workerUser.id,
      companyId: pacificAdventures.id,
      role: 'Coordinator',
      isActive: true,
      Permission: {
        connect: [{ id: permPackages.id }, { id: permWorkers.id }],
      },
    },
  });

  // Tourist
  const tourist = await prisma.tourist.upsert({
    where: { userId: touristUser.id },
    update: {
      languageId: es.id,
      currencyId: usd.id,
      emergencyPhoneId: emergencyPhone.id,
    },
    create: {
      userId: touristUser.id,
      languageId: es.id,
      currencyId: usd.id,
      emergencyPhoneId: emergencyPhone.id,
    },
  });

  // Helper: set representative city via raw SQL
  async function setRepresentativeCity(packageId: number, cityId: number) {
    await prisma.$executeRaw`UPDATE "TouristPackage" SET "representativeCityId" = ${cityId} WHERE "id" = ${packageId}`;
  }
  // Helpers for PackageLocation
  async function clearPackageLocations(packageId: number) {
    await prisma.$executeRaw`DELETE FROM "PackageLocation" WHERE "packageId" = ${packageId}`;
  }
  async function upsertPackageLocation(
    packageId: number,
    cityId: number,
    ord: number,
    notes: string | null,
  ) {
    await prisma.$executeRaw`
      INSERT INTO "PackageLocation" ("packageId","cityId","order","notes","createdAt")
      VALUES (${packageId}, ${cityId}, ${ord}, ${notes}, ${new Date()})
      ON CONFLICT ("packageId","cityId")
      DO UPDATE SET "order" = EXCLUDED."order", "notes" = EXCLUDED."notes"
    `;
  }

  // Helper to create or update a tourist package with nested relations
  async function upsertTouristPackage(params: {
    companyId: number;
    name: string;
    description: string;
    duration?: string;
    type: 'GROUP' | 'PRIVATE' | 'SELF_GUIDED';
    difficulty?: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'HARD';
    languageId: number;
    rating?: number;
    isActive?: boolean;
    minAge?: number;
    maxAge?: number;
    minParticipants?: number;
    maxParticipants?: number;
    meetingPoint?: string;
    meetingLatitude?: number;
    meetingLongitude?: number;
    endPoint?: string;
    endLatitude?: number;
    endLongitude?: number;
    timezone?: string;
    bookingCutoff?: string;
    requirements?: string[];
    safetyInfo?: string;
    additionalInfo?: string;
    cancellationPolicy?: string;
    representativeCityId: number;
    locations?: Array<{ cityId: number; order: number; notes?: string | null }>;
    pricing: Array<{
      name: string;
      description?: string;
      currencyId: number;
      // Accept both number and string for flexibility with Decimal; prefer number going forward.
      amount: number | string;
      perPerson?: boolean;
      minParticipants?: number;
      maxParticipants?: number;
      isActive?: boolean;
      // Optional validity window for seasonal / promotional pricing
      validFrom?: Date | string;
      validTo?: Date | string;
    }>;
    benefits?: Array<{ iconUrl?: string; title: string; order?: number }>;
    media?: Array<{
      type?: 'IMAGE' | 'VIDEO';
      url: string;
      caption?: string;
      order?: number;
      isPrimary?: boolean;
    }>;
    pickup?: {
      isHotelPickupAvailable?: boolean;
      pickupRadiusKm?: number;
      pickupStartTime?: string;
      pickupEndTime?: string;
      instructions?: string;
    };
    activities?: Array<{
      name: string;
      description?: string;
      destinationCityId: number;
      startDate: string | Date;
      endDate: string | Date;
      schedules?: Array<{
        timezone: string;
        daysOfWeek: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN')[];
        startTime: string;
        endTime?: string;
        notes?: string;
      }>;
      features?: Array<{
        category?: string;
        iconUrl?: string;
        name: string;
        description?: string;
        order?: number;
      }>;
    }>;
    translations?: {
      en?: {
        name?: string;
        description?: string;
        meetingPoint?: string;
        endPoint?: string;
        cancellationPolicy?: string;
        requirements?: string[];
        includedItems?: string[];
        excludedItems?: string[];
      };
      es?: {
        name?: string;
        description?: string;
        meetingPoint?: string;
        endPoint?: string;
        cancellationPolicy?: string;
        requirements?: string[];
        includedItems?: string[];
        excludedItems?: string[];
      };
    };
    includedItems?: string[];
    excludedItems?: string[];
  }) {
    const {
      representativeCityId,
      locations = [],
      pricing,
      benefits = [],
      media = [],
      pickup,
      activities = [],
      translations,
      includedItems = [],
      excludedItems = [],
      ...data
    } = params;

    let pkg = await prisma.touristPackage.findFirst({
      where: { companyId: data.companyId, name: data.name },
    });
    if (!pkg) {
      pkg = await prisma.touristPackage.create({
        data: {
          ...data,
          isActive: data.isActive ?? true,
          updatedAt: new Date(),
          includedItems,
          excludedItems,
        },
      });
    } else {
      await prisma.touristPackage.update({
        where: { id: pkg.id },
        data: {
          ...data,
          updatedAt: new Date(),
          includedItems,
          excludedItems,
        },
      });
    }

    // Representative city
    await setRepresentativeCity(pkg.id, representativeCityId);

    // Languages linking (en & es)
    await prisma.packageLanguage.upsert({
      where: { packageId_languageId: { packageId: pkg.id, languageId: en.id } },
      update: {},
      create: { packageId: pkg.id, languageId: en.id },
    });
    await prisma.packageLanguage.upsert({
      where: { packageId_languageId: { packageId: pkg.id, languageId: es.id } },
      update: {},
      create: { packageId: pkg.id, languageId: es.id },
    });

    // Translations (optional)
    if (translations?.en) {
      const t = translations.en;
      await prisma.touristPackageTranslation.upsert({
        where: {
          packageId_languageId: { packageId: pkg.id, languageId: en.id },
        },
        update: { ...t },
        create: { packageId: pkg.id, languageId: en.id, ...t },
      });
    }
    if (translations?.es) {
      const t = translations.es;
      await prisma.touristPackageTranslation.upsert({
        where: {
          packageId_languageId: { packageId: pkg.id, languageId: es.id },
        },
        update: { ...t },
        create: { packageId: pkg.id, languageId: es.id, ...t },
      });
    }

    // Idempotent child collections
    await prisma.benefit.deleteMany({ where: { packageId: pkg.id } });
    if (benefits.length) {
      await prisma.benefit.createMany({
        data: benefits.map((b) => ({ ...b, packageId: pkg.id })),
      });
    }

    // Activities and their schedules/features, then link to package with contextual start/end dates
    // Activity itself is date-agnostic; dates live on the association row
    for (const act of activities) {
      let activity = await prisma.activity.findFirst({
        where: {
          name: act.name,
          destinationCityId: act.destinationCityId,
        },
      });
      if (!activity) {
        // Cast to any until Prisma client regenerated without start/end on Activity
        activity = await (prisma as any).activity.create({
          data: {
            name: act.name,
            description: act.description,
            destinationCityId: act.destinationCityId,
          },
        });
      } else {
        activity = await (prisma as any).activity.update({
          where: { id: activity.id },
          data: {
            description: act.description,
            destinationCityId: act.destinationCityId,
          },
        });
      }

      // Link to package (idempotent via composite PK)
      await (prisma as any).touristPackageActivity.upsert({
        where: {
          packageId_activityId: { packageId: pkg.id, activityId: activity!.id },
        },
        update: {
          startDate: new Date(act.startDate),
          endDate: new Date(act.endDate),
        },
        create: {
          packageId: pkg.id,
          activityId: activity!.id,
          startDate: new Date(act.startDate),
          endDate: new Date(act.endDate),
        },
      });

      // Reset and seed activity schedules
      await prisma.schedule.deleteMany({ where: { activityId: activity!.id } });
      if (act.schedules?.length) {
        await prisma.schedule.createMany({
          data: act.schedules.map((s) => ({
            activityId: activity!.id,
            timezone: s.timezone,
            daysOfWeek: s.daysOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            notes: s.notes,
          })),
        });
      }

      // Reset and seed activity features
      await prisma.feature.deleteMany({ where: { activityId: activity!.id } });
      if (act.features?.length) {
        await prisma.feature.createMany({
          data: act.features.map((f) => ({ ...f, activityId: activity!.id })),
        });
      }
    }

    await prisma.media.deleteMany({ where: { packageId: pkg.id } });
    if (media.length) {
      await prisma.media.createMany({
        data: media.map((m) => ({
          packageId: pkg.id,
          type: m.type ?? 'IMAGE',
          ...m,
        })),
      });
    }

    await prisma.pickupDetail.deleteMany({ where: { packageId: pkg.id } });
    if (pickup) {
      await prisma.pickupDetail.create({
        data: { packageId: pkg.id, ...pickup },
      });
    }

    await prisma.pricingOption.deleteMany({ where: { packageId: pkg.id } });
    if (pricing.length) {
      await prisma.pricingOption.createMany({
        data: pricing.map((p) => ({
          packageId: pkg.id,
          perPerson: p.perPerson ?? true,
          isActive: p.isActive ?? true,
          ...p,
        })),
      });
    }

    // Note: Itinerary and package-level schedule removed in favor of Activity + Schedule

    // Normalized locations
    await clearPackageLocations(pkg.id);
    for (const loc of locations) {
      await upsertPackageLocation(
        pkg.id,
        loc.cityId,
        loc.order,
        loc.notes ?? null,
      );
    }

    return pkg;
  }

  // Package 1 (Andes Travel) - already seeded "Machu Picchu Full Day"
  let pkg = await prisma.touristPackage.findFirst({
    where: { companyId: company.id, name: 'Machu Picchu Full Day' },
  });
  if (!pkg) {
    pkg = await prisma.touristPackage.create({
      data: {
        companyId: company.id,
        name: 'Machu Picchu Full Day',
        description:
          'Experience the wonder of Machu Picchu in a full-day guided tour.',
        duration: '1 day',
        type: 'GROUP',
        difficulty: 'MODERATE',
        languageId: en.id,
        rating: 4.9,
        isActive: true,
        minAge: 8,
        maxAge: 80,
        minParticipants: 2,
        maxParticipants: 16,
        meetingPoint: 'Cusco Main Square',
        meetingLatitude: -13.5167,
        meetingLongitude: -71.978,
        endPoint: 'Cusco Train Station',
        endLatitude: -13.5281,
        endLongitude: -71.944,
        timezone: 'America/Lima',
        bookingCutoff: '24h before start',
        requirements: ['Valid passport', 'Comfortable shoes'],
        safetyInfo: 'Altitude sickness possible; stay hydrated.',
        additionalInfo: 'Bring sunscreen and a hat.',
        cancellationPolicy: 'Free cancellation up to 48h before departure.',
        updatedAt: new Date(),
      },
    });
    // Set representative city after create
    await setRepresentativeCity(pkg.id, cuscoCity.id);
  } else {
    // Update timestamp and set representative city
    await prisma.touristPackage.update({
      where: { id: pkg.id },
      data: { updatedAt: new Date() },
    });
    await setRepresentativeCity(pkg.id, cuscoCity.id);
  }

  // Package Languages (idempotent)
  await prisma.packageLanguage.upsert({
    where: { packageId_languageId: { packageId: pkg.id, languageId: en.id } },
    update: {},
    create: { packageId: pkg.id, languageId: en.id },
  });
  await prisma.packageLanguage.upsert({
    where: { packageId_languageId: { packageId: pkg.id, languageId: es.id } },
    update: {},
    create: { packageId: pkg.id, languageId: es.id },
  });

  // Package Translations (idempotent) - remove additionalInfo (not in translation schema)
  await prisma.touristPackageTranslation.upsert({
    where: { packageId_languageId: { packageId: pkg.id, languageId: en.id } },
    update: {
      name: 'Machu Picchu Full Day',
      description:
        'Experience the wonder of Machu Picchu in a full-day guided tour.',
      meetingPoint: 'Cusco Main Square',
      endPoint: 'Cusco Train Station',
      cancellationPolicy: 'Free cancellation up to 48h before departure.',
      requirements: ['Valid passport', 'Comfortable shoes'],
      includedItems: [
        'Professional guide',
        'Train tickets',
        'Entrance tickets',
      ],
      excludedItems: ['Meals', 'Tips'],
    },
    create: {
      packageId: pkg.id,
      languageId: en.id,
      name: 'Machu Picchu Full Day',
      description:
        'Experience the wonder of Machu Picchu in a full-day guided tour.',
      meetingPoint: 'Cusco Main Square',
      endPoint: 'Cusco Train Station',
      cancellationPolicy: 'Free cancellation up to 48h before departure.',
      requirements: ['Valid passport', 'Comfortable shoes'],
      includedItems: [
        'Professional guide',
        'Train tickets',
        'Entrance tickets',
      ],
      excludedItems: ['Meals', 'Tips'],
    },
  });
  await prisma.touristPackageTranslation.upsert({
    where: { packageId_languageId: { packageId: pkg.id, languageId: es.id } },
    update: {
      name: 'Machu Picchu Día Completo',
      description:
        'Vive la maravilla de Machu Picchu en un tour guiado de día completo.',
      meetingPoint: 'Plaza de Armas de Cusco',
      endPoint: 'Estación de tren de Cusco',
      cancellationPolicy: 'Cancelación gratuita hasta 48h antes de la salida.',
      requirements: ['Pasaporte válido', 'Zapatos cómodos'],
      includedItems: ['Guía profesional', 'Boletos de tren', 'Entradas'],
      excludedItems: ['Comidas', 'Propinas'],
    },
    create: {
      packageId: pkg.id,
      languageId: es.id,
      name: 'Machu Picchu Día Completo',
      description:
        'Vive la maravilla de Machu Picchu en un tour guiado de día completo.',
      meetingPoint: 'Plaza de Armas de Cusco',
      endPoint: 'Estación de tren de Cusco',
      cancellationPolicy: 'Cancelación gratuita hasta 48h antes de la salida.',
      requirements: ['Pasaporte válido', 'Zapatos cómodos'],
      includedItems: ['Guía profesional', 'Boletos de tren', 'Entradas'],
      excludedItems: ['Comidas', 'Propinas'],
    },
  });

  // Benefits (make idempotent per package)
  await prisma.benefit.deleteMany({ where: { packageId: pkg.id } });
  await prisma.benefit.createMany({
    data: [
      {
        packageId: pkg.id,
        iconUrl: 'https://picsum.photos/seed/benefit1/64',
        title: 'Skip-the-line access',
        order: 1,
      },
      {
        packageId: pkg.id,
        iconUrl: 'https://picsum.photos/seed/benefit2/64',
        title: 'Small group experience',
        order: 2,
      },
    ],
  });

  // Create activities for this package and attach features/schedules
  // Activity: Machu Picchu Guided Visit
  let mpActivity = await prisma.activity.findFirst({
    where: {
      name: 'Machu Picchu Guided Visit',
      destinationCityId: cuscoCity.id,
    },
  });
  if (!mpActivity) {
    // Cast to any until Prisma client regenerated with Activity dates removed
    mpActivity = await (prisma as any).activity.create({
      data: {
        name: 'Machu Picchu Guided Visit',
        description: 'Guided tour inside Machu Picchu citadel.',
        destinationCityId: cuscoCity.id,
      },
    });
  } else {
    mpActivity = await (prisma as any).activity.update({
      where: { id: mpActivity.id },
      data: {
        description: 'Guided tour inside Machu Picchu citadel.',
        destinationCityId: cuscoCity.id,
      },
    });
  }
  await (prisma as any).touristPackageActivity.upsert({
    where: {
      packageId_activityId: { packageId: pkg.id, activityId: mpActivity!.id },
    },
    update: {
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-12-31T23:59:59.000Z'),
    },
    create: {
      packageId: pkg.id,
      activityId: mpActivity!.id,
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-12-31T23:59:59.000Z'),
    },
  });
  await prisma.schedule.deleteMany({ where: { activityId: mpActivity!.id } });
  await prisma.schedule.create({
    data: {
      activityId: mpActivity!.id,
      timezone: 'America/Lima',
      daysOfWeek: ['MON', 'WED', 'FRI'],
      startTime: '05:00',
      endTime: '17:00',
      notes: 'Subject to availability and weather conditions',
    },
  });
  await prisma.feature.deleteMany({ where: { activityId: mpActivity!.id } });
  await prisma.feature.createMany({
    data: [
      {
        activityId: mpActivity!.id,
        category: 'Comfort',
        iconUrl: 'https://picsum.photos/seed/feat1/64',
        name: 'Modern trains',
        description: 'Comfortable, panoramic windows',
        order: 1,
      },
      {
        activityId: mpActivity!.id,
        category: 'Guide',
        iconUrl: 'https://picsum.photos/seed/feat2/64',
        name: 'Bilingual guide',
        description: 'Spanish/English',
        order: 2,
      },
    ],
  });

  // Itinerary removed

  // Media (idempotent)
  await prisma.media.deleteMany({ where: { packageId: pkg.id } });
  await prisma.media.createMany({
    data: [
      {
        packageId: pkg.id,
        type: 'IMAGE',
        url: 'https://picsum.photos/seed/machu1/800/600',
        caption: 'Machu Picchu Overview',
        order: 1,
        isPrimary: true,
      },
      {
        packageId: pkg.id,
        type: 'IMAGE',
        url: 'https://picsum.photos/seed/machu2/800/600',
        caption: 'Sun Gate',
        order: 2,
      },
    ],
  });

  // Pickup details (idempotent)
  await prisma.pickupDetail.deleteMany({ where: { packageId: pkg.id } });
  await prisma.pickupDetail.create({
    data: {
      packageId: pkg.id,
      isHotelPickupAvailable: true,
      pickupRadiusKm: 5,
      pickupStartTime: '04:30',
      pickupEndTime: '05:00',
      instructions: 'Be ready in the lobby 10 minutes before pickup time',
    },
  });

  // Normalized itinerary locations (idempotent) - raw SQL instead of delegate
  await clearPackageLocations(pkg.id);
  await upsertPackageLocation(pkg.id, cuscoCity.id, 1, 'Start and main visit');
  await upsertPackageLocation(
    pkg.id,
    limaCity.id,
    2,
    'Connection through Lima (optional)',
  );

  // Pricing (idempotent)
  await prisma.pricingOption.deleteMany({ where: { packageId: pkg.id } });
  await prisma.pricingOption.createMany({
    data: [
      {
        packageId: pkg.id,
        name: 'Standard',
        description: 'Group tour',
        currencyId: pen.id,
        amount: '450.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 16,
        isActive: true,
      },
      {
        packageId: pkg.id,
        name: 'Private',
        description: 'Private guide',
        currencyId: usd.id,
        amount: '300.00',
        perPerson: true,
        minParticipants: 1,
        maxParticipants: 6,
        isActive: true,
      },
    ],
  });

  // Package-level schedule removed in favor of activity schedules

  // Auth tables (idempotent examples)
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: 'google-admin-123',
      },
    },
    update: {
      userId: adminUser.id,
      access_token: 'mock-access-token',
      token_type: 'Bearer',
      scope: 'openid profile email',
    },
    create: {
      userId: adminUser.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: 'google-admin-123',
      access_token: 'mock-access-token',
      token_type: 'Bearer',
      scope: 'openid profile email',
    },
  });

  await prisma.session.upsert({
    where: { sessionToken: 'session-admin-123' },
    update: {
      userId: adminUser.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    create: {
      userId: adminUser.id,
      sessionToken: 'session-admin-123',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  await prisma.verificationToken.upsert({
    where: {
      identifier_token: {
        identifier: 'admin@example.com',
        token: 'verify-admin-123',
      },
    },
    update: { expires: new Date(Date.now() + 1000 * 60 * 60) },
    create: {
      identifier: 'admin@example.com',
      token: 'verify-admin-123',
      expires: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  console.log('Seed data created successfully');

  // Additional Tourist Packages
  // Andes Travel
  await upsertTouristPackage({
    companyId: company.id,
    name: 'Sacred Valley Explorer',
    description:
      'Visit Pisac and Ollantaytambo with scenic views of the Sacred Valley.',
    duration: '1 day',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.7,
    meetingPoint: 'Cusco Main Square',
    meetingLatitude: -13.5167,
    meetingLongitude: -71.978,
    endPoint: 'Cusco Main Square',
    endLatitude: -13.5167,
    endLongitude: -71.978,
    timezone: 'America/Lima',
    bookingCutoff: '12h before start',
    requirements: ['Comfortable shoes'],
    safetyInfo: 'Stay hydrated and use sunscreen.',
    cancellationPolicy: 'Free cancellation up to 24h before.',
    representativeCityId: cuscoCity.id,
    locations: [
      { cityId: cuscoCity.id, order: 1, notes: 'Departure and return' },
      { cityId: pisacCity.id, order: 2, notes: 'Market and ruins' },
    ],
    pricing: [
      {
        name: 'Standard',
        description: 'Group tour',
        currencyId: pen.id,
        amount: '150.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 20,
      },
      {
        name: 'Private',
        description: 'Private transport',
        currencyId: usd.id,
        amount: '300.00',
        perPerson: false,
        minParticipants: 1,
        maxParticipants: 6,
      },
    ],
    benefits: [
      { title: 'Small group', order: 1 },
      { title: 'Local guide', order: 2 },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/sacred1/800/600',
        caption: 'Sacred Valley',
        order: 1,
        isPrimary: true,
      },
      {
        url: 'https://picsum.photos/seed/sacred2/800/600',
        caption: 'Pisac',
        order: 2,
      },
    ],
    pickup: {
      isHotelPickupAvailable: true,
      pickupRadiusKm: 5,
      pickupStartTime: '07:30',
      pickupEndTime: '08:00',
      instructions: 'Wait in lobby',
    },
    activities: [
      {
        name: 'Pisac Market Visit',
        description: 'Explore Pisac traditional market and ruins.',
        destinationCityId: pisacCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'WED', 'FRI'],
            startTime: '08:00',
            endTime: '12:00',
          },
        ],
        features: [
          {
            category: 'Transport',
            name: 'Air-conditioned van',
            description: 'Comfortable seats',
            order: 1,
          },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Sacred Valley Explorer',
        description: 'Visit Pisac and Ollantaytambo with scenic views.',
      },
      es: {
        name: 'Explorador del Valle Sagrado',
        description: 'Visita Pisac y Ollantaytambo con vistas panorámicas.',
      },
    },
    includedItems: ['Guide', 'Transport'],
    excludedItems: ['Lunch', 'Entrance tickets'],
  });

  await upsertTouristPackage({
    companyId: company.id,
    name: 'Rainbow Mountain Trek',
    description: 'Hike to the colorful Vinicunca mountain near Cusco.',
    duration: '1 day',
    type: 'GROUP',
    difficulty: 'CHALLENGING',
    languageId: en.id,
    rating: 4.6,
    meetingPoint: 'Cusco Main Square',
    meetingLatitude: -13.5167,
    meetingLongitude: -71.978,
    timezone: 'America/Lima',
    bookingCutoff: '24h before start',
    requirements: ['Warm clothing', 'Good physical condition'],
    safetyInfo: 'Altitude can be demanding.',
    cancellationPolicy: 'Free cancellation up to 24h before.',
    representativeCityId: cuscoCity.id,
    locations: [{ cityId: cuscoCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '180.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 15,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/rainbow/800/600',
        caption: 'Rainbow Mountain',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Vinicunca Summit Trek',
        description: 'Challenging hike to Rainbow Mountain summit.',
        destinationCityId: cuscoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['TUE', 'THU', 'SAT'],
            startTime: '04:00',
            endTime: '18:00',
          },
        ],
      },
    ],
    translations: {
      en: { name: 'Rainbow Mountain Trek', description: 'Hike to Vinicunca.' },
      es: {
        name: 'Trekking Montaña de 7 Colores',
        description: 'Caminata a Vinicunca.',
      },
    },
    includedItems: ['Breakfast', 'Guide'],
    excludedItems: ['Entrance fee'],
  });

  // Inca Trails
  await upsertTouristPackage({
    companyId: incaTrails.id,
    name: 'Inca Trail 2D1N',
    description: 'Short Inca Trail to Machu Picchu over two days.',
    duration: '2D1N',
    type: 'GROUP',
    difficulty: 'MODERATE',
    languageId: en.id,
    rating: 4.8,
    meetingPoint: 'Cusco Main Square',
    meetingLatitude: -13.5167,
    meetingLongitude: -71.978,
    timezone: 'America/Lima',
    bookingCutoff: '72h before start',
    requirements: ['Passport required'],
    representativeCityId: cuscoCity.id,
    locations: [{ cityId: cuscoCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: usd.id,
        amount: '520.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 12,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/inca2d/800/600',
        caption: 'Inca Trail',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Short Inca Trail Hike',
        description: 'Hike from Km104 to Machu Picchu over 2 days.',
        destinationCityId: cuscoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'THU'],
            startTime: '07:00',
            endTime: '12:00',
          },
        ],
      },
    ],
    translations: {
      en: { name: 'Inca Trail 2D1N', description: 'Short Inca Trail.' },
      es: { name: 'Camino Inca 2D1N', description: 'Camino Inca corto.' },
    },
    includedItems: ['Entrance tickets', 'Guide'],
    excludedItems: ['Meals'],
  });

  await upsertTouristPackage({
    companyId: incaTrails.id,
    name: 'Humantay Lake Day Hike',
    description: 'Laguna Humantay day hike from Cusco.',
    duration: '1 day',
    type: 'GROUP',
    difficulty: 'MODERATE',
    languageId: en.id,
    rating: 4.6,
    meetingPoint: 'Cusco Main Square',
    meetingLatitude: -13.5167,
    meetingLongitude: -71.978,
    timezone: 'America/Lima',
    representativeCityId: cuscoCity.id,
    locations: [{ cityId: cuscoCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '160.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 16,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/humantay/800/600',
        caption: 'Humantay Lake',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Humantay Lake Hike',
        description: 'Day hike to Humantay Lake from Cusco.',
        destinationCityId: cuscoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['TUE', 'FRI', 'SUN'],
            startTime: '04:00',
            endTime: '17:00',
          },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Humantay Lake Day Hike',
        description: 'Lagoon hike from Cusco.',
      },
      es: {
        name: 'Caminata a Laguna Humantay',
        description: 'Caminata de un día desde Cusco.',
      },
    },
    includedItems: ['Breakfast'],
    excludedItems: ['Entrance fees'],
  });

  // Pacific Adventures - Lima area
  await upsertTouristPackage({
    companyId: pacificAdventures.id,
    name: 'Lima Historic Center Walking Tour',
    description:
      'Discover colonial architecture and main squares in downtown Lima.',
    duration: '4h',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.4,
    meetingPoint: 'Plaza Mayor de Lima',
    meetingLatitude: -12.0464,
    meetingLongitude: -77.0428,
    timezone: 'America/Lima',
    representativeCityId: limaCity.id,
    locations: [{ cityId: limaCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '40.00',
        perPerson: true,
        minParticipants: 1,
        maxParticipants: 20,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/lima-center/800/600',
        caption: 'Lima Center',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Historic Center Walking Tour',
        description: 'Guided walk through Lima historic center.',
        destinationCityId: limaCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
            startTime: '09:00',
            endTime: '13:00',
          },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Lima Historic Center Walking Tour',
        description: 'Discover colonial Lima.',
      },
      es: {
        name: 'Tour a Pie por el Centro Histórico de Lima',
        description: 'Descubre la Lima colonial.',
      },
    },
    includedItems: ['Guide'],
    excludedItems: ['Museum tickets'],
  });

  await upsertTouristPackage({
    companyId: pacificAdventures.id,
    name: 'Miraflores & Barranco Bike Tour',
    description:
      'Coastal ride through Miraflores cliffs and artistic Barranco district.',
    duration: '3h',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.5,
    meetingPoint: 'Parque Kennedy, Miraflores',
    meetingLatitude: -12.1196,
    meetingLongitude: -77.0315,
    timezone: 'America/Lima',
    representativeCityId: mirafloresCity.id,
    locations: [
      { cityId: mirafloresCity.id, order: 1 },
      { cityId: barrancoCity.id, order: 2 },
    ],
    pricing: [
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '35.00',
        perPerson: true,
        minParticipants: 1,
        maxParticipants: 15,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/bike/800/600',
        caption: 'Costa Verde Bike',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Miraflores & Barranco Coastal Bike',
        description: 'Ride along Costa Verde and Barranco highlights.',
        destinationCityId: mirafloresCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['SAT', 'SUN'],
            startTime: '10:00',
            endTime: '13:00',
          },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Miraflores & Barranco Bike Tour',
        description: 'Coastal bike experience.',
      },
      es: {
        name: 'Tour en Bicicleta Miraflores y Barranco',
        description: 'Recorrido costero en bicicleta.',
      },
    },
    includedItems: ['Bike', 'Helmet', 'Guide'],
    excludedItems: ['Snacks'],
  });

  // International samples
  await upsertTouristPackage({
    companyId: pacificAdventures.id,
    name: 'Rio de Janeiro Highlights',
    description: 'Christ the Redeemer, Sugarloaf Mountain and Copacabana.',
    duration: '1 day',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.6,
    meetingPoint: 'Copacabana Beach',
    meetingLatitude: -22.9712,
    meetingLongitude: -43.1822,
    timezone: 'America/Sao_Paulo',
    representativeCityId: rioCity.id,
    locations: [{ cityId: rioCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: brl.id,
        amount: '280.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 20,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/rio/800/600',
        caption: 'Rio',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Rio Highlights Tour',
        description: 'Christ the Redeemer, Sugarloaf, Copacabana.',
        destinationCityId: rioCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Sao_Paulo',
            daysOfWeek: ['MON', 'WED', 'FRI'],
            startTime: '08:00',
            endTime: '17:00',
          },
          {
            timezone: 'America/Sao_Paulo',
            daysOfWeek: ['SAT'],
            startTime: '09:00',
            endTime: '18:00',
            notes: 'Weekend extended hours',
          },
        ],
        features: [
          { category: 'Viewpoints', name: 'Sugarloaf Cable Car', order: 1 },
          { category: 'Iconic', name: 'Christ the Redeemer Stop', order: 2 },
        ],
      },
      {
        name: 'Copacabana Sunset Walk',
        description: 'Guided beach walk with sunset viewpoints.',
        destinationCityId: rioCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Sao_Paulo',
            daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
            startTime: '16:30',
            endTime: '19:30',
            notes: 'Best light conditions',
          },
        ],
        features: [
          { category: 'Leisure', name: 'Beachfront Walk', order: 1 },
          { category: 'Photography', name: 'Sunset Spots', order: 2 },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Rio de Janeiro Highlights',
        description: 'Must-see Rio attractions.',
      },
      es: {
        name: 'Lo Mejor de Río de Janeiro',
        description: 'Atracciones imperdibles de Río.',
      },
    },
    includedItems: ['Transport', 'Guide'],
    excludedItems: ['Tickets'],
  });

  await upsertTouristPackage({
    companyId: pacificAdventures.id,
    name: 'Santiago City and Wine',
    description: 'City landmarks and nearby winery visit.',
    duration: '1 day',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.5,
    meetingPoint: 'Plaza de Armas, Santiago',
    meetingLatitude: -33.4372,
    meetingLongitude: -70.6506,
    timezone: 'America/Santiago',
    representativeCityId: santiagoCity.id,
    locations: [{ cityId: santiagoCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: clp.id,
        amount: '45000.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 18,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/santiago/800/600',
        caption: 'Santiago',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Santiago City and Winery Tour',
        description: 'City landmarks followed by winery visit.',
        destinationCityId: santiagoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Santiago',
            daysOfWeek: ['TUE', 'THU', 'SAT'],
            startTime: '09:00',
            endTime: '17:30',
          },
        ],
        features: [
          { category: 'Wine', name: 'Cellar Visit', order: 1 },
          { category: 'Tasting', name: 'Premium Selection', order: 2 },
        ],
      },
      {
        name: 'Andes Morning Scenic Drive',
        description: 'Panoramic viewpoints near Santiago early hours.',
        destinationCityId: santiagoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Santiago',
            daysOfWeek: ['SUN'],
            startTime: '06:30',
            endTime: '11:30',
            notes: 'Sunrise drive (seasonal)',
          },
        ],
        features: [
          { category: 'Scenic', name: 'Mountain Viewpoints', order: 1 },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Santiago City and Wine',
        description: 'City tour and winery.',
      },
      es: { name: 'Santiago Ciudad y Vino', description: 'Ciudad y viñedo.' },
    },
    includedItems: ['Guide'],
    excludedItems: ['Wine tasting fee'],
  });

  // New enriched packages
  await upsertTouristPackage({
    companyId: company.id,
    name: 'Cusco Culinary Evening',
    description:
      'Explore Andean fusion cuisine with local market visit and tasting menu.',
    duration: '6h',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.7,
    meetingPoint: 'San Pedro Market Entrance',
    meetingLatitude: -13.5226,
    meetingLongitude: -71.9757,
    timezone: 'America/Lima',
    representativeCityId: cuscoCity.id,
    locations: [{ cityId: cuscoCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '95.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 14,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-06-30'),
      },
      {
        name: 'High Season',
        currencyId: pen.id,
        amount: '110.00',
        perPerson: true,
        minParticipants: 2,
        maxParticipants: 14,
        validFrom: new Date('2025-07-01'),
        validTo: new Date('2025-12-31'),
      },
    ],
    benefits: [
      { title: 'Chef-led tasting', order: 1 },
      { title: 'Local market immersion', order: 2 },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/cuscofood1/800/600',
        caption: 'Market produce',
        order: 1,
        isPrimary: true,
      },
      {
        url: 'https://picsum.photos/seed/cuscofood2/800/600',
        caption: 'Tasting session',
        order: 2,
      },
    ],
    activities: [
      {
        name: 'Cusco Market Tour',
        description: 'Guided walk through stalls: potatoes, corn, cacao.',
        destinationCityId: cuscoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'WED', 'FRI'],
            startTime: '15:00',
            endTime: '16:30',
          },
        ],
        features: [
          { category: 'Food', name: 'Local Produce Sampling', order: 1 },
        ],
      },
      {
        name: 'Andean Fusion Dinner',
        description: 'Multi-course tasting with native ingredients.',
        destinationCityId: cuscoCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'WED', 'FRI'],
            startTime: '17:00',
            endTime: '21:00',
          },
        ],
        features: [
          { category: 'Cuisine', name: 'Quinoa Variations', order: 1 },
          { category: 'Cuisine', name: 'Cacao Dessert', order: 2 },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Cusco Culinary Evening',
        description: 'Market tour and Andean tasting menu.',
      },
      es: {
        name: 'Noche Gastronómica en Cusco',
        description: 'Recorrido por mercado y menú de degustación andino.',
      },
    },
    includedItems: ['Guide', 'Dinner', 'Tasting samples'],
    excludedItems: ['Alcoholic drinks'],
  });

  await upsertTouristPackage({
    companyId: pacificAdventures.id,
    name: 'Lima Gastronomy Tour',
    description: 'Street food, ceviche workshop and dessert trail.',
    duration: '1 day',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.8,
    meetingPoint: 'Parque Kennedy, Miraflores',
    meetingLatitude: -12.1196,
    meetingLongitude: -77.0315,
    timezone: 'America/Lima',
    representativeCityId: limaCity.id,
    locations: [{ cityId: limaCity.id, order: 1 }],
    pricing: [
      {
        name: 'Early Bird',
        currencyId: pen.id,
        amount: '70.00',
        perPerson: true,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-03-31'),
      },
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '85.00',
        perPerson: true,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/limaceviche/800/600',
        caption: 'Ceviche prep',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Ceviche Workshop',
        description: 'Hands-on class with local chef.',
        destinationCityId: limaCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['TUE', 'THU', 'SAT'],
            startTime: '11:00',
            endTime: '13:00',
          },
        ],
        features: [
          { category: 'Cooking', name: 'Fish Preparation', order: 1 },
          { category: 'Cooking', name: 'Citrus Techniques', order: 2 },
        ],
      },
      {
        name: 'Dessert Trail',
        description: 'Sampling Peruvian desserts in local cafés.',
        destinationCityId: limaCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['TUE', 'THU', 'SAT'],
            startTime: '15:00',
            endTime: '17:30',
          },
        ],
        features: [
          { category: 'Sweet', name: 'Picarones Tasting', order: 1 },
          { category: 'Sweet', name: 'Lucuma Ice Cream', order: 2 },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Lima Gastronomy Tour',
        description: 'Ceviche workshop & dessert trail.',
      },
      es: {
        name: 'Tour Gastronómico Lima',
        description: 'Taller de ceviche y ruta de postres.',
      },
    },
    includedItems: ['Workshop ingredients', 'Dessert samples'],
    excludedItems: ['Alcoholic drinks'],
  });

  await upsertTouristPackage({
    companyId: pacificAdventures.id,
    name: 'Rio Night Samba Experience',
    description: 'Evening samba class and live music venue visit.',
    duration: '5h',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.9,
    meetingPoint: 'Lapa Arches',
    meetingLatitude: -22.9122,
    meetingLongitude: -43.1789,
    timezone: 'America/Sao_Paulo',
    representativeCityId: rioCity.id,
    locations: [{ cityId: rioCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: brl.id,
        amount: '190.00',
        perPerson: true,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/samba/800/600',
        caption: 'Samba class',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Samba Dance Class',
        description: 'Learn basics with professional instructor.',
        destinationCityId: rioCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Sao_Paulo',
            daysOfWeek: ['FRI', 'SAT'],
            startTime: '18:00',
            endTime: '19:30',
          },
        ],
        features: [{ category: 'Dance', name: 'Beginner Friendly', order: 1 }],
      },
      {
        name: 'Live Samba Venue',
        description: 'Local club with live band and dance floor.',
        destinationCityId: rioCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Sao_Paulo',
            daysOfWeek: ['FRI', 'SAT'],
            startTime: '20:00',
            endTime: '23:00',
            notes: 'Peak music sets after 21:00',
          },
        ],
        features: [
          { category: 'Music', name: 'Live Band', order: 1 },
          { category: 'Atmosphere', name: 'Historic Venue', order: 2 },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Rio Night Samba Experience',
        description: 'Dance class & live music.',
      },
      es: {
        name: 'Experiencia Nocturna Samba Río',
        description: 'Clase y música en vivo.',
      },
    },
    includedItems: ['Dance class', 'Entrance ticket'],
    excludedItems: ['Drinks'],
  });

  await upsertTouristPackage({
    companyId: incaTrails.id,
    name: 'Pisac Artisan Workshop',
    description: 'Hands-on textile and silver crafting half-day.',
    duration: '5h',
    type: 'GROUP',
    difficulty: 'EASY',
    languageId: en.id,
    rating: 4.6,
    meetingPoint: 'Pisac Plaza',
    meetingLatitude: -13.4223,
    meetingLongitude: -71.8537,
    timezone: 'America/Lima',
    representativeCityId: pisacCity.id,
    locations: [{ cityId: pisacCity.id, order: 1 }],
    pricing: [
      {
        name: 'Standard',
        currencyId: pen.id,
        amount: '65.00',
        perPerson: true,
      },
    ],
    media: [
      {
        url: 'https://picsum.photos/seed/pisacwork/800/600',
        caption: 'Artisan tools',
        order: 1,
        isPrimary: true,
      },
    ],
    activities: [
      {
        name: 'Textile Weaving Basics',
        description: 'Learn traditional patterns with local artisan.',
        destinationCityId: pisacCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'WED'],
            startTime: '09:00',
            endTime: '11:30',
          },
        ],
        features: [{ category: 'Craft', name: 'Loom Practice', order: 1 }],
      },
      {
        name: 'Silver Jewelry Craft',
        description: 'Create a simple ring or pendant.',
        destinationCityId: pisacCity.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        schedules: [
          {
            timezone: 'America/Lima',
            daysOfWeek: ['MON', 'WED'],
            startTime: '12:00',
            endTime: '14:30',
          },
        ],
        features: [
          { category: 'Craft', name: 'Basic Silversmith Tools', order: 1 },
        ],
      },
    ],
    translations: {
      en: {
        name: 'Pisac Artisan Workshop',
        description: 'Textile and silver crafting.',
      },
      es: {
        name: 'Taller Artesano Pisac',
        description: 'Textil y orfebrería.',
      },
    },
    includedItems: ['Materials', 'Instruction'],
    excludedItems: ['Lunch'],
  });
}

async function deleteData() {
  // Delete in dependency-safe order
  await prisma.benefit.deleteMany();
  // Activity-linked data first
  await prisma.schedule.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.touristPackageActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.media.deleteMany();
  await prisma.packageLanguage.deleteMany();
  await prisma.pickupDetail.deleteMany();
  await prisma.pricingOption.deleteMany();
  await prisma.touristPackageTranslation.deleteMany();
  // Remove normalized locations before packages (raw SQL)
  await prisma.$executeRaw`DELETE FROM "PackageLocation"`;
  await prisma.touristPackage.deleteMany();

  await prisma.companyInstallation.deleteMany();
  await prisma.companyWorker.deleteMany();
  await prisma.tourismCompanyTranslation.deleteMany();
  await prisma.tourismCompany.deleteMany();

  await prisma.permission.deleteMany();
  await prisma.tourist.deleteMany();
  await prisma.systemAdmin.deleteMany();
  await prisma.companyAdmin.deleteMany();

  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();

  await prisma.phone.deleteMany();
  await prisma.postalCode.deleteMany();

  await prisma.cityTranslation.deleteMany();
  await prisma.city.deleteMany();

  await prisma.regionTranslation.deleteMany();
  await prisma.region.deleteMany();

  await prisma.countryTranslation.deleteMany();
  await prisma.country.deleteMany();

  await prisma.currency.deleteMany();
  await prisma.language.deleteMany();

  await prisma.user.deleteMany();

  console.log('All seed data deleted successfully');
}

async function main() {
  const action = process.argv[2];
  if (!action || !['create', 'delete'].includes(action)) {
    console.log('Usage: ts-node prisma/seed.ts <create|delete>');
    process.exit(1);
  }

  if (action === 'create') {
    await createData();
  } else if (action === 'delete') {
    await deleteData();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
