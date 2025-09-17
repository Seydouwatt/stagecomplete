-- CreateEnum
CREATE TYPE "public"."ArtistDiscipline" AS ENUM ('MUSIC', 'THEATER', 'ACTOR', 'COMEDIENNE', 'COMEDIE', 'DANCE', 'CIRCUS', 'MAGIE', 'OTHER');

-- AlterTable
ALTER TABLE "public"."artists" ADD COLUMN     "artistDiscipline" "public"."ArtistDiscipline";
