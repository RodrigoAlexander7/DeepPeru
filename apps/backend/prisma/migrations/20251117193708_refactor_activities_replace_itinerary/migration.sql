/*
  Warnings:

  - You are about to drop the column `endDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `TouristPackageActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `TouristPackageActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "TouristPackageActivity" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
