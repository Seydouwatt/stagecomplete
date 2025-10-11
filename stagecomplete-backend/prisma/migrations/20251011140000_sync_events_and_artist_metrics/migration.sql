-- CreateTable: artist_metrics
CREATE TABLE IF NOT EXISTS "artist_metrics" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "searchClicks" INTEGER NOT NULL DEFAULT 0,
    "venueRequests" INTEGER NOT NULL DEFAULT 0,
    "viewsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "viewsLastMonth" INTEGER NOT NULL DEFAULT 0,
    "clicksThisMonth" INTEGER NOT NULL DEFAULT 0,
    "clicksLastMonth" INTEGER NOT NULL DEFAULT 0,
    "requestsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "requestsLastMonth" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "artist_metrics_artistId_key" ON "artist_metrics"("artistId");

-- AddForeignKey
DO $$ BEGIN
 ALTER TABLE "artist_metrics" ADD CONSTRAINT "artist_metrics_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add missing columns to events table
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Make artistId NOT NULL (handle existing NULL values first)
UPDATE "events" SET "artistId" = "venueId" WHERE "artistId" IS NULL AND "venueId" IS NOT NULL;
ALTER TABLE "events" ALTER COLUMN "artistId" SET NOT NULL;

-- Make venueId nullable (it already is, but ensure consistency)
ALTER TABLE "events" ALTER COLUMN "venueId" DROP NOT NULL;
