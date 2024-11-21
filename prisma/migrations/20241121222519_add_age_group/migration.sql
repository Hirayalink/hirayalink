/*
  Warnings:

  - You are about to alter the column `contactNumber` on the `RecipientRequestPost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "RecipientRequestPost" ADD COLUMN     "ageGroupAdolescent" INTEGER,
ADD COLUMN     "ageGroupEarlyChild" INTEGER,
ADD COLUMN     "ageGroupInfant" INTEGER,
ADD COLUMN     "ageGroupMiddleChild" INTEGER,
ADD COLUMN     "numberOfChildren" INTEGER,
ALTER COLUMN "contactNumber" SET DATA TYPE VARCHAR(11);
