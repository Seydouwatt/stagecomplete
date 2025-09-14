-- CreateEnum
CREATE TYPE "public"."ArtistType" AS ENUM ('SOLO', 'BAND', 'THEATER_GROUP', 'COMEDY_GROUP', 'ORCHESTRA', 'CHOIR', 'OTHER');

-- AlterTable
ALTER TABLE "public"."artists" ADD COLUMN     "artistType" "public"."ArtistType" NOT NULL DEFAULT 'SOLO',
ADD COLUMN     "memberCount" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."artist_members" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "socialLinks" JSONB,
    "instruments" TEXT[],
    "experience" TEXT,
    "yearsActive" INTEGER,
    "isFounder" BOOLEAN NOT NULL DEFAULT false,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."artist_members" ADD CONSTRAINT "artist_members_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
