/*
  Warnings:

  - You are about to drop the column `packageId` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `packageId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Itinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItineraryItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `activityId` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_packageId_fkey";

-- DropForeignKey
ALTER TABLE "ItineraryItem" DROP CONSTRAINT "ItineraryItem_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_packageId_fkey";

-- DropIndex
DROP INDEX "Feature_packageId_idx";

-- DropIndex
DROP INDEX "Schedule_packageId_idx";

-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "packageId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "packageId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Itinerary";

-- DropTable
DROP TABLE "ItineraryItem";

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "destinationCityId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TouristPackageActivity" (
    "packageId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TouristPackageActivity_pkey" PRIMARY KEY ("packageId","activityId")
);

-- CreateIndex
CREATE INDEX "TouristPackageActivity_activityId_idx" ON "TouristPackageActivity"("activityId");

-- CreateIndex
CREATE INDEX "TouristPackageActivity_packageId_idx" ON "TouristPackageActivity"("packageId");

-- CreateIndex
CREATE INDEX "Feature_activityId_idx" ON "Feature"("activityId");

-- CreateIndex
CREATE INDEX "Schedule_activityId_idx" ON "Schedule"("activityId");

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_destinationCityId_fkey" FOREIGN KEY ("destinationCityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TouristPackageActivity" ADD CONSTRAINT "TouristPackageActivity_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TouristPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TouristPackageActivity" ADD CONSTRAINT "TouristPackageActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
