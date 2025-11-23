import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    include: {
      User: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      TouristPackage: {
        select: {
          id: true,
          name: true,
        },
      },
      Currency: true,
    },
    orderBy: { bookingDate: 'desc' },
  });

  console.log(`\nTotal bookings in database: ${bookings.length}\n`);

  if (bookings.length === 0) {
    console.log('No bookings found in the database.');
  } else {
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. Booking ID: ${booking.id}`);
      console.log(`   User: ${booking.User.name} (${booking.User.email})`);
      console.log(`   Package: ${booking.TouristPackage.name}`);
      console.log(
        `   Travel Date: ${booking.travelDate.toISOString().split('T')[0]}`,
      );
      console.log(`   Status: ${booking.status}`);
      console.log(
        `   Amount: ${booking.Currency.symbol}${booking.totalAmount}`,
      );
      console.log(`   Participants: ${booking.numberOfParticipants}`);
      console.log(`   Booked on: ${booking.bookingDate.toISOString()}`);
      console.log('');
    });
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
