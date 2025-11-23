import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const currencies = await prisma.currency.findMany({
    orderBy: { id: 'asc' },
  });

  console.log('Currencies in database:');
  currencies.forEach((currency) => {
    console.log(
      `ID: ${currency.id}, Code: ${currency.code}, Name: ${currency.name}, Symbol: ${currency.symbol}`,
    );
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
