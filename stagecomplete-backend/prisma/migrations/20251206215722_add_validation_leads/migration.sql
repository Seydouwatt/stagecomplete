-- CreateEnum
CREATE TYPE "MetricEventType" AS ENUM ('PROFILE_VIEW', 'SEARCH_CLICK', 'VENUE_REQUEST');

-- CreateEnum
CREATE TYPE "ValidationLeadType" AS ENUM ('VENUE', 'ARTIST');

-- CreateEnum
CREATE TYPE "ValidationLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERVIEWED', 'BETA_INVITED', 'CONVERTED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionType_new" AS ENUM ('FREE', 'PREMIUM');
ALTER TABLE "public"."users" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "plan" TYPE "SubscriptionType_new" USING ("plan"::text::"SubscriptionType_new");
ALTER TYPE "SubscriptionType" RENAME TO "SubscriptionType_old";
ALTER TYPE "SubscriptionType_new" RENAME TO "SubscriptionType";
DROP TYPE "public"."SubscriptionType_old";
ALTER TABLE "users" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_artistId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED',
ALTER COLUMN "tags" DROP DEFAULT;

-- CreateTable
CREATE TABLE "artist_metrics_events" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "eventType" "MetricEventType" NOT NULL,
    "source" TEXT,
    "venueId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_metrics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validation_leads" (
    "id" TEXT NOT NULL,
    "type" "ValidationLeadType" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "venueName" TEXT,
    "venueType" TEXT,
    "currentBookingMethod" TEXT,
    "averageBookingsPerMonth" TEXT,
    "venueMainPainPoint" TEXT,
    "venueMaxBudget" TEXT,
    "artistName" TEXT,
    "artistType" TEXT,
    "discipline" TEXT,
    "experience" TEXT,
    "currentPromotion" TEXT,
    "monthlyGigs" TEXT,
    "desiredPrice" TEXT,
    "artistMainGoal" TEXT,
    "source" TEXT DEFAULT 'landing_page',
    "status" "ValidationLeadStatus" NOT NULL DEFAULT 'NEW',
    "score" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "validation_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "artist_metrics_events_artistId_eventType_createdAt_idx" ON "artist_metrics_events"("artistId", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "validation_leads_type_status_idx" ON "validation_leads"("type", "status");

-- CreateIndex
CREATE INDEX "validation_leads_createdAt_idx" ON "validation_leads"("createdAt");

-- CreateIndex
CREATE INDEX "events_artistId_date_idx" ON "events"("artistId", "date");

-- AddForeignKey
ALTER TABLE "artist_metrics_events" ADD CONSTRAINT "artist_metrics_events_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
