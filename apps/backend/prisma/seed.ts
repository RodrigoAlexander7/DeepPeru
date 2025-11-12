import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensurePhone(number: string, countryId: number) {
  const existing = await prisma.phone.findFirst({ where: { number, countryId } });
  if (existing) return existing;
  const last = await prisma.phone.findFirst({ select: { id: true }, orderBy: { id: 'desc' } });
  const nextId = (last?.id ?? 0) + 1;
  return prisma.phone.create({ data: { id: nextId, number, countryId } });
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

  // Currencies (code is not unique in schema, so find-or-create)
  const usd =
    (await prisma.currency.findFirst({ where: { code: 'USD' } })) ??
    (await prisma.currency.create({ data: { code: 'USD', name: 'US Dollar', symbol: '$' } }));
  const pen =
    (await prisma.currency.findFirst({ where: { code: 'PEN' } })) ??
    (await prisma.currency.create({ data: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' } }));

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

  // Country Translations
  await prisma.$transaction([
    prisma.countryTranslation.upsert({
      where: { countryId_languageId: { countryId: peru.id, languageId: en.id } },
      update: { name: 'Peru' },
      create: { countryId: peru.id, languageId: en.id, name: 'Peru' },
    }),
    prisma.countryTranslation.upsert({
      where: { countryId_languageId: { countryId: peru.id, languageId: es.id } },
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
  ]);

  // Regions (Peru) - find-or-create by name and country
  const limaRegion =
    (await prisma.region.findFirst({ where: { name: 'Lima', countryId: peru.id } })) ??
    (await prisma.region.create({ data: { name: 'Lima', code: 'LIM', countryId: peru.id } }));
  const cuscoRegion =
    (await prisma.region.findFirst({ where: { name: 'Cusco', countryId: peru.id } })) ??
    (await prisma.region.create({ data: { name: 'Cusco', code: 'CUS', countryId: peru.id } }));

  // Region Translations
  await prisma.$transaction([
    prisma.regionTranslation.upsert({
      where: { regionId_languageId: { regionId: limaRegion.id, languageId: en.id } },
      update: { name: 'Lima' },
      create: { regionId: limaRegion.id, languageId: en.id, name: 'Lima' },
    }),
    prisma.regionTranslation.upsert({
      where: { regionId_languageId: { regionId: limaRegion.id, languageId: es.id } },
      update: { name: 'Lima' },
      create: { regionId: limaRegion.id, languageId: es.id, name: 'Lima' },
    }),
    prisma.regionTranslation.upsert({
      where: { regionId_languageId: { regionId: cuscoRegion.id, languageId: en.id } },
      update: { name: 'Cusco' },
      create: { regionId: cuscoRegion.id, languageId: en.id, name: 'Cusco' },
    }),
    prisma.regionTranslation.upsert({
      where: { regionId_languageId: { regionId: cuscoRegion.id, languageId: es.id } },
      update: { name: 'Cusco' },
      create: { regionId: cuscoRegion.id, languageId: es.id, name: 'Cusco' },
    }),
  ]);

  // Cities
  const limaCity =
    (await prisma.city.findFirst({ where: { name: 'Lima', regionId: limaRegion.id } })) ??
    (await prisma.city.create({ data: { name: 'Lima', regionId: limaRegion.id } }));
  const cuscoCity =
    (await prisma.city.findFirst({ where: { name: 'Cusco', regionId: cuscoRegion.id } })) ??
    (await prisma.city.create({ data: { name: 'Cusco', regionId: cuscoRegion.id } }));

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
  ]);

  // Postal Code (find-or-create)
  const limaPostal =
    (await prisma.postalCode.findFirst({ where: { code: '15000', cityId: limaCity.id } })) ??
    (await prisma.postalCode.create({ data: { code: '15000', cityId: limaCity.id } }));

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
  let company = await prisma.tourismCompany.findFirst({ where: { name: 'Andes Travel' } });
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
  await prisma.companyAdmin.update({ where: { id: companyAdmin.id }, data: { tourismCompanyId: company.id } });

  // Company Translations (idempotent)
  await prisma.tourismCompanyTranslation.upsert({
    where: { companyId_languageId: { companyId: company.id, languageId: en.id } },
    update: { description: 'Adventure and cultural tours across the Andes', tagline: 'Explore the heights' },
    create: { companyId: company.id, languageId: en.id, description: 'Adventure and cultural tours across the Andes', tagline: 'Explore the heights' },
  });
  await prisma.tourismCompanyTranslation.upsert({
    where: { companyId_languageId: { companyId: company.id, languageId: es.id } },
    update: { description: 'Tours de aventura y cultura por los Andes', tagline: 'Explora las alturas' },
    create: { companyId: company.id, languageId: es.id, description: 'Tours de aventura y cultura por los Andes', tagline: 'Explora las alturas' },
  });

  // Company Installation (find-or-create by name + company)
  const mainOffice =
    (await prisma.companyInstallation.findFirst({ where: { name: 'Main Office', companyId: company.id } })) ??
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
    prisma.permission.upsert({ where: { name: 'MANAGE_PACKAGES' }, update: {}, create: { name: 'MANAGE_PACKAGES' } }),
    prisma.permission.upsert({ where: { name: 'MANAGE_WORKERS' }, update: {}, create: { name: 'MANAGE_WORKERS' } }),
  ]);

  // Company Worker (idempotent on compound unique)
  const worker = await prisma.companyWorker.upsert({
    where: { userId_companyId: { userId: workerUser.id, companyId: company.id } },
    update: { role: 'Guide Manager', isActive: true, Permission: { set: [{ id: permPackages.id }, { id: permWorkers.id }] } },
    create: {
      userId: workerUser.id,
      companyId: company.id,
      role: 'Guide Manager',
      isActive: true,
      Permission: { connect: [{ id: permPackages.id }, { id: permWorkers.id }] },
    },
    include: { Permission: true },
  });

  // Tourist (idempotent)
  const tourist = await prisma.tourist.upsert({
    where: { userId: touristUser.id },
    update: { languageId: es.id, currencyId: usd.id, emergencyPhoneId: emergencyPhone.id },
    create: { userId: touristUser.id, languageId: es.id, currencyId: usd.id, emergencyPhoneId: emergencyPhone.id },
  });

  // Helper: set representative city via raw SQL (bypasses stale client types)
  async function setRepresentativeCity(packageId: number, cityId: number) {
    await prisma.$executeRaw`UPDATE "TouristPackage" SET "representativeCityId" = ${cityId} WHERE "id" = ${packageId}`;
  }

  // Helpers for PackageLocation via raw SQL
  async function clearPackageLocations(packageId: number) {
    await prisma.$executeRaw`DELETE FROM "PackageLocation" WHERE "packageId" = ${packageId}`;
  }
  async function upsertPackageLocation(
    packageId: number,
    cityId: number,
    ord: number,
    notes: string | null
  ) {
    await prisma.$executeRaw`
      INSERT INTO "PackageLocation" ("packageId","cityId","order","notes","createdAt")
      VALUES (${packageId}, ${cityId}, ${ord}, ${notes}, ${new Date()})
      ON CONFLICT ("packageId","cityId")
      DO UPDATE SET "order" = EXCLUDED."order", "notes" = EXCLUDED."notes"
    `;
  }

  // Tourist Package (find-or-create by company + name)
  let pkg = await prisma.touristPackage.findFirst({ where: { companyId: company.id, name: 'Machu Picchu Full Day' } });
  if (!pkg) {
    pkg = await prisma.touristPackage.create({
      data: {
        companyId: company.id,
        name: 'Machu Picchu Full Day',
        description: 'Experience the wonder of Machu Picchu in a full-day guided tour.',
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
  await prisma.packageLanguage.upsert({ where: { packageId_languageId: { packageId: pkg.id, languageId: en.id } }, update: {}, create: { packageId: pkg.id, languageId: en.id } });
  await prisma.packageLanguage.upsert({ where: { packageId_languageId: { packageId: pkg.id, languageId: es.id } }, update: {}, create: { packageId: pkg.id, languageId: es.id } });

  // Package Translations (idempotent) - remove additionalInfo (not in translation schema)
  await prisma.touristPackageTranslation.upsert({
    where: { packageId_languageId: { packageId: pkg.id, languageId: en.id } },
    update: {
      name: 'Machu Picchu Full Day',
      description: 'Experience the wonder of Machu Picchu in a full-day guided tour.',
      meetingPoint: 'Cusco Main Square',
      endPoint: 'Cusco Train Station',
      cancellationPolicy: 'Free cancellation up to 48h before departure.',
      requirements: ['Valid passport', 'Comfortable shoes'],
      includedItems: ['Professional guide', 'Train tickets', 'Entrance tickets'],
      excludedItems: ['Meals', 'Tips'],
    },
    create: {
      packageId: pkg.id,
      languageId: en.id,
      name: 'Machu Picchu Full Day',
      description: 'Experience the wonder of Machu Picchu in a full-day guided tour.',
      meetingPoint: 'Cusco Main Square',
      endPoint: 'Cusco Train Station',
      cancellationPolicy: 'Free cancellation up to 48h before departure.',
      requirements: ['Valid passport', 'Comfortable shoes'],
      includedItems: ['Professional guide', 'Train tickets', 'Entrance tickets'],
      excludedItems: ['Meals', 'Tips'],
    },
  });
  await prisma.touristPackageTranslation.upsert({
    where: { packageId_languageId: { packageId: pkg.id, languageId: es.id } },
    update: {
      name: 'Machu Picchu Día Completo',
      description: 'Vive la maravilla de Machu Picchu en un tour guiado de día completo.',
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
      description: 'Vive la maravilla de Machu Picchu en un tour guiado de día completo.',
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
      { packageId: pkg.id, iconUrl: 'https://picsum.photos/seed/benefit1/64', title: 'Skip-the-line access', order: 1 },
      { packageId: pkg.id, iconUrl: 'https://picsum.photos/seed/benefit2/64', title: 'Small group experience', order: 2 },
    ],
  });

  // Features (idempotent)
  await prisma.feature.deleteMany({ where: { packageId: pkg.id } });
  await prisma.feature.createMany({
    data: [
      { packageId: pkg.id, category: 'Comfort', iconUrl: 'https://picsum.photos/seed/feat1/64', name: 'Modern trains', description: 'Comfortable, panoramic windows', order: 1 },
      { packageId: pkg.id, category: 'Guide', iconUrl: 'https://picsum.photos/seed/feat2/64', name: 'Bilingual guide', description: 'Spanish/English', order: 2 },
    ],
  });

  // Itinerary and items (idempotent)
  const existingItins = await prisma.itinerary.findMany({ where: { packageId: pkg.id }, select: { id: true } });
  if (existingItins.length) {
    await prisma.itineraryItem.deleteMany({ where: { itineraryId: { in: existingItins.map((i) => i.id) } } });
    await prisma.itinerary.deleteMany({ where: { id: { in: existingItins.map((i) => i.id) } } });
  }
  const itin = await prisma.itinerary.create({ data: { packageId: pkg.id, title: 'Full Day Itinerary', days: 1 } });
  await prisma.itineraryItem.createMany({
    data: [
      { itineraryId: itin.id, dayNumber: 1, title: 'Departure from Cusco', description: 'Early morning pickup', startTime: '05:00', endTime: '06:00', order: 1 },
      { itineraryId: itin.id, dayNumber: 1, title: 'Train to Aguas Calientes', description: 'Scenic train ride', startTime: '06:30', endTime: '08:30', order: 2 },
      { itineraryId: itin.id, dayNumber: 1, title: 'Machu Picchu Tour', description: 'Guided visit', startTime: '09:00', endTime: '12:00', order: 3 },
    ],
  });

  // Media (idempotent)
  await prisma.media.deleteMany({ where: { packageId: pkg.id } });
  await prisma.media.createMany({
    data: [
      { packageId: pkg.id, type: 'IMAGE', url: 'https://picsum.photos/seed/machu1/800/600', caption: 'Machu Picchu Overview', order: 1, isPrimary: true },
      { packageId: pkg.id, type: 'IMAGE', url: 'https://picsum.photos/seed/machu2/800/600', caption: 'Sun Gate', order: 2 },
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
  await upsertPackageLocation(pkg.id, limaCity.id, 2, 'Connection through Lima (optional)');

  // Pricing (idempotent)
  await prisma.pricingOption.deleteMany({ where: { packageId: pkg.id } });
  await prisma.pricingOption.createMany({
    data: [
      { packageId: pkg.id, name: 'Standard', description: 'Group tour', currencyId: pen.id, amount: '450.00', perPerson: true, minParticipants: 2, maxParticipants: 16, isActive: true },
      { packageId: pkg.id, name: 'Private', description: 'Private guide', currencyId: usd.id, amount: '300.00', perPerson: true, minParticipants: 1, maxParticipants: 6, isActive: true },
    ],
  });

  // Schedule (idempotent)
  await prisma.schedule.deleteMany({ where: { packageId: pkg.id } });
  await prisma.schedule.create({
    data: {
      packageId: pkg.id,
      timezone: 'America/Lima',
      daysOfWeek: ['MON', 'WED', 'FRI'],
      startTime: '05:00',
      endTime: '17:00',
      notes: 'Subject to availability and weather conditions',
    },
  });

  // Auth tables (idempotent examples)
  await prisma.account.upsert({
    where: { provider_providerAccountId: { provider: 'google', providerAccountId: 'google-admin-123' } },
    update: { userId: adminUser.id, access_token: 'mock-access-token', token_type: 'Bearer', scope: 'openid profile email' },
    create: { userId: adminUser.id, type: 'oauth', provider: 'google', providerAccountId: 'google-admin-123', access_token: 'mock-access-token', token_type: 'Bearer', scope: 'openid profile email' },
  });

  await prisma.session.upsert({
    where: { sessionToken: 'session-admin-123' },
    update: { userId: adminUser.id, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
    create: { userId: adminUser.id, sessionToken: 'session-admin-123', expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: 'admin@example.com', token: 'verify-admin-123' } },
    update: { expires: new Date(Date.now() + 1000 * 60 * 60) },
    create: { identifier: 'admin@example.com', token: 'verify-admin-123', expires: new Date(Date.now() + 1000 * 60 * 60) },
  });

  console.log('Seed data created successfully');
}

async function deleteData() {
  // Delete in dependency-safe order
  await prisma.itineraryItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.media.deleteMany();
  await prisma.packageLanguage.deleteMany();
  await prisma.pickupDetail.deleteMany();
  await prisma.pricingOption.deleteMany();
  await prisma.schedule.deleteMany();
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
