/*
  Warnings:

  - You are about to drop the `Tourist` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'AUTHORIZED', 'IN_PROCESS', 'IN_MEDIATION', 'REJECTED', 'CANCELLED', 'REFUNDED', 'CHARGED_BACK');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_emergencyPhoneId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Tourist" DROP CONSTRAINT "Tourist_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currencyId" INTEGER,
ADD COLUMN     "emergencyPhoneId" INTEGER,
ADD COLUMN     "languageId" INTEGER;

-- DropTable
DROP TABLE "Tourist";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,
    "pricingOptionId" INTEGER,
    "paymentId" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "currencyId" INTEGER NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "commissionPercentage" DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    "commissionAmount" DECIMAL(12,2) NOT NULL,
    "companyAmount" DECIMAL(12,2) NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "numberOfParticipants" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentId_key" ON "Booking"("paymentId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_packageId_idx" ON "Booking"("packageId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emergencyPhoneId_fkey" FOREIGN KEY ("emergencyPhoneId") REFERENCES "Phone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TouristPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_pricingOptionId_fkey" FOREIGN KEY ("pricingOptionId") REFERENCES "PricingOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
