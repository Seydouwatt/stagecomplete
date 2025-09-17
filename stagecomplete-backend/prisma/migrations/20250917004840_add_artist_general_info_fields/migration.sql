/*
  Warnings:

  - You are about to drop the column `name` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'MEMBER';

-- AlterTable
ALTER TABLE "public"."artists" ADD COLUMN     "artistName" TEXT,
ADD COLUMN     "baseLocation" TEXT,
ADD COLUMN     "coverPhoto" TEXT,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "public"."profiles" DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "displayName" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isFounder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT;
