/*
  Warnings:

  - You are about to drop the column `pickupAreaDescription` on the `PickupDetail` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationType` on the `TouristPackage` table. All the data in the column will be lost.
  - You are about to drop the column `additionalInfo` on the `TouristPackageTranslation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PickupDetail" DROP COLUMN "pickupAreaDescription";

-- AlterTable
ALTER TABLE "TouristPackage" DROP COLUMN "cancellationType",
ADD COLUMN     "representativeCityId" INTEGER;

-- AlterTable
ALTER TABLE "TouristPackageTranslation" DROP COLUMN "additionalInfo";

-- CreateTable
CREATE TABLE "PackageLocation" (
    "packageId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "order" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageLocation_pkey" PRIMARY KEY ("packageId","cityId")
);

-- CreateIndex
CREATE INDEX "PackageLocation_cityId_idx" ON "PackageLocation"("cityId");

-- CreateIndex
CREATE INDEX "PackageLocation_packageId_idx" ON "PackageLocation"("packageId");

-- AddForeignKey
ALTER TABLE "TouristPackage" ADD CONSTRAINT "TouristPackage_representativeCityId_fkey" FOREIGN KEY ("representativeCityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageLocation" ADD CONSTRAINT "PackageLocation_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TouristPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageLocation" ADD CONSTRAINT "PackageLocation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
