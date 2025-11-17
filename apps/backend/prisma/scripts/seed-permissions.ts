import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to seed all company permissions in the database
 * Run with: pnpm exec ts-node prisma/scripts/seed-permissions.ts
 */
async function seedPermissions() {
  const permissions = [
    'package:create',
    'package:edit',
    'package:delete',
    'package:view',
    'worker:invite',
    'worker:edit',
    'worker:remove',
    'worker:view',
    'company:create',
    'company:edit',
    'company:delete',
    'company:view',
    'installation:create',
    'installation:edit',
    'installation:delete',
    'installation:view',
    'booking:create',
    'booking:edit',
    'booking:cancel',
    'booking:view',
    'analytics:view',
  ];

  console.log('Starting permission seeding...');

  for (const permissionName of permissions) {
    await prisma.permission.upsert({
      where: { name: permissionName },
      update: {},
      create: { name: permissionName },
    });
    console.log(`✓ ${permissionName}`);
  }

  console.log(`\n✅ Successfully seeded ${permissions.length} permissions`);
}

seedPermissions()
  .catch((e) => {
    console.error('Error seeding permissions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
