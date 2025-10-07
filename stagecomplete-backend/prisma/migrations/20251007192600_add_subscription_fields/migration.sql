-- Add subscription fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'FREE';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscriptionEndsAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);
