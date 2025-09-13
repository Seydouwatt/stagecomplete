-- AlterTable
ALTER TABLE "public"."artists" ADD COLUMN     "artisticBio" TEXT,
ADD COLUMN     "equipment" TEXT[],
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mediaLinks" JSONB,
ADD COLUMN     "priceDetails" JSONB,
ADD COLUMN     "publicSlug" TEXT,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "travelRadius" INTEGER,
ADD COLUMN     "yearsActive" INTEGER;
